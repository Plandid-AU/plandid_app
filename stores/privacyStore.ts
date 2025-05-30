import { getUserPreferences, updateUserPreference } from "@/utils/database";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface PrivacySettings {
  shareDataForAnalytics: boolean;
}

interface PrivacyState {
  // State
  settings: PrivacySettings;
  isLoading: boolean;
  error: string | null;

  // Actions
  loadPrivacySettings: (userId?: string) => Promise<void>;
  updatePrivacySetting: (
    key: keyof PrivacySettings,
    value: boolean,
    userId?: string
  ) => Promise<void>;
  clearError: () => void;
}

const DEFAULT_USER_ID = "current-user";

const DEFAULT_PRIVACY_SETTINGS: PrivacySettings = {
  shareDataForAnalytics: false,
};

export const usePrivacyStore = create<PrivacyState>()(
  persist(
    (set, get) => ({
      // Initial state
      settings: DEFAULT_PRIVACY_SETTINGS,
      isLoading: false,
      error: null,

      // Actions
      loadPrivacySettings: async (userId = DEFAULT_USER_ID) => {
        try {
          set({ isLoading: true, error: null });
          const preferences = await getUserPreferences(userId);

          const settings: PrivacySettings = {
            shareDataForAnalytics: preferences.shareDataForAnalytics,
          };

          set({
            settings,
            isLoading: false,
          });
        } catch (error) {
          console.error("Error loading privacy settings:", error);
          set({
            error: "Failed to load privacy settings",
            isLoading: false,
          });
        }
      },

      updatePrivacySetting: async (
        key: keyof PrivacySettings,
        value: boolean,
        userId = DEFAULT_USER_ID
      ) => {
        try {
          set({ isLoading: true, error: null });

          // Update in database
          await updateUserPreference(userId, key, value);

          // Update in store
          set((state) => ({
            settings: {
              ...state.settings,
              [key]: value,
            },
            isLoading: false,
          }));
        } catch (error) {
          console.error("Error updating privacy setting:", error);
          set({
            error: "Failed to update privacy setting",
            isLoading: false,
          });
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "privacy-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        settings: state.settings,
      }),
    }
  )
);
