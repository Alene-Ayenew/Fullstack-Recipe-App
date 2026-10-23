import express from "express";
import {
  createFavorite,
  removeFavorite,
} from "../controllers/favoriteController.js";

const router = express.Router();

// Create a favorite
router.post("/", createFavorite);

// Delete a favorite
router.delete("/:userId/:recipeId", removeFavorite);

export default router;