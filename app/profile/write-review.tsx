import { ProgressDots } from "@/components/ProgressDots";
import { ThemedText } from "@/components/ThemedText";
import { VendorSelectionModal } from "@/components/VendorSelectionModal";
import { rf, rh, rs } from "@/constants/Responsive";
import { useTheme } from "@/hooks/useTheme";
import { useReviewsStore } from "@/stores/reviewsStore";
import { useUserStore } from "@/stores/userStore";
import { Vendor } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.backgroundPrimary,
    },
    statusBarBackground: {
      height: StatusBar.currentHeight || (Platform.OS === "ios" ? rh(44) : 0),
      backgroundColor: theme.colors.backgroundPrimary,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: theme.spacing["5xl"],
      paddingVertical: theme.spacing["3xl"],
      backgroundColor: theme.colors.backgroundPrimary,
    },
    backButton: {
      width: rs(40),
      height: rs(40),
      justifyContent: "center",
      alignItems: "center",
    },
    content: {
      flex: 1,
      paddingHorizontal: theme.spacing["5xl"],
      paddingBottom: theme.spacing["3xl"],
    },

    // Step 1 Styles
    stepOneContainer: {
      gap: rs(36),
      paddingTop: theme.spacing["5xl"],
    },
    titleContainer: {
      gap: rs(10),
    },
    title: {
      fontFamily: "Urbanist",
      fontWeight: "800",
      fontSize: rf(18),
      lineHeight: rf(18) * 1.2,
      letterSpacing: 0.09,
      color: theme.colors.textPrimary,
    },
    subtitle: {
      fontFamily: "Inter",
      fontWeight: "500",
      fontSize: rf(14),
      lineHeight: rf(14) * 1.43,
      color: "#71727A",
    },
    dropdown: {
      flexDirection: "row",
      alignItems: "center",
      alignSelf: "stretch",
      gap: theme.spacing["2xl"],
      padding: theme.spacing["3xl"],
      borderRadius: theme.borderRadius.lg,
      borderWidth: 1,
      borderColor: "#C5C6CC",
      minHeight: rs(48),
    },
    dropdownContent: {
      flex: 1,
    },
    dropdownPlaceholder: {
      fontFamily: "Inter",
      fontWeight: "500",
      fontSize: rf(14),
      lineHeight: rf(14) * 1.43,
      color: "#8F9098",
    },
    dropdownText: {
      fontFamily: "Inter",
      fontWeight: "500",
      fontSize: rf(14),
      lineHeight: rf(14) * 1.43,
      color: theme.colors.textPrimary,
    },

    // Step 2 Styles
    stepTwoContainer: {
      gap: rs(20),
      paddingTop: theme.spacing["5xl"],
    },
    ratingContainer: {
      gap: rs(12),
    },
    ratingLabel: {
      fontFamily: "Urbanist",
      fontWeight: "800",
      fontSize: rf(16),
      lineHeight: rf(16) * 1.2,
      letterSpacing: 0.08,
      color: theme.colors.textPrimary,
    },
    starsContainer: {
      flexDirection: "row",
      gap: rs(8),
    },
    recommendContainer: {
      gap: rs(12),
    },
    recommendLabel: {
      fontFamily: "Urbanist",
      fontWeight: "800",
      fontSize: rf(16),
      lineHeight: rf(16) * 1.2,
      letterSpacing: 0.08,
      color: theme.colors.textPrimary,
    },
    recommendOptions: {
      flexDirection: "row",
      gap: rs(12),
    },
    recommendOption: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      gap: rs(12),
      padding: rs(16),
      borderRadius: rs(12),
      borderWidth: 1.5,
      borderColor: "#C5C6CC",
    },
    recommendOptionSelected: {
      borderColor: theme.colors.primary,
      backgroundColor: `${theme.colors.primary}10`,
    },
    recommendText: {
      fontFamily: "Inter",
      fontWeight: "500",
      fontSize: rf(14),
      lineHeight: rf(14) * 1.43,
      color: theme.colors.textPrimary,
    },
    radioButton: {
      width: rs(16),
      height: rs(16),
      borderRadius: rs(8),
      borderWidth: 1.5,
      borderColor: "#C5C6CC",
    },
    radioButtonSelected: {
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.primary,
      justifyContent: "center",
      alignItems: "center",
    },
    radioButtonInner: {
      width: rs(6),
      height: rs(6),
      borderRadius: rs(3),
      backgroundColor: theme.colors.backgroundPrimary,
    },
    textAreaContainer: {
      gap: rs(12),
    },
    textAreaLabel: {
      fontFamily: "Urbanist",
      fontWeight: "800",
      fontSize: rf(16),
      lineHeight: rf(16) * 1.2,
      letterSpacing: 0.08,
      color: theme.colors.textPrimary,
    },
    textArea: {
      borderWidth: 1,
      borderColor: "#C5C6CC",
      borderRadius: rs(12),
      padding: rs(16),
      height: rs(120),
      textAlignVertical: "top",
      fontFamily: "Inter",
      fontWeight: "500",
      fontSize: rf(14),
      lineHeight: rf(14) * 1.43,
      color: theme.colors.textPrimary,
      backgroundColor: theme.colors.backgroundPrimary,
    },
    photosContainer: {
      gap: rs(12),
    },
    photosLabel: {
      fontFamily: "Urbanist",
      fontWeight: "800",
      fontSize: rf(16),
      lineHeight: rf(16) * 1.2,
      letterSpacing: 0.08,
      color: theme.colors.textPrimary,
    },
    addPhotosButton: {
      flexDirection: "row",
      alignItems: "center",
      padding: rs(16),
      gap: rs(16),
      borderRadius: rs(12),
      borderWidth: 1,
      borderColor: "#C5C6CC",
      backgroundColor: theme.colors.backgroundPrimary,
    },
    addPhotosText: {
      fontFamily: "Inter",
      fontWeight: "500",
      fontSize: rf(14),
      lineHeight: rf(14) * 1.43,
      color: theme.colors.textPrimary,
    },
    photosScrollContainer: {
      marginTop: rs(16),
    },
    photosScrollView: {
      paddingRight: rs(16),
    },
    photoItemContainer: {
      position: "relative",
      marginRight: rs(12),
    },
    photoItem: {
      width: rs(100),
      height: rs(100),
      borderRadius: rs(12),
      backgroundColor: "#F5F5F5",
    },
    removePhotoButton: {
      position: "absolute",
      top: rs(8),
      right: rs(8),
      width: rs(24),
      height: rs(24),
      borderRadius: rs(12),
      backgroundColor: "rgba(0, 0, 0, 0.6)",
      justifyContent: "center",
      alignItems: "center",
    },

    // Footer Styles
    footer: {
      padding: theme.spacing["5xl"],
      gap: theme.spacing["3xl"],
      backgroundColor: theme.colors.backgroundPrimary,
      borderTopWidth: 1,
      borderTopColor: theme.colors.borderLight,
    },
    progressContainer: {
      alignItems: "center",
    },
    buttonContainer: {
      alignSelf: "stretch",
    },
    button: {
      height: rh(40),
      backgroundColor: theme.colors.primary,
      borderRadius: rs(12),
      justifyContent: "center",
      alignItems: "center",
    },
    buttonDisabled: {
      backgroundColor: "#C5C6CC",
    },
    buttonText: {
      fontFamily: "Inter",
      fontWeight: "600",
      fontSize: rf(12),
      lineHeight: rf(12) * 1.2,
      color: theme.colors.backgroundPrimary,
    },
    buttonTextDisabled: {
      color: "#8F9098",
    },
  });

export default function WriteReviewScreen() {
  const router = useRouter();
  const theme = useTheme();
  const styles = createStyles(theme);
  const { user } = useUserStore();
  const { addReview, reviews } = useReviewsStore();

  // Step management
  const [currentStep, setCurrentStep] = useState(0);

  // Step 1 data
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [showVendorModal, setShowVendorModal] = useState(false);

  // Step 2 data
  const [rating, setRating] = useState(0);
  const [isRecommended, setIsRecommended] = useState<boolean | null>(null);
  const [description, setDescription] = useState("");
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBack = () => {
    if (currentStep === 0) {
      router.back();
    } else {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleNext = () => {
    if (currentStep === 0) {
      if (!selectedVendor) {
        Alert.alert("Error", "Please select a vendor to review.");
        return;
      }

      // Check for duplicate review
      if (
        user &&
        reviews.some(
          (review) =>
            review.userId === user.id && review.vendorId === selectedVendor.id
        )
      ) {
        Alert.alert(
          "Review Already Exists",
          "You have already reviewed this vendor. You can only submit one review per vendor.",
          [{ text: "OK" }]
        );
        return;
      }

      setCurrentStep(1);
    } else {
      handleSubmit();
    }
  };

  const handleVendorSelect = (vendor: Vendor) => {
    setSelectedVendor(vendor);
  };

  const handleStarPress = (starRating: number) => {
    setRating(starRating);
  };

  const handleAddPhotos = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Please allow access to your photo library to add photos."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
        allowsEditing: false,
      });

      if (!result.canceled && result.assets) {
        const newPhotos = result.assets.map((asset) => asset.uri);
        const updatedPhotos = [...selectedPhotos, ...newPhotos].slice(0, 10); // Max 10 photos
        setSelectedPhotos(updatedPhotos);
      }
    } catch (error) {
      console.error("Error picking images:", error);
      Alert.alert("Error", "Failed to select photos. Please try again.");
    }
  };

  const handleRemovePhoto = (photoToRemove: string) => {
    const updatedPhotos = selectedPhotos.filter(
      (photo) => photo !== photoToRemove
    );
    setSelectedPhotos(updatedPhotos);
  };

  const handleSubmit = async () => {
    if (!selectedVendor || !user) {
      Alert.alert("Error", "Please complete all required fields.");
      return;
    }

    if (rating === 0) {
      Alert.alert("Error", "Please provide a rating.");
      return;
    }

    if (isRecommended === null) {
      Alert.alert(
        "Error",
        "Please indicate if you would recommend this vendor."
      );
      return;
    }

    if (!description.trim()) {
      Alert.alert("Error", "Please write a description of your experience.");
      return;
    }

    // Final check for duplicate review before submission
    if (
      reviews.some(
        (review) =>
          review.userId === user.id && review.vendorId === selectedVendor.id
      )
    ) {
      Alert.alert(
        "Review Already Exists",
        "You have already reviewed this vendor.",
        [{ text: "OK" }]
      );
      return;
    }

    setIsSubmitting(true);

    try {
      await addReview({
        userId: user.id,
        vendorId: selectedVendor.id,
        vendorName: selectedVendor.name,
        vendorAvatar: selectedVendor.images?.[0]?.url,
        rating,
        isRecommended,
        description: description.trim(),
        photos: selectedPhotos,
      });

      Alert.alert(
        "Review Submitted",
        "Thank you for your review! It will help other couples make informed decisions.",
        [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      console.error("Error submitting review:", error);
      Alert.alert("Error", "Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceed = () => {
    if (currentStep === 0) {
      return !!selectedVendor;
    }
    return (
      rating > 0 && isRecommended !== null && description.trim().length > 0
    );
  };

  const getButtonText = () => {
    if (currentStep === 0) {
      return "Next";
    }
    return isSubmitting ? "Submitting..." : "Submit";
  };

  const renderStepOne = () => (
    <View style={styles.stepOneContainer}>
      <View style={styles.titleContainer}>
        <ThemedText style={styles.title}>Which Vendor did you use?</ThemedText>
        <ThemedText style={styles.subtitle}>
          Choose the vendor you selected
        </ThemedText>
      </View>

      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => setShowVendorModal(true)}
      >
        <View style={styles.dropdownContent}>
          {selectedVendor ? (
            <ThemedText style={styles.dropdownText}>
              {selectedVendor.name}
            </ThemedText>
          ) : (
            <ThemedText style={styles.dropdownPlaceholder}>
              Select your Vendor
            </ThemedText>
          )}
        </View>
        <Ionicons
          name="chevron-down"
          size={rf(12)}
          color={theme.colors.primary}
        />
      </TouchableOpacity>
    </View>
  );

  const renderStepTwo = () => (
    <View style={styles.stepTwoContainer}>
      <View style={styles.titleContainer}>
        <ThemedText style={styles.title}>How was your experience?</ThemedText>
        <ThemedText style={styles.subtitle}>
          Share your honest feedback
        </ThemedText>
      </View>

      {/* Rating */}
      <View style={styles.ratingContainer}>
        <ThemedText style={styles.ratingLabel}>Rating</ThemedText>
        <View style={styles.starsContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity key={star} onPress={() => handleStarPress(star)}>
              <Ionicons
                name={star <= rating ? "star" : "star-outline"}
                size={rs(24)}
                color={theme.colors.primary}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Recommendation */}
      <View style={styles.recommendContainer}>
        <ThemedText style={styles.recommendLabel}>
          Would you recommend this vendor?
        </ThemedText>
        <View style={styles.recommendOptions}>
          <TouchableOpacity
            style={[
              styles.recommendOption,
              isRecommended === true && styles.recommendOptionSelected,
            ]}
            onPress={() => setIsRecommended(true)}
          >
            <View
              style={[
                styles.radioButton,
                isRecommended === true && styles.radioButtonSelected,
              ]}
            >
              {isRecommended === true && (
                <View style={styles.radioButtonInner} />
              )}
            </View>
            <ThemedText style={styles.recommendText}>Yes</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.recommendOption,
              isRecommended === false && styles.recommendOptionSelected,
            ]}
            onPress={() => setIsRecommended(false)}
          >
            <View
              style={[
                styles.radioButton,
                isRecommended === false && styles.radioButtonSelected,
              ]}
            >
              {isRecommended === false && (
                <View style={styles.radioButtonInner} />
              )}
            </View>
            <ThemedText style={styles.recommendText}>No</ThemedText>
          </TouchableOpacity>
        </View>
      </View>

      {/* Description */}
      <View style={styles.textAreaContainer}>
        <ThemedText style={styles.textAreaLabel}>
          Tell us about your experience
        </ThemedText>
        <TextInput
          style={styles.textArea}
          placeholder="Share your experience with this vendor..."
          placeholderTextColor="#8F9098"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={6}
        />
      </View>

      {/* Photos */}
      <View style={styles.photosContainer}>
        <ThemedText style={styles.photosLabel}>
          Add Photos (Optional)
        </ThemedText>
        <TouchableOpacity
          style={styles.addPhotosButton}
          onPress={handleAddPhotos}
        >
          <Ionicons name="add" size={rf(16)} color={theme.colors.primary} />
          <ThemedText style={styles.addPhotosText}>Add Photos</ThemedText>
        </TouchableOpacity>

        {selectedPhotos.length > 0 && (
          <View style={styles.photosScrollContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.photosScrollView}
            >
              {selectedPhotos.map((photo, index) => (
                <View key={index} style={styles.photoItemContainer}>
                  <Image
                    source={{ uri: photo }}
                    style={styles.photoItem}
                    resizeMode="cover"
                  />
                  <TouchableOpacity
                    style={styles.removePhotoButton}
                    onPress={() => handleRemovePhoto(photo)}
                  >
                    <Ionicons name="close" size={rf(16)} color="white" />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={theme.colors.backgroundPrimary}
      />
      <View style={styles.statusBarBackground} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons
            name="chevron-back"
            size={rf(20)}
            color={theme.colors.primary}
          />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {currentStep === 0 ? renderStepOne() : renderStepTwo()}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.progressContainer}>
          <ProgressDots currentStep={currentStep} totalSteps={2} />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.button,
              (!canProceed() || isSubmitting) && styles.buttonDisabled,
            ]}
            onPress={handleNext}
            disabled={!canProceed() || isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator
                size="small"
                color={theme.colors.backgroundPrimary}
              />
            ) : (
              <ThemedText
                style={[
                  styles.buttonText,
                  (!canProceed() || isSubmitting) && styles.buttonTextDisabled,
                ]}
              >
                {getButtonText()}
              </ThemedText>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Vendor Selection Modal */}
      <VendorSelectionModal
        visible={showVendorModal}
        onClose={() => setShowVendorModal(false)}
        onSelect={handleVendorSelect}
        selectedVendorId={selectedVendor?.id}
      />
    </View>
  );
}
