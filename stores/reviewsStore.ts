import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

export interface Review {
  id: string;
  userId: string;
  vendorId: string;
  vendorName: string;
  vendorAvatar?: string;
  rating: number;
  isRecommended: boolean;
  description: string;
  photos: string[];
  createdAt: string;
  updatedAt: string;
}

interface ReviewsState {
  reviews: Review[];
  isLoading: boolean;
  error: string | null;

  // Actions
  loadReviews: (userId: string) => Promise<void>;
  addReview: (
    review: Omit<Review, "id" | "createdAt" | "updatedAt">
  ) => Promise<void>;
  updateReview: (reviewId: string, updates: Partial<Review>) => Promise<void>;
  deleteReview: (reviewId: string) => Promise<void>;
  clearError: () => void;
}

const REVIEWS_STORAGE_KEY = "app_reviews";

export const useReviewsStore = create<ReviewsState>((set, get) => ({
  reviews: [],
  isLoading: false,
  error: null,

  loadReviews: async (userId: string) => {
    set({ isLoading: true, error: null });

    try {
      // Simulate API call - replace with actual API integration later
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Load reviews from AsyncStorage
      const storedReviews = await AsyncStorage.getItem(REVIEWS_STORAGE_KEY);
      const allReviews: Review[] = storedReviews
        ? JSON.parse(storedReviews)
        : [];

      // Filter reviews for the current user
      const userReviews = allReviews.filter(
        (review) => review.userId === userId
      );

      set({ reviews: userReviews, isLoading: false });
    } catch (error) {
      console.error("Error loading reviews:", error);
      set({
        error: "Failed to load reviews. Please try again.",
        isLoading: false,
      });
    }
  },

  addReview: async (reviewData) => {
    set({ isLoading: true, error: null });

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newReview: Review = {
        ...reviewData,
        id: `review-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Load existing reviews from storage
      const storedReviews = await AsyncStorage.getItem(REVIEWS_STORAGE_KEY);
      const allReviews: Review[] = storedReviews
        ? JSON.parse(storedReviews)
        : [];

      // Add new review to all reviews
      const updatedAllReviews = [newReview, ...allReviews];

      // Save back to storage
      await AsyncStorage.setItem(
        REVIEWS_STORAGE_KEY,
        JSON.stringify(updatedAllReviews)
      );

      set((state) => ({
        reviews: [newReview, ...state.reviews],
        isLoading: false,
      }));
    } catch (error) {
      console.error("Error adding review:", error);
      set({
        error: "Failed to add review. Please try again.",
        isLoading: false,
      });
    }
  },

  updateReview: async (reviewId: string, updates: Partial<Review>) => {
    set({ isLoading: true, error: null });

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Load existing reviews from storage
      const storedReviews = await AsyncStorage.getItem(REVIEWS_STORAGE_KEY);
      const allReviews: Review[] = storedReviews
        ? JSON.parse(storedReviews)
        : [];

      // Update the review in all reviews
      const updatedAllReviews = allReviews.map((review) =>
        review.id === reviewId
          ? { ...review, ...updates, updatedAt: new Date().toISOString() }
          : review
      );

      // Save back to storage
      await AsyncStorage.setItem(
        REVIEWS_STORAGE_KEY,
        JSON.stringify(updatedAllReviews)
      );

      set((state) => ({
        reviews: state.reviews.map((review) =>
          review.id === reviewId
            ? { ...review, ...updates, updatedAt: new Date().toISOString() }
            : review
        ),
        isLoading: false,
      }));
    } catch (error) {
      console.error("Error updating review:", error);
      set({
        error: "Failed to update review. Please try again.",
        isLoading: false,
      });
    }
  },

  deleteReview: async (reviewId: string) => {
    set({ isLoading: true, error: null });

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Load existing reviews from storage
      const storedReviews = await AsyncStorage.getItem(REVIEWS_STORAGE_KEY);
      const allReviews: Review[] = storedReviews
        ? JSON.parse(storedReviews)
        : [];

      // Remove the review from all reviews
      const updatedAllReviews = allReviews.filter(
        (review) => review.id !== reviewId
      );

      // Save back to storage
      await AsyncStorage.setItem(
        REVIEWS_STORAGE_KEY,
        JSON.stringify(updatedAllReviews)
      );

      set((state) => ({
        reviews: state.reviews.filter((review) => review.id !== reviewId),
        isLoading: false,
      }));
    } catch (error) {
      console.error("Error deleting review:", error);
      set({
        error: "Failed to delete review. Please try again.",
        isLoading: false,
      });
    }
  },

  clearError: () => set({ error: null }),
}));
