const express = require("express");
const { connect } = require("./broker/broker");
const setListeners = require("./broker/listeners");
const cors = require('cors');

const app = express();
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json())

const { getNotifications } = require('./store')

/* Notifications API */
app.get('/api/notifications', (req, res) => {
  const notes = getNotifications()
  res.status(200).json(notes)
})

connect().then(() => {
  setListeners();
});

/* Health Check API */
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Notification service is running.",
  });
});

module.exports = app;
