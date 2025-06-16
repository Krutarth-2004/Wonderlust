const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn } = require("../middleware");
const bookingController = require("../controllers/booking");

// Route to create a booking
router.post("/book", isLoggedIn, wrapAsync(bookingController.createBooking));

// Route to check availability of a listing
router.get(
  "/availability",
  isLoggedIn,
  wrapAsync(bookingController.checkAvailability)
);

// Export the router
module.exports = router;
