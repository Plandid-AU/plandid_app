import { ReviewOptionsModal } from "@/components/ReviewOptionsModal";
import { ShareModal } from "@/components/ShareModal";
import { ThemedText } from "@/components/ThemedText";
import { rf, rh, rs } from "@/constants/Responsive";
import { useTheme } from "@/hooks/useTheme";
import { Review, useReviewsStore } from "@/stores/reviewsStore";
import { useUserStore } from "@/stores/userStore";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

type SortOption = "recent" | "oldest" | "highest" | "lowest";

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.backgroundPrimary,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: theme.spacing["5xl"],
      paddingVertical: theme.spacing["2xl"],
      gap: theme.spacing["2xl"],
    },
    backButton: {
      padding: theme.spacing.sm,
    },
    backIcon: {
      width: 12,
      height: 12,
      borderTopWidth: 2,
      borderLeftWidth: 2,
      borderColor: theme.colors.primary,
      transform: [{ rotate: "-45deg" }],
    },
    scrollContainer: {
      flex: 1,
    },
    content: {
      flex: 1,
      paddingHorizontal: theme.spacing["5xl"],
      paddingBottom: theme.spacing["5xl"],
    },
    titleSection: {
      gap: theme.spacing.base,
      paddingVertical: theme.spacing["2xl"],
    },
    subtitle: {
      color: theme.colors.textMuted,
    },
    writeReviewButtonContainer: {
      marginBottom: theme.spacing["4xl"],
    },
    writeReviewButton: {
      height: rh(40),
      backgroundColor: theme.colors.primary,
      borderRadius: theme.borderRadius.lg,
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "row",
      gap: theme.spacing["2xl"],
      paddingHorizontal: theme.spacing["4xl"],
    },
    writeReviewButtonText: {
      fontFamily: "Inter",
      fontWeight: "600",
      fontSize: rf(12),
      color: theme.colors.backgroundPrimary,
    },
    emptyStateContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      gap: theme.spacing["8xl"],
      paddingVertical: theme.spacing["10xl"],
    },
    emptyStateIcon: {
      width: rs(100),
      height: rs(100),
      borderRadius: rs(24),
      backgroundColor: "#EBEBEB",
      justifyContent: "center",
      alignItems: "center",
    },
    emptyStateTextContainer: {
      gap: theme.spacing["2xl"],
      alignItems: "center",
    },
    emptyStateTitle: {
      fontFamily: "Urbanist",
      fontWeight: "800",
      fontSize: rf(18),
      lineHeight: rf(18) * 1.2,
      color: theme.colors.textPrimary,
      textAlign: "center",
    },
    emptyStateDescription: {
      fontFamily: "Inter",
      fontWeight: "500",
      fontSize: rf(14),
      lineHeight: rf(14) * 1.43,
      color: theme.colors.textMuted,
      textAlign: "center",
      maxWidth: rs(238),
    },
    sortContainer: {
      flexDirection: "row",
      justifyContent: "flex-end",
      alignItems: "center",
      marginBottom: theme.spacing["4xl"],
    },
    sortButton: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing["3xl"],
      paddingVertical: theme.spacing["3xl"],
      paddingHorizontal: theme.spacing["4xl"],
      borderRadius: theme.borderRadius.lg,
      borderWidth: 0.5,
      borderColor: "#C5C6CC",
      minHeight: rs(40),
    },
    sortButtonText: {
      fontFamily: "Inter",
      fontWeight: "500",
      fontSize: rf(12),
      lineHeight: rf(12) * 1.33,
      color: theme.colors.textPrimary,
    },
    reviewCard: {
      backgroundColor: theme.colors.backgroundPrimary,
      borderRadius: theme.borderRadius.xl,
      borderWidth: 1,
      borderColor: "#8F9098",
      marginBottom: theme.spacing["4xl"],
    },
    reviewCardContent: {
      padding: theme.spacing["4xl"],
      gap: theme.spacing["3xl"],
    },
    reviewHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      gap: theme.spacing["4xl"],
    },
    reviewInfo: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing["4xl"],
      flex: 1,
    },
    vendorAvatar: {
      width: rs(40),
      height: rs(40),
      borderRadius: rs(20),
      backgroundColor: "#FDF2F2",
    },
    vendorDetails: {
      flex: 1,
      gap: rs(4),
    },
    vendorName: {
      fontFamily: "Urbanist",
      fontWeight: "700",
      fontSize: rf(14),
      lineHeight: rf(14) * 1.2,
      color: theme.colors.textPrimary,
    },
    reviewDate: {
      fontFamily: "Inter",
      fontWeight: "500",
      fontSize: rf(12),
      lineHeight: rf(12) * 1.33,
      color: theme.colors.textMuted,
    },
    moreButton: {
      width: rs(24),
      height: rs(24),
      justifyContent: "center",
      alignItems: "center",
    },
    divider: {
      height: rs(0.5),
      backgroundColor: "#D4D6DD",
    },
    ratingSection: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    starsContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: rs(4),
    },
    recommendedContainer: {
      flexDirection: "row",
      alignItems: "flex-end",
      gap: rs(6),
    },
    recommendedText: {
      fontFamily: "Urbanist",
      fontWeight: "700",
      fontSize: rf(12),
      lineHeight: rf(12) * 1.2,
      color: theme.colors.textPrimary,
    },
    reviewDescription: {
      fontFamily: "Inter",
      fontWeight: "500",
      fontSize: rf(12),
      lineHeight: rf(12) * 1.33,
      letterSpacing: 0.12,
      color: theme.colors.textPrimary,
    },
    // Photo Styles
    photosContainer: {
      gap: rs(12),
    },
    photosGrid: {
      flexDirection: "row",
      gap: rs(8),
      flexWrap: "wrap",
    },
    photoThumbnail: {
      width: rs(80),
      height: rs(80),
      borderRadius: rs(8),
      backgroundColor: "#F5F5F5",
    },
    photoCount: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.6)",
      borderRadius: rs(8),
      justifyContent: "center",
      alignItems: "center",
    },
    photoCountText: {
      fontFamily: "Inter",
      fontWeight: "600",
      fontSize: rf(14),
      color: "white",
    },
    // Gallery Modal Styles
    galleryOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.9)",
    },
    galleryHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: rs(20),
      paddingTop: Platform.OS === "ios" ? rs(60) : rs(40),
      paddingBottom: rs(20),
    },
    galleryTitle: {
      fontFamily: "Inter",
      fontWeight: "600",
      fontSize: rf(16),
      color: "white",
    },
    galleryCloseButton: {
      width: rs(32),
      height: rs(32),
      borderRadius: rs(16),
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      justifyContent: "center",
      alignItems: "center",
    },
    galleryContent: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    galleryImage: {
      width: SCREEN_WIDTH - rs(40),
      height: SCREEN_WIDTH - rs(40),
      borderRadius: rs(12),
    },
    galleryNavigation: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: rs(20),
      paddingBottom: Platform.OS === "ios" ? rs(40) : rs(20),
    },
    galleryNavButton: {
      width: rs(48),
      height: rs(48),
      borderRadius: rs(24),
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      justifyContent: "center",
      alignItems: "center",
    },
    galleryNavButtonDisabled: {
      opacity: 0.3,
    },
    galleryPageIndicator: {
      flexDirection: "row",
      alignItems: "center",
      gap: rs(8),
    },
    galleryPageText: {
      fontFamily: "Inter",
      fontWeight: "500",
      fontSize: rf(14),
      color: "white",
    },
    // Sort Modal Styles
    modalOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(31, 32, 36, 0.4)",
    },
    modalContainer: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: theme.colors.backgroundPrimary,
      borderTopLeftRadius: theme.borderRadius.xl,
      borderTopRightRadius: theme.borderRadius.xl,
      paddingBottom: Platform.OS === "ios" ? rs(34) : rs(20),
    },
    modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingTop: theme.spacing["4xl"],
      paddingBottom: theme.spacing["2xl"],
      paddingHorizontal: theme.spacing["5xl"],
    },
    modalTitle: {
      fontFamily: "Urbanist",
      fontWeight: "700",
      fontSize: rf(16),
      lineHeight: rf(16) * 1.2,
      color: theme.colors.textPrimary,
    },
    closeButton: {
      width: rs(18),
      height: rs(18),
      justifyContent: "center",
      alignItems: "center",
    },
    modalContent: {
      paddingHorizontal: theme.spacing["3xl"],
      paddingBottom: theme.spacing["2xl"],
    },
    sortOption: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: theme.spacing["2xl"],
      paddingHorizontal: theme.spacing["3xl"],
      gap: theme.spacing["5xl"],
    },
    sortOptionIcon: {
      width: rs(26),
      height: rs(26),
      justifyContent: "center",
      alignItems: "center",
    },
    sortOptionContent: {
      flex: 1,
      gap: rs(4),
    },
    sortOptionTitle: {
      fontFamily: "Inter",
      fontWeight: "500",
      fontSize: rf(14),
      lineHeight: rf(14) * 1.43,
      color: theme.colors.textPrimary,
    },
    sortOptionDescription: {
      fontFamily: "Inter",
      fontWeight: "500",
      fontSize: rf(12),
      lineHeight: rf(12) * 1.33,
      color: theme.colors.textMuted,
    },
    modalDivider: {
      height: rs(0.5),
      backgroundColor: theme.colors.borderLight,
      marginHorizontal: theme.spacing["3xl"],
    },
  });

export default function ReviewsScreen() {
  const router = useRouter();
  const theme = useTheme();
  const styles = createStyles(theme);
  const { user } = useUserStore();
  const { reviews, loadReviews } = useReviewsStore();

  const [sortModalVisible, setSortModalVisible] = useState(false);
  const [currentSort, setCurrentSort] = useState<SortOption>("recent");
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  // Gallery states
  const [showGallery, setShowGallery] = useState(false);
  const [galleryPhotos, setGalleryPhotos] = useState<string[]>([]);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const slideAnim = React.useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const overlayOpacity = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (user) {
      loadReviews(user.id);
    }
  }, [user, loadReviews]);

  useEffect(() => {
    if (sortModalVisible) {
      Animated.parallel([
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(overlayOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: SCREEN_HEIGHT,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [sortModalVisible, overlayOpacity, slideAnim]);

  const getSortedReviews = () => {
    const sortedReviews = [...reviews];

    switch (currentSort) {
      case "recent":
        return sortedReviews.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case "oldest":
        return sortedReviews.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      case "highest":
        return sortedReviews.sort((a, b) => b.rating - a.rating);
      case "lowest":
        return sortedReviews.sort((a, b) => a.rating - b.rating);
      default:
        return sortedReviews;
    }
  };

  const getSortDisplayText = () => {
    switch (currentSort) {
      case "recent":
        return "Sort By Most Recent";
      case "oldest":
        return "Sort By Oldest";
      case "highest":
        return "Sort By Highest Rating";
      case "lowest":
        return "Sort By Lowest Rating";
      default:
        return "Sort By Most Recent";
    }
  };

  const handleSortSelect = (option: SortOption) => {
    setCurrentSort(option);
    setSortModalVisible(false);
  };

  const handleWriteReview = () => {
    router.push("/profile/write-review");
  };

  const handleMorePress = (review: Review) => {
    setSelectedReview(review);
    setShowOptionsModal(true);
  };

  const handleCloseModal = () => {
    setShowOptionsModal(false);
    setSelectedReview(null);
  };

  const handleViewProfile = () => {
    if (!selectedReview) return;
    handleCloseModal();
    router.push({
      pathname: "/vendor/[id]",
      params: { id: selectedReview.vendorId },
    });
  };

  const handleContact = () => {
    if (!selectedReview) return;
    handleCloseModal();
    router.push({
      pathname: "/messaging/[vendorId]",
      params: { vendorId: selectedReview.vendorId },
    });
  };

  const handleShare = () => {
    if (!selectedReview) return;
    handleCloseModal();
    setShowShareModal(true);
  };

  const handleReport = () => {
    if (!selectedReview) return;
    handleCloseModal();
    router.push({
      pathname: "/report/[vendorId]",
      params: { vendorId: selectedReview.vendorId },
    });
  };

  const handlePhotoPress = (photos: string[], index: number) => {
    setGalleryPhotos(photos);
    setCurrentPhotoIndex(index);
    setShowGallery(true);
  };

  const handleGalleryClose = () => {
    setShowGallery(false);
    setGalleryPhotos([]);
    setCurrentPhotoIndex(0);
  };

  const handlePrevPhoto = () => {
    setCurrentPhotoIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNextPhoto = () => {
    setCurrentPhotoIndex((prev) =>
      Math.min(galleryPhotos.length - 1, prev + 1)
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Ionicons
          key={i}
          name={i <= rating ? "star" : "star-outline"}
          size={rs(20)}
          color={theme.colors.primary}
        />
      );
    }
    return stars;
  };

  const renderPhotos = (photos: string[]) => {
    if (!photos || photos.length === 0) return null;

    const maxDisplayPhotos = 4;
    const displayPhotos = photos.slice(0, maxDisplayPhotos);
    const remainingCount = photos.length - maxDisplayPhotos;

    return (
      <View style={styles.photosContainer}>
        <View style={styles.photosGrid}>
          {displayPhotos.map((photo, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handlePhotoPress(photos, index)}
              activeOpacity={0.8}
            >
              <Image
                source={{ uri: photo }}
                style={styles.photoThumbnail}
                resizeMode="cover"
              />
              {index === maxDisplayPhotos - 1 && remainingCount > 0 && (
                <View style={styles.photoCount}>
                  <ThemedText style={styles.photoCountText}>
                    +{remainingCount}
                  </ThemedText>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <View style={styles.emptyStateIcon}>
        <Ionicons
          name="document-text-outline"
          size={rs(32)}
          color={theme.colors.textMuted}
        />
      </View>

      <View style={styles.emptyStateTextContainer}>
        <ThemedText style={styles.emptyStateTitle}>
          Nothing here. For now.
        </ThemedText>
        <ThemedText style={styles.emptyStateDescription}>
          Write a new review
        </ThemedText>
      </View>

      <TouchableOpacity
        style={styles.writeReviewButton}
        onPress={handleWriteReview}
      >
        <Ionicons
          name="create-outline"
          size={rs(14)}
          color={theme.colors.backgroundPrimary}
        />
        <ThemedText style={styles.writeReviewButtonText}>
          Write a Review
        </ThemedText>
      </TouchableOpacity>
    </View>
  );

  const renderReviewsList = () => {
    const sortedReviews = getSortedReviews();

    return (
      <>
        <View style={styles.writeReviewButtonContainer}>
          <TouchableOpacity
            style={styles.writeReviewButton}
            onPress={handleWriteReview}
          >
            <Ionicons
              name="create-outline"
              size={rs(14)}
              color={theme.colors.backgroundPrimary}
            />
            <ThemedText style={styles.writeReviewButtonText}>
              Write a Review
            </ThemedText>
          </TouchableOpacity>
        </View>

        <View style={styles.sortContainer}>
          <TouchableOpacity
            style={styles.sortButton}
            onPress={() => setSortModalVisible(true)}
          >
            <Ionicons
              name="filter"
              size={rf(12)}
              color={theme.colors.primary}
            />
            <ThemedText style={styles.sortButtonText}>
              {getSortDisplayText()}
            </ThemedText>
            <Ionicons name="chevron-down" size={rf(10)} color="#C5C6CC" />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {sortedReviews.map((review) => (
            <View key={review.id} style={styles.reviewCard}>
              <View style={styles.reviewCardContent}>
                <View style={styles.reviewHeader}>
                  <View style={styles.reviewInfo}>
                    <View style={styles.vendorAvatar} />
                    <View style={styles.vendorDetails}>
                      <ThemedText style={styles.vendorName}>
                        {review.vendorName}
                      </ThemedText>
                      <ThemedText style={styles.reviewDate}>
                        Reviewed on {formatDate(review.createdAt)}
                      </ThemedText>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={styles.moreButton}
                    onPress={() => handleMorePress(review)}
                  >
                    <View style={{ flexDirection: "row", gap: rs(2) }}>
                      <View
                        style={{
                          width: rs(4),
                          height: rs(4),
                          borderRadius: rs(2),
                          backgroundColor: "#030819",
                        }}
                      />
                      <View
                        style={{
                          width: rs(4),
                          height: rs(4),
                          borderRadius: rs(2),
                          backgroundColor: "#030819",
                        }}
                      />
                      <View
                        style={{
                          width: rs(4),
                          height: rs(4),
                          borderRadius: rs(2),
                          backgroundColor: "#030819",
                        }}
                      />
                    </View>
                  </TouchableOpacity>
                </View>

                <View style={styles.divider} />

                <View style={styles.ratingSection}>
                  <View style={styles.starsContainer}>
                    {renderStars(review.rating)}
                  </View>
                  {review.isRecommended && (
                    <View style={styles.recommendedContainer}>
                      <ThemedText style={styles.recommendedText}>
                        Recommended
                      </ThemedText>
                      <Ionicons
                        name="checkmark-circle"
                        size={rs(20)}
                        color={theme.colors.primary}
                      />
                    </View>
                  )}
                </View>

                <ThemedText style={styles.reviewDescription}>
                  {review.description}
                </ThemedText>

                {renderPhotos(review.photos)}
              </View>
            </View>
          ))}
        </ScrollView>
      </>
    );
  };

  const renderSortModal = () => (
    <Modal
      visible={sortModalVisible}
      transparent
      animationType="none"
      onRequestClose={() => setSortModalVisible(false)}
    >
      <TouchableWithoutFeedback onPress={() => setSortModalVisible(false)}>
        <Animated.View
          style={[styles.modalOverlay, { opacity: overlayOpacity }]}
        />
      </TouchableWithoutFeedback>

      <Animated.View
        style={[
          styles.modalContainer,
          { transform: [{ translateY: slideAnim }] },
        ]}
      >
        <View style={styles.modalHeader}>
          <ThemedText style={styles.modalTitle}>Sort Options</ThemedText>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setSortModalVisible(false)}
          >
            <Ionicons
              name="close"
              size={rf(18)}
              color={theme.colors.textPrimary}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.modalContent}>
          <TouchableOpacity
            style={styles.sortOption}
            onPress={() => handleSortSelect("recent")}
          >
            <View style={styles.sortOptionIcon}>
              <Ionicons
                name="time-outline"
                size={rf(26)}
                color={theme.colors.textPrimary}
              />
            </View>
            <View style={styles.sortOptionContent}>
              <ThemedText style={styles.sortOptionTitle}>
                Most Recent
              </ThemedText>
              <ThemedText style={styles.sortOptionDescription}>
                Show newest reviews first
              </ThemedText>
            </View>
          </TouchableOpacity>

          <View style={styles.modalDivider} />

          <TouchableOpacity
            style={styles.sortOption}
            onPress={() => handleSortSelect("oldest")}
          >
            <View style={styles.sortOptionIcon}>
              <Ionicons
                name="time-outline"
                size={rf(26)}
                color={theme.colors.textPrimary}
              />
            </View>
            <View style={styles.sortOptionContent}>
              <ThemedText style={styles.sortOptionTitle}>Oldest</ThemedText>
              <ThemedText style={styles.sortOptionDescription}>
                Show oldest reviews first
              </ThemedText>
            </View>
          </TouchableOpacity>

          <View style={styles.modalDivider} />

          <TouchableOpacity
            style={styles.sortOption}
            onPress={() => handleSortSelect("highest")}
          >
            <View style={styles.sortOptionIcon}>
              <Ionicons
                name="trending-up-outline"
                size={rf(26)}
                color={theme.colors.textPrimary}
              />
            </View>
            <View style={styles.sortOptionContent}>
              <ThemedText style={styles.sortOptionTitle}>
                Highest Rating
              </ThemedText>
              <ThemedText style={styles.sortOptionDescription}>
                Show highest rated reviews first
              </ThemedText>
            </View>
          </TouchableOpacity>

          <View style={styles.modalDivider} />

          <TouchableOpacity
            style={styles.sortOption}
            onPress={() => handleSortSelect("lowest")}
          >
            <View style={styles.sortOptionIcon}>
              <Ionicons
                name="trending-down-outline"
                size={rf(26)}
                color={theme.colors.textPrimary}
              />
            </View>
            <View style={styles.sortOptionContent}>
              <ThemedText style={styles.sortOptionTitle}>
                Lowest Rating
              </ThemedText>
              <ThemedText style={styles.sortOptionDescription}>
                Show lowest rated reviews first
              </ThemedText>
            </View>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <View style={styles.backIcon} />
          </Pressable>
        </View>

        <ScrollView
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            {/* Title Section */}
            <View style={styles.titleSection}>
              <ThemedText type="h3">Reviews</ThemedText>
              <ThemedText type="caption" style={styles.subtitle}>
                Where all your reviews lives
              </ThemedText>
            </View>

            {reviews.length === 0 ? renderEmptyState() : renderReviewsList()}
          </View>
        </ScrollView>

        {renderSortModal()}
      </KeyboardAvoidingView>

      {/* Options Modal */}
      <ReviewOptionsModal
        visible={showOptionsModal}
        onClose={handleCloseModal}
        review={selectedReview}
        onViewProfile={handleViewProfile}
        onContact={handleContact}
        onShare={handleShare}
        onReport={handleReport}
      />

      {/* Share Modal */}
      <ShareModal
        visible={showShareModal}
        onClose={() => setShowShareModal(false)}
        vendor={
          selectedReview
            ? {
                id: selectedReview.vendorId,
                name: selectedReview.vendorName,
                location: "Melbourne, VIC", // Add location from vendor data
                avatar: selectedReview.vendorAvatar,
              }
            : undefined
        }
      />

      {/* Gallery Modal */}
      {showGallery && (
        <Modal
          visible={showGallery}
          transparent
          animationType="none"
          onRequestClose={handleGalleryClose}
        >
          <TouchableOpacity
            style={styles.galleryOverlay}
            activeOpacity={1}
            onPress={handleGalleryClose}
          >
            <View style={styles.galleryHeader}>
              <TouchableOpacity
                style={styles.galleryCloseButton}
                onPress={handleGalleryClose}
              >
                <Ionicons name="close" size={rf(18)} color="white" />
              </TouchableOpacity>
              <ThemedText style={styles.galleryTitle}>
                {galleryPhotos.length > 0
                  ? `Photo ${currentPhotoIndex + 1} of ${galleryPhotos.length}`
                  : "No Photos"}
              </ThemedText>
            </View>
            <View style={styles.galleryContent}>
              <Image
                source={{ uri: galleryPhotos[currentPhotoIndex] }}
                style={styles.galleryImage}
                resizeMode="contain"
              />
            </View>
            <View style={styles.galleryNavigation}>
              <TouchableOpacity
                style={[
                  styles.galleryNavButton,
                  currentPhotoIndex === 0 && styles.galleryNavButtonDisabled,
                ]}
                onPress={handlePrevPhoto}
                disabled={currentPhotoIndex === 0}
              >
                <Ionicons name="chevron-back" size={rf(24)} color="white" />
              </TouchableOpacity>
              <View style={styles.galleryPageIndicator}>
                <ThemedText style={styles.galleryPageText}>
                  {currentPhotoIndex + 1} of {galleryPhotos.length}
                </ThemedText>
              </View>
              <TouchableOpacity
                style={[
                  styles.galleryNavButton,
                  currentPhotoIndex === galleryPhotos.length - 1 &&
                    styles.galleryNavButtonDisabled,
                ]}
                onPress={handleNextPhoto}
                disabled={currentPhotoIndex === galleryPhotos.length - 1}
              >
                <Ionicons name="chevron-forward" size={rf(24)} color="white" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      )}
    </SafeAreaView>
  );
}
