import express from "express";
import {
  createFavorite,
  removeFavorite,
  userFavorite,
} from "../controllers/favoriteController.js";

const router = express.Router();

// Create a favorite
router.post("/", createFavorite);

// Delete a favorite
router.delete("/:userId/:recipeId", removeFavorite);
// Get favorite (user favorites)
router.get("/:userId",userFavorite);
export default router;