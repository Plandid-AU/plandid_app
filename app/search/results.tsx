import { VendorCard } from "@/components/VendorCard";
import { SearchResultsFilterModal } from "@/components/search/SearchResultsFilterModal";
import { getLineHeight, rf, rs } from "@/constants/Responsive";
import { mockVendors } from "@/data/mockData";
import { useFavoritesStore } from "@/stores/favoritesStore";
import { useSearchStore } from "@/stores/searchStore";
import { Vendor, VendorCategory } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  FlatList,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function SearchResultsScreen() {
  const params = useLocalSearchParams();
  const { location, date, service } = params;
  const { loadFavorites } = useFavoritesStore();

  const [showFilters, setShowFilters] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  // Add to recent searches
  const { addRecentSearch } = useSearchStore();

  useEffect(() => {
    // Load favorites
    loadFavorites();

    // Add to recent searches when page loads
    if (location && date && service) {
      addRecentSearch({
        location: location as string,
        date: date as string,
        service: service as string,
      });
    }

    // Animate in
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, [loadFavorites]);

  // Filter vendors based on search criteria
  const filteredVendors = useMemo(() => {
    let results = [...mockVendors];

    // Filter by service type
    if (service && service !== "All") {
      const categoryMap: { [key: string]: VendorCategory } = {
        Photographer: VendorCategory.PHOTO,
        Videographer: VendorCategory.VIDEO,
        "Content Creator": VendorCategory.CONTENT,
      };
      const category = categoryMap[service as string];
      if (category) {
        results = results.filter((vendor) => vendor.category === category);
      }
    }

    // Filter by location
    if (location && location !== "Flexible") {
      results = results.filter((vendor) =>
        vendor.location
          .toLowerCase()
          .includes((location as string).toLowerCase())
      );
    }

    return results;
  }, [location, service]);

  const handleBack = () => {
    if (isNavigating) return; // Prevent multiple taps

    setIsNavigating(true);

    // Navigate directly back to home with back animation
    router.dismissTo("/(tabs)");
  };

  const handleSearchInfoPress = () => {
    // Set the current search parameters in the store for modification
    const { setLocation, setDate, setService } = useSearchStore.getState();
    setLocation(location as string);
    setDate(date as string);
    setService(service as string);

    // Go back to the search page
    router.back();
  };

  const handleVendorPress = (vendor: Vendor) => {
    router.push({
      pathname: "/vendor/[id]",
      params: { id: vendor.id },
    });
  };

  const renderVendorCard = ({ item }: { item: Vendor }) => (
    <Animated.View
      style={[
        styles.cardContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <VendorCard vendor={item} onPress={() => handleVendorPress(item)} />
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.flex}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="chevron-back" size={rf(18)} color="#7B1513" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.searchInfo}
            onPress={handleSearchInfoPress}
            activeOpacity={0.7}
          >
            <Text style={styles.searchLocation}>{location || "Flexible"}</Text>
            <Text style={styles.searchDetails}>
              {date || "I'm not sure"} • {service || "All"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setShowFilters(!showFilters)}
            style={styles.filterButton}
          >
            <Ionicons name="options-outline" size={rf(20)} color="#7B1513" />
          </TouchableOpacity>
        </View>

        {/* Results */}
        <FlatList
          data={filteredVendors}
          keyExtractor={(item) => item.id}
          renderItem={renderVendorCard}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                No vendors found matching your criteria
              </Text>
              <TouchableOpacity
                style={styles.modifySearchButton}
                onPress={handleSearchInfoPress}
                activeOpacity={0.8}
              >
                <Text style={styles.modifySearchText}>Modify Search</Text>
              </TouchableOpacity>
            </View>
          }
        />

        {/* Filter Modal */}
        <SearchResultsFilterModal
          visible={showFilters}
          onClose={() => setShowFilters(false)}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: rs(16),
    paddingVertical: rs(12),
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
  },
  backButton: {
    width: rs(32),
    height: rs(32),
    alignItems: "center",
    justifyContent: "center",
  },
  searchInfo: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#D4D4D4",
    borderWidth: 1,
    borderRadius: rs(24),
    paddingVertical: rs(8),
    paddingHorizontal: rs(16),
    marginHorizontal: rs(12),
    gap: rs(2),
  },
  searchLocation: {
    fontFamily: "Inter",
    fontWeight: "500",
    fontSize: rf(14),
    lineHeight: getLineHeight(rf(14), 1.43),
    color: "#1F2024",
  },
  searchDetails: {
    fontFamily: "Inter",
    fontWeight: "500",
    fontSize: rf(10),
    lineHeight: getLineHeight(rf(10), 1.4),
    letterSpacing: rf(10) * 0.015,
    color: "#8F9098",
  },
  filterButton: {
    width: rs(32),
    height: rs(32),
    alignItems: "center",
    justifyContent: "center",
  },
  listContent: {
    paddingTop: rs(12),
    paddingBottom: rs(20),
  },
  cardContainer: {
    paddingHorizontal: rs(16),
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: rs(100),
    paddingHorizontal: rs(32),
  },
  emptyText: {
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    fontWeight: "500",
    fontSize: rf(16),
    lineHeight: getLineHeight(rf(16), 1.2),
    color: "#71727A",
    textAlign: "center",
    marginBottom: rs(24),
  },
  modifySearchButton: {
    paddingVertical: rs(12),
    paddingHorizontal: rs(24),
    backgroundColor: "#7B1513",
    borderRadius: rs(12),
  },
  modifySearchText: {
    fontFamily: "Inter",
    fontWeight: "600",
    fontSize: rf(14),
    lineHeight: getLineHeight(rf(14), 1.21),
    color: "#FFFFFF",
  },
});
