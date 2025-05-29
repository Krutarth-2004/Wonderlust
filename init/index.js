const mongoose = require("mongoose");
const initdata = require("./data");
const Listing = require("../models/listing");

mongoose
  .connect(
    "mongodb+srv://krutarthkadia:Kkhkkh%401707@wonderlust.dwooiis.mongodb.net/wonderlust"
  )
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
    owner: "6835587bc20db34577ac0dee", // Replace with a valid user ID
  }));
  await Listing.insertMany(initdata.data);
  console.log("Database initialized with sample data");
};

initDB();
