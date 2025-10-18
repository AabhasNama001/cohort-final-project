const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require('cors');
const sellerRoutes = require("./routes/seller.routes");

const app = express();

app.use(express.json());
app.use(cors({ origin: 'https://tubular-chimera-c62428.netlify.app', credentials: true }));
app.use(cookieParser());

/* Health Check API */
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Seller dashboard service is running.",
  });
});

app.use("/api/seller/dashboard", sellerRoutes);

module.exports = app;
