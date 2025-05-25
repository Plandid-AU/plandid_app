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
  date: string | null;
  service: string | null;

  // Recent searches
  recentSearches: RecentSearch[];

  // Actions
  setLocation: (location: string | null) => void;
  setDate: (date: string | null) => void;
  setService: (service: string | null) => void;
  clearAll: () => void;
  addRecentSearch: (search: Omit<RecentSearch, "id" | "timestamp">) => void;
  clearRecentSearches: () => void;
}

export const useSearchStore = create<SearchState>()(
  persist(
    (set, get) => ({
      // Initial state
      location: null,
      date: null,
      service: null,
      recentSearches: [],

      // Actions
      setLocation: (location) => set({ location }),
      setDate: (date) => set({ date }),
      setService: (service) => set({ service }),

      clearAll: () =>
        set({
          location: null,
          date: null,
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

      clearRecentSearches: () => set({ recentSearches: [] }),
    }),
    {
      name: "search-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
