const express = require("express");
const cartRoutes = require("./routes/cart.routes");
const cookieParser = require("cookie-parser");
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors({ origin: 'https://tubular-chimera-c62428.netlify.app', credentials: true }));
app.use(cookieParser());

/* Health Check API */
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Cart service is running.",
  });
});

app.use("/api/cart", cartRoutes);

module.exports = app;
