import { ThemedText } from "@/components/ThemedText";
import { rf, rh, rs } from "@/constants/Responsive";
import { useTheme } from "@/hooks/useTheme";
import { useQuotesStore } from "@/stores/quotesStore";
import { useUserStore } from "@/stores/userStore";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

type SortOption = "recent" | "oldest" | "highest" | "lowest";

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
    emptyStateContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      gap: theme.spacing["8xl"],
      paddingVertical: theme.spacing["10xl"],
    },
    emptyStateIcon: {
      width: rs(100),
      height: rs(100),
      borderRadius: rs(24),
      backgroundColor: "#EBEBEB",
      justifyContent: "center",
      alignItems: "center",
    },
    emptyStateTextContainer: {
      gap: theme.spacing["2xl"],
      alignItems: "center",
    },
    emptyStateTitle: {
      fontFamily: "Urbanist",
      fontWeight: "800",
      fontSize: rf(18),
      lineHeight: rf(18) * 1.2,
      color: theme.colors.textPrimary,
      textAlign: "center",
    },
    emptyStateDescription: {
      fontFamily: "Inter",
      fontWeight: "500",
      fontSize: rf(14),
      lineHeight: rf(14) * 1.43,
      color: theme.colors.textMuted,
      textAlign: "center",
      maxWidth: rs(238),
    },
    exploreButton: {
      height: rh(40),
      paddingHorizontal: theme.spacing["4xl"],
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.colors.primary,
      borderRadius: theme.borderRadius.lg,
    },
    exploreButtonText: {
      fontFamily: "Inter",
      fontWeight: "600",
      fontSize: rf(12),
      color: theme.colors.backgroundPrimary,
    },
    sortContainer: {
      flexDirection: "row",
      justifyContent: "flex-end",
      alignItems: "center",
      marginBottom: theme.spacing["4xl"],
    },
    sortButton: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing["3xl"],
      paddingVertical: theme.spacing["3xl"],
      paddingHorizontal: theme.spacing["4xl"],
      borderRadius: theme.borderRadius.lg,
      borderWidth: 0.5,
      borderColor: "#C5C6CC",
      minHeight: rs(40),
    },
    sortButtonText: {
      fontFamily: "Inter",
      fontWeight: "500",
      fontSize: rf(12),
      lineHeight: rf(12) * 1.33,
      color: theme.colors.textPrimary,
    },
    quoteCard: {
      backgroundColor: theme.colors.backgroundPrimary,
      borderRadius: theme.borderRadius.xl,
      borderWidth: 1,
      borderColor: "#D9D9D9",
      padding: theme.spacing["4xl"],
      marginBottom: theme.spacing["4xl"],
      height: rs(68),
      justifyContent: "center",
    },
    quoteCardContent: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      gap: theme.spacing["4xl"],
    },
    quoteInfo: {
      flex: 1,
      gap: rs(4),
    },
    vendorName: {
      fontFamily: "Urbanist",
      fontWeight: "700",
      fontSize: rf(14),
      lineHeight: rf(14) * 1.2,
      color: theme.colors.textPrimary,
    },
    quoteDate: {
      fontFamily: "Inter",
      fontWeight: "500",
      fontSize: rf(12),
      lineHeight: rf(12) * 1.33,
      color: theme.colors.textMuted,
    },
    chevronIcon: {
      width: rs(20),
      height: rs(20),
      justifyContent: "center",
      alignItems: "center",
    },
    // Sort Modal Styles
    modalOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(31, 32, 36, 0.4)",
    },
    modalContainer: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: theme.colors.backgroundPrimary,
      borderTopLeftRadius: theme.borderRadius.xl,
      borderTopRightRadius: theme.borderRadius.xl,
      paddingBottom: Platform.OS === "ios" ? rs(34) : rs(20),
    },
    modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingTop: theme.spacing["4xl"],
      paddingBottom: theme.spacing["2xl"],
      paddingHorizontal: theme.spacing["5xl"],
    },
    modalTitle: {
      fontFamily: "Urbanist",
      fontWeight: "700",
      fontSize: rf(16),
      lineHeight: rf(16) * 1.2,
      color: theme.colors.textPrimary,
    },
    closeButton: {
      width: rs(18),
      height: rs(18),
      justifyContent: "center",
      alignItems: "center",
    },
    modalContent: {
      paddingHorizontal: theme.spacing["3xl"],
      paddingBottom: theme.spacing["2xl"],
    },
    sortOption: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: theme.spacing["2xl"],
      paddingHorizontal: theme.spacing["3xl"],
      gap: theme.spacing["5xl"],
    },
    sortOptionIcon: {
      width: rs(26),
      height: rs(26),
      justifyContent: "center",
      alignItems: "center",
    },
    sortOptionContent: {
      flex: 1,
      gap: rs(4),
    },
    sortOptionTitle: {
      fontFamily: "Inter",
      fontWeight: "500",
      fontSize: rf(14),
      lineHeight: rf(14) * 1.43,
      color: theme.colors.textPrimary,
    },
    sortOptionDescription: {
      fontFamily: "Inter",
      fontWeight: "500",
      fontSize: rf(12),
      lineHeight: rf(12) * 1.33,
      color: theme.colors.textMuted,
    },
    divider: {
      height: rs(0.5),
      backgroundColor: theme.colors.borderLight,
      marginHorizontal: theme.spacing["3xl"],
    },
  });

export default function MyQuotesScreen() {
  const router = useRouter();
  const theme = useTheme();
  const styles = createStyles(theme);
  const { user } = useUserStore();
  const { quotes, loadQuotes } = useQuotesStore();

  const [sortModalVisible, setSortModalVisible] = useState(false);
  const [currentSort, setCurrentSort] = useState<SortOption>("recent");
  const slideAnim = React.useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const overlayOpacity = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (user) {
      loadQuotes(user.id);
    }
  }, [user, loadQuotes]);

  useEffect(() => {
    if (sortModalVisible) {
      Animated.parallel([
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(overlayOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: SCREEN_HEIGHT,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [sortModalVisible, overlayOpacity, slideAnim]);

  const getSortedQuotes = () => {
    const sortedQuotes = [...quotes];

    switch (currentSort) {
      case "recent":
        return sortedQuotes.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case "oldest":
        return sortedQuotes.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      case "highest":
        return sortedQuotes.sort((a, b) => b.totalCost - a.totalCost);
      case "lowest":
        return sortedQuotes.sort((a, b) => a.totalCost - b.totalCost);
      default:
        return sortedQuotes;
    }
  };

  const getSortDisplayText = () => {
    switch (currentSort) {
      case "recent":
        return "Sort By Most Recent";
      case "oldest":
        return "Sort By Oldest";
      case "highest":
        return "Sort By Highest Price";
      case "lowest":
        return "Sort By Lowest Price";
      default:
        return "Sort By Most Recent";
    }
  };

  const handleSortSelect = (option: SortOption) => {
    setCurrentSort(option);
    setSortModalVisible(false);
  };

  const handleQuotePress = (quoteId: string) => {
    router.push(`/quotes/${quoteId}` as any);
  };

  const handleExplore = () => {
    router.push("/(tabs)/explore");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <View style={styles.emptyStateIcon}>
        <Ionicons
          name="document-text-outline"
          size={rs(32)}
          color={theme.colors.textMuted}
        />
      </View>

      <View style={styles.emptyStateTextContainer}>
        <ThemedText style={styles.emptyStateTitle}>
          Nothing here. For now.
        </ThemedText>
        <ThemedText style={styles.emptyStateDescription}>
          This is where you&apos;ll find your all your quotes from vendors
        </ThemedText>
      </View>

      <TouchableOpacity style={styles.exploreButton} onPress={handleExplore}>
        <ThemedText style={styles.exploreButtonText}>Go Explore</ThemedText>
      </TouchableOpacity>
    </View>
  );

  const renderQuotesList = () => {
    const sortedQuotes = getSortedQuotes();

    return (
      <>
        <View style={styles.sortContainer}>
          <TouchableOpacity
            style={styles.sortButton}
            onPress={() => setSortModalVisible(true)}
          >
            <Ionicons
              name="filter"
              size={rf(12)}
              color={theme.colors.primary}
            />
            <ThemedText style={styles.sortButtonText}>
              {getSortDisplayText()}
            </ThemedText>
            <Ionicons name="chevron-down" size={rf(10)} color="#C5C6CC" />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {sortedQuotes.map((quote) => (
            <TouchableOpacity
              key={quote.id}
              style={styles.quoteCard}
              onPress={() => handleQuotePress(quote.id)}
            >
              <View style={styles.quoteCardContent}>
                <View style={styles.quoteInfo}>
                  <ThemedText style={styles.vendorName}>
                    {quote.vendorName}
                  </ThemedText>
                  <ThemedText style={styles.quoteDate}>
                    Quoted on {formatDate(quote.createdAt)}
                  </ThemedText>
                </View>
                <View style={styles.chevronIcon}>
                  <Ionicons
                    name="chevron-forward"
                    size={rf(20)}
                    color={theme.colors.primary}
                  />
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </>
    );
  };

  const renderSortModal = () => (
    <Modal
      visible={sortModalVisible}
      transparent
      animationType="none"
      onRequestClose={() => setSortModalVisible(false)}
    >
      <TouchableWithoutFeedback onPress={() => setSortModalVisible(false)}>
        <Animated.View
          style={[styles.modalOverlay, { opacity: overlayOpacity }]}
        />
      </TouchableWithoutFeedback>

      <Animated.View
        style={[
          styles.modalContainer,
          { transform: [{ translateY: slideAnim }] },
        ]}
      >
        <View style={styles.modalHeader}>
          <ThemedText style={styles.modalTitle}>Sort Options</ThemedText>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setSortModalVisible(false)}
          >
            <Ionicons
              name="close"
              size={rf(18)}
              color={theme.colors.textPrimary}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.modalContent}>
          <TouchableOpacity
            style={styles.sortOption}
            onPress={() => handleSortSelect("recent")}
          >
            <View style={styles.sortOptionIcon}>
              <Ionicons
                name="time-outline"
                size={rf(26)}
                color={theme.colors.textPrimary}
              />
            </View>
            <View style={styles.sortOptionContent}>
              <ThemedText style={styles.sortOptionTitle}>
                Most Recent
              </ThemedText>
              <ThemedText style={styles.sortOptionDescription}>
                Show newest quotes first
              </ThemedText>
            </View>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.sortOption}
            onPress={() => handleSortSelect("oldest")}
          >
            <View style={styles.sortOptionIcon}>
              <Ionicons
                name="time-outline"
                size={rf(26)}
                color={theme.colors.textPrimary}
              />
            </View>
            <View style={styles.sortOptionContent}>
              <ThemedText style={styles.sortOptionTitle}>Oldest</ThemedText>
              <ThemedText style={styles.sortOptionDescription}>
                Show oldest quotes first
              </ThemedText>
            </View>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.sortOption}
            onPress={() => handleSortSelect("highest")}
          >
            <View style={styles.sortOptionIcon}>
              <Ionicons
                name="trending-up-outline"
                size={rf(26)}
                color={theme.colors.textPrimary}
              />
            </View>
            <View style={styles.sortOptionContent}>
              <ThemedText style={styles.sortOptionTitle}>
                Highest Price
              </ThemedText>
              <ThemedText style={styles.sortOptionDescription}>
                Show most expensive quotes first
              </ThemedText>
            </View>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.sortOption}
            onPress={() => handleSortSelect("lowest")}
          >
            <View style={styles.sortOptionIcon}>
              <Ionicons
                name="trending-down-outline"
                size={rf(26)}
                color={theme.colors.textPrimary}
              />
            </View>
            <View style={styles.sortOptionContent}>
              <ThemedText style={styles.sortOptionTitle}>
                Lowest Price
              </ThemedText>
              <ThemedText style={styles.sortOptionDescription}>
                Show least expensive quotes first
              </ThemedText>
            </View>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
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
              <ThemedText type="h3">My Quotes</ThemedText>
              <ThemedText type="caption" style={styles.subtitle}>
                Where all your quotes lives
              </ThemedText>
            </View>

            {quotes.length === 0 ? renderEmptyState() : renderQuotesList()}
          </View>
        </ScrollView>

        {renderSortModal()}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
