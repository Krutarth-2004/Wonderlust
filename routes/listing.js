const express = require("express");
const router = express.Router();
const multer = require("multer");

const wrapAsync = require("../utils/wrapAsync");
const listingsController = require("../controllers/listings");
const { isLoggedIn, isOwner, validateListing } = require("../middleware");
const { storage } = require("../config/cloudConfig");
const upload = multer({ storage });

/**
 * LISTINGS INDEX + CREATE
 * GET  /         → show all listings
 * POST /         → create new listing (requires login, validation, image upload)
 */
router
  .route("/")
  .get(wrapAsync(listingsController.index))
  .post(
    isLoggedIn,
    upload.single("image"),
    validateListing,
    wrapAsync(listingsController.createListing)
  );

/**
 * RENDER NEW LISTING FORM
 * GET /new       → form to create listing
 */
router.get("/new", isLoggedIn, listingsController.renderNewForm);

/**
 * SEARCH LISTINGS
 * GET /search    → handle search query
 */
router.get("/search", wrapAsync(listingsController.searchListings));

/**
 * SHOW SINGLE LISTING
 * GET /:id       → show listing detail page
 */
router.get("/:id", wrapAsync(listingsController.showListing));

/**
 * EDIT LISTING
 * GET  /:id/edit   → render edit form (requires ownership)
 * POST /:id/edit   → submit listing edits (with optional image upload)
 */
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

/**
 * DELETE LISTING
 * POST /:id/delete → delete listing (requires ownership)
 */
router.post(
  "/:id/delete",
  isLoggedIn,
  isOwner,
  wrapAsync(listingsController.deleteListing)
);

module.exports = router;
