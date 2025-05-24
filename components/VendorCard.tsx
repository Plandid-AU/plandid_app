import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useRef, useState } from "react";
import {
  Dimensions,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Vendor } from "../types";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = SCREEN_WIDTH - 32;
const IMAGE_HEIGHT = 323;

interface VendorCardProps {
  vendor: Vendor;
  onPress: () => void;
  onFavoritePress: (vendorId: string) => void;
  isFavorited?: boolean;
}

export const VendorCard: React.FC<VendorCardProps> = ({
  vendor,
  onPress,
  onFavoritePress,
  isFavorited = false,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / CARD_WIDTH);
    setCurrentImageIndex(index);
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.95}
    >
      {/* Image Section */}
      <View style={styles.imageContainer}>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          {vendor.images.map((image) => (
            <Image
              key={image.id}
              source={{ uri: image.url }}
              style={styles.image}
              resizeMode="cover"
            />
          ))}
        </ScrollView>

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
            onFavoritePress(vendor.id);
          }}
        >
          <View style={styles.heartIconContainer}>
            <Ionicons
              name={isFavorited ? "heart" : "heart-outline"}
              size={22}
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
                  index === 3 && styles.paginationDotSmall,
                  index === 4 && styles.paginationDotExtraSmall,
                ]}
              />
            ))}
          </View>
        )}
      </View>

      {/* Info Section */}
      <View style={styles.infoContainer}>
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
              <Ionicons name="star" size={14} color="#000000" />
              <Text style={styles.ratingText}>{vendor.rating.toFixed(2)}</Text>
            </View>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Features */}
          <View style={styles.featuresRow}>
            {vendor.hasInstantQuote && (
              <View style={styles.feature}>
                <Ionicons name="flash" size={14} color="#7B1513" />
                <Text style={styles.featureText}>Instant Quote</Text>
              </View>
            )}
            {vendor.hasAvailability && (
              <View style={styles.feature}>
                <Ionicons name="checkmark-circle" size={14} color="#7B1513" />
                <Text style={styles.featureText}>Availability Listed</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#D9D9D9",
  },
  imageContainer: {
    height: IMAGE_HEIGHT,
    position: "relative",
  },
  image: {
    width: CARD_WIDTH,
    height: IMAGE_HEIGHT,
  },
  gradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 80,
  },
  heartButton: {
    position: "absolute",
    top: 12,
    right: 16,
    zIndex: 1,
  },
  heartIconContainer: {
    width: 24,
    height: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  heartIcon: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 2,
  },
  pagination: {
    position: "absolute",
    bottom: 18,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  paginationDot: {
    borderRadius: 3,
  },
  paginationDotActive: {
    width: 6,
    height: 6,
    backgroundColor: "#FFFFFF",
  },
  paginationDotInactive: {
    width: 6,
    height: 6,
    backgroundColor: "#DDDDDD",
  },
  paginationDotSmall: {
    width: 5,
    height: 5,
  },
  paginationDotExtraSmall: {
    width: 4,
    height: 4,
  },
  infoContainer: {
    padding: 12,
    paddingHorizontal: 18,
  },
  infoContent: {
    gap: 8,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 19,
  },
  vendorInfo: {
    flex: 1,
    gap: 6,
  },
  vendorHeader: {
    gap: 2,
  },
  vendorName: {
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    fontWeight: "800",
    fontSize: 16,
    lineHeight: 19.2,
    letterSpacing: 0.08,
    color: "#252525",
  },
  vendorLocation: {
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    fontWeight: "500",
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.12,
    color: "#717171",
  },
  vendorTagline: {
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    fontWeight: "500",
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.12,
    color: "#000000",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    height: 19,
  },
  ratingText: {
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    fontWeight: "500",
    fontSize: 16,
    lineHeight: 22,
    color: "#252525",
  },
  divider: {
    height: 0.5,
    backgroundColor: "#D4D6DD",
    marginVertical: 0,
  },
  featuresRow: {
    flexDirection: "row",
    gap: 12,
  },
  feature: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  featureText: {
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    fontWeight: "700",
    fontSize: 14,
    lineHeight: 16.8,
    color: "#252525",
  },
});
