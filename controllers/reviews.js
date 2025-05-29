const Review = require("../models/review");
const Listing = require("../models/listing");

module.exports.createReview = async (req, res) => {
  const { id } = req.params;
  const review = new Review(req.body);
  review.author = req.user._id; // Set the author to the logged-in user
  await review.save();

  const listing = await Listing.findById(id);
  listing.reviews.push(review._id); // Push the ObjectId of the review
  await listing.save();

  req.flash("success", "New Review added successfully!");
  res.redirect(`/listings/${id}`);
};

module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;
  await Review.findByIdAndDelete(reviewId);

  const listing = await Listing.findById(id);
  listing.reviews = listing.reviews.filter(
    (review) => review.toString() !== reviewId
  );
  await listing.save();

  req.flash("success", "Review deleted successfully!");
  res.redirect(`/listings/${id}`);
};
