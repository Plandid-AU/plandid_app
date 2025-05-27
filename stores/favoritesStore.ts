import { mockUser } from "@/data/mockData";
import {
  getUserFavorites,
  getUserPreferences,
  getUserSuperlikes,
  toggleFavorite,
  toggleSuperlike,
  updateUserPreference,
} from "@/utils/database";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface FavoritesState {
  // State
  favoriteVendors: string[];
  superlikedVendors: string[];
  isLoading: boolean;
  error: string | null;

  // User preferences for tooltips
  hasSeenSuperlikeTooltip: boolean;
  hasSeenUndoSuperlikeTooltip: boolean;
  hasCompletedFirstSuperlike: boolean;

  // Actions
  loadFavorites: () => Promise<void>;
  loadUserPreferences: () => Promise<void>;
  toggleFavoriteVendor: (vendorId: string) => Promise<void>;
  toggleSuperlikeVendor: (
    vendorId: string
  ) => Promise<{ isSuperliked: boolean; isFavorited: boolean }>;
  isFavorited: (vendorId: string) => boolean;
  isSuperliked: (vendorId: string) => boolean;
  markTooltipSeen: (
    tooltipType: "superlike" | "undoSuperlike"
  ) => Promise<void>;
  clearError: () => void;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      // Initial state
      favoriteVendors: [],
      superlikedVendors: [],
      isLoading: false,
      error: null,
      hasSeenSuperlikeTooltip: false,
      hasSeenUndoSuperlikeTooltip: false,
      hasCompletedFirstSuperlike: false,

      // Actions
      loadFavorites: async () => {
        try {
          set({ isLoading: true, error: null });
          const [favorites, superlikes] = await Promise.all([
            getUserFavorites(mockUser.id),
            getUserSuperlikes(mockUser.id),
          ]);
          set({
            favoriteVendors: favorites,
            superlikedVendors: superlikes,
            isLoading: false,
          });
        } catch (error) {
          console.error("Error loading favorites:", error);
          set({
            error: "Failed to load favorites",
            isLoading: false,
          });
        }
      },

      loadUserPreferences: async () => {
        try {
          const preferences = await getUserPreferences(mockUser.id);
          set({
            hasSeenSuperlikeTooltip: preferences.hasSeenSuperlikeTooltip,
            hasSeenUndoSuperlikeTooltip:
              preferences.hasSeenUndoSuperlikeTooltip,
            hasCompletedFirstSuperlike: preferences.hasCompletedFirstSuperlike,
          });
        } catch (error) {
          console.error("Error loading user preferences:", error);
        }
      },

      toggleFavoriteVendor: async (vendorId: string) => {
        try {
          set({ error: null });

          // Optimistically update the UI
          const currentFavorites = get().favoriteVendors;
          const currentSuperlikes = get().superlikedVendors;
          const isCurrentlyFavorited = currentFavorites.includes(vendorId);

          let newFavorites: string[];
          let newSuperlikes: string[];

          if (isCurrentlyFavorited) {
            // Remove from both favorites and superlikes
            newFavorites = currentFavorites.filter((id) => id !== vendorId);
            newSuperlikes = currentSuperlikes.filter((id) => id !== vendorId);
          } else {
            // Add to favorites only
            newFavorites = [...currentFavorites, vendorId];
            newSuperlikes = currentSuperlikes;
          }

          set({
            favoriteVendors: newFavorites,
            superlikedVendors: newSuperlikes,
          });

          // Sync with database
          const isFavorited = await toggleFavorite(mockUser.id, vendorId);

          // Verify the database state matches our optimistic update
          if (isFavorited !== !isCurrentlyFavorited) {
            // If there's a mismatch, reload from database
            await get().loadFavorites();
          }
        } catch (error) {
          console.error("Error toggling favorite:", error);
          set({ error: "Failed to update favorite" });

          // Reload favorites from database on error
          await get().loadFavorites();
        }
      },

      toggleSuperlikeVendor: async (vendorId: string) => {
        try {
          set({ error: null });

          // Optimistically update the UI
          const currentFavorites = get().favoriteVendors;
          const currentSuperlikes = get().superlikedVendors;
          const isCurrentlySuperliked = currentSuperlikes.includes(vendorId);

          let newFavorites: string[];
          let newSuperlikes: string[];

          if (isCurrentlySuperliked) {
            // Remove from superlikes, keep in favorites
            newFavorites = currentFavorites.includes(vendorId)
              ? currentFavorites
              : [...currentFavorites, vendorId];
            newSuperlikes = currentSuperlikes.filter((id) => id !== vendorId);
          } else {
            // Add to both favorites and superlikes
            newFavorites = currentFavorites.includes(vendorId)
              ? currentFavorites
              : [...currentFavorites, vendorId];
            newSuperlikes = [...currentSuperlikes, vendorId];
          }

          set({
            favoriteVendors: newFavorites,
            superlikedVendors: newSuperlikes,
          });

          // Sync with database
          const result = await toggleSuperlike(mockUser.id, vendorId);

          // Update preferences if this was the first superlike
          if (result.isSuperliked && !get().hasCompletedFirstSuperlike) {
            set({ hasCompletedFirstSuperlike: true });
          }

          return result;
        } catch (error) {
          console.error("Error toggling superlike:", error);
          set({ error: "Failed to update superlike" });

          // Reload favorites from database on error
          await get().loadFavorites();
          return { isSuperliked: false, isFavorited: false };
        }
      },

      isFavorited: (vendorId: string) => {
        return get().favoriteVendors.includes(vendorId);
      },

      isSuperliked: (vendorId: string) => {
        return get().superlikedVendors.includes(vendorId);
      },

      markTooltipSeen: async (tooltipType: "superlike" | "undoSuperlike") => {
        try {
          const preference =
            tooltipType === "superlike"
              ? "hasSeenSuperlikeTooltip"
              : "hasSeenUndoSuperlikeTooltip";

          await updateUserPreference(mockUser.id, preference, true);

          set({
            [preference]: true,
          });
        } catch (error) {
          console.error("Error marking tooltip as seen:", error);
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "favorites-storage",
      storage: createJSONStorage(() => AsyncStorage),
      // Persist favorites, superlikes, and user preferences
      partialize: (state) => ({
        favoriteVendors: state.favoriteVendors,
        superlikedVendors: state.superlikedVendors,
        hasSeenSuperlikeTooltip: state.hasSeenSuperlikeTooltip,
        hasSeenUndoSuperlikeTooltip: state.hasSeenUndoSuperlikeTooltip,
        hasCompletedFirstSuperlike: state.hasCompletedFirstSuperlike,
      }),
    }
  )
);
