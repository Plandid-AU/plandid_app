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
  loadFavorites: (userId?: string) => Promise<void>;
  loadUserPreferences: (userId?: string) => Promise<void>;
  toggleFavoriteVendor: (vendorId: string, userId?: string) => Promise<void>;
  toggleSuperlikeVendor: (
    vendorId: string,
    userId?: string
  ) => Promise<{ isSuperliked: boolean; isFavorited: boolean }>;
  isFavorited: (vendorId: string) => boolean;
  isSuperliked: (vendorId: string) => boolean;
  markTooltipSeen: (
    tooltipType: "superlike" | "undoSuperlike",
    userId?: string
  ) => Promise<void>;
  clearError: () => void;
}

const DEFAULT_USER_ID = "current-user";

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
      loadFavorites: async (userId = DEFAULT_USER_ID) => {
        try {
          set({ isLoading: true, error: null });
          const [favorites, superlikes] = await Promise.all([
            getUserFavorites(userId),
            getUserSuperlikes(userId),
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

      loadUserPreferences: async (userId = DEFAULT_USER_ID) => {
        try {
          const preferences = await getUserPreferences(userId);
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

      toggleFavoriteVendor: async (
        vendorId: string,
        userId = DEFAULT_USER_ID
      ) => {
        try {
          set({ isLoading: true, error: null });

          const isFavorited = await toggleFavorite(userId, vendorId);

          set((state) => ({
            favoriteVendors: isFavorited
              ? [...state.favoriteVendors, vendorId]
              : state.favoriteVendors.filter((id) => id !== vendorId),
            isLoading: false,
          }));
        } catch (error) {
          console.error("Error toggling favorite:", error);
          set({
            error: "Failed to update favorite",
            isLoading: false,
          });
        }
      },

      toggleSuperlikeVendor: async (
        vendorId: string,
        userId = DEFAULT_USER_ID
      ) => {
        try {
          set({ isLoading: true, error: null });

          const result = await toggleSuperlike(userId, vendorId);

          set((state) => {
            const newFavorites = result.isFavorited
              ? state.favoriteVendors.includes(vendorId)
                ? state.favoriteVendors
                : [...state.favoriteVendors, vendorId]
              : state.favoriteVendors.filter((id) => id !== vendorId);

            const newSuperlikes = result.isSuperliked
              ? state.superlikedVendors.includes(vendorId)
                ? state.superlikedVendors
                : [...state.superlikedVendors, vendorId]
              : state.superlikedVendors.filter((id) => id !== vendorId);

            let newHasCompletedFirstSuperlike =
              state.hasCompletedFirstSuperlike;

            // Mark first superlike as completed if this is a new superlike
            if (result.isSuperliked && !state.hasCompletedFirstSuperlike) {
              newHasCompletedFirstSuperlike = true;
              // Update in database
              updateUserPreference(
                userId,
                "hasCompletedFirstSuperlike",
                true
              ).catch(console.error);
            }

            return {
              ...state,
              favoriteVendors: newFavorites,
              superlikedVendors: newSuperlikes,
              hasCompletedFirstSuperlike: newHasCompletedFirstSuperlike,
              isLoading: false,
            };
          });

          return result;
        } catch (error) {
          console.error("Error toggling superlike:", error);
          set({
            error: "Failed to update superlike",
            isLoading: false,
          });
          return { isSuperliked: false, isFavorited: false };
        }
      },

      isFavorited: (vendorId: string) => {
        return get().favoriteVendors.includes(vendorId);
      },

      isSuperliked: (vendorId: string) => {
        return get().superlikedVendors.includes(vendorId);
      },

      markTooltipSeen: async (
        tooltipType: "superlike" | "undoSuperlike",
        userId = DEFAULT_USER_ID
      ) => {
        try {
          const preference =
            tooltipType === "superlike"
              ? "hasSeenSuperlikeTooltip"
              : "hasSeenUndoSuperlikeTooltip";

          await updateUserPreference(userId, preference, true);

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
