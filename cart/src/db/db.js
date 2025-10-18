const mongoose = require("mongoose");

async function connectToDb() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to the DB");
  } catch (error) {
    console.error("Error connecting to the cart database", error);
  }
}

module.exports = connectToDb;
