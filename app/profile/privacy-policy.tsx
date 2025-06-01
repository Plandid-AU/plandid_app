import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { router } from "expo-router";
import React from "react";
import {
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
    section: {
      marginBottom: theme.spacing["3xl"],
    },
    sectionTitle: {
      marginBottom: theme.spacing["2xl"],
      color: theme.colors.textPrimary,
      fontSize: theme.typography.fontSize.h4,
      fontWeight: theme.typography.fontWeight.bold,
    },
    paragraph: {
      marginBottom: theme.spacing["2xl"],
      color: theme.colors.textSecondary,
      lineHeight: theme.typography.lineHeight.relaxed,
    },
    lastUpdated: {
      marginTop: theme.spacing["4xl"],
      color: theme.colors.textMuted,
      fontSize: theme.typography.fontSize.caption,
      fontStyle: "italic",
    },
  });

export default function PrivacyPolicyScreen() {
  const theme = useTheme();
  const styles = createStyles(theme);

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={handleBack}>
          <View style={styles.backIcon} />
        </Pressable>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Title Section */}
          <View style={styles.titleSection}>
            <ThemedText type="h3">Privacy Policy</ThemedText>
            <ThemedText type="caption" style={styles.subtitle}>
              Your privacy and data protection information
            </ThemedText>
          </View>

          <View style={styles.section}>
            <ThemedText type="h4" style={styles.sectionTitle}>
              Information We Collect
            </ThemedText>
            <ThemedText type="body" style={styles.paragraph}>
              At Plandid, we collect information you provide directly to us,
              such as when you create an account, fill out a form, or contact
              us. This may include your name, email address, phone number,
              wedding date, and location preferences.
            </ThemedText>
            <ThemedText type="body" style={styles.paragraph}>
              We also collect information automatically when you use our
              services, including device information, usage data, and location
              information (with your permission).
            </ThemedText>
          </View>

          <View style={styles.section}>
            <ThemedText type="h4" style={styles.sectionTitle}>
              How We Use Your Information
            </ThemedText>
            <ThemedText type="body" style={styles.paragraph}>
              We use the information we collect to provide, maintain, and
              improve our services, including matching you with relevant
              vendors, processing transactions, and communicating with you about
              your account.
            </ThemedText>
            <ThemedText type="body" style={styles.paragraph}>
              With your consent, we may also use your information for analytics
              purposes to better understand how our users interact with our
              platform and to improve our services.
            </ThemedText>
          </View>

          <View style={styles.section}>
            <ThemedText type="h4" style={styles.sectionTitle}>
              Information Sharing
            </ThemedText>
            <ThemedText type="body" style={styles.paragraph}>
              We do not sell, trade, or otherwise transfer your personal
              information to third parties without your consent, except as
              described in this policy or as required by law.
            </ThemedText>
            <ThemedText type="body" style={styles.paragraph}>
              We may share your information with vendors you choose to contact
              through our platform, and with service providers who assist us in
              operating our platform.
            </ThemedText>
          </View>

          <View style={styles.section}>
            <ThemedText type="h4" style={styles.sectionTitle}>
              Data Security
            </ThemedText>
            <ThemedText type="body" style={styles.paragraph}>
              We implement appropriate security measures to protect your
              personal information against unauthorized access, alteration,
              disclosure, or destruction. However, no method of transmission
              over the internet is 100% secure.
            </ThemedText>
          </View>

          <View style={styles.section}>
            <ThemedText type="h4" style={styles.sectionTitle}>
              Your Rights
            </ThemedText>
            <ThemedText type="body" style={styles.paragraph}>
              You have the right to access, update, or delete your personal
              information. You may also opt out of certain communications from
              us. To exercise these rights, please contact us using the
              information provided below.
            </ThemedText>
          </View>

          <View style={styles.section}>
            <ThemedText type="h4" style={styles.sectionTitle}>
              Contact Us
            </ThemedText>
            <ThemedText type="body" style={styles.paragraph}>
              If you have any questions about this Privacy Policy, please
              contact us at privacy@plandid.com or through the contact
              information provided in our app.
            </ThemedText>
          </View>

          <ThemedText type="caption" style={styles.lastUpdated}>
            Last updated: December 2024
          </ThemedText>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
