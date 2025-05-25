import { RecentSearchItem } from "@/components/search/RecentSearchItem";
import { SearchFilterModal } from "@/components/search/SearchFilterModal";
import { getLineHeight, rf, rs } from "@/constants/Responsive";
import { RecentSearch, useSearchStore } from "@/stores/searchStore";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function SearchScreen() {
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showDateModal, setShowDateModal] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  // Get search state from store
  const {
    location,
    date,
    service,
    recentSearches,
    setLocation,
    setDate,
    setService,
    clearAll,
  } = useSearchStore();

  useEffect(() => {
    // Animate in on mount
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
  }, []);

  const handleBack = () => {
    router.back();
  };

  const handleSearch = () => {
    // Navigate to search results
    router.push({
      pathname: "/search/results",
      params: {
        location: location || "Flexible",
        date: date || "I'm not sure",
        service: service || "All",
      },
    });
  };

  const handleRecentSearchPress = (search: RecentSearch) => {
    setLocation(search.location);
    setDate(search.date);
    setService(search.service);
    handleSearch();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="chevron-back" size={rf(18)} color="#7B1513" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Search</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Search Filters */}
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Wedding Location */}
          <TouchableOpacity
            style={styles.filterItem}
            onPress={() => setShowLocationModal(true)}
            activeOpacity={0.7}
          >
            <Text style={styles.filterLabel}>Wedding Location</Text>
            <Text style={styles.filterValue}>{location || "Flexible"}</Text>
          </TouchableOpacity>

          {/* Wedding Date */}
          <TouchableOpacity
            style={styles.filterItem}
            onPress={() => setShowDateModal(true)}
            activeOpacity={0.7}
          >
            <Text style={styles.filterLabel}>Wedding Date</Text>
            <Text style={styles.filterValue}>{date || "I'm not sure"}</Text>
          </TouchableOpacity>

          {/* Service */}
          <TouchableOpacity
            style={styles.filterItem}
            onPress={() => setShowServiceModal(true)}
            activeOpacity={0.7}
          >
            <Text style={styles.filterLabel}>Service</Text>
            <Text style={styles.filterValue}>{service || "Photographer"}</Text>
          </TouchableOpacity>

          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <View style={styles.recentSearchesContainer}>
              <Text style={styles.recentSearchesTitle}>Recent Searches</Text>
              {recentSearches.map((search, index) => (
                <RecentSearchItem
                  key={search.id}
                  search={search}
                  onPress={() => handleRecentSearchPress(search)}
                />
              ))}
            </View>
          )}
        </ScrollView>

        {/* Bottom Bar */}
        <View style={styles.bottomBar}>
          <TouchableOpacity onPress={clearAll} activeOpacity={0.7}>
            <Text style={styles.clearAllText}>Clear All</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.searchButton}
            onPress={handleSearch}
            activeOpacity={0.8}
          >
            <Ionicons name="search" size={rf(12)} color="#FFFFFF" />
            <Text style={styles.searchButtonText}>Search</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Modals */}
      <SearchFilterModal
        visible={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        type="location"
        value={location}
        onSelect={setLocation}
      />
      <SearchFilterModal
        visible={showDateModal}
        onClose={() => setShowDateModal(false)}
        type="date"
        value={date}
        onSelect={setDate}
      />
      <SearchFilterModal
        visible={showServiceModal}
        onClose={() => setShowServiceModal(false)}
        type="service"
        value={service}
        onSelect={setService}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: rs(24),
    paddingTop: rs(12),
    paddingBottom: rs(24),
  },
  backButton: {
    width: rs(18),
    height: rs(18),
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontFamily: "Inter",
    fontWeight: "600",
    fontSize: rf(18),
    lineHeight: getLineHeight(rf(18), 1.2),
    color: "#1F2024",
  },
  headerSpacer: {
    width: rs(18),
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: rs(24),
    paddingBottom: rs(24),
  },
  filterItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: rs(28),
    paddingHorizontal: rs(24),
    marginBottom: rs(16),
    backgroundColor: "#FFFFFF",
    borderRadius: rs(16),
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.08)",
  },
  filterLabel: {
    fontFamily: "Inter",
    fontWeight: "700",
    fontSize: rf(14),
    lineHeight: getLineHeight(rf(14), 1.14),
    color: "#1F2024",
  },
  filterValue: {
    fontFamily: "Inter",
    fontWeight: "600",
    fontSize: rf(14),
    lineHeight: getLineHeight(rf(14), 1.14),
    color: "#1F2024",
    textAlign: "right",
  },
  recentSearchesContainer: {
    marginTop: rs(8),
  },
  recentSearchesTitle: {
    fontFamily: "Inter",
    fontWeight: "700",
    fontSize: rf(14),
    lineHeight: getLineHeight(rf(14), 1.14),
    color: "#1F2024",
    marginBottom: rs(8),
  },
  bottomBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: rs(24),
    paddingVertical: rs(16),
    borderTopWidth: 1,
    borderTopColor: "rgba(0, 0, 0, 0.16)",
    borderBottomLeftRadius: rs(28),
    borderBottomRightRadius: rs(28),
  },
  clearAllText: {
    fontFamily: "Inter",
    fontWeight: "600",
    fontSize: rf(16),
    lineHeight: getLineHeight(rf(16), 1.03),
    color: "#252525",
  },
  searchButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: rs(8),
    paddingVertical: rs(12),
    paddingHorizontal: rs(16),
    backgroundColor: "#7B1513",
    borderRadius: rs(12),
    minHeight: rs(40),
  },
  searchButtonText: {
    fontFamily: "Inter",
    fontWeight: "700",
    fontSize: rf(12),
    lineHeight: getLineHeight(rf(12), 1.21),
    color: "#FFFFFF",
  },
});
