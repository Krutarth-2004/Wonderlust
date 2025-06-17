const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookingSchema = new Schema(
  {
    listing: {
      type: Schema.Types.ObjectId,
      ref: "Listing",
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    checkIn: {
      type: Date,
      required: true,
    },
    checkOut: {
      type: Date,
      required: true,
      validate: {
        validator: function (val) {
          return val > this.checkIn;
        },
        message: "Check-out must be after check-in.",
      },
    },
    guests: {
      type: Number,
      required: true,
      min: [1, "At least one guest is required."],
    },
    checkInTime: {
      type: String,
      default: "10 AM", // Optional default
    },
    checkOutTime: {
      type: String,
      default: "9 AM", // Optional default
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  }
);

module.exports = mongoose.model("Booking", bookingSchema);
