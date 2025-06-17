const User = require("../models/user");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const multer = require("multer");
const { storage } = require("../config/cloudConfig");
const Listing = require("../models/listing");
const Booking = require("../models/booking");

const upload = multer({ storage });

module.exports.renderSignupForm = (req, res) => {
  res.render("users/signup", { hideHeaderFooter: true });
};

module.exports.signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ username, email });
    const registeredUser = await User.register(user, password);

    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome back!");
      res.redirect("/listings");
    });
  } catch (e) {
    console.error("Signup error:", e);
    req.flash("error", e.message || "Signup failed. Please try again.");
    res.redirect("/signup");
  }
};

module.exports.renderLoginForm = (req, res) => {
  res.render("users/login", { hideHeaderFooter: true });
};

module.exports.login = async (req, res) => {
  req.flash("success", "Welcome back!");
  res.redirect(res.locals.redirectUrl || "/listings");
};

module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.flash("success", "Logged out successfully!");
    res.redirect("/listings");
  });
};

module.exports.renderforgotPasswordForm = (req, res) => {
  res.render("users/forgotPassword", { hideHeaderFooter: true });
};

module.exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      req.flash("error", "No account with that email exists.");
      return res.redirect("/forgot-password");
    }

    const token = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    const resetURL = `http://${req.headers.host}/reset/${token}`;

    const mailOptions = {
      to: user.email,
      from: process.env.GMAIL_USER,
      subject: "Password Reset Request",
      text: `You are receiving this because you (or someone else) requested a password reset.\n\n
Click the link to reset your password:\n${resetURL}\n\n
If you didn't request this, ignore this email.\n`,
    };

    await transporter.sendMail(mailOptions);
    req.flash("success", "An email has been sent with reset instructions.");
    res.redirect("/login");
  } catch (err) {
    console.error("Password reset error:", err);
    req.flash("error", "Something went wrong. Please try again.");
    res.redirect("/forgot-password");
  }
};

module.exports.renderResetPasswordForm = async (req, res) => {
  try {
    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user) {
      req.flash("error", "Password reset token is invalid or expired.");
      return res.redirect("/forgot-password");
    }
    res.render("users/resetPassword", {
      hideHeaderFooter: true,
      token: req.params.token,
    });
  } catch (err) {
    console.error("Render reset form error:", err);
    req.flash("error", "Something went wrong.");
    res.redirect("/forgot-password");
  }
};

module.exports.resetPassword = async (req, res) => {
  const { password, confirm } = req.body;
  if (password !== confirm) {
    req.flash("error", "Passwords do not match.");
    return res.redirect("back");
  }

  try {
    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      req.flash("error", "Token is invalid or expired.");
      return res.redirect("/forgot-password");
    }

    await user.setPassword(password);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    req.login(user, (err) => {
      if (err) throw err;
      req.flash("success", "Password reset successfully.");
      res.redirect("/login");
    });
  } catch (err) {
    console.error("Reset password error:", err);
    req.flash("error", "Something went wrong.");
    res.redirect("/forgot-password");
  }
};

module.exports.renderProfile = (req, res) => {
  res.render("users/profile", { user: req.user });
};

module.exports.updateProfile = async (req, res) => {
  try {
    const { username, email } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      req.flash("error", "User not found.");
      return res.redirect("/profile");
    }

    user.username = username;
    user.email = email;

    if (req.file) {
      user.avatar = { url: req.file.path, filename: req.file.filename };
    }

    await user.save();

    req.login(user, (err) => {
      if (err) {
        console.error(err);
        req.flash("error", "Something went wrong. Please try again.");
        return res.redirect("/profile");
      }
      req.flash("success", "Profile updated successfully.");
      return res.redirect("/profile");
    });
  } catch (err) {
    console.error("Profile update error:", err);
    req.flash("error", "Something went wrong. Please try again.");
    return res.redirect("/profile");
  }
};

module.exports.myListings = async (req, res) => {
  try {
    const listings = await Listing.find({ owner: req.user._id }).populate(
      "owner"
    );
    res.render("users/myListings", { allListings: listings });
  } catch (err) {
    console.error("My Listings error:", err);
    req.flash("error", "Unable to fetch your listings.");
    res.redirect("/listings");
  }
};

module.exports.addToFavorites = async (req, res) => {
  try {
    const listingId = req.params.id;
    const user = await User.findById(req.user._id);

    if (!Array.isArray(user.favorites)) user.favorites = [];

    if (!user.favorites.includes(listingId)) {
      user.favorites.push(listingId);
      await user.save();
      req.flash("success", "Listing added to favorites.");
      res.redirect(req.get("referer") || "/listings");
    } else {
      req.flash("info", "Listing already in favorites.");
      res.redirect(req.get("referer") || "/listings");
    }
  } catch (err) {
    console.error("Add to favorites error:", err);
    req.flash("error", "Unable to add to favorites.");
    res.redirect(req.get("referer") || "/listings");
  }
};

module.exports.removeFromFavorites = async (req, res) => {
  try {
    const listingId = req.params.id;
    const user = req.user;

    if (!user) {
      req.flash("error", "You must be logged in.");
      return res.redirect("back");
    }

    user.favorites = user.favorites.filter(
      (fav) => fav.toString() !== listingId
    );
    await user.save();

    req.flash("success", "Removed from favorites.");
    res.redirect(req.get("referer") || "/listings");
  } catch (err) {
    console.error("Remove favorite error:", err);
    req.flash("error", "Something went wrong.");
    res.redirect("back");
  }
};

module.exports.favorites = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("favorites");
    res.render("users/favorites", { favorites: user.favorites });
  } catch (err) {
    console.error("Fetch favorites error:", err);
    req.flash("error", "Unable to fetch your favorites.");
    res.redirect("/listings");
  }
};

module.exports.renderChangePasswordForm = (req, res) => {
  res.render("users/settings");
};

module.exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;

  if (newPassword !== confirmPassword) {
    req.flash("error", "New passwords do not match.");
    return res.redirect("/settings");
  }

  try {
    const user = await User.findById(req.user._id);
    user.changePassword(currentPassword, newPassword, (err) => {
      if (err) {
        req.flash("error", "Current password is incorrect.");
        return res.redirect("/settings");
      }
      req.flash("success", "Password changed successfully.");
      res.redirect("/settings");
    });
  } catch (err) {
    console.error("Change password error:", err);
    req.flash("error", "Failed to change password.");
    res.redirect("/settings");
  }
};

module.exports.renderPrivacy = (req, res) => {
  res.render("users/privacy", { title: "Privacy Policy" });
};

module.exports.renderTerms = (req, res) => {
  res.render("users/terms", { title: "Terms of Service" });
};

module.exports.renderContact = (req, res) => {
  res.render("users/contact", { title: "About Us" });
};

module.exports.myBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("listing")
      .populate("user");
    res.render("users/myBookings", { bookings });
  } catch (err) {
    console.error("My bookings error:", err);
    req.flash("error", "Unable to fetch your bookings.");
    res.redirect("/listings");
  }
};

module.exports.cancelBooking = async (req, res) => {
  const { bookingId } = req.params;

  try {
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      req.flash("error", "Booking not found.");
      return res.redirect("/my-bookings");
    }

    if (!booking.user.equals(req.user._id)) {
      req.flash("error", "Not authorized to cancel this booking.");
      return res.redirect("/my-bookings");
    }

    await Booking.findByIdAndDelete(bookingId);
    req.flash("success", "Booking canceled successfully.");
    res.redirect("/my-bookings");
  } catch (error) {
    console.error("Cancel booking error:", error);
    req.flash("error", "Failed to cancel booking.");
    res.redirect("/my-bookings");
  }
};
