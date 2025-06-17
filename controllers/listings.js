const Listing = require("../models/listing");
const axios = require("axios");

// Utility to get geolocation from address using Nominatim API
async function getCoordinates(address) {
  const geoRes = await axios.get("https://nominatim.openstreetmap.org/search", {
    params: { q: address, format: "json", limit: 1 },
    headers: { "User-Agent": "ListingApp (krutarthkadia@gmail.com)" },
  });

  if (!geoRes.data.length) return null;
  const { lat, lon } = geoRes.data[0];
  return { lat: parseFloat(lat), lon: parseFloat(lon) };
}

// Render all listings
module.exports.index = async (req, res) => {
  const allListings = await Listing.find({}).sort({ createdAt: -1 });
  res.render("listings/index.ejs", { allListings });
};

// Render form for new listing
module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

// Create new listing
module.exports.createListing = async (req, res) => {
  try {
    const { title, description, price, address, category, maxOccupancy } =
      req.body;

    if (!req.file) {
      req.flash("error", "Image upload is required.");
      return res.redirect("/listings/new");
    }

    const coords = await getCoordinates(address);
    if (!coords) {
      req.flash("error", "Could not find location coordinates.");
      return res.redirect("/listings/new");
    }

    const newListing = new Listing({
      title,
      description,
      price,
      address,
      maxOccupancy,
      category,
      owner: req.user._id,
      geometry: {
        type: "Point",
        coordinates: [coords.lon, coords.lat],
      },
      image: {
        url: req.file.path,
        filename: req.file.filename,
      },
    });

    await newListing.save();
    req.flash("success", "New listing created successfully!");
    res.redirect("/listings");
  } catch (err) {
    console.error(err);
    req.flash("error", "Failed to create listing.");
    res.redirect("/listings/new");
  }
};

// Show individual listing
module.exports.showListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");

  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }

  res.render("listings/show.ejs", { listing });
};

// Render edit form
module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }

  const originalImage = listing.image.url.replace(
    "/upload",
    "/upload/h_250,w_250"
  );
  res.render("listings/edit.ejs", { listing, originalImage });
};

// Update listing
module.exports.updateListing = async (req, res) => {
  const { id } = req.params;
  const { title, description, price, address, category } = req.body;

  try {
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing not found.");
      return res.redirect("/listings");
    }

    listing.title = title;
    listing.description = description;
    listing.price = price;
    listing.address = address;
    listing.category = category;

    const coords = await getCoordinates(address);
    if (!coords) {
      req.flash(
        "error",
        "Could not find coordinates for the provided address."
      );
      return res.redirect(`/listings/${id}/edit`);
    }

    listing.geometry = {
      type: "Point",
      coordinates: [coords.lon, coords.lat],
    };

    if (req.file) {
      listing.image = {
        url: req.file.path,
        filename: req.file.filename,
      };
    }

    await listing.save();
    req.flash("success", "Listing updated successfully!");
    res.redirect(`/listings/${id}`);
  } catch (err) {
    console.error("Error updating listing:", err);
    req.flash("error", "Failed to update listing.");
    res.redirect(`/listings/${id}/edit`);
  }
};

// Delete listing
module.exports.deleteListing = async (req, res) => {
  try {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted successfully!");
    res.redirect("/listings");
  } catch (err) {
    console.error(err);
    req.flash("error", "Failed to delete listing.");
    res.redirect("/listings");
  }
};

// Search listings by title (AJAX)
module.exports.searchListings = async (req, res) => {
  const { query } = req.query;
  if (!query || query.trim().length === 0) {
    return res.json({ listings: [] });
  }

  const regex = new RegExp(query, "i");
  const listings = await Listing.find({ title: regex });
  res.json({ listings });
};
