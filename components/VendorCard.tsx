import { getLineHeight, rf, rh, rs } from "@/constants/Responsive";
import { useFavoritesStore } from "@/stores/favoritesStore";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Vendor } from "../types";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_MARGIN = rs(32); // Responsive horizontal margin
const CARD_WIDTH = SCREEN_WIDTH - CARD_MARGIN;
const IMAGE_HEIGHT = rh(323); // Responsive image height

interface VendorCardProps {
  vendor: Vendor;
  onPress: () => void;
}

export const VendorCard: React.FC<VendorCardProps> = ({ vendor, onPress }) => {
  const { isFavorited, toggleFavoriteVendor } = useFavoritesStore();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageLoadingStates, setImageLoadingStates] = useState<{
    [key: string]: boolean;
  }>({});
  const [imageErrorStates, setImageErrorStates] = useState<{
    [key: string]: boolean;
  }>({});
  const flatListRef = useRef<FlatList>(null);

  // More responsive scroll handling with both onScroll and onMomentumScrollEnd
  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const contentOffsetX = event.nativeEvent.contentOffset.x;
      const index = Math.round(contentOffsetX / CARD_WIDTH);
      const clampedIndex = Math.max(
        0,
        Math.min(index, vendor.images.length - 1)
      );

      if (clampedIndex !== currentImageIndex) {
        setCurrentImageIndex(clampedIndex);
      }
    },
    [currentImageIndex, vendor.images.length]
  );

  const handleMomentumScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const contentOffsetX = event.nativeEvent.contentOffset.x;
      const index = Math.round(contentOffsetX / CARD_WIDTH);
      const clampedIndex = Math.max(
        0,
        Math.min(index, vendor.images.length - 1)
      );
      setCurrentImageIndex(clampedIndex);
    },
    [vendor.images.length]
  );

  const handleImageLoadStart = (imageId: string) => {
    setImageLoadingStates((prev) => ({ ...prev, [imageId]: true }));
    setImageErrorStates((prev) => ({ ...prev, [imageId]: false }));
  };

  const handleImageLoad = (imageId: string) => {
    setImageLoadingStates((prev) => ({ ...prev, [imageId]: false }));
  };

  const handleImageError = (imageId: string) => {
    console.log(`Failed to load image: ${imageId}`);
    setImageLoadingStates((prev) => ({ ...prev, [imageId]: false }));
    setImageErrorStates((prev) => ({ ...prev, [imageId]: true }));
  };

  const renderImageWithFallback = useCallback(
    ({ item }: { item: any }) => {
      const isLoading = imageLoadingStates[item.id];
      const hasError = imageErrorStates[item.id];

      return (
        <TouchableOpacity
          activeOpacity={1}
          onPress={onPress}
          style={styles.imageItem}
        >
          <View style={styles.imageWrapper}>
            {!hasError ? (
              <Image
                key={`${item.id}_${item.url}`}
                source={{
                  uri: item.url,
                  cache: "reload",
                }}
                style={styles.image}
                resizeMode="cover"
                onLoadStart={() => handleImageLoadStart(item.id)}
                onLoad={() => handleImageLoad(item.id)}
                onError={() => handleImageError(item.id)}
              />
            ) : (
              <View style={[styles.image, styles.errorContainer]}>
                <Ionicons name="image-outline" size={rf(50)} color="#999" />
                <Text style={styles.errorText}>Image failed to load</Text>
              </View>
            )}
            {isLoading && (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator size="large" color="#7B1513" />
              </View>
            )}
          </View>
        </TouchableOpacity>
      );
    },
    [imageLoadingStates, imageErrorStates, onPress]
  );

  return (
    <View style={styles.card}>
      {/* Image Section */}
      <View style={styles.imageContainer}>
        <FlatList
          ref={flatListRef}
          data={vendor.images}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          bounces={false}
          scrollEventThrottle={16}
          decelerationRate="fast"
          snapToInterval={CARD_WIDTH}
          snapToAlignment="start"
          onScroll={handleScroll}
          onMomentumScrollEnd={handleMomentumScrollEnd}
          renderItem={renderImageWithFallback}
          keyExtractor={(item) => item.id}
          getItemLayout={(_, index) => ({
            length: CARD_WIDTH,
            offset: CARD_WIDTH * index,
            index,
          })}
        />

        {/* Gradient Overlay */}
        <LinearGradient
          colors={["rgba(0,0,0,0.4)", "transparent"]}
          style={styles.gradient}
          pointerEvents="none"
        />

        {/* Heart Icon */}
        <TouchableOpacity
          style={styles.heartButton}
          onPress={(e) => {
            e.stopPropagation();
            toggleFavoriteVendor(vendor.id);
          }}
        >
          <View style={styles.heartIconContainer}>
            <Ionicons
              name={isFavorited(vendor.id) ? "heart" : "heart-outline"}
              size={rf(22)}
              color="#FFFAFC"
              style={styles.heartIcon}
            />
          </View>
        </TouchableOpacity>

        {/* Pagination Dots */}
        {vendor.images.length > 1 && (
          <View style={styles.pagination}>
            {vendor.images.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  index === currentImageIndex
                    ? styles.paginationDotActive
                    : styles.paginationDotInactive,
                ]}
              />
            ))}
          </View>
        )}
      </View>

      {/* Info Section */}
      <TouchableOpacity
        style={styles.infoContainer}
        onPress={onPress}
        activeOpacity={0.95}
      >
        <View style={styles.infoContent}>
          {/* Header Info */}
          <View style={styles.headerRow}>
            <View style={styles.vendorInfo}>
              <View style={styles.vendorHeader}>
                <Text style={styles.vendorName}>{vendor.name}</Text>
                <Text style={styles.vendorLocation}>{vendor.location}</Text>
              </View>
              <Text style={styles.vendorTagline}>{vendor.tagline}</Text>
            </View>

            {/* Rating */}
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={rf(14)} color="#000000" />
              <Text style={styles.ratingText}>{vendor.rating.toFixed(2)}</Text>
            </View>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Features */}
          <View style={styles.featuresRow}>
            {vendor.hasInstantQuote && (
              <View style={styles.feature}>
                <Ionicons name="flash" size={rf(14)} color="#7B1513" />
                <Text style={styles.featureText}>Instant Quote</Text>
              </View>
            )}
            {vendor.hasAvailability && (
              <View style={styles.feature}>
                <Ionicons
                  name="checkmark-circle"
                  size={rf(14)}
                  color="#7B1513"
                />
                <Text style={styles.featureText}>Availability Listed</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: rs(12),
    overflow: "hidden",
    marginBottom: rs(16),
    borderWidth: 1,
    borderColor: "#E5E5E5",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: rs(2),
    },
    shadowOpacity: 0.1,
    shadowRadius: rs(8),
    elevation: 3,
  },
  imageContainer: {
    height: IMAGE_HEIGHT,
    position: "relative",
  },
  imageItem: {
    width: CARD_WIDTH,
  },
  imageWrapper: {
    position: "relative",
  },
  image: {
    width: CARD_WIDTH,
    height: IMAGE_HEIGHT,
  },
  errorContainer: {
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "#999",
    fontSize: rf(12),
    marginTop: rs(8),
    textAlign: "center",
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
  gradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: rh(80),
  },
  heartButton: {
    position: "absolute",
    top: rs(12),
    right: rs(16),
    zIndex: 1,
  },
  heartIconContainer: {
    width: rs(24),
    height: rs(22),
    justifyContent: "center",
    alignItems: "center",
  },
  heartIcon: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: rs(2),
  },
  pagination: {
    position: "absolute",
    bottom: rs(18),
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: rs(6),
  },
  paginationDot: {
    borderRadius: rs(3),
  },
  paginationDotActive: {
    width: rs(6),
    height: rs(6),
    backgroundColor: "#FFFFFF",
  },
  paginationDotInactive: {
    width: rs(6),
    height: rs(6),
    backgroundColor: "#DDDDDD",
  },
  infoContainer: {
    padding: rs(12),
    paddingHorizontal: rs(18),
  },
  infoContent: {
    gap: rs(8),
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: rs(19),
  },
  vendorInfo: {
    flex: 1,
    gap: rs(6),
  },
  vendorHeader: {
    gap: rs(2),
  },
  vendorName: {
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    fontWeight: "800",
    fontSize: rf(16),
    lineHeight: getLineHeight(rf(16), 1.2),
    letterSpacing: 0.08,
    color: "#252525",
  },
  vendorLocation: {
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    fontWeight: "500",
    fontSize: rf(12),
    lineHeight: getLineHeight(rf(12), 1.33),
    letterSpacing: 0.12,
    color: "#717171",
  },
  vendorTagline: {
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    fontWeight: "500",
    fontSize: rf(12),
    lineHeight: getLineHeight(rf(12), 1.33),
    letterSpacing: 0.12,
    color: "#000000",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: rs(4),
    height: rh(19),
  },
  ratingText: {
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    fontWeight: "500",
    fontSize: rf(16),
    lineHeight: getLineHeight(rf(16), 1.375),
    color: "#252525",
  },
  divider: {
    height: 0.5,
    backgroundColor: "#D4D6DD",
    marginVertical: 0,
  },
  featuresRow: {
    flexDirection: "row",
    gap: rs(12),
  },
  feature: {
    flexDirection: "row",
    alignItems: "center",
    gap: rs(4),
  },
  featureText: {
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    fontWeight: "700",
    fontSize: rf(14),
    lineHeight: getLineHeight(rf(14), 1.2),
    color: "#252525",
  },
});
