import {
  createOrUpdateUser,
  updateUserPersonalDetails as dbUpdateUserPersonalDetails,
  updateUserWeddingDate as dbUpdateWeddingDate,
  updateUserWeddingLocation as dbUpdateWeddingLocation,
  getUser,
} from "@/utils/database";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface UserData {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  weddingDate?: Date | string;
  weddingLocation?: string;
  favoriteVendors: string[];
}

interface UserState {
  // User data
  user: UserData | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setUser: (user: UserData) => void;
  loadUser: (userId: string) => Promise<void>;
  updateWeddingDate: (date: Date) => Promise<void>;
  updateWeddingLocation: (location: string) => Promise<void>;
  updateUserPersonalDetails: (
    name: string,
    email: string,
    phoneNumber?: string
  ) => Promise<void>;
  saveUserToDatabase: () => Promise<void>;
  clearUser: () => void;
  clearError: () => void;
}

// Helper function to ensure weddingDate is a proper Date object
const normalizeUserData = (userData: UserData): UserData => {
  return {
    ...userData,
    weddingDate: userData.weddingDate
      ? typeof userData.weddingDate === "string"
        ? new Date(userData.weddingDate)
        : userData.weddingDate
      : undefined,
  };
};

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: {
        id: "current-user",
        name: "Jane Doe",
        email: "jane@example.com",
        phoneNumber: "0419293923",
        weddingDate: new Date(2026, 11, 18), // Dec 18, 2026
        weddingLocation: "Melbourne",
        favoriteVendors: [],
      },
      isLoading: false,
      error: null,

      // Actions
      setUser: (user) => set({ user: normalizeUserData(user) }),

      loadUser: async (userId: string) => {
        try {
          set({ isLoading: true, error: null });
          const userData = await getUser(userId);
          if (userData) {
            set({
              user: normalizeUserData({ ...userData, favoriteVendors: [] }),
              isLoading: false,
            });
          } else {
            // Create default user if not found
            const defaultUser: UserData = {
              id: userId,
              name: "Jane Doe",
              email: "jane@example.com",
              phoneNumber: "0419293923",
              weddingDate: new Date(2026, 11, 18),
              weddingLocation: "Melbourne",
              favoriteVendors: [],
            };
            const normalizedUser = normalizeUserData(defaultUser);
            await createOrUpdateUser(
              normalizedUser.id,
              normalizedUser.name,
              normalizedUser.email,
              normalizedUser.weddingDate instanceof Date
                ? normalizedUser.weddingDate
                : undefined,
              normalizedUser.weddingLocation,
              normalizedUser.phoneNumber
            );
            set({ user: normalizedUser, isLoading: false });
          }
        } catch (error) {
          console.error("Error loading user:", error);
          set({
            error: "Failed to load user data",
            isLoading: false,
          });
        }
      },

      updateWeddingDate: async (date: Date) => {
        const currentUser = get().user;
        if (!currentUser) return;

        try {
          set({ isLoading: true, error: null });

          // Update in database
          await dbUpdateWeddingDate(currentUser.id, date);

          // Update in store
          set((state) => ({
            user: state.user ? { ...state.user, weddingDate: date } : null,
            isLoading: false,
          }));
        } catch (error) {
          console.error("Error updating wedding date:", error);
          set({
            error: "Failed to update wedding date",
            isLoading: false,
          });
        }
      },

      updateWeddingLocation: async (location: string) => {
        const currentUser = get().user;
        if (!currentUser) return;

        try {
          set({ isLoading: true, error: null });

          // Update in database
          await dbUpdateWeddingLocation(currentUser.id, location);

          // Update in store
          set((state) => ({
            user: state.user
              ? { ...state.user, weddingLocation: location }
              : null,
            isLoading: false,
          }));
        } catch (error) {
          console.error("Error updating wedding location:", error);
          set({
            error: "Failed to update wedding location",
            isLoading: false,
          });
        }
      },

      updateUserPersonalDetails: async (
        name: string,
        email: string,
        phoneNumber?: string
      ) => {
        const currentUser = get().user;
        if (!currentUser) return;

        try {
          set({ isLoading: true, error: null });

          // Update in database
          await dbUpdateUserPersonalDetails(
            currentUser.id,
            name,
            email,
            phoneNumber
          );

          // Update in store
          set((state) => ({
            user: state.user
              ? { ...state.user, name, email, phoneNumber }
              : null,
            isLoading: false,
          }));
        } catch (error) {
          console.error("Error updating user personal details:", error);
          set({
            error: "Failed to update user personal details",
            isLoading: false,
          });
        }
      },

      saveUserToDatabase: async () => {
        const currentUser = get().user;
        if (!currentUser) return;

        try {
          set({ isLoading: true, error: null });
          const normalizedUser = normalizeUserData(currentUser);
          await createOrUpdateUser(
            normalizedUser.id,
            normalizedUser.name,
            normalizedUser.email,
            normalizedUser.weddingDate instanceof Date
              ? normalizedUser.weddingDate
              : undefined,
            normalizedUser.weddingLocation,
            normalizedUser.phoneNumber
          );
          set({ isLoading: false });
        } catch (error) {
          console.error("Error saving user to database:", error);
          set({
            error: "Failed to save user data",
            isLoading: false,
          });
        }
      },

      clearUser: () => set({ user: null }),

      clearError: () => set({ error: null }),
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
      }),
    }
  )
);
