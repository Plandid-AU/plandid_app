import { mockUser, mockVendors } from "@/data/mockData";
import { Vendor } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const IMAGE_HEIGHT = 342;

export default function VendorDetailsScreen() {
  const { id } = useLocalSearchParams();
  const vendor = mockVendors.find((v) => v.id === id) as Vendor;

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);
  const [expandedReviews, setExpandedReviews] = useState<string[]>([]);
  const [showFullDescription, setShowFullDescription] = useState(false);

  if (!vendor) {
    return null;
  }

  const hasWeddingDate = !!mockUser.weddingDate;
  const isAvailableOnDate =
    hasWeddingDate &&
    vendor.availability?.some(
      (date) => date.getTime() === mockUser.weddingDate?.getTime()
    );

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / SCREEN_WIDTH);
    setCurrentImageIndex(index);
  };

  const handleInstantQuote = () => {
    Alert.alert("Instant Quote", "Instant quote feature coming soon!");
  };

  const handleMessage = () => {
    Alert.alert("Message", "Messaging feature coming soon!");
  };

  const toggleReviewExpanded = (reviewId: string) => {
    setExpandedReviews((prev) =>
      prev.includes(reviewId)
        ? prev.filter((id) => id !== reviewId)
        : [...prev, reviewId]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
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
              <Image
                key={image.id}
                source={{ uri: image.url }}
                style={styles.headerImage}
                resizeMode="cover"
              />
            ))}
          </ScrollView>

          {/* Gradient Overlay */}
          <LinearGradient
            colors={["#000000", "transparent"]}
            style={styles.gradient}
            pointerEvents="none"
          />

          {/* Navigation Bar */}
          <View style={styles.navBar}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.navButton}
            >
              <Ionicons name="chevron-back" size={20} color="#7B1513" />
            </TouchableOpacity>

            <View style={styles.navRightButtons}>
              <TouchableOpacity
                style={styles.navButton}
                onPress={() => setIsFavorited(!isFavorited)}
              >
                <Ionicons
                  name={isFavorited ? "heart" : "heart-outline"}
                  size={22}
                  color="#FFFAFC"
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.navButton}>
                <Ionicons name="share-outline" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>

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
              <Ionicons name="star" size={12} color="#000000" />
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
                    ? `${
                        vendor.name
                      } is available on your wedding day!\n${mockUser.weddingDate?.toLocaleDateString(
                        "en-US",
                        { day: "numeric", month: "short", year: "numeric" }
                      )}`
                    : `${vendor.name} is not available on your wedding date`}
                </Text>
              </View>
              <View style={styles.divider} />
            </>
          )}

          {/* Style Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Explore my style</Text>
              <Ionicons name="chevron-forward" size={10} color="#7B1513" />
            </View>

            {vendor.styles.map((style) => (
              <TouchableOpacity key={style.id} style={styles.styleCard}>
                <Image
                  source={{ uri: style.imageUrl }}
                  style={styles.styleImage}
                />
                <View style={styles.styleInfo}>
                  <Text style={styles.styleTitle}>{style.name}</Text>
                  <Text style={styles.styleDescription}>
                    {style.description}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={14} color="#7B1513" />
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.divider} />

          {/* Portfolio Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>View Full Portfolio</Text>
              <Ionicons name="chevron-forward" size={10} color="#7B1513" />
            </View>

            <View style={styles.portfolioCard}>
              <Image
                source={{ uri: vendor.images[0]?.url }}
                style={styles.portfolioImage}
              />
              <View style={styles.portfolioInfo}>
                <Text style={styles.portfolioTitle}>{vendor.name}</Text>
                <Text style={styles.portfolioTagline}>{vendor.tagline}</Text>
              </View>
            </View>
          </View>

          {/* Description Section */}
          <View style={styles.descriptionSection}>
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
                size={10}
                color="#7B1513"
              />
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          {/* Delivery Time Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Delivery Time</Text>
            <View style={styles.deliveryRow}>
              <Ionicons name="send" size={18} color="#7B1513" />
              <Text style={styles.deliveryText}>{vendor.deliveryTime}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Offerings Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Offerings</Text>
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
              <Ionicons name="star" size={16} color="#000000" />
              <Text style={styles.reviewsTitle}>
                {vendor.rating} • {vendor.reviewCount} Reviews
              </Text>
            </View>

            {vendor.reviews.map((review) => (
              <View key={review.id} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <View style={styles.reviewUserInfo}>
                    <Text style={styles.reviewUserName}>{review.userName}</Text>
                    <View style={styles.reviewStars}>
                      {[...Array(5)].map((_, i) => (
                        <Ionicons
                          key={i}
                          name="star"
                          size={12}
                          color="#000000"
                        />
                      ))}
                    </View>
                  </View>
                  {review.userImage && (
                    <Image
                      source={{ uri: review.userImage }}
                      style={styles.reviewUserImage}
                    />
                  )}
                </View>

                <Text
                  style={styles.reviewText}
                  numberOfLines={
                    expandedReviews.includes(review.id) ? undefined : 2
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
                    size={10}
                    color="#7B1513"
                  />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

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
    </SafeAreaView>
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
  gradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: IMAGE_HEIGHT,
  },
  navBar: {
    position: "absolute",
    top: 32,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    height: 56,
  },
  navButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  navRightButtons: {
    flexDirection: "row",
    gap: 10,
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
    width: 6,
    height: 6,
    borderRadius: 3,
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
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  vendorName: {
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    fontWeight: "800",
    fontSize: 24,
    lineHeight: 28.8,
    letterSpacing: 0.24,
    color: "#000000",
    textAlign: "center",
  },
  vendorSubtitle: {
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    fontWeight: "500",
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.12,
    color: "#A0A0A0",
    textAlign: "center",
  },
  ratingRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  ratingText: {
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    fontWeight: "500",
    fontSize: 14,
    lineHeight: 20,
    color: "#252525",
  },
  divider: {
    height: 0.5,
    backgroundColor: "#D4D6DD",
  },
  sectionTitle: {
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    fontWeight: "700",
    fontSize: 12,
    lineHeight: 14.4,
    color: "#000000",
    textAlign: "center",
  },
  availabilityText: {
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    fontWeight: "500",
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.12,
    color: "#000000",
    textAlign: "center",
    marginTop: 4,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
    marginBottom: 10,
  },
  styleCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 9,
    paddingHorizontal: 12,
  },
  styleImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: "#D9D9D9",
  },
  styleInfo: {
    flex: 1,
  },
  styleTitle: {
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    fontWeight: "700",
    fontSize: 12,
    lineHeight: 14.4,
    color: "#000000",
  },
  styleDescription: {
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    fontWeight: "500",
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.12,
    color: "#000000",
  },
  portfolioCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    paddingHorizontal: 8,
    marginTop: 15,
  },
  portfolioImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#D9D9D9",
  },
  portfolioInfo: {
    flex: 1,
  },
  portfolioTitle: {
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    fontWeight: "700",
    fontSize: 12,
    lineHeight: 14.4,
    color: "#000000",
  },
  portfolioTagline: {
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    fontWeight: "500",
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.12,
    color: "#000000",
  },
  descriptionSection: {
    paddingHorizontal: 28,
    paddingVertical: 12,
  },
  descriptionText: {
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    fontWeight: "500",
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.12,
    color: "#000000",
  },
  showMoreButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    marginTop: 8,
  },
  showMoreText: {
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    fontWeight: "700",
    fontSize: 12,
    lineHeight: 14.4,
    color: "#000000",
  },
  deliveryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 12,
    paddingHorizontal: 8,
  },
  deliveryText: {
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    fontWeight: "500",
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.12,
    color: "#000000",
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 12,
  },
  tag: {
    backgroundColor: "#EBEBEB",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  tagText: {
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    fontWeight: "700",
    fontSize: 12,
    lineHeight: 14.4,
    color: "#1F2024",
  },
  reviewsHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 12,
  },
  reviewsTitle: {
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    fontWeight: "800",
    fontSize: 16,
    lineHeight: 19.2,
    letterSpacing: 0.08,
    color: "#252525",
  },
  reviewCard: {
    backgroundColor: "#EBEBEB",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  reviewUserInfo: {
    flex: 1,
  },
  reviewUserName: {
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    fontWeight: "700",
    fontSize: 14,
    lineHeight: 16.8,
    color: "#1F2024",
  },
  reviewStars: {
    flexDirection: "row",
    gap: 1,
    marginTop: 4,
  },
  reviewUserImage: {
    width: 18,
    height: 18,
    borderRadius: 9,
  },
  reviewText: {
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    fontWeight: "500",
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.12,
    color: "#494A50",
  },
  ctaContainer: {
    flexDirection: "row",
    gap: 14,
    padding: 13,
    paddingHorizontal: 24,
    borderTopWidth: 1,
    borderTopColor: "#D9D9D9",
    backgroundColor: "#FFFFFF",
  },
  ctaButtonSecondary: {
    flex: 1,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#7B1513",
  },
  ctaButtonSecondaryText: {
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    fontWeight: "600",
    fontSize: 12,
    lineHeight: 14.5,
    color: "#7B1513",
  },
  ctaButtonPrimary: {
    flex: 1,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    backgroundColor: "#7B1513",
  },
  ctaButtonPrimaryText: {
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    fontWeight: "600",
    fontSize: 12,
    lineHeight: 14.5,
    color: "#FFFFFF",
  },
});
