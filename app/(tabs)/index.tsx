import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
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
import { mockVendors } from "@/data/mockData";
import { useTheme } from "@/hooks/useTheme";
import { useFavoritesStore } from "@/stores/favoritesStore";
import { Vendor, VendorCategory } from "@/types";

const createStyles = (theme: any) =>
  StyleSheet.create({
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
  const theme = useTheme();
  const styles = createStyles(theme);
  const [selectedCategory, setSelectedCategory] = useState<VendorCategory>(
    VendorCategory.PHOTO
  );
  const { loadFavorites, loadUserPreferences } = useFavoritesStore();

  // Animation values
  const cardAnimations = useRef<{ [key: string]: Animated.Value }>({}).current;
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Scroll tracking for shadow effect
  const scrollY = useRef(new Animated.Value(0)).current;
  const [hasScrolled, setHasScrolled] = useState(false);

  // FlatList ref for scroll control
  const flatListRef = useRef<FlatList>(null);

  // Load favorites and user preferences when component mounts
  useEffect(() => {
    loadFavorites();
    loadUserPreferences();
  }, [loadFavorites, loadUserPreferences]);

  // Filter vendors by selected category
  const filteredVendors = useMemo(() => {
    return mockVendors.filter((vendor) => vendor.category === selectedCategory);
  }, [selectedCategory]);

  // Initialize card animations for new vendors
  useEffect(() => {
    filteredVendors.forEach((vendor, index) => {
      if (!cardAnimations[vendor.id]) {
        cardAnimations[vendor.id] = new Animated.Value(0);
      }
    });
  }, [filteredVendors]);

  // Animate content transition when category changes
  useEffect(() => {
    setIsTransitioning(true);

    // Scroll to top smoothly if user has scrolled
    if (hasScrolled && flatListRef.current) {
      flatListRef.current.scrollToOffset({
        offset: 0,
        animated: true,
      });
      // Reset scroll state
      setHasScrolled(false);
    }

    // Reset and animate only the vendor cards
    const cardAnimationPromises = filteredVendors.map((vendor, index) => {
      cardAnimations[vendor.id].setValue(0);
      return Animated.timing(cardAnimations[vendor.id], {
        toValue: 1,
        duration: 250,
        delay: Math.min(index * 40, 200), // Cap the delay to prevent long waits
        useNativeDriver: true,
      });
    });

    if (cardAnimationPromises.length > 0) {
      Animated.stagger(40, cardAnimationPromises).start(() => {
        setIsTransitioning(false);
      });
    } else {
      setIsTransitioning(false);
    }
  }, [selectedCategory]);

  const handleSearchPress = () => {
    // Navigate to search page
    router.push("/search");
  };

  const handleVendorPress = (vendor: Vendor) => {
    // Navigate to vendor details
    router.push({
      pathname: "/vendor/[id]",
      params: { id: vendor.id },
    });
  };

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    {
      useNativeDriver: false,
      listener: (event: any) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        setHasScrolled(offsetY > 10);
      },
    }
  );

  const renderVendorCard = ({
    item,
    index,
  }: {
    item: Vendor;
    index: number;
  }) => {
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
  };

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
            onCategoryChange={setSelectedCategory}
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
