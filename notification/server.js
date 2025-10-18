require("dotenv").config();
const app = require("./src/app");

// Get the port from the environment variable (for Render) or default to 3006 (for local)
const PORT = process.env.PORT || 3006;

app.listen(PORT, () => {
  console.log(`Notification service is running on port ${PORT}`);
});
