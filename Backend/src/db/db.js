const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connection succesful");
  } catch (error) {
    console.log("COnnection failed", error);
  }
}

module.exports = connectDB;
