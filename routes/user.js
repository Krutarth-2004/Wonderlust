const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");
const { isLoggedIn } = require("../middleware.js");
const { cloudinary, storage } = require("../config/cloudConfig");
const multer = require("multer");
const upload = multer({ storage });

router
  .route("/signup")
  .get(userController.renderSignupForm)
  .post(wrapAsync(userController.signup));

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

router.get("/logout", userController.logout);

// router.get(
//   "/google",
//   passport.authenticate("google", {
//     scope: ["profile", "email"],
//     prompt: "select_account",
//   })
// );
// router.get(
//   "/google/callback",
//   passport.authenticate("google", {
//     failureRedirect: "/login",
//     failureFlash: true,
//   }),
//   userController.googleCallback
// );

router
  .route("/forgot-password")
  .get(userController.renderforgotPasswordForm)
  .post(wrapAsync(userController.forgotPassword));

router
  .route("/reset/:token")
  .get(userController.renderResetPasswordForm)
  .post(wrapAsync(userController.resetPassword));

router
  .route("/profile")
  .get(isLoggedIn, userController.renderProfile)
  .post(
    isLoggedIn,
    upload.single("avatar"),
    wrapAsync(userController.updateProfile)
  );

router
  .route("/my-listings")
  .get(isLoggedIn, wrapAsync(userController.myListings));

router.get("/favorites", isLoggedIn, wrapAsync(userController.favorites));

router
  .route("/favorites/:id")
  .post(isLoggedIn, wrapAsync(userController.addToFavorites))
  .delete(isLoggedIn, wrapAsync(userController.removeFromFavorites));

router
  .route("/settings")
  .get(isLoggedIn, userController.renderChangePasswordForm)
  .post(isLoggedIn, wrapAsync(userController.changePassword));

router.get("/privacy", userController.renderPrivacy);
router.get("/terms", userController.renderTerms);
router.get("/contact", userController.renderContact);

router.get("/my-bookings", isLoggedIn, wrapAsync(userController.myBookings));
router.delete(
  "/bookings/:bookingId",
  isLoggedIn,
  wrapAsync(userController.cancelBooking)
);

module.exports = router;
