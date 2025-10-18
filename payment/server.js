require("dotenv").config();
const app = require("./src/app");
const { connect } = require("./src/broker/broker");
const connectDb = require("./src/db/db");

// Get the port from the environment variable (for Render) or default to 3004 (for local)
const PORT = process.env.PORT || 3004;

connectDb();
connect();

app.listen(PORT, () => {
  console.log(`Payment Server is running on port ${PORT}`);
});
