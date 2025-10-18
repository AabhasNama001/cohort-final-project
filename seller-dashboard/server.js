require("dotenv").config();
const app = require("./src/app");
const { connect } = require("./src/broker/broker");
const listeners = require("./src/broker/listeners");
const connectDb = require("./src/db/db");

// Get the port from the environment variable (for Render) or default to 3007 (for local)
const PORT = process.env.PORT || 3007;

connectDb();

connect().then(() => {
  listeners();
});

app.listen(PORT, () => {
  console.log(`Seller-Dashboard service is running on port ${PORT}`);
});
