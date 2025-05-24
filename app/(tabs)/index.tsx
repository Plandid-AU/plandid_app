import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
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
import { mockUser, mockVendors } from "@/data/mockData";
import { Vendor, VendorCategory } from "@/types";

export default function HomeScreen() {
  const [selectedCategory, setSelectedCategory] = useState<VendorCategory>(
    VendorCategory.PHOTO
  );
  const [favoriteVendors, setFavoriteVendors] = useState<string[]>(
    mockUser.favoriteVendors
  );

  // Filter vendors by selected category
  const filteredVendors = useMemo(() => {
    return mockVendors.filter((vendor) => vendor.category === selectedCategory);
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
        renderItem={({ item }) => (
          <VendorCard
            vendor={item}
            onPress={() => handleVendorPress(item)}
            onFavoritePress={handleFavoritePress}
            isFavorited={favoriteVendors.includes(item.id)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No vendors found in this category
            </Text>
          </View>
        }
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
    paddingBottom: 20,
  },
  header: {
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 100,
  },
  emptyText: {
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    fontWeight: "500",
    fontSize: 16,
    color: "#71727A",
  },
});
