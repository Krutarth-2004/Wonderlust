const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required."],
    unique: true,
    trim: true,
    minlength: [3, "Username must be at least 3 characters."],
  },
  email: {
    type: String,
    required: [true, "Email is required."],
    trim: true,
    lowercase: true,
    match: [/.+\@.+\..+/, "Please fill a valid email address."],
  },
  avatar: {
    url: {
      type: String,
      default:
        "https://res.cloudinary.com/dge7zdb1k/image/upload/v1748925711/wonderlust/f8ozf8gecoox7dgcussa.jpg",
    },
    filename: {
      type: String,
      default: "",
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

// Add username + hashed password via passport-local-mongoose
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
