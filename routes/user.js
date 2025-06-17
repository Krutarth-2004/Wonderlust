const express = require("express");
const router = express.Router();
const passport = require("passport");
const multer = require("multer");

const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");
const { storage } = require("../config/cloudConfig");
const upload = multer({ storage });

/* ========== AUTH ROUTES ========== */

// Sign up
router
  .route("/signup")
  .get(userController.renderSignupForm)
  .post(wrapAsync(userController.signup));

// Log in
router
  .route("/login")
  .get(userController.renderLoginForm)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userController.login
  );

// Log out
router.get("/logout", userController.logout);

/* ========== PASSWORD RECOVERY ROUTES ========== */

// Forgot password
router
  .route("/forgot-password")
  .get(userController.renderforgotPasswordForm)
  .post(wrapAsync(userController.forgotPassword));

// Reset password via token
router
  .route("/reset/:token")
  .get(userController.renderResetPasswordForm)
  .post(wrapAsync(userController.resetPassword));

/* ========== USER PROFILE ROUTES ========== */

// View and update profile
router
  .route("/profile")
  .get(isLoggedIn, userController.renderProfile)
  .post(
    isLoggedIn,
    upload.single("avatar"),
    wrapAsync(userController.updateProfile)
  );

// Change password
router
  .route("/settings")
  .get(isLoggedIn, userController.renderChangePasswordForm)
  .post(isLoggedIn, wrapAsync(userController.changePassword));

/* ========== FAVORITES ROUTES ========== */

// View favorites
router.get("/favorites", isLoggedIn, wrapAsync(userController.favorites));

// Add or remove from favorites
router
  .route("/favorites/:id")
  .post(isLoggedIn, wrapAsync(userController.addToFavorites))
  .delete(isLoggedIn, wrapAsync(userController.removeFromFavorites));

/* ========== LISTINGS AND BOOKINGS ROUTES ========== */

// Listings owned by user
router.get("/my-listings", isLoggedIn, wrapAsync(userController.myListings));

// Bookings made by user
router.get("/my-bookings", isLoggedIn, wrapAsync(userController.myBookings));

// Cancel a booking
router.delete(
  "/bookings/:bookingId",
  isLoggedIn,
  wrapAsync(userController.cancelBooking)
);

/* ========== STATIC PAGES ========== */

router.get("/privacy", userController.renderPrivacy);
router.get("/terms", userController.renderTerms);
router.get("/contact", userController.renderContact);

module.exports = router;
