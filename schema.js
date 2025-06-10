const Joi = require("joi");

const listingSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().required().min(0),
  address: Joi.string().required(),
  maxOccupancy: Joi.number().required().min(1),
  category: Joi.string()
    .valid(
      "house",
      "flat/apartment",
      "barn",
      "boat",
      "cabin",
      "cottage",
      "campervan",
      "castle",
      "container",
      "earth_home",
      "farm",
      "guest_house",
      "hotel",
      "houseboat",
      "tiny_home",
      "tower",
      "tree_house",
      "windmill",
      "yurt"
    )
    .required(),
  image: Joi.string().allow("", null), // allow empty since multer handles file uploads
});

const reviewSchema = Joi.object({
  comment: Joi.string().required(),
  rating: Joi.number().min(1).max(5).required(),
});

module.exports = { listingSchema, reviewSchema };
