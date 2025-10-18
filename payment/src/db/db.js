const mongoose = require("mongoose");

async function connectDb(req, res) {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DB.");
  } catch (error) {
    console.log("Error connecting to the Payment service", error);
  }
}

module.exports = connectDb;
