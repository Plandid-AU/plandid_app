import { ProgressDots } from "@/components/ProgressDots";
import { ThemedText } from "@/components/ThemedText";
import { rf, rh, rs } from "@/constants/Responsive";
import { mockVendors } from "@/data/mockData";
import { useTheme } from "@/hooks/useTheme";
import { useQuotesStore } from "@/stores/quotesStore";
import { useUserStore } from "@/stores/userStore";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

interface Package {
  id: string;
  name: string;
  price: number;
  features: string[];
  isPopular?: boolean;
}

interface Addon {
  id: string;
  name: string;
  description: string;
  price: number;
}

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
      paddingHorizontal: theme.spacing["5xl"],
      paddingVertical: theme.spacing["3xl"],
      backgroundColor: theme.colors.backgroundPrimary,
    },
    backButton: {
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
    titleContainer: {
      paddingVertical: theme.spacing["4xl"],
      gap: theme.spacing["2xl"],
    },
    title: {
      fontFamily: "Urbanist",
      fontWeight: "800",
      fontSize: rf(24),
      lineHeight: rf(24) * 1.2,
      color: theme.colors.textPrimary,
    },
    subtitle: {
      fontFamily: "Inter",
      fontWeight: "500",
      fontSize: rf(12),
      lineHeight: rf(12) * 1.33,
      color: theme.colors.textMuted,
    },
    packageCard: {
      backgroundColor: theme.colors.backgroundPrimary,
      borderRadius: theme.borderRadius.lg,
      borderWidth: 1,
      borderColor: theme.colors.borderLight,
      marginBottom: theme.spacing["3xl"],
      overflow: "hidden",
    },
    packageCardSelected: {
      borderColor: theme.colors.primary,
      borderWidth: 2,
    },
    packageHeader: {
      padding: theme.spacing["4xl"],
      gap: theme.spacing["xl"],
    },
    packageName: {
      fontFamily: "Urbanist",
      fontWeight: "800",
      fontSize: rf(18),
      lineHeight: rf(18) * 1.2,
      color: theme.colors.textPrimary,
    },
    popularBadge: {
      fontFamily: "Urbanist",
      fontWeight: "400",
      fontSize: rf(12),
      lineHeight: rf(12) * 2,
      color: theme.colors.textMuted,
    },
    divider: {
      height: 0.5,
      backgroundColor: theme.colors.borderLight,
      marginHorizontal: theme.spacing["4xl"],
    },
    featuresContainer: {
      padding: theme.spacing["4xl"],
      gap: theme.spacing["3xl"],
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
      flexDirection: "row",
      alignItems: "center",
      padding: theme.spacing["4xl"],
      gap: theme.spacing["4xl"],
      borderRadius: theme.borderRadius.lg,
      borderWidth: 1,
      borderColor: theme.colors.borderLight,
      backgroundColor: theme.colors.backgroundPrimary,
      marginBottom: theme.spacing["3xl"],
    },
    addonContent: {
      flex: 1,
      gap: theme.spacing["xs"],
    },
    addonName: {
      fontFamily: "Inter",
      fontWeight: "500",
      fontSize: rf(14),
      lineHeight: rf(14) * 1.43,
      color: theme.colors.textPrimary,
    },
    addonDescription: {
      fontFamily: "Inter",
      fontWeight: "500",
      fontSize: rf(12),
      lineHeight: rf(12) * 1.33,
      color: theme.colors.textMuted,
    },
    checkbox: {
      width: rs(24),
      height: rs(24),
      borderRadius: rs(6),
      borderWidth: 1.5,
      borderColor: theme.colors.borderLight,
      justifyContent: "center",
      alignItems: "center",
    },
    checkboxSelected: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    footer: {
      padding: theme.spacing["5xl"],
      gap: theme.spacing["5xl"],
      backgroundColor: theme.colors.backgroundPrimary,
      borderTopWidth: 1,
      borderTopColor: theme.colors.borderLight,
    },
    nextButton: {
      height: rh(40),
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.colors.primary,
      borderRadius: theme.borderRadius.lg,
    },
    nextButtonText: {
      fontFamily: "Inter",
      fontWeight: "600",
      fontSize: rf(12),
      color: theme.colors.backgroundPrimary,
    },
    doneButton: {
      height: rh(40),
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.colors.primary,
      borderRadius: theme.borderRadius.lg,
    },
    doneButtonText: {
      fontFamily: "Inter",
      fontWeight: "600",
      fontSize: rf(12),
      color: theme.colors.backgroundPrimary,
    },
    quoteResultCard: {
      backgroundColor: theme.colors.backgroundPrimary,
      borderRadius: theme.borderRadius.lg,
      borderWidth: 1,
      borderColor: theme.colors.borderLight,
      marginBottom: theme.spacing["3xl"],
      overflow: "hidden",
    },
    vendorSection: {
      flexDirection: "row",
      alignItems: "center",
      padding: theme.spacing["4xl"],
    },
    vendorAvatar: {
      width: rs(40),
      height: rs(40),
      borderRadius: rs(20),
      backgroundColor: theme.colors.backgroundSecondary,
      justifyContent: "center",
      alignItems: "center",
    },
    vendorInfo: {
      flex: 1,
      paddingLeft: theme.spacing["4xl"],
    },
    vendorName: {
      fontFamily: "Urbanist",
      fontWeight: "800",
      fontSize: rf(18),
      lineHeight: rf(18) * 1.2,
      color: theme.colors.textPrimary,
    },
    vendorLocation: {
      fontFamily: "Inter",
      fontWeight: "500",
      fontSize: rf(12),
      lineHeight: rf(12) * 1.33,
      color: theme.colors.textMuted,
    },
    sectionTitle: {
      fontFamily: "Urbanist",
      fontWeight: "800",
      fontSize: rf(18),
      lineHeight: rf(18) * 1.2,
      color: theme.colors.textPrimary,
      padding: theme.spacing["4xl"],
    },
    packageSummary: {
      padding: theme.spacing["4xl"],
    },
    packagePrice: {
      fontFamily: "Urbanist",
      fontWeight: "800",
      fontSize: rf(14),
      lineHeight: rf(14) * 1.43,
      color: theme.colors.textPrimary,
    },
    featureTextSmall: {
      fontFamily: "Inter",
      fontWeight: "500",
      fontSize: rf(12),
      lineHeight: rf(12) * 1.43,
      color: theme.colors.textPrimary,
    },
    moreFeatures: {
      fontFamily: "Inter",
      fontWeight: "500",
      fontSize: rf(12),
      lineHeight: rf(12) * 1.43,
      color: theme.colors.textPrimary,
    },
    addonSummary: {
      padding: theme.spacing["4xl"],
    },
    addonSummaryHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    addonSummaryName: {
      fontFamily: "Urbanist",
      fontWeight: "800",
      fontSize: rf(14),
      lineHeight: rf(14) * 1.43,
      color: theme.colors.textPrimary,
    },
    addonSummaryPrice: {
      fontFamily: "Urbanist",
      fontWeight: "800",
      fontSize: rf(14),
      lineHeight: rf(14) * 1.43,
      color: theme.colors.textPrimary,
    },
    addonSummaryDescription: {
      fontFamily: "Inter",
      fontWeight: "500",
      fontSize: rf(12),
      lineHeight: rf(12) * 1.33,
      color: theme.colors.textMuted,
    },
    costBreakdown: {
      padding: theme.spacing["4xl"],
    },
    costRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: theme.spacing["2xl"],
    },
    costLabel: {
      fontFamily: "Inter",
      fontWeight: "500",
      fontSize: rf(14),
      lineHeight: rf(14) * 1.43,
      color: theme.colors.textPrimary,
    },
    costValue: {
      fontFamily: "Urbanist",
      fontWeight: "800",
      fontSize: rf(14),
      lineHeight: rf(14) * 1.43,
      color: theme.colors.textPrimary,
    },
    totalRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: theme.spacing["2xl"],
    },
    totalLabel: {
      fontFamily: "Inter",
      fontWeight: "500",
      fontSize: rf(14),
      lineHeight: rf(14) * 1.43,
      color: theme.colors.textPrimary,
    },
    totalValue: {
      fontFamily: "Urbanist",
      fontWeight: "800",
      fontSize: rf(14),
      lineHeight: rf(14) * 1.43,
      color: theme.colors.textPrimary,
    },
    quoteNote: {
      padding: theme.spacing["4xl"],
      flexDirection: "row",
      alignItems: "center",
    },
    quoteNoteText: {
      fontFamily: "Inter",
      fontWeight: "500",
      fontSize: rf(12),
      lineHeight: rf(12) * 1.33,
      color: theme.colors.textMuted,
      paddingLeft: theme.spacing["2xl"],
    },
  });

export default function InstantQuoteScreen() {
  const { vendorId } = useLocalSearchParams();
  const router = useRouter();
  const theme = useTheme();
  const styles = createStyles(theme);
  const { user } = useUserStore();
  const { createQuote } = useQuotesStore();

  const [currentStep, setCurrentStep] = useState(0);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [selectedAddons, setSelectedAddons] = useState<Addon[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Get vendor data
  const vendor = mockVendors.find((v) => v.id === vendorId);

  if (!vendor) {
    router.back();
    return null;
  }

  // Mock package data - in a real app, this would come from the vendor's database
  const packages: Package[] = [
    {
      id: "standard",
      name: "Standard Package",
      price: 2200,
      features: [
        "Half-Day Coverage (6 Hours)",
        "One Photographer",
        "300–500 Edited Photos",
        "Online Gallery (6 Months)",
        "Travel Included (Within 50km)",
      ],
    },
    {
      id: "premium",
      name: "Premium Package",
      price: 2700,
      features: [
        "Full-Day Coverage (10 Hours)",
        "Two Photographers",
        "700–900 Edited Photos",
        "Online Gallery (12 Months)",
        "Travel Included (Within 100km)",
      ],
      isPopular: true,
    },
    {
      id: "exclusive",
      name: "Exclusive Package",
      price: 3500,
      features: [
        "Full-Day Coverage (12 Hours)",
        "Two Photographers + Assistant",
        "1000+ Edited Photos",
        "Online Gallery (24 Months)",
        "Travel Included (Within 200km)",
        "Same-Day Preview",
      ],
    },
  ];

  const addons: Addon[] = [
    {
      id: "drone",
      name: "Drone Photography",
      description:
        "Aerial shots of your venue and ceremony for a cinematic touch.",
      price: 1200,
    },
    {
      id: "slideshow",
      name: "Same-Day Slideshow",
      description: "A curated slideshow of highlights shown at your reception.",
      price: 300,
    },
    {
      id: "raw",
      name: "Raw Photo Files",
      description:
        "Get access to all unedited RAW images from your wedding day.",
      price: 700,
    },
    {
      id: "album",
      name: "Wedding Album (30 Pages)",
      description:
        "A handcrafted, high-quality photo album featuring your favourite images.",
      price: 400,
    },
  ];

  const handleNext = () => {
    if (currentStep === 0 && !selectedPackage) {
      Alert.alert(
        "Please select a package",
        "You need to choose a package to continue."
      );
      return;
    }
    setCurrentStep(currentStep + 1);
  };

  const handleAddonToggle = (addon: Addon) => {
    if (selectedAddons.find((a) => a.id === addon.id)) {
      setSelectedAddons(selectedAddons.filter((a) => a.id !== addon.id));
    } else {
      setSelectedAddons([...selectedAddons, addon]);
    }
  };

  const calculateCosts = () => {
    const packageCost = selectedPackage?.price || 0;
    const addonsCost = selectedAddons.reduce(
      (sum, addon) => sum + addon.price,
      0
    );
    const subtotal = packageCost + addonsCost;
    const gst = subtotal * 0.1;
    const total = subtotal + gst;

    return { packageCost, addonsCost, gst, total };
  };

  const handleDone = async () => {
    if (!selectedPackage || !user) return;

    try {
      setIsLoading(true);
      const { packageCost, addonsCost, gst, total } = calculateCosts();

      await createQuote(
        user.id,
        vendor.id,
        vendor.name,
        vendor.images[0]?.url,
        selectedPackage.name,
        selectedPackage,
        selectedAddons,
        packageCost,
        addonsCost,
        gst,
        total,
        user.weddingDate?.toString()
      );

      // Navigate back to vendor page or quotes page
      router.back();
      Alert.alert("Quote Saved", "Your quote has been saved to your profile!");
    } catch {
      Alert.alert("Error", "Failed to save quote. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderPackageSelection = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.titleContainer}>
        <ThemedText style={styles.title}>
          Which Package are you after?
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          Choose the right package for you, don&apos;t worry if you&apos;re not
          sure. You can always change it and discuss it with your professional
        </ThemedText>
      </View>

      {packages.map((pkg) => (
        <TouchableOpacity
          key={pkg.id}
          style={[
            styles.packageCard,
            selectedPackage?.id === pkg.id && styles.packageCardSelected,
          ]}
          onPress={() => setSelectedPackage(pkg)}
        >
          <View style={styles.packageHeader}>
            <ThemedText style={styles.packageName}>{pkg.name}</ThemedText>
            {pkg.isPopular && (
              <ThemedText style={styles.popularBadge}>Most Popular</ThemedText>
            )}
          </View>

          <View style={styles.divider} />

          <View style={styles.featuresContainer}>
            {pkg.features.map((feature, index) => (
              <View key={index} style={styles.featureRow}>
                <Ionicons
                  name="checkmark"
                  size={rf(14)}
                  color={theme.colors.primary}
                />
                <ThemedText style={styles.featureText}>{feature}</ThemedText>
              </View>
            ))}
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderAddonSelection = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.titleContainer}>
        <ThemedText style={styles.title}>Select Extra Packages</ThemedText>
        <ThemedText style={styles.subtitle}>
          Add anything else you want to potentially include in your quote
        </ThemedText>
      </View>

      {addons.map((addon) => {
        const isSelected = selectedAddons.find((a) => a.id === addon.id);
        return (
          <TouchableOpacity
            key={addon.id}
            style={styles.addonCard}
            onPress={() => handleAddonToggle(addon)}
          >
            <View style={styles.addonContent}>
              <ThemedText style={styles.addonName}>{addon.name}</ThemedText>
              <ThemedText style={styles.addonDescription}>
                {addon.description}
              </ThemedText>
            </View>
            <View
              style={[styles.checkbox, isSelected && styles.checkboxSelected]}
            >
              {isSelected && (
                <Ionicons
                  name="checkmark"
                  size={rf(16)}
                  color={theme.colors.backgroundPrimary}
                />
              )}
            </View>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );

  const renderQuoteResult = () => {
    const { packageCost, addonsCost, gst, total } = calculateCosts();

    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.titleContainer}>
          <ThemedText style={styles.title}>Your Quote</ThemedText>
          <ThemedText style={styles.subtitle}>
            You can access your quote from your profile
          </ThemedText>
        </View>

        {/* Vendor Info */}
        <View style={styles.quoteResultCard}>
          <View style={styles.vendorSection}>
            {vendor.images?.[0]?.url ? (
              <Image
                source={{ uri: vendor.images[0].url }}
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
              <ThemedText style={styles.vendorName}>{vendor.name}</ThemedText>
              <ThemedText style={styles.vendorLocation}>
                {vendor.location}
              </ThemedText>
            </View>
          </View>
        </View>

        {/* Selected Package */}
        <View style={styles.quoteResultCard}>
          <ThemedText style={styles.sectionTitle}>Selected Package</ThemedText>
          <View style={styles.packageSummary}>
            <View style={styles.packageHeader}>
              <ThemedText style={styles.packageName}>
                {selectedPackage?.name}
              </ThemedText>
              <ThemedText style={styles.packagePrice}>
                ${packageCost.toFixed(2)}
              </ThemedText>
            </View>
            <View style={styles.divider} />
            <View style={styles.featuresContainer}>
              {selectedPackage?.features.slice(0, 3).map((feature, index) => (
                <View key={index} style={styles.featureRow}>
                  <Ionicons
                    name="checkmark"
                    size={rf(12)}
                    color={theme.colors.primary}
                  />
                  <ThemedText style={styles.featureTextSmall}>
                    {feature}
                  </ThemedText>
                </View>
              ))}
              {selectedPackage?.features &&
                selectedPackage.features.length > 3 && (
                  <ThemedText style={styles.moreFeatures}>
                    +{selectedPackage.features.length - 3} more features
                  </ThemedText>
                )}
            </View>
          </View>
        </View>

        {/* Selected Add-ons */}
        {selectedAddons.length > 0 && (
          <View style={styles.quoteResultCard}>
            <ThemedText style={styles.sectionTitle}>Add-ons</ThemedText>
            {selectedAddons.map((addon, index) => (
              <View key={index} style={styles.addonSummary}>
                <View style={styles.addonSummaryHeader}>
                  <ThemedText style={styles.addonSummaryName}>
                    {addon.name}
                  </ThemedText>
                  <ThemedText style={styles.addonSummaryPrice}>
                    ${addon.price.toFixed(2)}
                  </ThemedText>
                </View>
                {addon.description && (
                  <ThemedText style={styles.addonSummaryDescription}>
                    {addon.description}
                  </ThemedText>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Cost Breakdown */}
        <View style={styles.quoteResultCard}>
          <ThemedText style={styles.sectionTitle}>Cost Breakdown</ThemedText>
          <View style={styles.costBreakdown}>
            <View style={styles.costRow}>
              <ThemedText style={styles.costLabel}>Package</ThemedText>
              <ThemedText style={styles.costValue}>
                ${packageCost.toFixed(2)}
              </ThemedText>
            </View>

            {selectedAddons.length > 0 && (
              <View style={styles.costRow}>
                <ThemedText style={styles.costLabel}>Add-ons</ThemedText>
                <ThemedText style={styles.costValue}>
                  ${addonsCost.toFixed(2)}
                </ThemedText>
              </View>
            )}

            <View style={styles.costRow}>
              <ThemedText style={styles.costLabel}>GST (10%)</ThemedText>
              <ThemedText style={styles.costValue}>
                ${gst.toFixed(2)}
              </ThemedText>
            </View>

            <View style={styles.divider} />

            <View style={styles.totalRow}>
              <ThemedText style={styles.totalLabel}>Total</ThemedText>
              <ThemedText style={styles.totalValue}>
                ${total.toFixed(2)} AUD
              </ThemedText>
            </View>
          </View>
        </View>

        {/* Quote Note */}
        <View style={styles.quoteNote}>
          <Ionicons
            name="information-circle-outline"
            size={rf(16)}
            color={theme.colors.textMuted}
          />
          <ThemedText style={styles.quoteNoteText}>
            This is an instant quote. Final pricing may vary after consultation
            with the vendor.
          </ThemedText>
        </View>
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={theme.colors.backgroundPrimary}
      />
      <View style={styles.statusBarBackground} />

      {/* Header */}
      <View style={styles.header}>
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
      </View>

      {/* Content */}
      <View style={styles.content}>
        {currentStep === 0 && renderPackageSelection()}
        {currentStep === 1 && renderAddonSelection()}
        {currentStep === 2 && renderQuoteResult()}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <ProgressDots currentStep={currentStep} totalSteps={3} />

        {currentStep < 2 ? (
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <ThemedText style={styles.nextButtonText}>Next</ThemedText>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.doneButton}
            onPress={handleDone}
            disabled={isLoading}
          >
            <ThemedText style={styles.doneButtonText}>
              {isLoading ? "Saving..." : "Done"}
            </ThemedText>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
