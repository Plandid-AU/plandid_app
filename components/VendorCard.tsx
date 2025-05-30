import { SuperlikeButton } from "@/components/SuperlikeButton";
import { ThemedText } from "@/components/ThemedText";
import { rf, rh, rs } from "@/constants/Responsive";
import { useTheme } from "@/hooks/useTheme";
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

const createStyles = (theme: any) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.colors.backgroundPrimary,
      borderRadius: theme.borderRadius.xl,
      overflow: "hidden",
      marginBottom: theme.spacing["2xl"],
      borderWidth: 1,
      borderColor: theme.colors.borderLight,
      ...theme.shadows.base,
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
      backgroundColor: theme.colors.gray50,
      justifyContent: "center",
      alignItems: "center",
    },
    errorText: {
      color: theme.colors.gray800,
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
      backgroundColor: theme.colors.backgroundOverlay,
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
      ...theme.shadows.text,
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
      backgroundColor: theme.colors.white,
    },
    paginationDotInactive: {
      width: rs(6),
      height: rs(6),
      backgroundColor: theme.colors.gray300,
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
    ratingContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: rs(4),
      height: rh(19),
    },
    divider: {
      ...theme.components.divider,
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
  });

export const VendorCard: React.FC<VendorCardProps> = ({ vendor, onPress }) => {
  const theme = useTheme();
  const styles = createStyles(theme);
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
                <Ionicons
                  name="image-outline"
                  size={rf(50)}
                  color={theme.colors.gray800}
                />
                <Text style={styles.errorText}>Image failed to load</Text>
              </View>
            )}
            {isLoading && (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
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

        {/* Superlike Button */}
        <SuperlikeButton
          vendorId={vendor.id}
          style={styles.heartButton}
          iconSize={rf(22)}
          iconColor="#FFFAFC"
          onPress={(e?: any) => {
            e?.stopPropagation?.();
          }}
        />

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
                <ThemedText type="vendorName">{vendor.name}</ThemedText>
                <ThemedText type="vendorLocation">{vendor.location}</ThemedText>
              </View>
              <ThemedText type="vendorTagline">{vendor.tagline}</ThemedText>
            </View>

            {/* Rating */}
            <View style={styles.ratingContainer}>
              <Ionicons
                name="star"
                size={rf(14)}
                color={theme.colors.textPrimary}
              />
              <ThemedText type="rating">{vendor.rating.toFixed(2)}</ThemedText>
            </View>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Features */}
          <View style={styles.featuresRow}>
            {vendor.hasInstantQuote && (
              <View style={styles.feature}>
                <Ionicons
                  name="flash"
                  size={rf(14)}
                  color={theme.colors.primary}
                />
                <ThemedText type="feature">Instant Quote</ThemedText>
              </View>
            )}
            {vendor.hasAvailability && (
              <View style={styles.feature}>
                <Ionicons
                  name="checkmark-circle"
                  size={rf(14)}
                  color={theme.colors.primary}
                />
                <ThemedText type="feature">Availability Listed</ThemedText>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};
