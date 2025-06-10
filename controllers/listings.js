const Listing = require("../models/listing");
const axios = require("axios");

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  allListings.reverse();
  res.render("./listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("./listings/new.ejs");
};

module.exports.createListing = async (req, res) => {
  try {
    const { title, description, price, address, category, maxOccupancy } =
      req.body;
    const { path: url, filename } = req.file;

    // Geocode the address
    const geoRes = await axios.get(
      "https://nominatim.openstreetmap.org/search",
      {
        params: { q: address, format: "json", limit: 1 },
        headers: { "User-Agent": "ListingApp (krutarthkadia@gmail.com)" },
      }
    );

    if (!geoRes.data.length) {
      req.flash("error", "Could not find location coordinates.");
      return res.redirect("/listings/new");
    }

    const { lat, lon } = geoRes.data[0];

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
        coordinates: [parseFloat(lon), parseFloat(lat)],
      },
      image: { url, filename },
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
  const {
    title,
    description,
    price,
    address, // Note: address instead of location
    category,
  } = req.body;

  try {
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing not found.");
      return res.redirect("/listings");
    }

    // Update fields
    listing.title = title;
    listing.description = description;
    listing.price = price;
    listing.address = address;
    listing.category = category;

    // Geocode the new address with Nominatim
    const geoResponse = await axios.get(
      "https://nominatim.openstreetmap.org/search",
      {
        params: {
          q: address,
          format: "json",
          limit: 1,
        },
        headers: {
          "User-Agent": "ListingApp (krutarthkadia@gmail.com)",
        },
      }
    );

    if (geoResponse.data && geoResponse.data.length > 0) {
      const geoData = geoResponse.data[0];
      listing.geometry = {
        type: "Point",
        coordinates: [parseFloat(geoData.lon), parseFloat(geoData.lat)],
      };
    } else {
      req.flash(
        "error",
        "Could not find coordinates for the provided address."
      );
      return res.redirect(`/listings/${id}/edit`);
    }

    // Update image if a new file was uploaded
    if (req.file) {
      listing.image = {
        url: req.file.path,
        filename: req.file.filename,
      };
    }

    await listing.save();

    req.flash("success", "Listing updated successfully!");
    res.redirect(`/listings/${id}`);
  } catch (error) {
    console.error("Error updating listing:", error);
    req.flash("error", "Failed to update listing.");
    res.redirect(`/listings/${id}/edit`);
  }
};

module.exports.deleteListing = async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing deleted successfully!");
  res.redirect("/listings");
};
