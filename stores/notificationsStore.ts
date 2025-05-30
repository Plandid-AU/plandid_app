import { getUserPreferences, updateUserPreference } from "@/utils/database";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

interface NotificationSettings {
  messages: boolean;
  recommendations: boolean;
  reminders: boolean;
  email: boolean;
}

interface NotificationState {
  // State
  settings: NotificationSettings;
  isLoading: boolean;
  error: string | null;
  permissionGranted: boolean;

  // Actions
  loadNotificationSettings: (userId?: string) => Promise<void>;
  updateNotificationSetting: (
    key: keyof NotificationSettings,
    value: boolean,
    userId?: string
  ) => Promise<void>;
  checkPermissionStatus: () => Promise<void>;
  requestNotificationPermission: () => Promise<{
    granted: boolean;
    shouldShowSettings: boolean;
  }>;
  clearError: () => void;
}

const DEFAULT_USER_ID = "current-user";

const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  messages: false,
  recommendations: false,
  reminders: false,
  email: false,
};

export const useNotificationsStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      // Initial state
      settings: DEFAULT_NOTIFICATION_SETTINGS,
      isLoading: false,
      error: null,
      permissionGranted: false,

      // Actions
      loadNotificationSettings: async (userId = DEFAULT_USER_ID) => {
        try {
          set({ isLoading: true, error: null });
          const preferences = await getUserPreferences(userId);

          const settings: NotificationSettings = {
            messages: preferences.notificationsMessages || false,
            recommendations: preferences.notificationsRecommendations || false,
            reminders: preferences.notificationsReminders || false,
            email: preferences.notificationsEmail || false,
          };

          set({
            settings,
            isLoading: false,
          });
        } catch (error) {
          console.error("Error loading notification settings:", error);
          set({
            error: "Failed to load notification settings",
            isLoading: false,
          });
        }
      },

      updateNotificationSetting: async (
        key: keyof NotificationSettings,
        value: boolean,
        userId = DEFAULT_USER_ID
      ) => {
        try {
          set({ isLoading: true, error: null });

          // Map to database field names
          const dbFieldMap = {
            messages: "notificationsMessages",
            recommendations: "notificationsRecommendations",
            reminders: "notificationsReminders",
            email: "notificationsEmail",
          };

          // Update in database
          await updateUserPreference(userId, dbFieldMap[key] as any, value);

          // Update in store
          set((state) => ({
            settings: {
              ...state.settings,
              [key]: value,
            },
            isLoading: false,
          }));
        } catch (error) {
          console.error("Error updating notification setting:", error);
          set({
            error: "Failed to update notification setting",
            isLoading: false,
          });
        }
      },

      checkPermissionStatus: async () => {
        try {
          const { status } = await Notifications.getPermissionsAsync();
          const granted = status === "granted";
          set({ permissionGranted: granted });

          // Store permission status for consistency
          await AsyncStorage.setItem(
            "notification-permission",
            granted ? "granted" : "denied"
          );
        } catch (error) {
          console.error(
            "Error checking notification permission status:",
            error
          );
          set({ permissionGranted: false });
        }
      },

      requestNotificationPermission: async () => {
        try {
          const { status: existingStatus } =
            await Notifications.getPermissionsAsync();

          let finalStatus = existingStatus;

          // Only ask if permissions have not been previously determined
          if (existingStatus !== "granted") {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
          }

          const granted = finalStatus === "granted";
          set({ permissionGranted: granted });

          // Store permission status
          await AsyncStorage.setItem(
            "notification-permission",
            granted ? "granted" : "denied"
          );

          if (!granted) {
            console.warn("Notification permission not granted");
            // Return both the granted status and whether we should show settings prompt
            return {
              granted: false,
              shouldShowSettings: finalStatus === "denied",
            };
          }

          return { granted: true, shouldShowSettings: false };
        } catch (error) {
          console.error("Error requesting notification permission:", error);
          return { granted: false, shouldShowSettings: false };
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "notifications-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        settings: state.settings,
        // Don't persist permissionGranted - always check with system
      }),
    }
  )
);
