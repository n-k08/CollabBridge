import dns from "dns";
dns.setDefaultResultOrder("ipv4first");

import http from "http";
import app from "./app.js";
import connectDB from "./config/db.js";
import { initSocket } from "./config/socket.js";
import initSocketHandlers from "./sockets/index.js";
import { PORT } from "./config/env.js";

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Create HTTP server
    const server = http.createServer(app);

    // Initialize Socket.io
    const io = initSocket(server);
    initSocketHandlers(io);

    // Start server
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Socket.io initialized`);
      console.log(`API available at http://localhost:${PORT}/api`);
    });

  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();