require("dotenv").config();
const app = require("./src/app");
const connectToDb = require("./src/db/db");

// Get the port from the environment variable (for Render) or default to 3002 (for local)
const PORT = process.env.PORT || 3002;

connectToDb();

app.listen(PORT, () => {
  console.log(`Cart Server is running on port ${PORT}`);
});
