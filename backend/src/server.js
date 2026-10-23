import express from "express";
import "dotenv/config";

import { ENV } from "./config/env.js";
import favoriteRoutes from "./routes/favoriteRoutes.js";

const app = express();
const PORT = ENV.PORT || 5000;

// Middleware
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.status(200).json({ success: true });
});

// Favorite routes
app.use("/api/favorites", favoriteRoutes);

// Start server
app.listen(PORT, () => {
  console.log("Server is running on port:", PORT);
});