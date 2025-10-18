const mongoose = require("mongoose");

async function connectToDb(req, res) {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DB");
  } catch (error) {
    console.error("Error connecting to order db", error);
  }
}

module.exports = connectToDb;
