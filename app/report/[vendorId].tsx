import { ProgressDots } from "@/components/ProgressDots";
import { ThemedText } from "@/components/ThemedText";
import { RadioButton } from "@/components/ui/RadioButton";
import { rf, rh, rs } from "@/constants/Responsive";
import { mockVendors } from "@/data/mockData";
import { useTheme } from "@/hooks/useTheme";
import { useReportsStore } from "@/stores/reportsStore";
import { useUserStore } from "@/stores/userStore";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
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

const REPORT_CATEGORIES = [
  "It's inaccurate",
  "It's a scam",
  "Inappropriate behavior",
  "It's not a real vendor",
  "Something else",
];

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
    titleContainer: {
      gap: rs(8),
      marginBottom: theme.spacing["4xl"],
    },
    title: {
      fontFamily: "Urbanist",
      fontWeight: "800",
      fontSize: rf(24),
      lineHeight: rf(24) * 1.2,
      letterSpacing: 0.24,
      color: theme.colors.textPrimary,
    },
    subtitle: {
      fontFamily: "Inter",
      fontWeight: "500",
      fontSize: rf(12),
      lineHeight: rf(12) * 1.33,
      letterSpacing: 0.12,
      color: "#71727A",
    },
    optionsContainer: {
      gap: rs(8),
    },
    optionItem: {
      flexDirection: "row",
      alignItems: "center",
      padding: rs(16),
      gap: rs(16),
      borderRadius: rs(12),
      borderWidth: 0.5,
      borderColor: "#C5C6CC",
      backgroundColor: theme.colors.backgroundPrimary,
    },
    optionContent: {
      flex: 1,
    },
    optionTitle: {
      fontFamily: "Inter",
      fontWeight: "500",
      fontSize: rf(14),
      lineHeight: rf(14) * 1.43,
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
    addPhotosButton: {
      flexDirection: "row",
      alignItems: "center",
      padding: rs(16),
      gap: rs(16),
      borderRadius: rs(12),
      borderWidth: 0.5,
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
    photosContainer: {
      flexDirection: "row",
      gap: rs(16),
      marginTop: rs(16),
      flexWrap: "wrap",
    },
    photoItemContainer: {
      position: "relative",
    },
    photoItem: {
      width: (SCREEN_WIDTH - 48 - 16) / 2,
      height: (SCREEN_WIDTH - 48 - 16) / 2,
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
    summaryContainer: {
      gap: rs(16),
    },
    summarySection: {
      gap: rs(6),
    },
    summaryLabel: {
      fontFamily: "Urbanist",
      fontWeight: "800",
      fontSize: rf(16),
      lineHeight: rf(16) * 1.2,
      letterSpacing: 0.08,
      color: theme.colors.textPrimary,
    },
    summaryValue: {
      fontFamily: "Inter",
      fontWeight: "500",
      fontSize: rf(14),
      lineHeight: rf(14) * 1.43,
      color: theme.colors.textPrimary,
    },
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
      backgroundColor: theme.colors.backgroundSecondary,
    },
    buttonText: {
      fontFamily: "Inter",
      fontWeight: "600",
      fontSize: rf(12),
      lineHeight: rf(12) * 1.2,
      color: theme.colors.backgroundPrimary,
    },
    buttonTextDisabled: {
      color: theme.colors.textMuted,
    },
  });

export default function ReportScreen() {
  const { vendorId } = useLocalSearchParams<{ vendorId: string }>();
  const router = useRouter();
  const theme = useTheme();
  const styles = createStyles(theme);

  const {
    currentReport,
    initializeReport,
    updateReportData,
    submitReport,
    clearCurrentReport,
    isSubmitting,
    error,
    clearError,
  } = useReportsStore();

  const { user } = useUserStore();

  const [currentStep, setCurrentStep] = useState(0);
  const [description, setDescription] = useState("");
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);

  const vendor = mockVendors.find((v) => v.id === vendorId);

  useEffect(() => {
    if (vendor && vendorId) {
      initializeReport(vendorId, vendor.name);
    }

    return () => {
      clearCurrentReport();
    };
  }, [vendor, vendorId]);

  useEffect(() => {
    if (error) {
      Alert.alert("Error", error);
      clearError();
    }
  }, [error]);

  const handleBack = () => {
    if (currentStep === 0) {
      router.back();
    } else {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleNext = () => {
    if (currentStep < 2) {
      if (currentStep === 0 && !currentReport?.category) {
        Alert.alert("Error", "Please select a reason for reporting.");
        return;
      }
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleCategorySelect = (category: string) => {
    updateReportData({ category });
  };

  const handleDescriptionChange = (text: string) => {
    setDescription(text);
    updateReportData({ description: text });
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
        const updatedPhotos = [...selectedPhotos, ...newPhotos];
        setSelectedPhotos(updatedPhotos);
        updateReportData({ photos: updatedPhotos });
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
    updateReportData({ photos: updatedPhotos });
  };

  const renderPhotoItem = (photo: string, index: number) => (
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
  );

  const handleSubmit = async () => {
    if (!user) {
      Alert.alert("Error", "Please log in to submit a report.");
      return;
    }

    try {
      await submitReport(user.id);
      Alert.alert(
        "Report Submitted",
        "Thank you for your report. We'll review it and take appropriate action.",
        [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      console.error("Error submitting report:", error);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return !!currentReport?.category;
      case 1:
        return true; // Description and photos are optional
      case 2:
        return true; // Summary step
      default:
        return false;
    }
  };

  const getButtonText = () => {
    if (currentStep === 2) {
      return isSubmitting ? "Submitting..." : "Submit";
    }
    return "Next";
  };

  const renderStepOne = () => (
    <>
      <View style={styles.titleContainer}>
        <ThemedText style={styles.title}>
          Why are you reporting this vendor?
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          This will not be shared with the vendor
        </ThemedText>
      </View>

      <View style={styles.optionsContainer}>
        {REPORT_CATEGORIES.map((category) => (
          <TouchableOpacity
            key={category}
            style={styles.optionItem}
            onPress={() => handleCategorySelect(category)}
          >
            <View style={styles.optionContent}>
              <ThemedText style={styles.optionTitle}>{category}</ThemedText>
            </View>
            <RadioButton
              selected={currentReport?.category === category}
              onPress={() => handleCategorySelect(category)}
              size="small"
            />
          </TouchableOpacity>
        ))}
      </View>
    </>
  );

  const renderStepTwo = () => (
    <>
      <View style={styles.titleContainer}>
        <ThemedText style={styles.title}>
          Tell us about what happened
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          What led you to this conclusion
        </ThemedText>
      </View>

      <View style={{ gap: rs(16) }}>
        <TextInput
          placeholder="Tell us about what happened..."
          value={description}
          onChangeText={handleDescriptionChange}
          multiline
          numberOfLines={6}
          style={styles.textArea}
          placeholderTextColor="#8F9098"
        />

        <TouchableOpacity
          style={styles.addPhotosButton}
          onPress={handleAddPhotos}
        >
          <Ionicons name="add" size={rf(16)} color={theme.colors.primary} />
          <ThemedText style={styles.addPhotosText}>Add Photos</ThemedText>
        </TouchableOpacity>

        {selectedPhotos.length > 0 && (
          <View style={styles.photosContainer}>
            {selectedPhotos.map((photo, index) =>
              renderPhotoItem(photo, index)
            )}
          </View>
        )}
      </View>
    </>
  );

  const renderStepThree = () => (
    <>
      <View style={styles.titleContainer}>
        <ThemedText style={styles.title}>Double check</ThemedText>
        <ThemedText style={styles.subtitle}>
          What led you to this conclusion
        </ThemedText>
      </View>

      <View style={styles.summaryContainer}>
        <View style={styles.summarySection}>
          <ThemedText style={styles.summaryLabel}>Category</ThemedText>
          <ThemedText style={styles.summaryValue}>
            {currentReport?.category}
          </ThemedText>
        </View>

        <View style={styles.summarySection}>
          <ThemedText style={styles.summaryLabel}>Description</ThemedText>
          <ThemedText style={styles.summaryValue}>
            {currentReport?.description || "No description provided"}
          </ThemedText>
        </View>

        {selectedPhotos.length > 0 && (
          <View style={styles.photosContainer}>
            {selectedPhotos.map((photo, index) =>
              renderPhotoItem(photo, index)
            )}
          </View>
        )}
      </View>
    </>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return renderStepOne();
      case 1:
        return renderStepTwo();
      case 2:
        return renderStepThree();
      default:
        return renderStepOne();
    }
  };

  if (!vendor) {
    return (
      <View style={styles.container}>
        <View
          style={[
            styles.container,
            { justifyContent: "center", alignItems: "center" },
          ]}
        >
          <ThemedText>Vendor not found</ThemedText>
        </View>
      </View>
    );
  }

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
        {renderCurrentStep()}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.progressContainer}>
          <ProgressDots currentStep={currentStep} totalSteps={3} />
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
    </View>
  );
}
