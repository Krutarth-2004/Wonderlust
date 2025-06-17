const mongoose = require("mongoose");
const Review = require("./review");

const listingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Listing title is required."],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required."],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required."],
      min: [0, "Price cannot be negative."],
    },
    address: {
      type: String,
      required: [true, "Address is required."],
      trim: true,
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
        required: [true, "Image URL is required."],
      },
      filename: {
        type: String,
        required: [true, "Image filename is required."],
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
        validate: {
          validator: function (coords) {
            return coords.length === 2;
          },
          message: "Coordinates must be an array of [longitude, latitude].",
        },
      },
    },
    maxOccupancy: {
      type: Number,
      required: true,
      min: [1, "At least one guest must be allowed."],
    },
  },
  { timestamps: true } // Adds createdAt and updatedAt fields
);

// Middleware to delete associated reviews if listing is deleted
listingSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Review.deleteMany({ _id: { $in: doc.reviews } });
  }
});

module.exports = mongoose.model("Listing", listingSchema);
