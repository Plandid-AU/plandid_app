import { rf, rs } from "@/constants/Responsive";
import { useTheme } from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  Image,
  Linking,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

interface ShareModalProps {
  visible: boolean;
  onClose: () => void;
  vendor?: {
    id: string;
    name: string;
    location?: string;
    avatar?: string;
  };
}

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
    modal: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: theme.colors.backgroundPrimary,
      borderTopLeftRadius: theme.borderRadius.xl,
      borderTopRightRadius: theme.borderRadius.xl,
      paddingBottom: Math.max(theme.layout.safeAreaBottom || 20, 20),
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingTop: theme.spacing["4xl"],
      paddingBottom: theme.spacing["2xl"],
      paddingHorizontal: theme.spacing["3xl"],
    },
    headerTitle: {
      fontFamily: "Urbanist",
      fontWeight: "800",
      fontSize: rf(24),
      lineHeight: rf(24) * 1.2,
      letterSpacing: 0.24,
      color: theme.colors.textPrimary,
    },
    closeButton: {
      width: rs(18),
      height: rs(18),
      justifyContent: "center",
      alignItems: "center",
    },
    vendorInfo: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing["2xl"],
      paddingHorizontal: theme.spacing["3xl"],
      marginBottom: theme.spacing["3xl"],
    },
    vendorAvatar: {
      width: rs(40),
      height: rs(40),
      borderRadius: rs(20),
      backgroundColor: theme.colors.primaryLight,
      justifyContent: "center",
      alignItems: "center",
    },
    vendorAvatarText: {
      fontSize: rf(14),
      fontWeight: "700",
      color: theme.colors.primary,
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
    vendorLocation: {
      fontFamily: "Inter",
      fontWeight: "500",
      fontSize: rf(12),
      lineHeight: rf(12) * 1.33,
      letterSpacing: 0.12,
      color: theme.colors.textMuted,
    },
    imagePreview: {
      backgroundColor: theme.colors.gray400,
      borderRadius: theme.borderRadius.xl,
      marginHorizontal: theme.spacing["3xl"],
      marginBottom: theme.spacing["3xl"],
      height: rs(120),
      overflow: "hidden",
      position: "relative",
    },
    vendorImage: {
      width: "100%",
      height: "100%",
      resizeMode: "cover",
    },
    imageFallback: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    previewDots: {
      position: "absolute",
      bottom: rs(12),
      alignSelf: "center",
      flexDirection: "row",
      alignItems: "center",
      gap: rs(6),
    },
    previewDot: {
      width: rs(6),
      height: rs(6),
      borderRadius: rs(3),
    },
    activeDot: {
      backgroundColor: theme.colors.backgroundPrimary,
    },
    inactiveDot: {
      backgroundColor: theme.colors.gray500,
    },
    smallDot: {
      width: rs(5),
      height: rs(5),
      borderRadius: rs(2.5),
    },
    smallestDot: {
      width: rs(4),
      height: rs(4),
      borderRadius: rs(2),
    },
    socialContainer: {
      flexDirection: "row",
      justifyContent: "center",
      gap: theme.spacing["3xl"],
      paddingHorizontal: theme.spacing["3xl"],
      marginBottom: theme.spacing["3xl"],
    },
    socialButton: {
      width: rs(48),
      height: rs(48),
      borderRadius: theme.borderRadius.xl,
      backgroundColor: theme.colors.primary,
      justifyContent: "center",
      alignItems: "center",
    },
    linkContainer: {
      paddingHorizontal: theme.spacing["3xl"],
      marginBottom: theme.spacing["3xl"],
    },
    linkInput: {
      borderWidth: 1,
      borderColor: theme.colors.gray600,
      borderRadius: theme.borderRadius.xl,
      paddingHorizontal: theme.spacing["2xl"],
      paddingVertical: theme.spacing.xl,
      fontSize: rf(14),
      color: theme.colors.textPrimary,
      fontFamily: "Inter",
      fontWeight: "500",
    },
    copyButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.borderRadius.xl,
      paddingVertical: theme.spacing.xl,
      paddingHorizontal: theme.spacing["2xl"],
      marginHorizontal: theme.spacing["3xl"],
      marginBottom: theme.spacing["4xl"],
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      gap: theme.spacing.base,
      height: rs(40),
    },
    copyButtonText: {
      color: theme.colors.backgroundPrimary,
      fontSize: rf(12),
      fontWeight: "600",
      fontFamily: "Inter",
    },
  });

export const ShareModal: React.FC<ShareModalProps> = ({
  visible,
  onClose,
  vendor,
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const [linkText] = useState("https://plandid.com.au/listing-number");

  const handleClose = useCallback(() => {
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
    ]).start(() => {
      onClose();
    });
  }, [overlayOpacity, slideAnim, onClose]);

  const handleCopyLink = useCallback(async () => {
    try {
      await Clipboard.setStringAsync(linkText);
      Alert.alert("Copied!", "Link copied to clipboard");
      handleClose();
    } catch (error) {
      Alert.alert("Error", "Failed to copy link");
    }
  }, [linkText, handleClose]);

  const handleSocialShare = useCallback(
    async (platform: string) => {
      const shareText = vendor
        ? `Check out ${vendor.name} on Plandid! ${linkText}`
        : `Check out this vendor on Plandid! ${linkText}`;

      let url = "";

      switch (platform) {
        case "messages":
          if (Platform.OS === "ios") {
            url = `sms:&body=${encodeURIComponent(shareText)}`;
          } else {
            url = `sms:?body=${encodeURIComponent(shareText)}`;
          }
          break;
        case "facebook":
          url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            linkText
          )}`;
          break;
        case "messenger":
          url = `fb-messenger://share?link=${encodeURIComponent(linkText)}`;
          break;
        case "gmail":
          url = `mailto:?subject=${encodeURIComponent(
            "Check out this vendor!"
          )}&body=${encodeURIComponent(shareText)}`;
          break;
        case "discord":
          await Clipboard.setStringAsync(shareText);
          Alert.alert(
            "Copied!",
            "Link copied to clipboard. Open Discord to share!"
          );
          handleClose();
          return;
      }

      try {
        const canOpen = await Linking.canOpenURL(url);
        if (canOpen) {
          await Linking.openURL(url);
          handleClose();
        } else {
          await Clipboard.setStringAsync(shareText);
          Alert.alert("App not found", "Link copied to clipboard instead");
          handleClose();
        }
      } catch (error) {
        await Clipboard.setStringAsync(shareText);
        Alert.alert(
          "Link copied",
          "Couldn't open app, link copied to clipboard"
        );
        handleClose();
      }
    },
    [vendor, linkText, handleClose]
  );

  const getVendorInitials = useCallback((name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }, []);

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

  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="none">
      <TouchableWithoutFeedback onPress={handleClose}>
        <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]} />
      </TouchableWithoutFeedback>

      <Animated.View
        style={[styles.modal, { transform: [{ translateY: slideAnim }] }]}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Share Your Vendor</Text>
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <Ionicons name="close" size={rf(18)} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Vendor Info */}
        <View style={styles.vendorInfo}>
          <View style={styles.vendorAvatar}>
            <Text style={styles.vendorAvatarText}>
              {vendor?.name ? getVendorInitials(vendor.name) : "AL"}
            </Text>
          </View>
          <View style={styles.vendorDetails}>
            <Text style={styles.vendorName}>
              {vendor?.name || "Artful Lens"}
            </Text>
            <Text style={styles.vendorLocation}>
              {vendor?.location || "Melbourne, VIC"}
            </Text>
          </View>
        </View>

        {/* Image Preview */}
        <View style={styles.imagePreview}>
          {vendor?.avatar ? (
            <Image source={{ uri: vendor.avatar }} style={styles.vendorImage} />
          ) : (
            <View style={styles.imageFallback}>
              <View style={styles.previewDots}>
                <View style={[styles.previewDot, styles.activeDot]} />
                <View style={[styles.previewDot, styles.inactiveDot]} />
                <View style={[styles.previewDot, styles.inactiveDot]} />
                <View
                  style={[
                    styles.previewDot,
                    styles.inactiveDot,
                    styles.smallDot,
                  ]}
                />
                <View
                  style={[
                    styles.previewDot,
                    styles.inactiveDot,
                    styles.smallestDot,
                  ]}
                />
              </View>
            </View>
          )}
          {vendor?.avatar && (
            <View style={styles.previewDots}>
              <View style={[styles.previewDot, styles.activeDot]} />
              <View style={[styles.previewDot, styles.inactiveDot]} />
              <View style={[styles.previewDot, styles.inactiveDot]} />
              <View
                style={[styles.previewDot, styles.inactiveDot, styles.smallDot]}
              />
              <View
                style={[
                  styles.previewDot,
                  styles.inactiveDot,
                  styles.smallestDot,
                ]}
              />
            </View>
          )}
        </View>

        {/* Social Media Buttons */}
        <View style={styles.socialContainer}>
          <TouchableOpacity
            style={styles.socialButton}
            onPress={() => handleSocialShare("messages")}
          >
            <Ionicons name="chatbubble" size={rf(24)} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.socialButton}
            onPress={() => handleSocialShare("facebook")}
          >
            <Ionicons name="logo-facebook" size={rf(24)} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.socialButton}
            onPress={() => handleSocialShare("messenger")}
          >
            <Ionicons name="chatbubbles" size={rf(24)} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.socialButton}
            onPress={() => handleSocialShare("gmail")}
          >
            <Ionicons name="mail" size={rf(24)} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.socialButton}
            onPress={() => handleSocialShare("discord")}
          >
            <Ionicons name="logo-discord" size={rf(24)} color="white" />
          </TouchableOpacity>
        </View>

        {/* Link Input */}
        <View style={styles.linkContainer}>
          <Text style={styles.linkInput}>{linkText}</Text>
        </View>

        {/* Copy Button */}
        <TouchableOpacity style={styles.copyButton} onPress={handleCopyLink}>
          <Ionicons name="copy" size={rf(12)} color="white" />
          <Text style={styles.copyButtonText}>Copy Link</Text>
        </TouchableOpacity>
      </Animated.View>
    </Modal>
  );
};
