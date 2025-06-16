require("dotenv").config({ path: "../.env" });

const mongoose = require("mongoose");
const initdata = require("./data");
const Listing = require("../models/listing");

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

const initDB = async () => {
  await Listing.deleteMany({});
  initdata.data = initdata.data.map((item) => ({
    ...item,
    owner: "68354f5c039e2f817d9d48af", // Replace with a valid user ID
    maxOccupancy: 100,
    image: {
      url: "https://news.airbnb.com/wp-content/uploads/sites/4/2019/06/PJM020719Q202_Luxe_WanakaNZ_LivingRoom_0264-LightOn_R1.jpg?fit=3200%2C2133",
      filename: "sample-image.jpg",
    },
  }));
  await Listing.insertMany(initdata.data);
  console.log("Database initialized with sample data");
};

initDB();
