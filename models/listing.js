const mongoose = require("mongoose");
const Review = require("./review");

const listingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  address: {
    type: String, // Full address as a single string
    required: true,
  },
  category: {
    type: String,
    enum: [
      "house",
      "flat/apartment",
      "barn",
      "boat",
      "cabin",
      "cottage",
      "campervan",
      "castle",
      "container",
      "earth_home",
      "farm",
      "guest_house",
      "hotel",
      "houseboat",
      "tiny_home",
      "tower",
      "tree_house",
      "windmill",
      "yurt",
    ],

    required: true,
  },
  image: {
    url: {
      type: String,
      required: true,
    },
    filename: {
      type: String,
      required: true,
    },
  },
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  geometry: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    },
  },
  maxOccupancy: {
    type: Number,
    required: true,
    min: 1, // Ensure at least one person can occupy
  },
});

listingSchema.post("findOneAndDelete", async function (listing) {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
