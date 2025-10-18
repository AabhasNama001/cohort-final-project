const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require('cors');
const authRoutes = require("./routes/auth.routes");

const app = express();
app.use(express.json());
// Allow Vite dev server origin and enable credentials for cookie-based auth
app.use(cors({ origin: 'https://tubular-chimera-c62428.netlify.app', credentials: true }));
app.use(cookieParser());

/* Health Check API */
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Auth service is running.",
  });
});

// Routes
app.use("/api/auth", authRoutes);

module.exports = app;
