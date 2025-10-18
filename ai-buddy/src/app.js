const express = require("express");

const app = express();

app.use(express.json())

// mount AI routes
const aiRoutes = require('./routes/ai.routes')
app.use('/api/ai-buddy', aiRoutes)

/* Health Check API */
app.get("/", (req, res) => {
  res.status(200).json({
    message: "AI Buddy service is running.",
  });
});

module.exports = app;
