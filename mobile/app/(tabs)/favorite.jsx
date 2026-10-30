
import {
  View,
  Text,
  Alert,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useAuth, useUser } from "@clerk/expo";
import React, { useEffect, useState } from "react";
import { API_URL } from "../../constants/api";
import { favoritesStyles } from "../../assets/styles/favorites.styles";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";
import RecipeCard from "../../components/RecipeCard";
import NoFavoritesFound from "../../components/NoFavoritesFound";
import LoadingSpinner from "../../components/LoadingSpinner";

const FavoriteScreen = () => {
  const { signOut } = useAuth();
  const { user } = useUser();

  const [favoriteRecipes, setFavoriteRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFavorites = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/favorites/${user.id}`);

        if (!response.ok) throw new Error("Failed to fetch favorites");

        const favorites = await response.json();

        // Transform the data to match RecipeCard components
        const transformedFavorites = favorites.map((favorite) => ({
          ...favorite,
          id: favorite.recipeId,
        }));

        setFavoriteRecipes(transformedFavorites);
      } catch (error) {
        console.log("Error loading favorites:", error);
        Alert.alert("Error", "Failed to load favorites");
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, [user?.id]);

  const handleSignOut = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await signOut();
          } catch (error) {
            console.log("Error signing out:", error);
            Alert.alert("Error", "Failed to sign out");
          }
        },
      },
    ]);
  };

  if (loading) {
    return <LoadingSpinner message="Loading your favorites" />;
  }

  return (
    <View style={favoritesStyles.container}>
      <View style={favoritesStyles.header}>
        <Text style={favoritesStyles.title}>Favorites</Text>

        <TouchableOpacity
          style={favoritesStyles.logoutButton}
          onPress={handleSignOut}
        >
          <Ionicons name="log-out-outline" size={22} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      <View style={favoritesStyles.recipesSection}>
        <FlatList
          data={favoriteRecipes}
          renderItem={({ item }) => <RecipeCard recipe={item} />}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={favoritesStyles.recipesGrid}
          ListEmptyComponent={<NoFavoritesFound />}
        />
      </View>
    </View>
  );
};

export default FavoriteScreen;
