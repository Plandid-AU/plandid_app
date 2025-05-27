import { VendorCard } from "@/components/VendorCard";
import { getLineHeight, rf, rs } from "@/constants/Responsive";
import { mockVendors } from "@/data/mockData";
import { useFavoritesStore } from "@/stores/favoritesStore";
import { Vendor } from "@/types";
import { router } from "expo-router";
import React, { useEffect } from "react";
import {
  FlatList,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function FavouritesScreen() {
  const { favoriteVendors, loadFavorites, loadUserPreferences } =
    useFavoritesStore();

  useEffect(() => {
    loadFavorites();
    loadUserPreferences();
  }, [loadFavorites, loadUserPreferences]);

  // Get favorite vendor objects
  const favoriteVendorObjects = mockVendors.filter((vendor) =>
    favoriteVendors.includes(vendor.id)
  );

  const handleVendorPress = (vendorId: string) => {
    router.push({
      pathname: "/vendor/[id]",
      params: { id: vendorId },
    });
  };

  const renderVendorCard = ({ item }: { item: Vendor }) => (
    <View style={styles.cardContainer}>
      <VendorCard vendor={item} onPress={() => handleVendorPress(item.id)} />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Favourites</Text>
      </View>

      {favoriteVendorObjects.length > 0 ? (
        <FlatList
          data={favoriteVendorObjects}
          keyExtractor={(item) => item.id}
          renderItem={renderVendorCard}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContent}>
          <Text style={styles.subtitle}>
            Your favourite vendors will appear here
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    paddingHorizontal: rs(24),
    paddingVertical: rs(16),
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
  },
  title: {
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    fontWeight: "800",
    fontSize: rf(24),
    lineHeight: getLineHeight(rf(24), 1.2),
    color: "#000000",
  },
  listContent: {
    paddingTop: rs(12),
    paddingBottom: rs(20),
  },
  cardContainer: {
    paddingHorizontal: rs(16),
  },
  emptyContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: rs(20),
  },
  subtitle: {
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    fontWeight: "500",
    fontSize: rf(16),
    lineHeight: getLineHeight(rf(16), 1.375),
    color: "#71727A",
    textAlign: "center",
  },
});
