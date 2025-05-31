import { ThemedText } from "@/components/ThemedText";
import { rf, rh, rs } from "@/constants/Responsive";
import { useTheme } from "@/hooks/useTheme";
import { useQuotesStore } from "@/stores/quotesStore";
import { useUserStore } from "@/stores/userStore";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect } from "react";
import {
  Alert,
  Image,
  Platform,
  ScrollView,
  Share,
  StatusBar,
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
    statusBarBackground: {
      height: StatusBar.currentHeight || (Platform.OS === "ios" ? rh(44) : 0),
      backgroundColor: theme.colors.backgroundPrimary,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: theme.spacing["5xl"],
      paddingVertical: theme.spacing["3xl"],
      backgroundColor: theme.colors.backgroundPrimary,
    },
    headerLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing["3xl"],
    },
    backButton: {
      width: rs(40),
      height: rs(40),
      justifyContent: "center",
      alignItems: "center",
    },
    headerTitle: {
      fontFamily: "Urbanist",
      fontWeight: "700",
      fontSize: rf(16),
      lineHeight: rf(16) * 1.2,
      color: theme.colors.textPrimary,
    },
    shareButton: {
      width: rs(40),
      height: rs(40),
      justifyContent: "center",
      alignItems: "center",
    },
    content: {
      flex: 1,
      paddingHorizontal: theme.spacing["5xl"],
      paddingBottom: theme.spacing["3xl"],
    },
    vendorSection: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing["4xl"],
      paddingVertical: theme.spacing["4xl"],
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.borderLight,
      marginBottom: theme.spacing["5xl"],
    },
    vendorAvatar: {
      width: rs(60),
      height: rs(60),
      borderRadius: rs(30),
      backgroundColor: theme.colors.backgroundSecondary,
    },
    vendorInfo: {
      flex: 1,
      gap: theme.spacing["xs"],
    },
    vendorName: {
      fontFamily: "Urbanist",
      fontWeight: "700",
      fontSize: rf(18),
      lineHeight: rf(18) * 1.2,
      color: theme.colors.textPrimary,
    },
    quoteDate: {
      fontFamily: "Inter",
      fontWeight: "500",
      fontSize: rf(12),
      lineHeight: rf(12) * 1.33,
      color: theme.colors.textMuted,
    },
    section: {
      marginBottom: theme.spacing["6xl"],
    },
    sectionTitle: {
      fontFamily: "Urbanist",
      fontWeight: "700",
      fontSize: rf(16),
      lineHeight: rf(16) * 1.2,
      color: theme.colors.textPrimary,
      marginBottom: theme.spacing["4xl"],
    },
    packageCard: {
      backgroundColor: theme.colors.backgroundPrimary,
      borderRadius: theme.borderRadius.lg,
      borderWidth: 1,
      borderColor: theme.colors.borderLight,
      padding: theme.spacing["4xl"],
      gap: theme.spacing["3xl"],
    },
    packageHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    packageName: {
      fontFamily: "Urbanist",
      fontWeight: "700",
      fontSize: rf(16),
      lineHeight: rf(16) * 1.2,
      color: theme.colors.textPrimary,
    },
    packagePrice: {
      fontFamily: "Urbanist",
      fontWeight: "700",
      fontSize: rf(16),
      lineHeight: rf(16) * 1.2,
      color: theme.colors.primary,
    },
    divider: {
      height: 0.5,
      backgroundColor: theme.colors.borderLight,
    },
    featuresList: {
      gap: theme.spacing["2xl"],
    },
    featureRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing["2xl"],
    },
    featureText: {
      fontFamily: "Inter",
      fontWeight: "500",
      fontSize: rf(14),
      lineHeight: rf(14) * 1.43,
      color: theme.colors.textPrimary,
      flex: 1,
    },
    addonCard: {
      backgroundColor: theme.colors.backgroundPrimary,
      borderRadius: theme.borderRadius.lg,
      borderWidth: 1,
      borderColor: theme.colors.borderLight,
      padding: theme.spacing["4xl"],
      marginBottom: theme.spacing["3xl"],
    },
    addonHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: theme.spacing["xs"],
    },
    addonName: {
      fontFamily: "Inter",
      fontWeight: "600",
      fontSize: rf(14),
      lineHeight: rf(14) * 1.43,
      color: theme.colors.textPrimary,
    },
    addonPrice: {
      fontFamily: "Inter",
      fontWeight: "600",
      fontSize: rf(14),
      lineHeight: rf(14) * 1.43,
      color: theme.colors.primary,
    },
    addonDescription: {
      fontFamily: "Inter",
      fontWeight: "500",
      fontSize: rf(12),
      lineHeight: rf(12) * 1.33,
      color: theme.colors.textMuted,
    },
    costBreakdown: {
      backgroundColor: theme.colors.backgroundSecondary,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing["4xl"],
      gap: theme.spacing["3xl"],
    },
    costRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    costLabel: {
      fontFamily: "Inter",
      fontWeight: "500",
      fontSize: rf(14),
      lineHeight: rf(14) * 1.43,
      color: theme.colors.textPrimary,
    },
    costValue: {
      fontFamily: "Inter",
      fontWeight: "600",
      fontSize: rf(14),
      lineHeight: rf(14) * 1.43,
      color: theme.colors.textPrimary,
    },
    totalRow: {
      paddingTop: theme.spacing["3xl"],
      borderTopWidth: 1,
      borderTopColor: theme.colors.borderLight,
    },
    totalLabel: {
      fontFamily: "Urbanist",
      fontWeight: "700",
      fontSize: rf(16),
      lineHeight: rf(16) * 1.2,
      color: theme.colors.textPrimary,
    },
    totalValue: {
      fontFamily: "Urbanist",
      fontWeight: "700",
      fontSize: rf(16),
      lineHeight: rf(16) * 1.2,
      color: theme.colors.primary,
    },
    emptyAddons: {
      fontFamily: "Inter",
      fontWeight: "500",
      fontSize: rf(14),
      lineHeight: rf(14) * 1.43,
      color: theme.colors.textMuted,
      fontStyle: "italic",
    },
    footer: {
      padding: theme.spacing["5xl"],
      gap: theme.spacing["3xl"],
      backgroundColor: theme.colors.backgroundPrimary,
      borderTopWidth: 1,
      borderTopColor: theme.colors.borderLight,
    },
    actionButton: {
      height: rh(40),
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.colors.primary,
      borderRadius: theme.borderRadius.lg,
    },
    actionButtonText: {
      fontFamily: "Inter",
      fontWeight: "600",
      fontSize: rf(12),
      color: theme.colors.backgroundPrimary,
    },
    secondaryButton: {
      height: rh(40),
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "transparent",
      borderRadius: theme.borderRadius.lg,
      borderWidth: 1,
      borderColor: theme.colors.primary,
    },
    secondaryButtonText: {
      fontFamily: "Inter",
      fontWeight: "600",
      fontSize: rf(12),
      color: theme.colors.primary,
    },
  });

export default function QuoteDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const theme = useTheme();
  const styles = createStyles(theme);
  const { loadQuoteById, removeQuote, currentQuote, isLoading } =
    useQuotesStore();
  const { user } = useUserStore();

  useEffect(() => {
    loadQuote();
  }, [id]);

  const loadQuote = async () => {
    if (!id) return;

    try {
      await loadQuoteById(id);
    } catch {
      Alert.alert("Error", "Failed to load quote details");
      router.back();
    }
  };

  const handleShare = async () => {
    if (!currentQuote) return;

    try {
      const shareContent = `Quote from ${currentQuote.vendorName}\n\nPackage: ${
        currentQuote.selectedPackage
      }\nTotal: $${currentQuote.totalCost.toFixed(
        2
      )} AUD\n\nGenerated by Plandid`;

      await Share.share({
        message: shareContent,
        title: `Quote from ${currentQuote.vendorName}`,
      });
    } catch {
      Alert.alert("Error", "Failed to share quote");
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Quote",
      "Are you sure you want to delete this quote? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            if (!user) return;
            try {
              await removeQuote(id!, user.id);
              router.back();
            } catch {
              Alert.alert("Error", "Failed to delete quote");
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-AU", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (isLoading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ThemedText style={styles.costLabel}>Loading...</ThemedText>
      </View>
    );
  }

  if (!currentQuote) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ThemedText style={styles.costLabel}>Quote not found</ThemedText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={theme.colors.backgroundPrimary}
      />
      <View style={styles.statusBarBackground} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons
              name="chevron-back"
              size={rf(20)}
              color={theme.colors.primary}
            />
          </TouchableOpacity>
          <ThemedText style={styles.headerTitle}>Quote Details</ThemedText>
        </View>
        <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
          <Ionicons
            name="share-outline"
            size={rf(20)}
            color={theme.colors.primary}
          />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Vendor Section */}
        <View style={styles.vendorSection}>
          {currentQuote.vendorAvatar ? (
            <Image
              source={{ uri: currentQuote.vendorAvatar }}
              style={styles.vendorAvatar}
            />
          ) : (
            <View style={styles.vendorAvatar}>
              <Ionicons
                name="person"
                size={rf(24)}
                color={theme.colors.textMuted}
              />
            </View>
          )}
          <View style={styles.vendorInfo}>
            <ThemedText style={styles.vendorName}>
              {currentQuote.vendorName}
            </ThemedText>
            <ThemedText style={styles.quoteDate}>
              Created {formatDate(currentQuote.createdAt)}
            </ThemedText>
          </View>
        </View>

        {/* Package Section */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Selected Package</ThemedText>
          <View style={styles.packageCard}>
            <View style={styles.packageHeader}>
              <ThemedText style={styles.packageName}>
                {currentQuote.selectedPackage}
              </ThemedText>
              <ThemedText style={styles.packagePrice}>
                ${currentQuote.packageCost.toFixed(2)}
              </ThemedText>
            </View>

            {currentQuote.packageDetails?.features && (
              <>
                <View style={styles.divider} />
                <View style={styles.featuresList}>
                  {currentQuote.packageDetails.features.map(
                    (feature: string, index: number) => (
                      <View key={index} style={styles.featureRow}>
                        <Ionicons
                          name="checkmark"
                          size={rf(14)}
                          color={theme.colors.primary}
                        />
                        <ThemedText style={styles.featureText}>
                          {feature}
                        </ThemedText>
                      </View>
                    )
                  )}
                </View>
              </>
            )}
          </View>
        </View>

        {/* Add-ons Section */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Add-ons</ThemedText>
          {currentQuote.selectedAddons &&
          currentQuote.selectedAddons.length > 0 ? (
            currentQuote.selectedAddons.map((addon: any, index: number) => (
              <View key={index} style={styles.addonCard}>
                <View style={styles.addonHeader}>
                  <ThemedText style={styles.addonName}>{addon.name}</ThemedText>
                  <ThemedText style={styles.addonPrice}>
                    ${addon.price.toFixed(2)}
                  </ThemedText>
                </View>
                {addon.description && (
                  <ThemedText style={styles.addonDescription}>
                    {addon.description}
                  </ThemedText>
                )}
              </View>
            ))
          ) : (
            <ThemedText style={styles.emptyAddons}>
              No add-ons selected
            </ThemedText>
          )}
        </View>

        {/* Cost Breakdown */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Cost Breakdown</ThemedText>
          <View style={styles.costBreakdown}>
            <View style={styles.costRow}>
              <ThemedText style={styles.costLabel}>Package</ThemedText>
              <ThemedText style={styles.costValue}>
                ${currentQuote.packageCost.toFixed(2)}
              </ThemedText>
            </View>

            <View style={styles.costRow}>
              <ThemedText style={styles.costLabel}>Add-ons</ThemedText>
              <ThemedText style={styles.costValue}>
                ${currentQuote.addonsCost.toFixed(2)}
              </ThemedText>
            </View>

            <View style={styles.costRow}>
              <ThemedText style={styles.costLabel}>GST (10%)</ThemedText>
              <ThemedText style={styles.costValue}>
                ${currentQuote.gst.toFixed(2)}
              </ThemedText>
            </View>

            <View style={[styles.costRow, styles.totalRow]}>
              <ThemedText style={styles.totalLabel}>Total</ThemedText>
              <ThemedText style={styles.totalValue}>
                ${currentQuote.totalCost.toFixed(2)} AUD
              </ThemedText>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Footer Actions */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
          <ThemedText style={styles.actionButtonText}>Share Quote</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton} onPress={handleDelete}>
          <ThemedText style={styles.secondaryButtonText}>
            Delete Quote
          </ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
}
