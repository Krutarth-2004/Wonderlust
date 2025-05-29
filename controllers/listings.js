const Listing = require("../models/listing");
const axios = require("axios");

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("./listings/index.ejs", { allListings });
};
module.exports.renderNewForm = (req, res) => {
  res.render("./listings/new.ejs");
}; // Make sure axios is installed

module.exports.createListing = async (req, res) => {
  try {
    const { title, description, price, location, country } = req.body;
    let url = req.file.path;
    let filename = req.file.filename;

    // Geocode the location using Nominatim
    const geoRes = await axios.get(
      "https://nominatim.openstreetmap.org/search",
      {
        params: {
          q: location,
          format: "json",
          limit: 1,
        },
        headers: {
          "User-Agent": "ListingApp (krutarthkadia@gmail.com)", // Required by Nominatim
        },
      }
    );

    if (!geoRes.data || geoRes.data.length === 0) {
      req.flash("error", "Could not find location coordinates.");
      return res.redirect("/listings/new");
    }

    const { lat, lon } = geoRes.data[0];

    const newListing = new Listing({
      title,
      description,
      price,
      location,
      country,
      owner: req.user._id,
      geometry: {
        type: "Point",
        coordinates: [parseFloat(lon), parseFloat(lat)], // [longitude, latitude]
      },
      image: { url, filename },
    });

    await newListing.save();
    req.flash("success", "New listing created successfully!");
    res.redirect("/listings");
  } catch (err) {
    console.error("Error creating listing:", err);
    req.flash("error", "Failed to create listing.");
    res.redirect("/listings/new");
  }
};

module.exports.showListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }
  res.render("./listings/show.ejs", { listing });
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }
  let originalImage = listing.image.url;
  originalImage = originalImage.replace("/upload", "/upload/h_250,w_250");
  res.render("./listings/edit.ejs", { listing, originalImage });
};

module.exports.updateListing = async (req, res) => {
  const { id } = req.params;
  const { title, description, price, location, country } = req.body;

  const listing = await Listing.findById(id);

  listing.title = title;
  listing.description = description;
  listing.price = price;
  listing.location = location;
  listing.country = country;

  // Geocode new location with OpenStreetMap (Nominatim)
  try {
    const geoResponse = await axios.get(
      "https://nominatim.openstreetmap.org/search",
      {
        params: {
          q: location,
          format: "json",
          limit: 1,
        },
        headers: {
          "User-Agent": "ListingApp (krutarthkadia@gmail.com)",
        },
      }
    );

    const geoData = geoResponse.data[0];
    if (geoData) {
      listing.geometry = {
        type: "Point",
        coordinates: [parseFloat(geoData.lon), parseFloat(geoData.lat)],
      };
    }
  } catch (error) {
    console.error("Geocoding failed:", error);
    req.flash("error", "Failed to update location coordinates.");
  }

  if (req.file) {
    listing.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
  }

  await listing.save();
  req.flash("success", "Listing updated successfully!");
  res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing deleted successfully!");
  res.redirect("/listings");
};
