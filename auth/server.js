require("dotenv").config();
const app = require("./src/app");
const { connect } = require("./src/broker/broker");
const connectToDb = require("./src/db/db");

// Get the port from the environment variable (for Render) or default to 3000 (for local)
const PORT = process.env.PORT || 3000;

connectToDb();
connect();

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
