const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require('cors');
const orderRoutes = require("./routes/order.routes");

const app = express();

app.use(express.json());
app.use(cors({ origin: 'https://shoppp-ease.netlify.app', credentials: true }));
app.use(cookieParser());

/* Health Check API */
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Order service is running.",
  });
});

app.use("/api/orders", orderRoutes);

module.exports = app;
