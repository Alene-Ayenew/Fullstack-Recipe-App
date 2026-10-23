
import { db } from "../config/db.js";
import { favoriteTable } from "../db/schema.js";

export const createFavorite = async (req, res, next) => {
  try {
    const {
      userId,
      recipeId,
      title,
      image,
      cookTime,
      servings,
    } = req.body;

    // Validate required fields
    if (!userId || !recipeId || !title) {
      return res.status(400).json({
        error: "Missing required fields",
      });
    }

    // Insert the favorite into the database
    const newFavorite = await db
      .insert(favoriteTable)
      .values({
        userId,
        recipeId,
        title,
        image,
        cookTime,
        servings,
      })
      .returning();

    return res.status(201).json(newFavorite[0]);
  } catch (error) {
    next(error);
  }
};
