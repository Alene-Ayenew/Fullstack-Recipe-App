
import express from "express";
import { createFavorite } from "../controllers/favoriteController.js";

const router = express.Router();

// POST /api/favorites
router.post("/", createFavorite);

export default router;
