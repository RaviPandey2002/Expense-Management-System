const mongoose = require("mongoose");
const colors = require("colors");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to DB Successfully!!")
  } catch (error) {
    console.log(`${error}`);
  }
};

module.exports = connectDB;
