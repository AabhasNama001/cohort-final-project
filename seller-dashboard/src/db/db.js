const mongoose = require("mongoose");

async function connectDb(req, res) {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to db");
  } catch (error) {
    console.log("Error connecting to the Db", error);
  }
}

module.exports = connectDb;
