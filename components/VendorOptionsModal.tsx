import { getLineHeight, rf, rs } from "@/constants/Responsive";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { FavouritesTab } from "./FavouritesTabs";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

interface VendorOptionsModalProps {
  visible: boolean;
  onClose: () => void;
  tab: FavouritesTab;
  vendorName: string;
  onContact?: () => void;
  onShare?: () => void;
  onMoveToSuperliked?: () => void;
  onMoveToLiked?: () => void;
  onRemove?: () => void;
  onReport?: () => void;
}

export const VendorOptionsModal: React.FC<VendorOptionsModalProps> = ({
  visible,
  onClose,
  tab,
  vendorName,
  onContact,
  onShare,
  onMoveToSuperliked,
  onMoveToLiked,
  onRemove,
  onReport,
}) => {
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

  const handleClose = () => {
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
  };

  const renderOption = (
    icon: string,
    title: string,
    description: string,
    onPress: () => void,
    iconColor: string = "#000000"
  ) => (
    <TouchableOpacity style={styles.option} onPress={onPress}>
      <View style={styles.optionIcon}>
        <Ionicons name={icon as any} size={rf(26)} color={iconColor} />
      </View>
      <View style={styles.optionContent}>
        <Text style={styles.optionTitle}>{title}</Text>
        <Text style={styles.optionDescription}>{description}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderDivider = () => <View style={styles.divider} />;

  const renderLikedOptions = () => (
    <>
      {renderOption(
        "send",
        "Contact",
        "Reach out to the vendor of your choice",
        onContact || (() => {})
      )}
      {renderDivider()}
      {renderOption(
        "share-outline",
        "Share",
        "Show your friends the vendor you discovered",
        onShare || (() => {})
      )}
      {renderDivider()}
      {renderOption(
        "heart",
        "Move to Super Liked",
        "Upgrade this vendor to super liked",
        onMoveToSuperliked || (() => {})
      )}
      {renderDivider()}
      {renderOption(
        "close",
        "Remove Vendor",
        "Not interested anymore? Remove it from your list",
        onRemove || (() => {})
      )}
      {renderDivider()}
      {renderOption(
        "warning",
        "Report Vendor",
        "Something isn't right? Let us know!",
        onReport || (() => {})
      )}
    </>
  );

  const renderSuperlikedOptions = () => (
    <>
      {renderOption(
        "send",
        "Contact",
        "Reach out to the vendor of your choice",
        onContact || (() => {})
      )}
      {renderDivider()}
      {renderOption(
        "share-outline",
        "Share",
        "Show your friends the vendor you discovered",
        onShare || (() => {})
      )}
      {renderDivider()}
      {renderOption(
        "heart-outline",
        "Move back to liked",
        "Move the vendor back to liked",
        onMoveToLiked || (() => {})
      )}
      {renderDivider()}
      {renderOption(
        "close",
        "Remove Vendor",
        "Not interested anymore? Remove it from your list",
        onRemove || (() => {})
      )}
      {renderDivider()}
      {renderOption(
        "warning",
        "Report Vendor",
        "Something isn't right? Let us know!",
        onReport || (() => {})
      )}
    </>
  );

  const renderContactedOptions = () => (
    <>
      {renderOption(
        "share-outline",
        "Share",
        "Show your friends the vendor you discovered",
        onShare || (() => {})
      )}
      {renderDivider()}
      {renderOption(
        "close",
        "Remove Vendor",
        "Not interested anymore? Remove it from your list",
        onRemove || (() => {})
      )}
      {renderDivider()}
      {renderOption(
        "warning",
        "Report Vendor",
        "Something isn't right? Let us know!",
        onReport || (() => {})
      )}
    </>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback onPress={handleClose}>
        <Animated.View
          style={[
            styles.overlay,
            {
              opacity: overlayOpacity,
            },
          ]}
        />
      </TouchableWithoutFeedback>

      <Animated.View
        style={[
          styles.modal,
          {
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Options</Text>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Ionicons name="close" size={rf(18)} color="#000000" />
          </TouchableOpacity>
        </View>

        {/* Options */}
        <View style={styles.optionsContainer}>
          {tab === FavouritesTab.LIKED && renderLikedOptions()}
          {tab === FavouritesTab.SUPERLIKED && renderSuperlikedOptions()}
          {tab === FavouritesTab.CONTACTED && renderContactedOptions()}
        </View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: rs(12),
    borderTopRightRadius: rs(12),
    paddingBottom: rs(34), // Safe area padding
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: rs(16),
    paddingHorizontal: rs(24),
  },
  title: {
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    fontWeight: "800",
    fontSize: rf(24),
    lineHeight: getLineHeight(rf(24), 1.2),
    letterSpacing: 0.01,
    color: "#000000",
  },
  closeButton: {
    width: rs(18),
    height: rs(18),
    justifyContent: "center",
    alignItems: "center",
  },
  optionsContainer: {
    paddingHorizontal: rs(18),
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: rs(16),
    paddingHorizontal: rs(18),
    gap: rs(24),
  },
  optionIcon: {
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
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    fontWeight: "500",
    fontSize: rf(14),
    lineHeight: getLineHeight(rf(14), 1.43),
    color: "#000000",
  },
  optionDescription: {
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    fontWeight: "500",
    fontSize: rf(12),
    lineHeight: getLineHeight(rf(12), 1.33),
    letterSpacing: 0.01,
    color: "#808080",
  },
  divider: {
    height: rs(0.5),
    backgroundColor: "#D4D6DD",
    marginHorizontal: rs(18),
  },
});
