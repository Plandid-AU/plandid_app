import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import { ThemedTextInput } from "@/components/ThemedTextInput";
import { useTheme } from "@/hooks/useTheme";
import { useUserStore } from "@/stores/userStore";
import { Ionicons } from "@expo/vector-icons";
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
    linkAccountSection: {
      gap: theme.spacing.base,
      paddingTop: theme.spacing["2xl"],
    },
    linkAccountDescription: {
      color: theme.colors.textMuted,
      marginBottom: theme.spacing["2xl"],
    },
    linkButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: theme.spacing.base,
      backgroundColor: theme.colors.primary,
      borderRadius: theme.borderRadius.xl,
      paddingVertical: theme.spacing.xl,
      paddingHorizontal: theme.spacing["2xl"],
      width: 148,
      height: 40,
    },
    linkButtonText: {
      color: theme.colors.white,
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.semibold,
      lineHeight: theme.typography.lineHeight.sm,
    },
    linkIcon: {
      width: 14,
      height: 14,
    },
    bottomSection: {
      borderTopWidth: 1,
      borderTopColor: "#D9D9D9",
      paddingHorizontal: theme.spacing["5xl"],
      paddingVertical: theme.spacing["3xl"],
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
      height: 40,
    },
  });

export default function YourPartnerScreen() {
  const theme = useTheme();
  const styles = createStyles(theme);
  const { user, updateUserPartnerDetails, isLoading, error } = useUserStore();

  const [partnerName, setPartnerName] = useState("");
  const [hasChanges, setHasChanges] = useState(false);

  // Load current partner data when component mounts
  useEffect(() => {
    if (user?.partnerName) {
      setPartnerName(user.partnerName);
    }
  }, [user]);

  // Track changes
  useEffect(() => {
    const originalPartnerName = user?.partnerName || "";
    setHasChanges(partnerName !== originalPartnerName);
  }, [partnerName, user?.partnerName]);

  const handleBack = () => {
    router.back();
  };

  const handleSave = async () => {
    try {
      await updateUserPartnerDetails(partnerName || undefined);
      router.back();
    } catch (error) {
      console.error("Error saving partner details:", error);
    }
  };

  const handleCancel = () => {
    // Reset to original value
    setPartnerName(user?.partnerName || "");
    router.back();
  };

  const handleLinkAccount = () => {
    // TODO: Implement link account functionality
    console.log("Link account pressed");
    // For now, just toggle the linked status
    updateUserPartnerDetails(undefined, undefined, !user?.isLinked);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
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
              <ThemedText type="h3">Your Partner</ThemedText>
              <ThemedText type="caption" style={styles.subtitle}>
                Check or modify your partner's information
              </ThemedText>
            </View>

            {/* Form Section */}
            <View style={styles.formSection}>
              {/* Name Input */}
              <ThemedTextInput
                label="Name"
                placeholder="Micheal Kane"
                value={partnerName}
                onChangeText={setPartnerName}
                autoCapitalize="words"
                autoComplete="name"
              />

              {/* Link Account Section */}
              <View style={styles.linkAccountSection}>
                <ThemedText
                  type="label"
                  style={{ color: theme.colors.textSecondary }}
                >
                  Link Account
                </ThemedText>
                <ThemedText
                  type="caption"
                  style={styles.linkAccountDescription}
                >
                  By Linking your accounts with your partner, you will now share
                  vendors list and all the quotes
                </ThemedText>

                <Pressable
                  style={styles.linkButton}
                  onPress={handleLinkAccount}
                >
                  <Ionicons
                    name="link"
                    size={14}
                    color={theme.colors.white}
                    style={styles.linkIcon}
                  />
                  <ThemedText style={styles.linkButtonText}>
                    {user?.isLinked ? "Unlink Account" : "Link Account"}
                  </ThemedText>
                </Pressable>
              </View>

              {/* Show linked status */}
              {user?.isLinked && (
                <View style={{ marginTop: theme.spacing.base }}>
                  <ThemedText
                    type="caption"
                    style={{ color: theme.colors.success }}
                  >
                    ✓ Account is linked with your partner
                  </ThemedText>
                </View>
              )}
            </View>
          </View>
        </ScrollView>

        {/* Bottom Section */}
        <View style={styles.bottomSection}>
          <View style={styles.buttonContainer}>
            <ThemedButton
              title="Cancel"
              variant="secondary"
              size="base"
              onPress={handleCancel}
              style={styles.button}
              disabled={isLoading}
            />
            <ThemedButton
              title="Save"
              variant="primary"
              size="base"
              onPress={handleSave}
              style={styles.button}
              disabled={isLoading || !hasChanges}
              loading={isLoading}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
