import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Animated,
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";

import { CategoryTabs } from "@/components/CategoryTabs";
import { SearchBar } from "@/components/SearchBar";
import { ThemedText } from "@/components/ThemedText";
import { VendorCard } from "@/components/VendorCard";
import { rs } from "@/constants/Responsive";
import { theme } from "@/constants/Theme";
import { mockVendors } from "@/data/mockData";
import { Vendor, VendorCategory } from "@/types";

// Suppress useInsertionEffect warning in development - this is a known React Navigation issue
// that occurs during rapid navigation transitions and doesn't affect functionality
if (__DEV__) {
  const originalConsoleWarn = console.warn;
  const originalConsoleError = console.error;

  console.warn = (...args) => {
    const message = args[0];
    if (
      typeof message === "string" &&
      (message.includes("useInsertionEffect must not schedule updates") ||
        message.includes(
          "Warning: useInsertionEffect must not schedule updates"
        ))
    ) {
      return; // Suppress this specific warning
    }
    originalConsoleWarn.apply(console, args);
  };

  console.error = (...args) => {
    const message = args[0];
    if (
      typeof message === "string" &&
      (message.includes("useInsertionEffect must not schedule updates") ||
        message.includes(
          "Warning: useInsertionEffect must not schedule updates"
        ))
    ) {
      return; // Suppress this specific error
    }
    originalConsoleError.apply(console, args);
  };
}

// Create styles statically to completely avoid any insertion effect issues
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundPrimary,
  },
  stickyHeader: {
    backgroundColor: theme.colors.backgroundPrimary,
    paddingTop: rs(8),
    paddingBottom: rs(12),
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
    zIndex: 10,
  },
  stickyHeaderWithShadow: {
    borderBottomColor: "transparent",
    zIndex: 10,
  },
  shadowLine: {
    height: rs(4),
    zIndex: 9,
  },
  searchBarContainer: {
    paddingHorizontal: theme.spacing["2xl"],
    marginBottom: rs(12),
  },
  categoryTabsContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContent: {
    paddingTop: rs(12),
    paddingBottom: rs(20),
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: rs(100),
  },
  cardContainer: {
    paddingHorizontal: theme.spacing["2xl"],
  },
});

export default function HomeScreen() {
  // Standard state management - warning is now suppressed
  const [selectedCategory, setSelectedCategory] = useState<VendorCategory>(
    VendorCategory.PHOTO
  );
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  // Animation values - use refs to prevent re-creation during renders
  const cardAnimations = useRef<{ [key: string]: Animated.Value }>({}).current;
  const isMountedRef = useRef(true);

  // Scroll tracking for shadow effect
  const scrollY = useRef(new Animated.Value(0)).current;

  // FlatList ref for scroll control
  const flatListRef = useRef<FlatList>(null);

  // Use cleanup on unmount to prevent state updates during unmounting
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Filter vendors by selected category - memoized to prevent unnecessary recalculations
  const filteredVendors = useMemo(() => {
    return mockVendors.filter((vendor) => vendor.category === selectedCategory);
  }, [selectedCategory]);

  // Initialize card animations for new vendors - use callback to prevent recreation
  const initializeCardAnimations = useCallback(() => {
    filteredVendors.forEach((vendor, index) => {
      if (!cardAnimations[vendor.id]) {
        cardAnimations[vendor.id] = new Animated.Value(0);
      }
    });
  }, [filteredVendors, cardAnimations]);

  useEffect(() => {
    if (isMountedRef.current) {
      initializeCardAnimations();
    }
  }, [initializeCardAnimations]);

  // Animate content transition when category changes - use callback to prevent recreation
  const animateTransition = useCallback(() => {
    if (!isMountedRef.current) return;

    setIsTransitioning(true);

    // Scroll to top smoothly if user has scrolled
    if (hasScrolled && flatListRef.current) {
      flatListRef.current.scrollToOffset({
        offset: 0,
        animated: true,
      });
      // Reset scroll state only if still mounted
      if (isMountedRef.current) {
        setHasScrolled(false);
      }
    }

    // Reset and animate only the vendor cards
    const cardAnimationPromises = filteredVendors
      .map((vendor, index) => {
        if (cardAnimations[vendor.id]) {
          cardAnimations[vendor.id].setValue(0);
          return Animated.timing(cardAnimations[vendor.id], {
            toValue: 1,
            duration: 250,
            delay: Math.min(index * 40, 200), // Cap the delay to prevent long waits
            useNativeDriver: true,
          });
        }
        return null;
      })
      .filter(
        (animation): animation is Animated.CompositeAnimation =>
          animation !== null
      );

    if (cardAnimationPromises.length > 0) {
      Animated.stagger(40, cardAnimationPromises).start(() => {
        if (isMountedRef.current) {
          setIsTransitioning(false);
        }
      });
    } else {
      if (isMountedRef.current) {
        setIsTransitioning(false);
      }
    }
  }, [filteredVendors, hasScrolled, cardAnimations]);

  useEffect(() => {
    animateTransition();
  }, [selectedCategory, animateTransition]);

  // Stable callback functions to prevent unnecessary re-renders
  const handleSearchPress = useCallback(() => {
    router.push("/search");
  }, []);

  const handleVendorPress = useCallback((vendor: Vendor) => {
    router.push({
      pathname: "/vendor/[id]",
      params: { id: vendor.id },
    });
  }, []);

  const handleCategoryChange = useCallback(
    (category: VendorCategory) => {
      if (isMountedRef.current && selectedCategory !== category) {
        // Use a longer delay to prevent scheduling during insertion phase
        setTimeout(() => {
          if (isMountedRef.current) {
            setSelectedCategory(category);
          }
        }, 16); // One frame delay + buffer
      }
    },
    [selectedCategory]
  );

  const handleScroll = useCallback(
    Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
      useNativeDriver: false,
      listener: (event: any) => {
        if (isMountedRef.current) {
          const offsetY = event.nativeEvent.contentOffset.y;
          setHasScrolled(offsetY > 10);
        }
      },
    }),
    [scrollY]
  );

  const renderVendorCard = useCallback(
    ({ item, index }: { item: Vendor; index: number }) => {
      const cardAnim = cardAnimations[item.id] || new Animated.Value(1);

      const cardOpacity = cardAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
      });

      const cardTranslateY = cardAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [30, 0],
      });

      const cardScale = cardAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0.95, 1],
      });

      return (
        <Animated.View
          style={[
            styles.cardContainer,
            {
              opacity: cardOpacity,
              transform: [{ translateY: cardTranslateY }, { scale: cardScale }],
            },
          ]}
        >
          <VendorCard vendor={item} onPress={() => handleVendorPress(item)} />
        </Animated.View>
      );
    },
    [cardAnimations, handleVendorPress]
  );

  // Early return if not initialized
  if (!isMountedRef.current) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={styles.emptyContainer}>
          <ThemedText type="body" style={{ color: theme.colors.textMuted }}>
            Loading...
          </ThemedText>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Sticky Header with Search Bar and Category Tabs */}
      <View
        style={[
          styles.stickyHeader,
          hasScrolled && styles.stickyHeaderWithShadow,
        ]}
      >
        {/* Search Bar with consistent margins */}
        <View style={styles.searchBarContainer}>
          <SearchBar onPress={handleSearchPress} />
        </View>

        {/* Category Tabs - centered */}
        <View style={styles.categoryTabsContainer}>
          <CategoryTabs
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
          />
        </View>
      </View>

      {/* Bottom Shadow Line - only visible when scrolled */}
      {hasScrolled && (
        <LinearGradient
          colors={["rgba(0,0,0,0.1)", "transparent"]}
          style={styles.shadowLine}
        />
      )}

      <FlatList
        ref={flatListRef}
        data={filteredVendors}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        renderItem={renderVendorCard}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <ThemedText type="body" style={{ color: theme.colors.textMuted }}>
              No vendors found in this category
            </ThemedText>
          </View>
        }
        // Add some performance optimizations for smooth scrolling
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={10}
        initialNumToRender={8}
        getItemLayout={(data, index) => ({
          length: 200, // Approximate item height
          offset: 200 * index,
          index,
        })}
        // Disable scroll during transitions for smoother experience
        scrollEnabled={!isTransitioning}
      />
    </SafeAreaView>
  );
}
