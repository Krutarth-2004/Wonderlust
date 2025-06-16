const User = require("../models/user");
const Booking = require("../models/booking");
const Listing = require("../models/listing");
const mongoose = require("mongoose");

module.exports.createBooking = async (req, res) => {
  try {
    const listingId = req.params.id;
    const { checkIn, checkOut, guests, checkInTime, checkOutTime } = req.body;

    // Parse and validate dates
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const guestsNum = parseInt(guests, 10);

    function isValidDate(d) {
      return d instanceof Date && !isNaN(d.getTime());
    }

    if (
      !isValidDate(checkInDate) ||
      !isValidDate(checkOutDate) ||
      guestsNum <= 0
    ) {
      req.flash(
        "error",
        "Invalid date or guest count. Please check your input."
      );
      return res.redirect(`/listings/${listingId}`);
    }

    // Check if listing exists
    const listing = await Listing.findById(listingId);
    if (!listing) {
      req.flash("error", "Listing not found. Please check the listing ID.");
      return res.redirect("/listings");
    }

    // Create and save the booking
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

    req.flash("success", "Booking created successfully!");
    res.redirect(`/listings/${listingId}`);
  } catch (err) {
    console.error(err);
    req.flash("error", "Failed to create booking.");
    res.redirect(`/listings/${req.params.id}`);
  }
};

module.exports.checkAvailability = async (req, res) => {
  try {
    const listingId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(listingId)) {
      return req.flash(
        "error",
        "Invalid listing ID. Please check the ID and try again."
      );
    }

    const { checkIn, checkOut, guests } = req.query;

    if (!checkIn || !checkOut || !guests) {
      return req.flash(
        "error",
        "Missing required query parameters: checkIn, checkOut, or guests."
      );
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const guestsNum = parseInt(guests, 10);

    if (isNaN(checkInDate) || isNaN(checkOutDate) || guestsNum <= 0) {
      return req.flash(
        "error",
        "Invalid date or guest count. Please check your input."
      );
    }

    if (checkOutDate <= checkInDate) {
      return req.flash(
        "error",
        "Check-out date must be after check-in date. Please adjust your dates."
      );
    }

    // Check overlapping bookings
    const overlappingBookings = await Booking.find({
      listing: listingId,
      $or: [{ checkIn: { $lt: checkOutDate }, checkOut: { $gt: checkInDate } }],
    });

    // Sum up the existing guests
    let totalGuestsAlreadyBooked = 0;
    overlappingBookings.forEach((booking) => {
      totalGuestsAlreadyBooked += booking.guests;
    });

    const listing = await Listing.findById(listingId);
    if (!listing) {
      return req.flash(
        "error",
        "Listing not found. Please check the listing ID."
      );
    }

    const totalGuestsIncludingNewBooking = totalGuestsAlreadyBooked + guestsNum;
    if (totalGuestsIncludingNewBooking > listing.maxOccupancy) {
      return res.json({
        available: false,
        message: `The total number of guests (${totalGuestsIncludingNewBooking}) exceeds the maximum occupancy of ${listing.maxOccupancy}.`,
      });
    }

    res.json({ available: true });
  } catch (err) {
    console.error(err);
    req.flash("error", "Failed to check availability.");
  }
};
