import { ConfirmationModal } from "@/components/ConfirmationModal";
import { DateSelectorModal } from "@/components/DateSelectorModal";
import { LocationSelectorModal } from "@/components/LocationSelectorModal";
import { ThemedText } from "@/components/ThemedText";
import { rf, rs } from "@/constants/Responsive";
import { useTheme } from "@/hooks/useTheme";
import { useUserStore } from "@/stores/userStore";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.backgroundPrimary,
    },
    keyboardAvoidingView: {
      flex: 1,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: theme.spacing["5xl"],
      paddingVertical: theme.spacing["2xl"],
      gap: theme.spacing["2xl"],
    },
    backButton: {
      padding: theme.spacing.sm,
    },
    backIcon: {
      width: 12,
      height: 12,
      borderTopWidth: 2,
      borderLeftWidth: 2,
      borderColor: theme.colors.primary,
      transform: [{ rotate: "-45deg" }],
    },
    scrollContent: {
      flex: 1,
    },
    content: {
      flex: 1,
      paddingHorizontal: theme.spacing["5xl"],
    },
    titleSection: {
      gap: theme.spacing.base,
      paddingVertical: theme.spacing["2xl"],
    },
    subtitle: {
      color: theme.colors.textMuted,
    },
    formSection: {
      gap: theme.spacing["2xl"],
      flex: 1,
      paddingTop: theme.spacing["2xl"],
      paddingBottom: theme.spacing["6xl"],
    },
    inputGroup: {
      gap: theme.spacing["2xl"],
    },
    inputLabel: {
      fontSize: rf(12),
      fontWeight: "700",
      color: "#2F3036",
    },
    inputField: {
      borderWidth: 1,
      borderColor: "#C5C6CC",
      borderRadius: theme.borderRadius.xl,
      paddingHorizontal: theme.spacing["4xl"],
      paddingVertical: theme.spacing["3xl"],
      backgroundColor: theme.colors.backgroundPrimary,
      minHeight: rs(48),
      justifyContent: "center",
    },
    inputText: {
      fontSize: rf(14),
      fontWeight: "500",
      color: theme.colors.textPrimary,
      lineHeight: rf(20),
    },
    inputPlaceholder: {
      fontSize: rf(14),
      fontWeight: "500",
      color: theme.colors.textPrimary,
      lineHeight: rf(20),
    },
    bottomSection: {
      borderTopWidth: 1,
      borderTopColor: "#D9D9D9",
      paddingTop: theme.spacing["3xl"],
      paddingBottom: theme.spacing["3xl"],
      paddingHorizontal: theme.spacing["5xl"],
      backgroundColor: theme.colors.backgroundPrimary,
    },
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      gap: theme.spacing["3xl"],
    },
    button: {
      flex: 1,
      paddingVertical: theme.spacing["3xl"],
      paddingHorizontal: theme.spacing["4xl"],
      borderRadius: theme.borderRadius.xl,
      alignItems: "center",
      justifyContent: "center",
      minHeight: rs(48),
    },
    cancelButton: {
      borderWidth: 1.5,
      borderColor: theme.colors.primary,
      backgroundColor: "transparent",
    },
    saveButton: {
      backgroundColor: theme.colors.primary,
    },
    buttonText: {
      fontSize: rf(12),
      fontWeight: "600",
      lineHeight: rf(14.5),
    },
    cancelButtonText: {
      color: theme.colors.primary,
    },
    saveButtonText: {
      color: theme.colors.backgroundPrimary,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
  });

export default function WeddingDetailsScreen() {
  const theme = useTheme();
  const styles = createStyles(theme);
  const {
    user,
    updateWeddingDate,
    updateWeddingLocation,
    loadUser,
    isLoading,
    error,
  } = useUserStore();

  const [showDateModal, setShowDateModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [changesMade, setChangesMade] = useState(false);
  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);

  // Temporary values for tracking changes without saving immediately
  const [tempWeddingDate, setTempWeddingDate] = useState<Date | undefined>();
  const [tempWeddingLocation, setTempWeddingLocation] = useState<
    string | undefined
  >();

  useEffect(() => {
    // Load user data on mount
    loadUser("current-user");
  }, [loadUser]);

  useEffect(() => {
    // Initialize temp values when user data loads
    if (user) {
      setTempWeddingDate(
        user.weddingDate
          ? typeof user.weddingDate === "string"
            ? new Date(user.weddingDate)
            : user.weddingDate
          : undefined
      );
      setTempWeddingLocation(user.weddingLocation);
    }
  }, [user]);

  useEffect(() => {
    // Check if changes were made by comparing temp values with original user data
    if (user) {
      const originalDate = user.weddingDate
        ? typeof user.weddingDate === "string"
          ? new Date(user.weddingDate)
          : user.weddingDate
        : undefined;

      const dateChanged =
        tempWeddingDate?.getTime() !== originalDate?.getTime();
      const locationChanged = tempWeddingLocation !== user.weddingLocation;

      setChangesMade(dateChanged || locationChanged);
    }
  }, [tempWeddingDate, tempWeddingLocation, user]);

  const handleBack = () => {
    router.back();
  };

  const handleDateSelect = async (date: Date) => {
    setTempWeddingDate(date);
    setShowDateModal(false);
  };

  const handleLocationSelect = async (location: string) => {
    setTempWeddingLocation(location);
    setShowLocationModal(false);
  };

  const handleCancel = () => {
    if (changesMade) {
      setShowCancelConfirmation(true);
    } else {
      router.back();
    }
  };

  const handleConfirmCancel = () => {
    // Reset temp values to original values
    if (user) {
      setTempWeddingDate(
        user.weddingDate
          ? typeof user.weddingDate === "string"
            ? new Date(user.weddingDate)
            : user.weddingDate
          : undefined
      );
      setTempWeddingLocation(user.weddingLocation);
    }
    setChangesMade(false);
    setShowCancelConfirmation(false);
    router.back();
  };

  const handleCancelCancel = () => {
    setShowCancelConfirmation(false);
  };

  const handleSave = async () => {
    try {
      // Save the temporary values to database
      if (tempWeddingDate && user) {
        await updateWeddingDate(tempWeddingDate);
      }
      if (tempWeddingLocation && user) {
        await updateWeddingLocation(tempWeddingLocation);
      }
      setChangesMade(false);
      router.back();
    } catch (error) {
      console.error("Error saving wedding details:", error);
    }
  };

  const formatDate = (date?: Date | string) => {
    if (!date) return "12 Dec 2026";

    // Handle case where date might be a string (from JSON serialization)
    const dateObj = typeof date === "string" ? new Date(date) : date;

    // Check if the date is valid
    if (isNaN(dateObj.getTime())) {
      return "12 Dec 2026";
    }

    return dateObj.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ThemedText>Loading...</ThemedText>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={handleBack}>
            <View style={styles.backIcon} />
          </Pressable>
        </View>

        {/* Scrollable Content */}
        <View style={styles.scrollContent}>
          <View style={styles.content}>
            {/* Title Section */}
            <View style={styles.titleSection}>
              <ThemedText type="h3">Wedding Details</ThemedText>
              <ThemedText type="caption" style={styles.subtitle}>
                To make your searches easier, fill in the details of your
                wedding
              </ThemedText>
            </View>

            {/* Form Section */}
            <View style={styles.formSection}>
              {/* Date Input */}
              <View style={styles.inputGroup}>
                <ThemedText style={styles.inputLabel}>Date</ThemedText>
                <TouchableOpacity
                  style={styles.inputField}
                  onPress={() => setShowDateModal(true)}
                  activeOpacity={0.7}
                >
                  <ThemedText style={styles.inputText}>
                    {formatDate(tempWeddingDate || user?.weddingDate)}
                  </ThemedText>
                </TouchableOpacity>
              </View>

              {/* Location Input */}
              <View style={styles.inputGroup}>
                <ThemedText style={styles.inputLabel}>Location</ThemedText>
                <TouchableOpacity
                  style={styles.inputField}
                  onPress={() => setShowLocationModal(true)}
                  activeOpacity={0.7}
                >
                  <ThemedText style={styles.inputText}>
                    {tempWeddingLocation ||
                      user?.weddingLocation ||
                      "Melbourne"}
                  </ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Bottom Section */}
          {changesMade && (
            <View style={styles.bottomSection}>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={handleCancel}
                  activeOpacity={0.8}
                >
                  <ThemedText
                    style={[styles.buttonText, styles.cancelButtonText]}
                  >
                    Cancel
                  </ThemedText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.saveButton]}
                  onPress={handleSave}
                  activeOpacity={0.8}
                >
                  <ThemedText
                    style={[styles.buttonText, styles.saveButtonText]}
                  >
                    Save
                  </ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {/* Date Selector Modal */}
        <DateSelectorModal
          visible={showDateModal}
          onClose={() => setShowDateModal(false)}
          onDateSelect={handleDateSelect}
          selectedDate={tempWeddingDate}
        />

        {/* Location Selector Modal */}
        <LocationSelectorModal
          visible={showLocationModal}
          onClose={() => setShowLocationModal(false)}
          onLocationSelect={handleLocationSelect}
          selectedLocation={tempWeddingLocation}
        />

        {/* Cancel Confirmation Modal */}
        <ConfirmationModal
          visible={showCancelConfirmation}
          title="Unsaved Changes"
          message="You have unsaved changes. Are you sure you want to cancel? Nothing will be saved."
          confirmText="Yes, Cancel"
          cancelText="Stay"
          onConfirm={handleConfirmCancel}
          onCancel={handleCancelCancel}
          confirmStyle="destructive"
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
