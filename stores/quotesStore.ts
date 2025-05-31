import {
  deleteQuote,
  getQuoteById,
  getUserQuotes,
  saveQuote,
} from "@/utils/database";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface QuoteData {
  id: string;
  userId: string;
  vendorId: string;
  vendorName: string;
  vendorAvatar?: string;
  selectedPackage: string;
  packageDetails: any;
  selectedAddons?: any;
  packageCost: number;
  addonsCost: number;
  gst: number;
  totalCost: number;
  eventDate?: string;
  createdAt: string;
  updatedAt: string;
}

interface QuotesState {
  // Quote data
  quotes: QuoteData[];
  currentQuote: QuoteData | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  loadQuotes: (userId: string) => Promise<void>;
  loadQuoteById: (quoteId: string) => Promise<void>;
  createQuote: (
    userId: string,
    vendorId: string,
    vendorName: string,
    vendorAvatar: string | undefined,
    selectedPackage: string,
    packageDetails: any,
    selectedAddons: any,
    packageCost: number,
    addonsCost: number,
    gst: number,
    totalCost: number,
    eventDate?: string
  ) => Promise<string>;
  removeQuote: (quoteId: string, userId: string) => Promise<void>;
  clearCurrentQuote: () => void;
  clearError: () => void;
}

export const useQuotesStore = create<QuotesState>()(
  persist(
    (set, get) => ({
      // Initial state
      quotes: [],
      currentQuote: null,
      isLoading: false,
      error: null,

      // Actions
      loadQuotes: async (userId: string) => {
        try {
          set({ isLoading: true, error: null });
          const quotes = await getUserQuotes(userId);
          set({ quotes, isLoading: false });
        } catch (error) {
          console.error("Error loading quotes:", error);
          set({
            error: "Failed to load quotes",
            isLoading: false,
          });
        }
      },

      loadQuoteById: async (quoteId: string) => {
        try {
          set({ isLoading: true, error: null });
          const quote = await getQuoteById(quoteId);
          set({ currentQuote: quote, isLoading: false });
        } catch (error) {
          console.error("Error loading quote:", error);
          set({
            error: "Failed to load quote",
            isLoading: false,
          });
        }
      },

      createQuote: async (
        userId: string,
        vendorId: string,
        vendorName: string,
        vendorAvatar: string | undefined,
        selectedPackage: string,
        packageDetails: any,
        selectedAddons: any,
        packageCost: number,
        addonsCost: number,
        gst: number,
        totalCost: number,
        eventDate?: string
      ) => {
        try {
          set({ isLoading: true, error: null });

          const quoteId = await saveQuote(
            userId,
            vendorId,
            vendorName,
            vendorAvatar,
            selectedPackage,
            packageDetails,
            selectedAddons,
            packageCost,
            addonsCost,
            gst,
            totalCost,
            eventDate
          );

          // Reload quotes to get the updated list
          const quotes = await getUserQuotes(userId);
          set({ quotes, isLoading: false });

          return quoteId;
        } catch (error) {
          console.error("Error creating quote:", error);
          set({
            error: "Failed to create quote",
            isLoading: false,
          });
          throw error;
        }
      },

      removeQuote: async (quoteId: string, userId: string) => {
        try {
          set({ isLoading: true, error: null });
          await deleteQuote(quoteId, userId);

          // Remove from local state
          const currentQuotes = get().quotes;
          const updatedQuotes = currentQuotes.filter(
            (quote) => quote.id !== quoteId
          );
          set({ quotes: updatedQuotes, isLoading: false });
        } catch (error) {
          console.error("Error removing quote:", error);
          set({
            error: "Failed to remove quote",
            isLoading: false,
          });
        }
      },

      clearCurrentQuote: () => set({ currentQuote: null }),
      clearError: () => set({ error: null }),
    }),
    {
      name: "quotes-storage",
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist quotes array, not loading states
      partialize: (state) => ({ quotes: state.quotes }),
    }
  )
);
