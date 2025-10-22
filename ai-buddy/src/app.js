const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());

// Allow frontend origin
app.use(cors({ origin: "https://shoppp-ease.netlify.app", credentials: true }));

// mount AI routes
const aiRoutes = require("./routes/ai.routes");
app.use("/api/ai-buddy", aiRoutes);

/* Health Check API */
app.get("/", (req, res) => {
  res.status(200).json({
    message: "AI Buddy service is running.",
  });
});

module.exports = app;
