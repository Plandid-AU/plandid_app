import { ProgressDots } from "@/components/ProgressDots";
import { ThemedText } from "@/components/ThemedText";
import { rf, rh, rs } from "@/constants/Responsive";
import { mockVendors } from "@/data/mockData";
import { useTheme } from "@/hooks/useTheme";
import { useQuotesStore } from "@/stores/quotesStore";
import { useUserStore } from "@/stores/userStore";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  Share,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

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
      paddingBottom: rh(120),
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
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
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
      overflow: "hidden",
    },
    featuresContent: {
      padding: theme.spacing["4xl"],
      gap: theme.spacing["3xl"],
    },
    featureRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: theme.spacing["2xl"],
      minHeight: rs(24),
      paddingVertical: theme.spacing["xs"],
    },
    featureText: {
      fontFamily: "Inter",
      fontWeight: "500",
      fontSize: rf(14),
      lineHeight: rf(14) * 1.43,
      color: theme.colors.textPrimary,
      flex: 1,
      flexWrap: "wrap",
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
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      padding: theme.spacing["4xl"],
      paddingTop: theme.spacing["2xl"],
      gap: theme.spacing["3xl"],
      backgroundColor: theme.colors.backgroundPrimary,
      borderTopWidth: 1,
      borderTopColor: theme.colors.borderLight,
      zIndex: 1000,
    },
    footerActions: {
      flexDirection: "row",
      gap: theme.spacing["2xl"],
    },
    nextButton: {
      flex: 1,
      height: rh(48),
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.colors.primary,
      borderRadius: theme.borderRadius.lg,
    },
    nextButtonText: {
      fontFamily: "Inter",
      fontWeight: "600",
      fontSize: rf(14),
      color: theme.colors.backgroundPrimary,
    },
    doneButton: {
      flex: 1,
      height: rh(48),
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.colors.primary,
      borderRadius: theme.borderRadius.lg,
    },
    doneButtonText: {
      fontFamily: "Inter",
      fontWeight: "600",
      fontSize: rf(14),
      color: theme.colors.backgroundPrimary,
    },
    shareButton: {
      flex: 1,
      height: rh(48),
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.colors.backgroundSecondary,
      borderRadius: theme.borderRadius.lg,
      borderWidth: 1,
      borderColor: theme.colors.borderLight,
    },
    shareButtonText: {
      fontFamily: "Inter",
      fontWeight: "600",
      fontSize: rf(14),
      color: theme.colors.textPrimary,
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
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: theme.spacing["5xl"],
    },
    loadingContent: {
      alignItems: "center",
      gap: theme.spacing["4xl"],
    },
    loadingIcon: {
      marginBottom: theme.spacing["2xl"],
    },
    loadingTitle: {
      fontFamily: "Urbanist",
      fontWeight: "800",
      fontSize: rf(24),
      lineHeight: rf(24) * 1.2,
      color: theme.colors.textPrimary,
      textAlign: "center",
    },
    loadingSubtitle: {
      fontFamily: "Inter",
      fontWeight: "500",
      fontSize: rf(14),
      lineHeight: rf(14) * 1.43,
      color: theme.colors.textMuted,
      textAlign: "center",
      maxWidth: rs(280),
    },
    loadingSpinner: {
      marginTop: theme.spacing["2xl"],
    },
    pulseContainer: {
      width: rs(120),
      height: rs(120),
      justifyContent: "center",
      alignItems: "center",
    },
    pulseCircle: {
      position: "absolute",
      width: rs(120),
      height: rs(120),
      borderRadius: rs(60),
      backgroundColor: theme.colors.primary,
    },
    loadingIconInner: {
      zIndex: 1,
    },
  });

// Animated Package Component
const AnimatedPackage: React.FC<{
  pkg: Package;
  isSelected: boolean;
  onSelect: () => void;
  animationValue: any;
  theme: any;
  styles: any;
}> = ({ pkg, isSelected, onSelect, animationValue, theme, styles }) => {
  // Use React refs to measure actual content height
  const [expandedHeight, setExpandedHeight] = useState(0);

  // Measure content height when features change
  const onFeaturesLayout = (event: any) => {
    const { height } = event.nativeEvent.layout;
    setExpandedHeight(height);
  };

  const animatedStyle = useAnimatedStyle(() => {
    const animationProgress = animationValue.value || 0;
    const targetHeight = animationProgress === 1 ? expandedHeight : 0;
    return {
      height: withTiming(targetHeight, {
        duration: 300,
      }),
      opacity: withTiming(animationProgress, {
        duration: 300,
      }),
    };
  });

  const dividerAnimatedStyle = useAnimatedStyle(() => {
    const animationProgress = animationValue.value || 0;
    return {
      opacity: withTiming(animationProgress, {
        duration: 300,
      }),
    };
  });

  return (
    <TouchableOpacity
      style={[styles.packageCard, isSelected && styles.packageCardSelected]}
      onPress={onSelect}
    >
      <View style={styles.packageHeader}>
        <View style={{ flex: 1 }}>
          <ThemedText style={styles.packageName}>{pkg.name}</ThemedText>
          {pkg.isPopular && (
            <ThemedText style={styles.popularBadge}>Most Popular</ThemedText>
          )}
        </View>
        <ThemedText style={styles.packagePrice}>
          ${pkg.price.toFixed(0)}
        </ThemedText>
      </View>

      {/* Always render the divider and features, but animate their visibility */}
      <Animated.View style={dividerAnimatedStyle}>
        <View style={styles.divider} />
      </Animated.View>

      <Animated.View style={[styles.featuresContainer, animatedStyle]}>
        <View style={styles.featuresContent} onLayout={onFeaturesLayout}>
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
      </Animated.View>
    </TouchableOpacity>
  );
};

// Animated Loading Component
const LoadingAnimation: React.FC<{
  theme: any;
  styles: any;
}> = ({ theme, styles }) => {
  const pulseScale = useSharedValue(1);
  const pulseOpacity = useSharedValue(0.3);

  useEffect(() => {
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.2, { duration: 1000 }),
        withTiming(1, { duration: 1000 })
      ),
      -1,
      true
    );

    pulseOpacity.value = withRepeat(
      withSequence(
        withTiming(0.6, { duration: 1000 }),
        withTiming(0.3, { duration: 1000 })
      ),
      -1,
      true
    );
  }, [pulseScale, pulseOpacity]);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
    opacity: pulseOpacity.value,
  }));

  return (
    <View style={styles.loadingContainer}>
      <View style={styles.loadingContent}>
        <View style={styles.pulseContainer}>
          <Animated.View style={[styles.pulseCircle, pulseStyle]} />
          <View style={styles.loadingIconInner}>
            <Ionicons
              name="calculator-outline"
              size={rf(48)}
              color={theme.colors.backgroundPrimary}
            />
          </View>
        </View>

        <View>
          <ThemedText style={styles.loadingTitle}>
            Plandid is retrieving your quote
          </ThemedText>
          <ThemedText style={styles.loadingSubtitle}>
            We&apos;re calculating the best pricing for your special day...
          </ThemedText>
        </View>

        <ActivityIndicator
          size="large"
          color={theme.colors.primary}
          style={styles.loadingSpinner}
        />
      </View>
    </View>
  );
};

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
  const [isProcessingQuote, setIsProcessingQuote] = useState(false);
  const [showQuoteResult, setShowQuoteResult] = useState(false);

  // Individual animation values for each package for better reactivity
  const standardAnimation = useSharedValue(0);
  const premiumAnimation = useSharedValue(0);
  const exclusiveAnimation = useSharedValue(0);

  // Animation mapping
  const getAnimationValue = (packageId: string) => {
    switch (packageId) {
      case "standard":
        return standardAnimation;
      case "premium":
        return premiumAnimation;
      case "exclusive":
        return exclusiveAnimation;
      default:
        return standardAnimation;
    }
  };

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

  // Get vendor data
  const vendor = mockVendors.find((v) => v.id === vendorId);

  if (!vendor) {
    router.back();
    return null;
  }

  const handleNext = () => {
    if (currentStep === 0 && !selectedPackage) {
      Alert.alert(
        "Please select a package",
        "You need to choose a package to continue."
      );
      return;
    }

    if (currentStep === 1) {
      // After add-on selection, start the processing animation
      setIsProcessingQuote(true);

      // Simulate processing time (2-3 seconds)
      setTimeout(() => {
        setIsProcessingQuote(false);
        setShowQuoteResult(true);
      }, 2500);
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (showQuoteResult) {
      // If we're on the quote result, go back to addon selection
      setShowQuoteResult(false);
      setCurrentStep(1);
    } else if (isProcessingQuote) {
      // If processing, go back to addon selection
      setIsProcessingQuote(false);
      setCurrentStep(1);
    } else if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      router.back();
    }
  };

  const handlePackageSelect = (pkg: Package) => {
    setSelectedPackage(pkg);

    // Reset all animations first
    standardAnimation.value = 0;
    premiumAnimation.value = 0;
    exclusiveAnimation.value = 0;

    // Then set the selected package to expand
    getAnimationValue(pkg.id).value = 1;
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

  const handleShare = async () => {
    if (!selectedPackage || !vendor) return;

    try {
      const { packageCost, addonsCost, total } = calculateCosts();

      let shareContent = `Quote from ${vendor.name}\n\n`;
      shareContent += `Package: ${
        selectedPackage.name
      } - $${packageCost.toFixed(2)}\n`;

      if (selectedAddons.length > 0) {
        shareContent += `Add-ons: $${addonsCost.toFixed(2)}\n`;
        selectedAddons.forEach((addon) => {
          shareContent += `- ${addon.name}\n`;
        });
      }

      shareContent += `\nTotal: $${total.toFixed(2)} AUD\n`;
      shareContent += `\nGenerated with Plandid - Your Wedding Planning Assistant`;

      await Share.share({
        message: shareContent,
      });
    } catch {
      Alert.alert("Error", "Failed to share quote");
    }
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

      {packages.map((pkg) => {
        const isSelected = selectedPackage?.id === pkg.id;

        return (
          <AnimatedPackage
            key={pkg.id}
            pkg={pkg}
            isSelected={isSelected}
            onSelect={() => handlePackageSelect(pkg)}
            animationValue={getAnimationValue(pkg.id)}
            theme={theme}
            styles={styles}
          />
        );
      })}
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
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={theme.colors.backgroundPrimary}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons
            name="chevron-back"
            size={rf(20)}
            color={theme.colors.primary}
          />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {!isProcessingQuote &&
          !showQuoteResult &&
          currentStep === 0 &&
          renderPackageSelection()}
        {!isProcessingQuote &&
          !showQuoteResult &&
          currentStep === 1 &&
          renderAddonSelection()}
        {isProcessingQuote && (
          <LoadingAnimation theme={theme} styles={styles} />
        )}
        {showQuoteResult && renderQuoteResult()}
      </View>

      {/* Footer */}
      {!isProcessingQuote && (
        <View style={styles.footer}>
          <ProgressDots
            currentStep={showQuoteResult ? 2 : currentStep}
            totalSteps={2}
          />

          {!showQuoteResult ? (
            <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
              <ThemedText style={styles.nextButtonText}>
                {currentStep === 1 ? "Get Quote" : "Next"}
              </ThemedText>
            </TouchableOpacity>
          ) : (
            <View style={styles.footerActions}>
              <TouchableOpacity
                style={styles.shareButton}
                onPress={handleShare}
              >
                <ThemedText style={styles.shareButtonText}>
                  Share Quote
                </ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.doneButton}
                onPress={handleDone}
                disabled={isLoading}
              >
                <ThemedText style={styles.doneButtonText}>
                  {isLoading ? "Saving..." : "Done"}
                </ThemedText>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    </SafeAreaView>
  );
}
