const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require('cors');
const app = express();
const paymentRoutes = require("./routes/payment.routes");

app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(cookieParser());

/* Health Check API */
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Payment service is running.",
  });
});

app.use("/api/payments", paymentRoutes);

module.exports = app;
