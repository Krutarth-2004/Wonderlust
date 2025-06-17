const Booking = require("../models/booking");
const Listing = require("../models/listing");
const mongoose = require("mongoose");

// Helper: safely parse a date
function parseDate(input) {
  const date = new Date(input);
  return isNaN(date) ? null : date;
}

module.exports.createBooking = async (req, res) => {
  try {
    const listingId = req.params.id;
    const { checkIn, checkOut, guests, checkInTime, checkOutTime } = req.body;

    const checkInDate = parseDate(checkIn);
    const checkOutDate = parseDate(checkOut);
    const guestsNum = parseInt(guests, 10);

    if (!checkInDate || !checkOutDate || isNaN(guestsNum) || guestsNum <= 0) {
      req.flash(
        "error",
        "Invalid date or guest count. Please check your input."
      );
      return res.redirect(`/listings/${listingId}`);
    }

    if (checkOutDate <= checkInDate) {
      req.flash("error", "Check-out date must be after check-in date.");
      return res.redirect(`/listings/${listingId}`);
    }

    const listing = await Listing.findById(listingId);
    if (!listing) {
      req.flash("error", "Listing not found. Please check the listing ID.");
      return res.redirect("/listings");
    }

    // Optional: Check for overlapping bookings here as well
    const overlappingBookings = await Booking.find({
      listing: listingId,
      checkIn: { $lt: checkOutDate },
      checkOut: { $gt: checkInDate },
    });

    let totalGuestsAlreadyBooked = 0;
    overlappingBookings.forEach((booking) => {
      totalGuestsAlreadyBooked += booking.guests;
    });

    const totalGuestsIncludingNewBooking = totalGuestsAlreadyBooked + guestsNum;

    if (totalGuestsIncludingNewBooking > listing.maxOccupancy) {
      req.flash(
        "error",
        `Booking exceeds max occupancy. Only ${
          listing.maxOccupancy - totalGuestsAlreadyBooked
        } guests can be added for this date range.`
      );
      return res.redirect(`/listings/${listingId}`);
    }

    const newBooking = new Booking({
      user: req.user._id,
      listing: listingId,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests: guestsNum,
      checkInTime: checkInTime || "10 AM",
      checkOutTime: checkOutTime || "9 AM",
    });

    await newBooking.save();

    req.flash(
      "success",
      `Booking confirmed from ${checkIn} to ${checkOut} for ${guestsNum} guest(s).`
    );
    res.redirect(`/listings/${listingId}`);
  } catch (err) {
    console.error(err);
    req.flash("error", "Failed to create booking.");
    return res.redirect(`/listings/${req.params.id}`);
  }
};

module.exports.checkAvailability = async (req, res) => {
  try {
    const listingId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(listingId)) {
      return res.status(400).json({
        available: false,
        message: "Invalid listing ID. Please check the ID and try again.",
      });
    }

    const { checkIn, checkOut, guests } = req.query;
    const checkInDate = parseDate(checkIn);
    const checkOutDate = parseDate(checkOut);
    const guestsNum = parseInt(guests, 10);

    if (
      !checkIn ||
      !checkOut ||
      !guests ||
      !checkInDate ||
      !checkOutDate ||
      isNaN(guestsNum) ||
      guestsNum <= 0
    ) {
      return res.status(400).json({
        available: false,
        message: "Invalid check-in/check-out dates or guest count.",
      });
    }

    if (checkOutDate <= checkInDate) {
      return res.status(400).json({
        available: false,
        message: "Check-out date must be after check-in date.",
      });
    }

    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({
        available: false,
        message: "Listing not found.",
      });
    }

    const overlappingBookings = await Booking.find({
      listing: listingId,
      checkIn: { $lt: checkOutDate },
      checkOut: { $gt: checkInDate },
    });

    let totalGuestsAlreadyBooked = 0;
    overlappingBookings.forEach((booking) => {
      totalGuestsAlreadyBooked += booking.guests;
    });

    const totalGuestsIncludingNewBooking = totalGuestsAlreadyBooked + guestsNum;

    if (totalGuestsIncludingNewBooking > listing.maxOccupancy) {
      return res.status(200).json({
        available: false,
        message: `The total number of guests (${totalGuestsIncludingNewBooking}) exceeds the maximum occupancy of ${listing.maxOccupancy}.`,
      });
    }

    return res.status(200).json({ available: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      available: false,
      message: "Failed to check availability due to server error.",
    });
  }
};
