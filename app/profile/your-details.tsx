import { ConfirmationModal } from "@/components/ConfirmationModal";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import { ThemedTextInput } from "@/components/ThemedTextInput";
import { useTheme } from "@/hooks/useTheme";
import { useUserStore } from "@/stores/userStore";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.backgroundPrimary,
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
    scrollContainer: {
      flex: 1,
    },
    content: {
      flex: 1,
      paddingHorizontal: theme.spacing["5xl"],
      paddingBottom: theme.spacing["5xl"],
    },
    titleSection: {
      gap: theme.spacing.base,
      paddingVertical: theme.spacing["2xl"],
    },
    subtitle: {
      color: theme.colors.textMuted,
    },
    formSection: {
      flex: 1,
      gap: theme.spacing["2xl"],
      paddingTop: theme.spacing["2xl"],
    },
    buttonContainer: {
      borderTopWidth: 1,
      borderTopColor: theme.colors.gray400,
      paddingHorizontal: theme.spacing["5xl"],
      paddingVertical: theme.spacing["2xl"],
      gap: theme.spacing["2xl"],
      backgroundColor: theme.colors.backgroundPrimary,
    },
    buttonRow: {
      flexDirection: "row",
      gap: theme.spacing["2xl"],
    },
    buttonHalf: {
      flex: 1,
    },
  });

interface FormData {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phoneNumber?: string;
  password?: string;
}

export default function YourDetailsScreen() {
  const theme = useTheme();
  const styles = createStyles(theme);
  const { user, updateUserPersonalDetails, loadUser, isLoading } =
    useUserStore();

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
  });

  const [originalData, setOriginalData] = useState<FormData>({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [changesMade, setChangesMade] = useState(false);
  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);

  const handleBack = () => {
    router.back();
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phoneNumber.replace(/\s/g, ""))) {
      newErrors.phoneNumber = "Please enter a valid phone number";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      // Update user personal details through the store
      await updateUserPersonalDetails(
        formData.name,
        formData.email,
        formData.phoneNumber
      );

      // Update original data to reflect saved state
      setOriginalData({
        name: formData.name,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        password: "",
      });
      setChangesMade(false);

      // Navigate back
      router.back();
    } catch (error) {
      console.error("Error saving details:", error);
      // Handle error (show toast, etc.)
    }
  };

  const handleCancel = () => {
    if (changesMade) {
      setShowCancelConfirmation(true);
    } else {
      router.back();
    }
  };

  const handleConfirmCancel = () => {
    setShowCancelConfirmation(false);
    router.back();
  };

  const handleCancelCancel = () => {
    setShowCancelConfirmation(false);
  };

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  useEffect(() => {
    // Load user data on mount
    loadUser("current-user");
  }, [loadUser]);

  useEffect(() => {
    // Update form data when user data is loaded
    if (user) {
      const userData = {
        name: user.name || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        password: "", // Don't show actual password
      };
      setFormData(userData);
      setOriginalData(userData);
    }
  }, [user]);

  useEffect(() => {
    // Check if changes were made
    const hasChanges =
      formData.name !== originalData.name ||
      formData.email !== originalData.email ||
      formData.phoneNumber !== originalData.phoneNumber ||
      (formData.password !== "" && formData.password !== originalData.password);
    setChangesMade(hasChanges);
  }, [formData, originalData]);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={handleBack}>
            <View style={styles.backIcon} />
          </Pressable>
        </View>

        <ScrollView
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            {/* Title Section */}
            <View style={styles.titleSection}>
              <ThemedText type="h3">Your Details</ThemedText>
              <ThemedText type="caption" style={styles.subtitle}>
                Check or modify your personal information
              </ThemedText>
            </View>

            {/* Form Section */}
            <View style={styles.formSection}>
              <ThemedTextInput
                label="Name"
                placeholder="Jane Doe"
                value={formData.name}
                onChangeText={(value) => updateFormData("name", value)}
                error={errors.name}
                autoCapitalize="words"
                autoComplete="name"
              />

              <ThemedTextInput
                label="Email"
                placeholder="jane_doe@mail.com"
                value={formData.email}
                onChangeText={(value) => updateFormData("email", value)}
                error={errors.email}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />

              <ThemedTextInput
                label="Phone Number"
                placeholder="0419293923"
                value={formData.phoneNumber}
                onChangeText={(value) => updateFormData("phoneNumber", value)}
                error={errors.phoneNumber}
                keyboardType="phone-pad"
                autoComplete="tel"
              />

              <ThemedTextInput
                label="Password"
                placeholder="•••••••••••••"
                value={formData.password}
                onChangeText={(value) => updateFormData("password", value)}
                error={errors.password}
                isPassword={true}
                autoCapitalize="none"
                autoComplete="password"
              />
            </View>
          </View>
        </ScrollView>

        {/* Button Container */}
        {changesMade && (
          <View style={styles.buttonContainer}>
            <View style={styles.buttonRow}>
              <View style={styles.buttonHalf}>
                <ThemedButton
                  title="Cancel"
                  variant="secondary"
                  onPress={handleCancel}
                  disabled={isLoading}
                />
              </View>
              <View style={styles.buttonHalf}>
                <ThemedButton
                  title="Save"
                  variant="primary"
                  onPress={handleSave}
                  loading={isLoading}
                  disabled={isLoading}
                />
              </View>
            </View>
          </View>
        )}

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
