import { db } from "../config/db.js";
import { favoriteTable } from "../db/schema.js";
import { and, eq } from "drizzle-orm";
export const createFavorite = async (req, res, next) => {
  try {
    const { userId, recipeId, title, image, cookTime, servings } = req.body;

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

// Delete a favorite
export const removeFavorite = async (req, res) => {
  try {
    const { userId, recipeId } = req.params;

    await db
      .delete(favoriteTable)
      .where(
        and(
          eq(favoriteTable.userId, parseInt(userId, 10)),
          eq(favoriteTable.recipeId, parseInt(recipeId, 10)),
        ),
      );

    return res.status(200).json({
      message: "Favorite removed successfully",
    });
  } catch (error) {
    console.error("Error removing a favorite:", error);

    return res.status(500).json({
      error: "Something went wrong!",
    });
  }
};
// Get user favorites
export const userFavorite = async (req, res) => {
  try {
    const { userId } = req.params;

    const favorites = await db
      .select()
      .from(favoriteTable)
      .where(eq(favoriteTable.userId, parseInt(userId, 10)));

    return res.status(200).json({
      success: true,
      favorites,
    });
  } catch (error) {
    console.error("Error fetching favorites:", error);

    return res.status(500).json({
      error: "Something went wrong",
    });
  }
};

