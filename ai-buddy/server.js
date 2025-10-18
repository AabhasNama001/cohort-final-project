require("dotenv").config();
const app = require("./src/app");
const http = require("http");
const { initSocketServer } = require("./src/sockets/socket.server");

// Get the port from Render's environment variables, or default to 3005 for local development
const PORT = process.env.PORT || 3005;

const httpServer = http.createServer(app);

initSocketServer(httpServer);

httpServer.listen(PORT, () => {
  console.log(`AI-Buddy service is running on port ${PORT}`);
});
