import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface ReportData {
  id: string;
  vendorId: string;
  vendorName: string;
  category: string;
  description: string;
  photos: string[];
  userId: string;
  createdAt: string;
  status: "pending" | "reviewed" | "resolved";
}

interface ReportsState {
  // Current report being created
  currentReport: Partial<ReportData> | null;

  // All user reports
  userReports: ReportData[];

  // Loading states
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;

  // Actions
  initializeReport: (vendorId: string, vendorName: string) => void;
  updateReportData: (data: Partial<ReportData>) => void;
  submitReport: (userId: string) => Promise<void>;
  loadUserReports: (userId: string) => Promise<void>;
  clearCurrentReport: () => void;
  clearError: () => void;
}

export const useReportsStore = create<ReportsState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentReport: null,
      userReports: [],
      isLoading: false,
      isSubmitting: false,
      error: null,

      // Initialize a new report
      initializeReport: (vendorId: string, vendorName: string) => {
        set({
          currentReport: {
            id: `report_${Date.now()}`,
            vendorId,
            vendorName,
            category: "",
            description: "",
            photos: [],
            createdAt: new Date().toISOString(),
            status: "pending",
          },
          error: null,
        });
      },

      // Update report data
      updateReportData: (data: Partial<ReportData>) => {
        const { currentReport } = get();
        if (currentReport) {
          set({
            currentReport: { ...currentReport, ...data },
          });
        }
      },

      // Submit report
      submitReport: async (userId: string) => {
        const { currentReport } = get();
        if (!currentReport || !currentReport.category) {
          set({ error: "Please select a category for your report" });
          return;
        }

        set({ isSubmitting: true, error: null });

        try {
          const reportToSubmit: ReportData = {
            ...currentReport,
            userId,
            createdAt: new Date().toISOString(),
            status: "pending",
          } as ReportData;

          // For now, just log the report data
          // TODO: Replace with actual API call when backend is ready
          console.log("Submitting report:", reportToSubmit);

          // Simulate API delay
          await new Promise((resolve) => setTimeout(resolve, 1000));

          // Add to user reports for local storage
          const { userReports } = get();
          set({
            userReports: [reportToSubmit, ...userReports],
            currentReport: null,
            isSubmitting: false,
          });

          // Store in AsyncStorage for persistence
          try {
            const existingReports = await AsyncStorage.getItem("user_reports");
            const reports = existingReports ? JSON.parse(existingReports) : [];
            reports.unshift(reportToSubmit);
            await AsyncStorage.setItem("user_reports", JSON.stringify(reports));
          } catch (storageError) {
            console.error("Error storing report locally:", storageError);
          }
        } catch (error) {
          console.error("Error submitting report:", error);
          set({
            error: "Failed to submit report. Please try again.",
            isSubmitting: false,
          });
        }
      },

      // Load user reports
      loadUserReports: async (userId: string) => {
        set({ isLoading: true, error: null });

        try {
          // Load from AsyncStorage for now
          // TODO: Replace with actual API call when backend is ready
          const storedReports = await AsyncStorage.getItem("user_reports");
          const reports = storedReports ? JSON.parse(storedReports) : [];

          // Filter reports for this user
          const userReports = reports.filter(
            (report: ReportData) => report.userId === userId
          );

          set({
            userReports,
            isLoading: false,
          });
        } catch (error) {
          console.error("Error loading user reports:", error);
          set({
            error: "Failed to load reports",
            isLoading: false,
          });
        }
      },

      // Clear current report
      clearCurrentReport: () => {
        set({ currentReport: null, error: null });
      },

      // Clear error
      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: "reports-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        userReports: state.userReports,
      }),
    }
  )
);
