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

module.exports.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ username, email });
    const registeredUser = await User.register(user, password);
    // Automatically log in the user after registration
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome to Wonderlust!");
      res.redirect("/listings");
    });
  } catch (e) {
    req.flash("error", e.message);
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

module.exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "Logged out successfully!");
    res.redirect("/listings");
  });
};

// module.exports.googleCallback = (req, res) => {
//   req.flash("success", "Welcome back!");
//   res.redirect(res.locals.redirectUrl || "/listings");
// };

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

    // Generate token
    const token = crypto.randomBytes(20).toString("hex");

    // Save token and expiry on user object
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // Send email
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.GMAIL_USER, // Your Gmail address
        pass: process.env.GMAIL_PASS, // Your Gmail app password
      },
    });

    const resetURL = `http://${req.headers.host}/reset/${token}`;

    const mailOptions = {
      to: user.email,
      from: process.env.GMAIL_USER,
      subject: "Password Reset Request",
      text: `You are receiving this because you (or someone else) requested a password reset for your account.\n\n
Please click on the following link, or paste it into your browser to complete the process:\n\n
${resetURL}\n\n
If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };

    await transporter.sendMail(mailOptions);
    req.flash(
      "success",
      "An email has been sent with password reset instructions."
    );
    res.redirect("/login");
  } catch (err) {
    console.error(err);
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
      req.flash("error", "Password reset token is invalid or has expired.");
      return res.redirect("/forgot-password");
    }
    res.render("users/resetPassword", {
      hideHeaderFooter: true,
      token: req.params.token,
    });
  } catch (err) {
    console.error(err);
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
      req.flash("error", "Password reset token is invalid or has expired.");
      return res.redirect("/forgot-password");
    }

    await user.setPassword(password);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    req.login(user, (err) => {
      if (err) throw err;
      req.flash("success", "Your password has been reset successfully.");
      res.redirect("/login");
    });
  } catch (err) {
    console.error(err);
    req.flash("error", "Something went wrong. Please try again.");
    res.redirect("/forgot-password");
  }
};

module.exports.renderProfile = (req, res) => {
  res.render("users/profile", { user: req.user });
};

module.exports.updateProfile = async (req, res, next) => {
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

    // If you must re-login:
    const successMessage = "Profile updated successfully.";
    req.login(user, (err) => {
      if (err) {
        console.error(err);
        req.flash("error", "Something went wrong. Please try again.");
        return res.redirect("/profile");
      }
      req.flash("success", successMessage);
      return res.redirect("/profile");
    });

    // OR (skip re-login if not strictly necessary):
    // req.flash("success", "Profile updated successfully.");
    // return res.redirect("/profile");
  } catch (err) {
    console.error(err);
    req.flash("error", "Something went wrong. Please try again.");
    return res.redirect("/profile");
  }
};

module.exports.myListings = async (req, res) => {
  try {
    const listings = await Listing.find({ owner: req.user._id }).populate(
      "owner"
    );
    res.render("users/myListings", { listings });
  } catch (err) {
    console.error(err);
    req.flash("error", "Unable to fetch your listings.");
    res.redirect("/listings");
  }
};

module.exports.addToFavorites = async (req, res) => {
  try {
    const listingId = req.params.id;
    const user = await User.findById(req.user._id);

    if (!Array.isArray(user.favorites)) {
      user.favorites = [];
    }

    if (!user.favorites.includes(listingId)) {
      user.favorites.push(listingId);
      await user.save();
      req.flash("success", "Listing added to favorites.");
    } else {
      req.flash("info", "Listing is already in your favorites.");
    }
    res.redirect(`/listings`);
  } catch (err) {
    console.error(err);
    req.flash("error", "Unable to add listing to favorites.");
    res.redirect("/listings");
  }
};

module.exports.removeFromFavorites = async (req, res) => {
  try {
    const listingId = req.params.id;
    const user = await User.findById(req.user._id);
    const index = user.favorites.indexOf(listingId);
    if (index > -1) {
      user.favorites.splice(index, 1);
      await user.save();
      req.flash("success", "Listing removed from favorites.");
    } else {
      req.flash("info", "Listing is not in your favorites.");
    }
    res.redirect(`/listings`);
  } catch (err) {
    console.error(err);
    req.flash("error", "Unable to remove listing from favorites.");
    res.redirect("/listings");
  }
};

module.exports.favorites = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("favorites");
    console.log(user.favorites);
    res.render("users/favorites", { favorites: user.favorites });
  } catch (err) {
    console.error(err);
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

  const user = await User.findById(req.user._id);

  user.changePassword(currentPassword, newPassword, function (err) {
    if (err) {
      req.flash("error", "Current password is incorrect or error occurred.");
      return res.redirect("/settings");
    }

    req.flash("success", "Password changed successfully.");
    res.redirect("/settings");
  });
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
    console.error(err);
    req.flash("error", "Unable to fetch your bookings.");
    res.redirect("/listings");
  }
};

module.exports.cancelBooking = async (req, res) => {
  const { bookingId } = req.params;

  try {
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      req.flash("error", "Booking not found");
      return res.redirect("/my-bookings");
    }

    // Optional: check if the booking belongs to the logged-in user
    if (!booking.user.equals(req.user._id)) {
      req.flash("error", "You do not have permission to cancel this booking");
      return res.redirect("/my-bookings");
    }

    await Booking.findByIdAndDelete(bookingId);
    req.flash("success", "Booking canceled successfully");
    res.redirect("/my-bookings");
  } catch (error) {
    req.flash("error", "Failed to cancel booking");
    res.redirect("/my-bookings");
  }
};
