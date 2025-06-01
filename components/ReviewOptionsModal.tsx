import { rs } from "@/constants/Responsive";
import { useTheme } from "@/hooks/useTheme";
import { Review } from "@/stores/reviewsStore";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Modal,
  Platform,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { ThemedText } from "./ThemedText";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

interface ReviewOptionsModalProps {
  visible: boolean;
  onClose: () => void;
  review: Review | null;
  onViewProfile: () => void;
  onContact: () => void;
  onShare: () => void;
  onReport: () => void;
}

export const ReviewOptionsModal: React.FC<ReviewOptionsModalProps> = ({
  visible,
  onClose,
  review,
  onViewProfile,
  onContact,
  onShare,
  onReport,
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
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
  }, [visible, overlayOpacity, slideAnim]);

  const options = [
    {
      id: "profile",
      icon: "person-outline" as const,
      title: "View Profile",
      description: "Check of their profile",
      onPress: onViewProfile,
    },
    {
      id: "contact",
      icon: "paper-plane-outline" as const,
      title: "Contact",
      description: "Reach out to the vendor of your choice",
      onPress: onContact,
    },
    {
      id: "share",
      icon: "share-outline" as const,
      title: "Share",
      description: "Show your friends the vendor you discovered",
      onPress: onShare,
    },
    {
      id: "report",
      icon: "warning-outline" as const,
      title: "Report Vendor",
      description: "Something isn't right? Let us know!",
      onPress: onReport,
    },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]} />
      </TouchableWithoutFeedback>

      <Animated.View
        style={[
          styles.modalContainer,
          { transform: [{ translateY: slideAnim }] },
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <ThemedText style={styles.title}>Options</ThemedText>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={rs(18)} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Options */}
        <View style={styles.optionsContainer}>
          {options.map((option, index) => (
            <View key={option.id}>
              <TouchableOpacity
                style={styles.optionItem}
                onPress={option.onPress}
                activeOpacity={0.7}
              >
                <View style={styles.iconContainer}>
                  <Ionicons
                    name={option.icon}
                    size={rs(26)}
                    color={theme.colors.primary}
                  />
                </View>
                <View style={styles.optionContent}>
                  <ThemedText style={styles.optionTitle}>
                    {option.title}
                  </ThemedText>
                  <ThemedText style={styles.optionDescription}>
                    {option.description}
                  </ThemedText>
                </View>
              </TouchableOpacity>
              {index < options.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </View>
      </Animated.View>
    </Modal>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    overlay: {
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
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingTop: theme.spacing["4xl"],
      paddingBottom: theme.spacing["2xl"],
      paddingHorizontal: theme.spacing["5xl"],
    },
    title: {
      fontFamily: "Urbanist",
      fontWeight: "800",
      fontSize: rs(24),
      lineHeight: rs(24) * 1.2,
      letterSpacing: 0.24,
      color: theme.colors.textPrimary,
    },
    closeButton: {
      width: rs(18),
      height: rs(18),
      justifyContent: "center",
      alignItems: "center",
    },
    optionsContainer: {
      paddingHorizontal: theme.spacing["3xl"],
      paddingBottom: theme.spacing["2xl"],
    },
    optionItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: theme.spacing["4xl"],
      paddingHorizontal: theme.spacing["3xl"],
      gap: theme.spacing["5xl"],
    },
    iconContainer: {
      width: rs(26),
      height: rs(26),
      justifyContent: "center",
      alignItems: "center",
    },
    optionContent: {
      flex: 1,
      gap: rs(4),
    },
    optionTitle: {
      fontFamily: "Inter",
      fontWeight: "500",
      fontSize: rs(14),
      lineHeight: rs(14) * 1.43,
      color: theme.colors.textPrimary,
    },
    optionDescription: {
      fontFamily: "Inter",
      fontWeight: "500",
      fontSize: rs(12),
      lineHeight: rs(12) * 1.33,
      color: "#808080",
    },
    divider: {
      height: rs(0.5),
      backgroundColor: "#D4D6DD",
      marginHorizontal: theme.spacing["3xl"],
    },
  });
