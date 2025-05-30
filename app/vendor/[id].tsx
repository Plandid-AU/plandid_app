import { SuperlikeButton } from "@/components/SuperlikeButton";
import { getLineHeight, rf, rh, rs } from "@/constants/Responsive";
import { mockChats } from "@/data/mockChats";
import { mockVendors } from "@/data/mockData";
import { useFavoritesStore } from "@/stores/favoritesStore";
import { useUserStore } from "@/stores/userStore";
import { Vendor } from "@/types";
import { Chat } from "@/types/chat";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const IMAGE_HEIGHT = rh(342);

export default function VendorDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const vendor = mockVendors.find((v) => v.id === id) as Vendor;
  const { loadFavorites } = useFavoritesStore();
  const { user, loadUser } = useUserStore();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [expandedReviews, setExpandedReviews] = useState<string[]>([]);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [imageLoadingStates, setImageLoadingStates] = useState<{
    [key: string]: boolean;
  }>({});
  const [imageErrorStates, setImageErrorStates] = useState<{
    [key: string]: boolean;
  }>({});

  // Load favorites and user data when component mounts
  useEffect(() => {
    loadFavorites();
    loadUser("current-user");
  }, [loadFavorites, loadUser]);

  if (!vendor) {
    return null;
  }

  const hasWeddingDate = !!user?.weddingDate;
  const isAvailableOnDate =
    hasWeddingDate &&
    vendor.availability?.some((date) => {
      if (!user?.weddingDate) return false;
      const userDate =
        typeof user.weddingDate === "string"
          ? new Date(user.weddingDate)
          : user.weddingDate;
      return (
        userDate instanceof Date &&
        !isNaN(userDate.getTime()) &&
        date.getTime() === userDate.getTime()
      );
    });

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / SCREEN_WIDTH);
    setCurrentImageIndex(index);
  };

  const handleMainScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    setIsScrolled(scrollY > 50);
  };

  const handleInstantQuote = () => {
    Alert.alert("Instant Quote", "Instant quote feature coming soon!");
  };

  const handleMessage = () => {
    // Check if user has already messaged this vendor
    const existingChat = mockChats.find(
      (chat: Chat) => chat.vendorId === vendor.id
    );

    if (existingChat) {
      // Redirect to existing chat
      router.push(`/chat/${existingChat.id}`);
    } else {
      // Start new messaging flow
      router.push({
        pathname: "/messaging/[vendorId]",
        params: { vendorId: vendor.id },
      });
    }
  };

  const toggleReviewExpanded = (reviewId: string) => {
    setExpandedReviews((prev) =>
      prev.includes(reviewId)
        ? prev.filter((id) => id !== reviewId)
        : [...prev, reviewId]
    );
  };

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

  const renderImageWithFallback = (
    image: any,
    style: any,
    imageId?: string
  ) => {
    const id = imageId || image.id;
    const isLoading = imageLoadingStates[id];
    const hasError = imageErrorStates[id];

    if (hasError) {
      return (
        <View style={[style, styles.errorContainer]}>
          <Ionicons name="image-outline" size={rf(50)} color="#999" />
          <Text style={styles.errorText}>Image failed to load</Text>
          {isLoading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#7B1513" />
            </View>
          )}
        </View>
      );
    }

    return (
      <View style={{ position: "relative" }}>
        <Image
          key={`${id}_${image.url || image.imageUrl}`}
          source={{
            uri: image.url || image.imageUrl,
            cache: "reload",
          }}
          style={style}
          resizeMode="cover"
          onLoadStart={() => handleImageLoadStart(id)}
          onLoad={() => handleImageLoad(id)}
          onError={() => handleImageError(id)}
        />
        {isLoading && (
          <View
            style={[
              styles.loadingOverlay,
              { position: "absolute", top: 0, left: 0, right: 0, bottom: 0 },
            ]}
          >
            <ActivityIndicator size="large" color="#7B1513" />
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle={isScrolled ? "dark-content" : "light-content"} />

      {/* Status Bar Background */}
      {isScrolled && <View style={styles.statusBarBackground} />}

      <ScrollView
        showsVerticalScrollIndicator={false}
        bounces={false}
        onScroll={handleMainScroll}
        scrollEventThrottle={16}
      >
        {/* Header Image Section */}
        <View style={styles.headerContainer}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
          >
            {vendor.images.map((image) => (
              <View key={image.id}>
                {renderImageWithFallback(image, styles.headerImage, image.id)}
              </View>
            ))}
          </ScrollView>

          {/* Gradient Overlay */}
          <LinearGradient
            colors={["#000000", "transparent"]}
            style={styles.gradient}
            pointerEvents="none"
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

        {/* Content Section */}
        <View style={styles.contentContainer}>
          {/* Vendor Info */}
          <View style={styles.section}>
            <Text style={styles.vendorName}>{vendor.name}</Text>
            <Text style={styles.vendorSubtitle}>
              Photographer based in {vendor.location}
            </Text>

            <View style={styles.ratingRow}>
              <Ionicons name="star" size={rf(12)} color="#000000" />
              <Text style={styles.ratingText}>
                {vendor.rating} • {vendor.reviewCount} Reviews
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Availability Section */}
          {hasWeddingDate && (
            <>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Confirmed Availability</Text>
                <Text style={styles.availabilityText}>
                  {isAvailableOnDate
                    ? `${vendor.name} is available on your wedding day!\n${
                        user?.weddingDate
                          ? (() => {
                              const date =
                                typeof user.weddingDate === "string"
                                  ? new Date(user.weddingDate)
                                  : user.weddingDate;
                              return date instanceof Date &&
                                !isNaN(date.getTime())
                                ? date.toLocaleDateString("en-US", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  })
                                : "";
                            })()
                          : ""
                      }`
                    : `${vendor.name} is not available on your wedding date`}
                </Text>
              </View>
              <View style={styles.divider} />
            </>
          )}

          {/* Style Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeaderLeft}>
              <Text style={styles.sectionTitle}>Explore my style</Text>
              <Ionicons name="chevron-forward" size={rf(14)} color="#000000" />
            </View>

            {vendor.styles.map((style) => (
              <TouchableOpacity key={style.id} style={styles.styleCard}>
                {renderImageWithFallback(style, styles.styleImage, style.id)}
                <View style={styles.styleInfo}>
                  <Text style={styles.styleTitle}>{style.name}</Text>
                  <Text style={styles.styleDescription}>
                    {style.description}
                  </Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={rf(14)}
                  color="#000000"
                />
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.divider} />

          {/* Profile Description Section */}
          <View style={styles.section}>
            {/* View Full Portfolio Button */}
            <View style={styles.portfolioButtonContainer}>
              <TouchableOpacity style={styles.portfolioButton}>
                <Text style={styles.portfolioButtonText}>
                  View Full Portfolio
                </Text>
                <Ionicons
                  name="chevron-forward"
                  size={rf(14)}
                  color="#000000"
                />
              </TouchableOpacity>
            </View>

            {/* Profile Section */}
            <View style={styles.profileSection}>
              <View style={styles.profileImageContainer}>
                {renderImageWithFallback(
                  vendor.images[0],
                  styles.portfolioImage,
                  `portfolio_${vendor.images[0]?.id}`
                )}
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.portfolioTitle}>{vendor.name}</Text>
                <Text style={styles.portfolioTagline}>{vendor.tagline}</Text>
              </View>
            </View>

            {/* Description */}
            <Text
              style={styles.descriptionText}
              numberOfLines={showFullDescription ? undefined : 4}
            >
              {vendor.description}
            </Text>
            <TouchableOpacity
              style={styles.showMoreButton}
              onPress={() => setShowFullDescription(!showFullDescription)}
            >
              <Text style={styles.showMoreText}>
                {showFullDescription ? "Show Less" : "Show More"}
              </Text>
              <Ionicons
                name={showFullDescription ? "chevron-up" : "chevron-down"}
                size={rf(10)}
                color="#000000"
              />
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          {/* Delivery Time Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitleLarge}>Delivery Time</Text>
            <View style={styles.deliveryRow}>
              <Ionicons name="send" size={rf(18)} color="#000000" />
              <View style={styles.deliveryTextContainer}>
                <Text style={styles.deliveryText}>{vendor.deliveryTime}</Text>
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Offerings Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitleLarge}>Offerings</Text>
            <View style={styles.tagsContainer}>
              {vendor.services.map((service, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{service}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.divider} />

          {/* Reviews Section */}
          <View style={styles.section}>
            <View style={styles.reviewsHeader}>
              <Ionicons name="star" size={rf(16)} color="#000000" />
              <Text style={styles.reviewsTitle}>
                {vendor.rating} • {vendor.reviewCount} Reviews
              </Text>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.reviewsContainer}
            >
              {vendor.reviews.map((review) => (
                <View key={review.id} style={styles.reviewCard}>
                  <View style={styles.reviewHeader}>
                    <View style={styles.reviewUserInfo}>
                      <Text style={styles.reviewUserName}>
                        {review.userName}
                      </Text>
                      <View style={styles.reviewStars}>
                        {[...Array(5)].map((_, i) => (
                          <Ionicons
                            key={i}
                            name="star"
                            size={rf(12)}
                            color="#000000"
                          />
                        ))}
                      </View>
                    </View>
                    {review.userImage &&
                      renderImageWithFallback(
                        { url: review.userImage },
                        styles.reviewUserImage,
                        `review_${review.id}`
                      )}
                  </View>

                  <Text
                    style={styles.reviewText}
                    numberOfLines={
                      expandedReviews.includes(review.id) ? undefined : 3
                    }
                  >
                    {review.text}
                  </Text>

                  <TouchableOpacity
                    style={styles.showMoreButton}
                    onPress={() => toggleReviewExpanded(review.id)}
                  >
                    <Text style={styles.showMoreText}>
                      {expandedReviews.includes(review.id)
                        ? "Show Less"
                        : "Show More"}
                    </Text>
                    <Ionicons
                      name={
                        expandedReviews.includes(review.id)
                          ? "chevron-up"
                          : "chevron-down"
                      }
                      size={rf(10)}
                      color="#000000"
                    />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </ScrollView>

      {/* Persistent Navigation Bar */}
      <View style={[styles.navBar, isScrolled && styles.navBarScrolled]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={[styles.navButton, !isScrolled && styles.navButtonWithBg]}
        >
          <Ionicons
            name="chevron-back"
            size={rf(20)}
            color={isScrolled ? "#000000" : "#000000"}
          />
        </TouchableOpacity>

        <View style={styles.navRightButtons}>
          <View
            style={[styles.navButton, !isScrolled && styles.navButtonWithBg]}
          >
            <SuperlikeButton
              vendorId={vendor.id}
              iconSize={rf(22)}
              iconColor={isScrolled ? "#000000" : "#000000"}
            />
          </View>
          <TouchableOpacity
            style={[styles.navButton, !isScrolled && styles.navButtonWithBg]}
          >
            <Ionicons
              name="share-outline"
              size={rf(24)}
              color={isScrolled ? "#000000" : "#000000"}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom CTA Buttons */}
      <View style={styles.ctaContainer}>
        <TouchableOpacity
          style={styles.ctaButtonSecondary}
          onPress={handleInstantQuote}
        >
          <Text style={styles.ctaButtonSecondaryText}>Instant Quote</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.ctaButtonPrimary}
          onPress={handleMessage}
        >
          <Text style={styles.ctaButtonPrimaryText}>Message</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  headerContainer: {
    height: IMAGE_HEIGHT,
    position: "relative",
  },
  headerImage: {
    width: SCREEN_WIDTH,
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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
  gradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: IMAGE_HEIGHT,
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
    width: rs(6),
    height: rs(6),
    borderRadius: rs(3),
  },
  paginationDotActive: {
    backgroundColor: "#FFFFFF",
  },
  paginationDotInactive: {
    backgroundColor: "#DDDDDD",
  },
  contentContainer: {
    backgroundColor: "#FFFFFF",
  },
  section: {
    paddingHorizontal: rs(24),
    paddingVertical: rs(12),
  },
  vendorName: {
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    fontWeight: "800",
    fontSize: rf(24),
    lineHeight: getLineHeight(rf(24), 1.2),
    letterSpacing: 0.24,
    color: "#000000",
    textAlign: "center",
  },
  vendorSubtitle: {
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    fontWeight: "500",
    fontSize: rf(12),
    lineHeight: getLineHeight(rf(12), 1.33),
    letterSpacing: 0.12,
    color: "#A0A0A0",
    textAlign: "center",
  },
  ratingRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: rs(4),
    marginTop: rs(4),
  },
  ratingText: {
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    fontWeight: "500",
    fontSize: rf(14),
    lineHeight: getLineHeight(rf(14), 1.43),
    color: "#252525",
  },
  divider: {
    height: 0.5,
    backgroundColor: "#D4D6DD",
    marginHorizontal: rs(24),
  },
  sectionTitle: {
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    fontWeight: "700",
    fontSize: rf(12),
    lineHeight: getLineHeight(rf(12), 1.2),
    color: "#000000",
    textAlign: "center",
  },
  sectionTitleLeft: {
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    fontWeight: "700",
    fontSize: rf(12),
    lineHeight: getLineHeight(rf(12), 1.2),
    color: "#000000",
    textAlign: "left",
  },
  availabilityText: {
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    fontWeight: "500",
    fontSize: rf(12),
    lineHeight: getLineHeight(rf(12), 1.33),
    letterSpacing: 0.12,
    color: "#000000",
    textAlign: "center",
    marginTop: rs(4),
  },
  sectionHeaderLeft: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: rs(4),
    marginBottom: rs(10),
  },
  styleCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: rs(10),
    paddingVertical: rs(9),
    paddingHorizontal: rs(12),
  },
  styleImage: {
    width: rs(48),
    height: rs(48),
    borderRadius: rs(8),
    backgroundColor: "#D9D9D9",
  },
  styleInfo: {
    flex: 1,
  },
  styleTitle: {
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    fontWeight: "700",
    fontSize: rf(12),
    lineHeight: getLineHeight(rf(12), 1.2),
    color: "#000000",
  },
  styleDescription: {
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    fontWeight: "500",
    fontSize: rf(12),
    lineHeight: getLineHeight(rf(12), 1.33),
    letterSpacing: 0.12,
    color: "#000000",
  },
  portfolioCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: rs(16),
    flex: 1,
  },
  portfolioImage: {
    width: rs(64),
    height: rs(64),
    borderRadius: rs(32),
    backgroundColor: "#D9D9D9",
  },
  portfolioInfo: {
    flex: 1,
  },
  portfolioTitle: {
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    fontWeight: "700",
    fontSize: rf(12),
    lineHeight: getLineHeight(rf(12), 1.2),
    color: "#000000",
  },
  portfolioTagline: {
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    fontWeight: "500",
    fontSize: rf(12),
    lineHeight: getLineHeight(rf(12), 1.33),
    letterSpacing: 0.12,
    color: "#000000",
  },
  portfolioButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: rs(4),
  },
  portfolioButtonText: {
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    fontWeight: "700",
    fontSize: rf(12),
    lineHeight: getLineHeight(rf(12), 1.2),
    color: "#000000",
  },
  descriptionText: {
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    fontWeight: "500",
    fontSize: rf(12),
    lineHeight: getLineHeight(rf(12), 1.33),
    letterSpacing: 0.12,
    color: "#000000",
    marginTop: rs(8),
  },
  showMoreButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: rs(4),
    marginTop: rs(8),
  },
  showMoreText: {
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    fontWeight: "700",
    fontSize: rf(12),
    lineHeight: getLineHeight(rf(12), 1.2),
    color: "#000000",
  },
  deliveryRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: rs(12),
    marginTop: rs(12),
  },
  deliveryText: {
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    fontWeight: "500",
    fontSize: rf(12),
    lineHeight: getLineHeight(rf(12), 1.33),
    letterSpacing: 0.12,
    color: "#000000",
  },
  deliveryTextContainer: {
    flex: 1,
    maxWidth: rs(250),
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: rs(12),
    marginTop: rs(12),
  },
  tag: {
    backgroundColor: "#EBEBEB",
    paddingVertical: rs(6),
    paddingHorizontal: rs(12),
    borderRadius: rs(12),
  },
  tagText: {
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    fontWeight: "700",
    fontSize: rf(12),
    lineHeight: getLineHeight(rf(12), 1.2),
    color: "#1F2024",
  },
  reviewsHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: rs(4),
    marginBottom: rs(12),
  },
  reviewsTitle: {
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    fontWeight: "800",
    fontSize: rf(16),
    lineHeight: getLineHeight(rf(16), 1.2),
    letterSpacing: 0.08,
    color: "#252525",
  },
  reviewsContainer: {
    gap: rs(12),
    paddingRight: rs(24),
  },
  reviewCard: {
    backgroundColor: "#EBEBEB",
    padding: rs(16),
    borderRadius: rs(16),
    width: rs(220),
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: rs(16),
  },
  reviewUserInfo: {
    flex: 1,
  },
  reviewUserName: {
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    fontWeight: "700",
    fontSize: rf(14),
    lineHeight: getLineHeight(rf(14), 1.2),
    color: "#1F2024",
  },
  reviewStars: {
    flexDirection: "row",
    gap: rs(1),
    marginTop: rs(4),
  },
  reviewUserImage: {
    width: rs(18),
    height: rs(18),
    borderRadius: rs(9),
  },
  reviewText: {
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    fontWeight: "500",
    fontSize: rf(12),
    lineHeight: getLineHeight(rf(12), 1.33),
    letterSpacing: 0.12,
    color: "#494A50",
  },
  ctaContainer: {
    flexDirection: "row",
    gap: rs(14),
    paddingBottom: rs(22),
    paddingTop: rs(10),
    paddingHorizontal: rs(24),
    borderTopWidth: 1,
    borderTopColor: "#D9D9D9",
    backgroundColor: "#FFFFFF",
  },
  ctaButtonSecondary: {
    flex: 1,
    height: rh(40),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: rs(12),
    borderWidth: 1.5,
    borderColor: "#7B1513",
  },
  ctaButtonSecondaryText: {
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    fontWeight: "600",
    fontSize: rf(12),
    lineHeight: getLineHeight(rf(12), 1.21),
    color: "#7B1513",
  },
  ctaButtonPrimary: {
    flex: 1,
    height: rh(40),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: rs(12),
    backgroundColor: "#7B1513",
  },
  ctaButtonPrimaryText: {
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    fontWeight: "600",
    fontSize: rf(12),
    lineHeight: getLineHeight(rf(12), 1.21),
    color: "#FFFFFF",
  },
  navBar: {
    position: "absolute",
    top: StatusBar.currentHeight || (Platform.OS === "ios" ? rh(44) : 0),
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: rs(24),
    height: rh(56),
    zIndex: 1000,
  },
  navBarScrolled: {
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 0.5,
    borderBottomColor: "rgba(0, 0, 0, 0.1)",
  },
  navButton: {
    width: rs(40),
    height: rs(40),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: rs(20),
  },
  navButtonWithBg: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  navRightButtons: {
    flexDirection: "row",
    gap: rs(10),
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: rs(16),
    marginBottom: rs(16),
  },
  profileImageContainer: {
    width: rs(64),
    height: rs(64),
    borderRadius: rs(32),
    backgroundColor: "#D9D9D9",
  },
  profileInfo: {
    flex: 1,
  },
  sectionTitleLarge: {
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    fontWeight: "800",
    fontSize: rf(16),
    lineHeight: getLineHeight(rf(16), 1.2),
    letterSpacing: 0.08,
    color: "#252525",
  },
  portfolioButtonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: rs(10),
  },
  statusBarBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: StatusBar.currentHeight || (Platform.OS === "ios" ? rh(44) : 0),
    backgroundColor: "#FFFFFF",
    zIndex: 999,
  },
});
