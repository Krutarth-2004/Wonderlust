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

const bookingSchema = Joi.object({
  listing: Joi.string().hex().length(24).required(),
  user: Joi.string().hex().length(24).required(),
  checkIn: Joi.date().required(),
  checkOut: Joi.date().greater(Joi.ref("checkIn")).required(),
  guests: Joi.number().integer().min(1).required(),
  checkInTime: Joi.string().optional(),
  checkOutTime: Joi.string().optional(),
});

const userSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6), // Add `.required()` if validating during signup
  avatar: Joi.object({
    url: Joi.string().uri().optional(),
    filename: Joi.string().optional(),
  }).optional(),
  favorites: Joi.array().items(Joi.string().hex().length(24)).optional(), // MongoDB ObjectId strings
  resetPasswordToken: Joi.string().optional(),
  resetPasswordExpires: Joi.date().optional(),
});

module.exports = { listingSchema, reviewSchema, bookingSchema, userSchema };
