const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn, isOwner, validateListing } = require("../middleware");
const listingsController = require("../controllers/listings");
const multer = require("multer");
const { storage } = require("../config/cloudConfig");
const upload = multer({ storage });

router
  .route("/")
  .get(wrapAsync(listingsController.index))
  .post(
    isLoggedIn,
    upload.single("image"),
    validateListing,
    wrapAsync(listingsController.createListing)
  );

router.get("/new", isLoggedIn, listingsController.renderNewForm);
router.get("/search", wrapAsync(listingsController.searchListings));

router.get("/:id", wrapAsync(listingsController.showListing));

router
  .route("/:id/edit")
  .get(isLoggedIn, isOwner, wrapAsync(listingsController.renderEditForm))
  .post(
    isLoggedIn,
    isOwner,
    upload.single("image"),
    validateListing,
    wrapAsync(listingsController.updateListing)
  );

router.post(
  "/:id/delete",
  isLoggedIn,
  isOwner,
  wrapAsync(listingsController.deleteListing)
);

module.exports = router;
