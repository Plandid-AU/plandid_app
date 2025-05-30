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
      borderColor: theme.colors.black,
      transform: [{ rotate: "-45deg" }],
    },
    content: {
      flex: 1,
      paddingHorizontal: theme.spacing["5xl"],
      paddingBottom: theme.spacing["4xl"],
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

export default function TermsConditionsScreen() {
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
        <ThemedText type="h3">Terms & Conditions</ThemedText>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <ThemedText type="h4" style={styles.sectionTitle}>
            Acceptance of Terms
          </ThemedText>
          <ThemedText type="body" style={styles.paragraph}>
            By accessing and using Plandid, you accept and agree to be bound by
            the terms and provision of this agreement. If you do not agree to
            abide by the above, please do not use this service.
          </ThemedText>
        </View>

        <View style={styles.section}>
          <ThemedText type="h4" style={styles.sectionTitle}>
            Use License
          </ThemedText>
          <ThemedText type="body" style={styles.paragraph}>
            Permission is granted to temporarily download one copy of Plandid
            for personal, non-commercial transitory viewing only. This is the
            grant of a license, not a transfer of title.
          </ThemedText>
          <ThemedText type="body" style={styles.paragraph}>
            Under this license you may not: modify or copy the materials; use
            the materials for any commercial purpose or for any public display;
            attempt to reverse engineer any software contained in Plandid; or
            remove any copyright or other proprietary notations from the
            materials.
          </ThemedText>
        </View>

        <View style={styles.section}>
          <ThemedText type="h4" style={styles.sectionTitle}>
            User Accounts
          </ThemedText>
          <ThemedText type="body" style={styles.paragraph}>
            When you create an account with us, you must provide information
            that is accurate, complete, and current at all times. You are
            responsible for safeguarding the password and for keeping your
            account information current.
          </ThemedText>
          <ThemedText type="body" style={styles.paragraph}>
            You are responsible for all activities that occur under your account
            and you agree to immediately notify us of any unauthorized use of
            your account.
          </ThemedText>
        </View>

        <View style={styles.section}>
          <ThemedText type="h4" style={styles.sectionTitle}>
            Vendor Interactions
          </ThemedText>
          <ThemedText type="body" style={styles.paragraph}>
            Plandid facilitates connections between users and wedding vendors.
            We are not responsible for the quality, safety, legality, or any
            other aspect of vendor services. All transactions and agreements are
            between you and the vendor directly.
          </ThemedText>
          <ThemedText type="body" style={styles.paragraph}>
            We encourage you to exercise caution and conduct appropriate due
            diligence before entering into any agreements with vendors found
            through our platform.
          </ThemedText>
        </View>

        <View style={styles.section}>
          <ThemedText type="h4" style={styles.sectionTitle}>
            Prohibited Uses
          </ThemedText>
          <ThemedText type="body" style={styles.paragraph}>
            You may not use our service for any unlawful purpose or to solicit
            others to perform unlawful acts, to violate any international,
            federal, provincial, or state regulations, rules, laws, or local
            ordinances, or to infringe upon or violate our intellectual property
            rights or the intellectual property rights of others.
          </ThemedText>
        </View>

        <View style={styles.section}>
          <ThemedText type="h4" style={styles.sectionTitle}>
            Limitation of Liability
          </ThemedText>
          <ThemedText type="body" style={styles.paragraph}>
            In no case shall Plandid, our directors, officers, employees,
            affiliates, agents, contractors, interns, suppliers, service
            providers, or licensors be liable for any injury, loss, claim, or
            any direct, indirect, incidental, punitive, special, or
            consequential damages of any kind.
          </ThemedText>
        </View>

        <View style={styles.section}>
          <ThemedText type="h4" style={styles.sectionTitle}>
            Termination
          </ThemedText>
          <ThemedText type="body" style={styles.paragraph}>
            We may terminate or suspend your account and bar access to the
            service immediately, without prior notice or liability, under our
            sole discretion, for any reason whatsoever and without limitation,
            including but not limited to a breach of the Terms.
          </ThemedText>
        </View>

        <View style={styles.section}>
          <ThemedText type="h4" style={styles.sectionTitle}>
            Changes to Terms
          </ThemedText>
          <ThemedText type="body" style={styles.paragraph}>
            We reserve the right, at our sole discretion, to modify or replace
            these Terms at any time. If a revision is material, we will provide
            at least 30 days notice prior to any new terms taking effect.
          </ThemedText>
        </View>

        <ThemedText type="caption" style={styles.lastUpdated}>
          Last updated: December 2024
        </ThemedText>
      </ScrollView>
    </SafeAreaView>
  );
}
