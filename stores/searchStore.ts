import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface RecentSearch {
  id: string;
  location: string;
  date: string;
  service: string;
  timestamp: Date;
}

interface SearchState {
  // Current search filters
  location: string | null;
  service: string | null;

  // Recent searches
  recentSearches: RecentSearch[];

  // Actions
  setLocation: (location: string | null) => void;
  setService: (service: string | null) => void;
  clearAll: () => void;
  addRecentSearch: (search: Omit<RecentSearch, "id" | "timestamp">) => void;
  updateMostRecentSearch: (
    search: Omit<RecentSearch, "id" | "timestamp">
  ) => void;
  clearRecentSearches: () => void;
}

export const useSearchStore = create<SearchState>()(
  persist(
    (set, get) => ({
      // Initial state
      location: null,
      service: null,
      recentSearches: [],

      // Actions
      setLocation: (location) => set({ location }),
      setService: (service) => set({ service }),

      clearAll: () =>
        set({
          location: null,
          service: null,
        }),

      addRecentSearch: (search) => {
        const newSearch: RecentSearch = {
          ...search,
          id: Date.now().toString(),
          timestamp: new Date(),
        };

        set((state) => ({
          recentSearches: [
            newSearch,
            ...state.recentSearches.filter(
              (s) =>
                !(
                  s.location === search.location &&
                  s.date === search.date &&
                  s.service === search.service
                )
            ),
          ].slice(0, 5), // Keep only 5 most recent
        }));
      },

      updateMostRecentSearch: (search) => {
        set((state) => {
          if (state.recentSearches.length === 0) {
            // If no recent searches, add as new
            const newSearch: RecentSearch = {
              ...search,
              id: Date.now().toString(),
              timestamp: new Date(),
            };
            return { recentSearches: [newSearch] };
          }

          // Update the most recent search
          const updatedRecentSearches = [...state.recentSearches];
          updatedRecentSearches[0] = {
            ...updatedRecentSearches[0],
            location: search.location,
            date: search.date,
            service: search.service,
            timestamp: new Date(),
          };

          return { recentSearches: updatedRecentSearches };
        });
      },

      clearRecentSearches: () => set({ recentSearches: [] }),
    }),
    {
      name: "search-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
