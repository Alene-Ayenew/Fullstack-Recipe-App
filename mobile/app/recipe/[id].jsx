import { View, Text, Alert, ScrollView, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import { router, useLocalSearchParams, useRouter } from "expo-router";
import { useUser } from "@clerk/expo";
import { API_URL } from "../../constants/api";
import { MealAPI } from "../../services/mealAPI";
import LoadingSpinner from "../../components/LoadingSpinner";
import { recipeDetailStyles } from "../../assets/styles/recipe-detail.styles";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";
const RecipeDetailScreen = () => {
  const { id: recipeId } = useLocalSearchParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useUser();
  const router = useRouter();
  const userId = user?.id;
  useEffect(() => {
    const checkIfSaved = async () => {
      try {
        const response = await fetch(`${API_URL}/favorites/${userId}`);
        const favorites = await response.json();
        const isRecipeSaved = favorites.some(
          (fav) => fav.recipeId === parseInt(recipeId),
        );
        setIsSaved(isRecipeSaved);
      } catch (error) {
        console.error("Error checking if recipe is saved:", error);
      }
    };

    const loadRecipeDetail = async () => {
      setLoading(true);
      try {
        const mealData = await MealAPI.getMealById(recipeId);
        if (mealData) {
          const transformedRecipe = MealAPI.transformMealData(mealData);

          const recipeWithVideo = {
            ...transformedRecipe,
            youtubeUrl: mealData.strYoutube || null,
          };

          setRecipe(recipeWithVideo);
        }
      } catch (error) {
        console.error("Error loading recipe detail:", error);
      } finally {
        setLoading(false);
      }
    };

    checkIfSaved();
    loadRecipeDetail();
  }, [recipeId, userId]);

  const getYouTubeEmbedUrl = (url) => {
    // example url: https://www.youtube.com/watch?v=mTvlmY4vCug
    const videoId = url.split("v=")[1];
    return `https://www.youtube.com/embed/${videoId}`;
  };

  const handleToggleSave = async () => {
    setIsSaving(true);

    try {
      if (isSaved) {
        // remove from favorites
        const response = await fetch(
          `${API_URL}/favorites/${userId}/${recipeId}`,
          {
            method: "DELETE",
          },
        );
        if (!response.ok) throw new Error("Failed to remove recipe");

        setIsSaved(false);
      } else {
        // add to favorites
        const response = await fetch(`${API_URL}/favorites`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            recipeId: parseInt(recipeId),
            title: recipe.title,
            image: recipe.image,
            cookTime: recipe.cookTime,
            servings: recipe.servings,
          }),
        });

        if (!response.ok) throw new Error("Failed to save recipe");
        setIsSaved(true);
      }
    } catch (error) {
      console.error("Error toggling recipe save:", error);
      Alert.alert("Error", `Something went wrong. Please try again.`);
    } finally {
      setIsSaving(false);
    }
  };
  if (loading) return <LoadingSpinner message="Loading recipe details..." />;
  return (
    <View style={recipeDetailStyles.container}>
      <ScrollView>
        {/* header */}
        <View style={recipeDetailStyles.headerContainer}>
          <View style={recipeDetailStyles.imageContainer}>
            <Image
              source={{ uri: recipe.image }}
              style={recipeDetailStyles.headerImage}
              contentFit="cover"
            />
          </View>
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.5)", "rgba(0,0,0,0.9)"]}
            style={recipeDetailStyles.gradientOverlay}
          />
          <View style={recipeDetailStyles.floatingButtons}>
            <TouchableOpacity
              style={recipeDetailStyles.floatingButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color={COLORS.white} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                recipeDetailStyles.floatingButton,
                { backgroundColor: isSaving ? COLORS.gray : COLORS.primary },
              ]}
              onPress={handleToggleSave}
              disabled={isSaving}
            >
              <Ionicons
                name={
                  isSaving
                    ? "hourglass"
                    : isSaved
                      ? "bookmark"
                      : "bookmarks-outline"
                }
                size={24}
                color={COLORS.white}
              />
            </TouchableOpacity>
          </View>

          {/* title section */}
          <View style={recipeDetailStyles.titleSection}>
            <View style={recipeDetailStyles.categoryBadge}>
              <Text style={recipeDetailStyles.categoryText}>
                {recipe.category}
              </Text>
            </View>
            <Text style={recipeDetailStyles.recipeTitle}>{recipe.title}</Text>
            {recipe.area && (
              <View style={recipeDetailStyles.locationRow}>
                <Ionicons name="location" size={16} color={COLORS.white} />
                <Text style={recipeDetailStyles.locationText}>
                  {recipe.area} Cuisine
                </Text>
              </View>
            )}
          </View>

          <View style={recipeDetailStyles.contentSection}>
            {/* QUICK STATS */}
            <View style={recipeDetailStyles.statsContainer}>
              <View style={recipeDetailStyles.statCard}>
                <LinearGradient
                  colors={["#FF6B6B", "#FF8E53"]}
                  style={recipeDetailStyles.statIconContainer}
                >
                  <Ionicons name="time" size={20} color={COLORS.white} />
                </LinearGradient>
                <Text style={recipeDetailStyles.statValue}>
                  {recipe.cookTime}
                </Text>
                <Text style={recipeDetailStyles.statLabel}>Prep Time</Text>
              </View>

              <View style={recipeDetailStyles.statCard}>
                <LinearGradient
                  colors={["#4ECDC4", "#44A08D"]}
                  style={recipeDetailStyles.statIconContainer}
                >
                  <Ionicons name="people" size={20} color={COLORS.white} />
                </LinearGradient>
                <Text style={recipeDetailStyles.statValue}>
                  {recipe.servings}
                </Text>
                <Text style={recipeDetailStyles.statLabel}>Servings</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default RecipeDetailScreen;
