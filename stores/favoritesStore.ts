import { mockUser } from "@/data/mockData";
import { getUserFavorites, toggleFavorite } from "@/utils/database";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface FavoritesState {
  // State
  favoriteVendors: string[];
  isLoading: boolean;
  error: string | null;

  // Actions
  loadFavorites: () => Promise<void>;
  toggleFavoriteVendor: (vendorId: string) => Promise<void>;
  isFavorited: (vendorId: string) => boolean;
  clearError: () => void;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      // Initial state
      favoriteVendors: [],
      isLoading: false,
      error: null,

      // Actions
      loadFavorites: async () => {
        try {
          set({ isLoading: true, error: null });
          const favorites = await getUserFavorites(mockUser.id);
          set({ favoriteVendors: favorites, isLoading: false });
        } catch (error) {
          console.error("Error loading favorites:", error);
          set({
            error: "Failed to load favorites",
            isLoading: false,
          });
        }
      },

      toggleFavoriteVendor: async (vendorId: string) => {
        try {
          set({ error: null });

          // Optimistically update the UI
          const currentFavorites = get().favoriteVendors;
          const isCurrentlyFavorited = currentFavorites.includes(vendorId);
          const newFavorites = isCurrentlyFavorited
            ? currentFavorites.filter((id) => id !== vendorId)
            : [...currentFavorites, vendorId];

          set({ favoriteVendors: newFavorites });

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

      isFavorited: (vendorId: string) => {
        return get().favoriteVendors.includes(vendorId);
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "favorites-storage",
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist the favoriteVendors array, not loading states
      partialize: (state) => ({ favoriteVendors: state.favoriteVendors }),
    }
  )
);
