const Review = require("../models/review");
const Listing = require("../models/listing");

// Create a new review
module.exports.createReview = async (req, res) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
      req.flash("error", "Listing not found.");
      return res.redirect("/listings");
    }

    const review = new Review(req.body);
    review.author = req.user._id;

    await review.save();

    listing.reviews.push(review._id);
    await listing.save();

    req.flash("success", "New review added successfully!");
    res.redirect(`/listings/${id}`);
  } catch (err) {
    console.error("Error creating review:", err);
    req.flash("error", "Failed to add review.");
    res.redirect(`/listings/${req.params.id}`);
  }
};

// Delete a review
module.exports.deleteReview = async (req, res) => {
  try {
    const { id, reviewId } = req.params;

    // Remove review document
    const deletedReview = await Review.findByIdAndDelete(reviewId);
    if (!deletedReview) {
      req.flash("error", "Review not found.");
      return res.redirect(`/listings/${id}`);
    }

    // Remove reference from listing
    await Listing.findByIdAndUpdate(id, {
      $pull: { reviews: reviewId },
    });

    req.flash("success", "Review deleted successfully!");
    res.redirect(`/listings/${id}`);
  } catch (err) {
    console.error("Error deleting review:", err);
    req.flash("error", "Failed to delete review.");
    res.redirect(`/listings/${req.params.id}`);
  }
};
