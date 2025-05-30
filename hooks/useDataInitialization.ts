import { useFavoritesStore } from "@/stores/favoritesStore";
import { useEffect, useRef } from "react";

// Global flag to track if data has been initialized
let globalDataInitialized = false;

export const useDataInitialization = () => {
  const { loadFavorites, loadUserPreferences } = useFavoritesStore();
  const initializationAttempted = useRef(false);

  useEffect(() => {
    // Prevent multiple initialization attempts
    if (globalDataInitialized || initializationAttempted.current) {
      return;
    }

    initializationAttempted.current = true;

    const initializeData = async () => {
      try {
        // Use a longer delay to ensure app is fully mounted
        setTimeout(async () => {
          if (!globalDataInitialized) {
            await Promise.all([loadFavorites(), loadUserPreferences()]);
            globalDataInitialized = true;
          }
        }, 500);
      } catch (error) {
        console.error("Error initializing data:", error);
        initializationAttempted.current = false;
      }
    };

    initializeData();
  }, [loadFavorites, loadUserPreferences]);

  return globalDataInitialized;
};
