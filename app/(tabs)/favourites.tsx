import { FavouritesEmptyState } from "@/components/FavouritesEmptyState";
import { FavouritesTab, FavouritesTabs } from "@/components/FavouritesTabs";
import { FavouritesVendorCard } from "@/components/FavouritesVendorCard";
import { ThemedText } from "@/components/ThemedText";
import { VendorOptionsModal } from "@/components/VendorOptionsModal";
import { rs } from "@/constants/Responsive";
import { mockVendors } from "@/data/mockData";
import { useTheme } from "@/hooks/useTheme";
import { useFavoritesStore } from "@/stores/favoritesStore";
import { Vendor } from "@/types";
import { router } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Animated,
  FlatList,
  SafeAreaView,
  StyleSheet,
  View,
} from "react-native";
import { ShareModal } from "../../components/ShareModal";

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.backgroundPrimary,
    },
    header: {
      paddingHorizontal: theme.spacing["5xl"],
      paddingVertical: theme.spacing["2xl"],
    },
    tabsContainer: {
      alignItems: "center",
      paddingVertical: rs(8),
    },
    listContent: {
      paddingTop: theme.spacing["5xl"],
      paddingBottom: theme.spacing["4xl"],
      paddingHorizontal: theme.spacing["5xl"],
    },
    cardContainer: {
      // No additional styling needed as animation is applied here
    },
  });

export default function FavouritesScreen() {
  const theme = useTheme();
  const styles = createStyles(theme);
  const {
    favoriteVendors,
    superlikedVendors,
    contactedVendors,
    loadFavorites,
    loadUserPreferences,
    toggleFavoriteVendor,
    toggleSuperlikeVendor,
  } = useFavoritesStore();

  const [selectedTab, setSelectedTab] = useState<FavouritesTab>(
    FavouritesTab.LIKED
  );
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  // Animation values
  const cardAnimations = useRef<{ [key: string]: Animated.Value }>({}).current;

  // FlatList ref for scroll control
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    loadFavorites();
    loadUserPreferences();
  }, [loadFavorites, loadUserPreferences]);

  // Get vendors for current tab
  const currentVendors = useMemo(() => {
    switch (selectedTab) {
      case FavouritesTab.LIKED:
        return mockVendors.filter((vendor) =>
          favoriteVendors.includes(vendor.id)
        );
      case FavouritesTab.SUPERLIKED:
        return mockVendors.filter((vendor) =>
          superlikedVendors.includes(vendor.id)
        );
      case FavouritesTab.CONTACTED:
        return mockVendors.filter((vendor) =>
          contactedVendors.includes(vendor.id)
        );
      default:
        return [];
    }
  }, [selectedTab, favoriteVendors, superlikedVendors, contactedVendors]);

  // Initialize card animations for new vendors
  useEffect(() => {
    currentVendors.forEach((vendor, index) => {
      if (!cardAnimations[vendor.id]) {
        cardAnimations[vendor.id] = new Animated.Value(0);
      }
    });
  }, [currentVendors, cardAnimations]);

  // Animate content transition when tab changes
  useEffect(() => {
    setIsTransitioning(true);

    // Scroll to top smoothly
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({
        offset: 0,
        animated: true,
      });
    }

    // Reset and animate vendor cards
    const cardAnimationPromises = currentVendors.map((vendor, index) => {
      cardAnimations[vendor.id].setValue(0);
      return Animated.timing(cardAnimations[vendor.id], {
        toValue: 1,
        duration: 250,
        delay: Math.min(index * 40, 200),
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
  }, [selectedTab, currentVendors, cardAnimations]);

  const handleVendorPress = (vendor: Vendor) => {
    router.push({
      pathname: "/vendor/[id]",
      params: { id: vendor.id },
    });
  };

  const handleMenuPress = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setShowOptionsModal(true);
  };

  const handleCloseModal = () => {
    setShowOptionsModal(false);
    setSelectedVendor(null);
  };

  const handleContact = () => {
    handleCloseModal();
    Alert.alert("Contact", "Messaging feature coming soon!");
  };

  const handleShare = async () => {
    if (!selectedVendor) return;

    handleCloseModal();
    setShowShareModal(true);
  };

  const handleMoveToSuperliked = async () => {
    if (!selectedVendor) return;

    handleCloseModal();

    try {
      await toggleSuperlikeVendor(selectedVendor.id);
      Alert.alert("Success", `${selectedVendor.name} moved to Super Liked!`);
    } catch (error) {
      console.error("Error moving to superliked:", error);
      Alert.alert("Error", "Failed to move vendor to Super Liked");
    }
  };

  const handleMoveToLiked = async () => {
    if (!selectedVendor) return;

    handleCloseModal();

    try {
      await toggleSuperlikeVendor(selectedVendor.id);
      Alert.alert("Success", `${selectedVendor.name} moved back to Liked!`);
    } catch (error) {
      console.error("Error moving to liked:", error);
      Alert.alert("Error", "Failed to move vendor to Liked");
    }
  };

  const handleRemove = async () => {
    if (!selectedVendor) return;

    Alert.alert(
      "Remove Vendor",
      `Are you sure you want to remove ${selectedVendor.name} from your favourites?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            handleCloseModal();
            try {
              await toggleFavoriteVendor(selectedVendor.id);
              Alert.alert(
                "Success",
                `${selectedVendor.name} removed from favourites`
              );
            } catch (error) {
              console.error("Error removing vendor:", error);
              Alert.alert("Error", "Failed to remove vendor");
            }
          },
        },
      ]
    );
  };

  const handleReport = () => {
    handleCloseModal();
    Alert.alert("Report Vendor", "Report feature coming soon!");
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
        <FavouritesVendorCard
          vendor={item}
          onPress={() => handleVendorPress(item)}
          onMenuPress={() => handleMenuPress(item)}
        />
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <ThemedText type="h3">My Vendors</ThemedText>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <FavouritesTabs
          selectedTab={selectedTab}
          onTabChange={setSelectedTab}
        />
      </View>

      {/* Content */}
      {currentVendors.length > 0 ? (
        <FlatList
          ref={flatListRef}
          data={currentVendors}
          keyExtractor={(item) => item.id}
          renderItem={renderVendorCard}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          scrollEnabled={!isTransitioning}
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          windowSize={10}
          initialNumToRender={8}
        />
      ) : (
        <FavouritesEmptyState tab={selectedTab} />
      )}

      {/* Options Modal */}
      <VendorOptionsModal
        visible={showOptionsModal}
        onClose={handleCloseModal}
        tab={selectedTab}
        vendorName={selectedVendor?.name || ""}
        onContact={handleContact}
        onShare={handleShare}
        onMoveToSuperliked={handleMoveToSuperliked}
        onMoveToLiked={handleMoveToLiked}
        onRemove={handleRemove}
        onReport={handleReport}
      />

      {/* Share Modal */}
      <ShareModal
        visible={showShareModal}
        onClose={() => setShowShareModal(false)}
        vendor={
          selectedVendor
            ? {
                id: selectedVendor.id,
                name: selectedVendor.name,
                location: selectedVendor.location,
                avatar: selectedVendor.images?.[0]?.url,
              }
            : undefined
        }
      />
    </SafeAreaView>
  );
}
