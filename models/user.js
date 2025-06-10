const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
  },
  avatar: {
    url: {
      type: String,
      default:
        "https://res.cloudinary.com/dge7zdb1k/image/upload/v1748925711/wonderlust/f8ozf8gecoox7dgcussa.jpg",
    },
    filename: {
      type: String,
      default: "", // Optional: an empty string by default
    },
  },
  favorites: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
    },
  ],

  resetPasswordToken: String,
  resetPasswordExpires: Date,
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
