import { router } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  FlatList,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { CategoryTabs } from "@/components/CategoryTabs";
import { SearchBar } from "@/components/SearchBar";
import { VendorCard } from "@/components/VendorCard";
import { getLineHeight, rf, rs } from "@/constants/Responsive";
import { mockUser, mockVendors } from "@/data/mockData";
import { Vendor, VendorCategory } from "@/types";

export default function HomeScreen() {
  const [selectedCategory, setSelectedCategory] = useState<VendorCategory>(
    VendorCategory.PHOTO
  );
  const [favoriteVendors, setFavoriteVendors] = useState<string[]>(
    mockUser.favoriteVendors
  );

  // Animation values
  const cardAnimations = useRef<{ [key: string]: Animated.Value }>({}).current;
  const [isTransitioning, setIsTransitioning] = useState(false);

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
    // Navigate to search page (not implemented yet)
    console.log("Search pressed");
  };

  const handleVendorPress = (vendor: Vendor) => {
    // Navigate to vendor details
    router.push({
      pathname: "/vendor/[id]",
      params: { id: vendor.id },
    });
  };

  const handleFavoritePress = (vendorId: string) => {
    setFavoriteVendors((prev) => {
      if (prev.includes(vendorId)) {
        return prev.filter((id) => id !== vendorId);
      }
      return [...prev, vendorId];
    });
  };

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
        <VendorCard
          vendor={item}
          onPress={() => handleVendorPress(item)}
          onFavoritePress={handleFavoritePress}
          isFavorited={favoriteVendors.includes(item.id)}
        />
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <FlatList
        data={filteredVendors}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.header}>
            {/* Search Bar */}
            <SearchBar onPress={handleSearchPress} />

            {/* Category Tabs */}
            <CategoryTabs
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
          </View>
        }
        renderItem={renderVendorCard}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No vendors found in this category
            </Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    paddingBottom: rs(20),
  },
  header: {
    alignItems: "center",
    gap: rs(12),
    paddingHorizontal: rs(16),
    paddingTop: rs(8),
    paddingBottom: rs(12),
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: rs(100),
  },
  emptyText: {
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    fontWeight: "500",
    fontSize: rf(16),
    lineHeight: getLineHeight(rf(16), 1.2),
    color: "#71727A",
  },
  cardContainer: {
    paddingHorizontal: rs(16),
  },
});
