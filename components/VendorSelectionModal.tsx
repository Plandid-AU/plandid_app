import { rf, rs } from "@/constants/Responsive";
import { mockVendors } from "@/data/mockData";
import { useTheme } from "@/hooks/useTheme";
import { useFavoritesStore } from "@/stores/favoritesStore";
import { Vendor } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { ThemedText } from "./ThemedText";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

interface VendorSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (vendor: Vendor) => void;
  selectedVendorId?: string;
}

export const VendorSelectionModal: React.FC<VendorSelectionModalProps> = ({
  visible,
  onClose,
  onSelect,
  selectedVendorId,
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const { contactedVendors } = useFavoritesStore();

  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Get contacted vendors
  const availableVendors = mockVendors.filter((vendor) =>
    contactedVendors.includes(vendor.id)
  );

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
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
  }, [visible]);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
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

  const handleVendorSelect = (vendor: Vendor) => {
    onSelect(vendor);
    handleClose();
  };

  const renderVendorItem = (vendor: Vendor) => (
    <TouchableOpacity
      key={vendor.id}
      style={styles.vendorItem}
      onPress={() => handleVendorSelect(vendor)}
      activeOpacity={0.7}
    >
      <View style={styles.vendorAvatar}>{/* Placeholder avatar */}</View>
      <View style={styles.vendorContent}>
        <ThemedText style={styles.vendorName}>{vendor.name}</ThemedText>
        <ThemedText style={styles.vendorLocation}>{vendor.location}</ThemedText>
      </View>
      <View style={styles.radioButton}>
        {selectedVendorId === vendor.id ? (
          <View style={styles.radioButtonSelected}>
            <View style={styles.radioButtonInner} />
          </View>
        ) : (
          <View style={styles.radioButtonUnselected} />
        )}
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <ThemedText style={styles.emptyStateText}>
        No vendors available to review
      </ThemedText>
      <ThemedText style={styles.emptyStateDescription}>
        You can only review vendors you have contacted
      </ThemedText>
    </View>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback onPress={handleClose}>
        <Animated.View style={[styles.overlay, { opacity: fadeAnim }]} />
      </TouchableWithoutFeedback>

      <Animated.View
        style={[
          styles.modalContainer,
          { transform: [{ translateY: slideAnim }] },
        ]}
      >
        <View style={styles.header}>
          <ThemedText style={styles.title}>Select Vendor</ThemedText>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Ionicons name="close" size={rf(18)} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {availableVendors.length > 0
            ? availableVendors.map(renderVendorItem)
            : renderEmptyState()}
        </ScrollView>
      </Animated.View>
    </Modal>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: "rgba(31, 32, 36, 0.4)",
    },
    modalContainer: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: theme.colors.backgroundPrimary,
      borderTopLeftRadius: rs(12),
      borderTopRightRadius: rs(12),
      paddingHorizontal: rs(24),
      paddingTop: rs(24),
      paddingBottom: rs(34),
      maxHeight: SCREEN_HEIGHT * 0.7,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: rs(6),
      paddingTop: rs(8),
      marginBottom: rs(16),
    },
    title: {
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
      alignItems: "center",
      justifyContent: "center",
    },
    scrollView: {
      flex: 1,
    },
    vendorItem: {
      flexDirection: "row",
      alignItems: "center",
      alignSelf: "stretch",
      gap: rs(16),
      padding: rs(16),
      marginBottom: rs(8),
      borderRadius: rs(16),
      borderWidth: 1,
      borderColor: "#D9D9D9",
      backgroundColor: theme.colors.backgroundPrimary,
      minHeight: rs(68),
    },
    vendorAvatar: {
      width: rs(40),
      height: rs(40),
      borderRadius: rs(20),
      backgroundColor: "#FDF2F2",
    },
    vendorContent: {
      flex: 1,
      justifyContent: "center",
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
    radioButton: {
      width: rs(16),
      height: rs(16),
    },
    radioButtonSelected: {
      width: rs(16),
      height: rs(16),
      borderRadius: rs(8),
      backgroundColor: theme.colors.primary,
      borderWidth: 1,
      borderColor: theme.colors.primary,
      justifyContent: "center",
      alignItems: "center",
    },
    radioButtonInner: {
      width: rs(6),
      height: rs(6),
      borderRadius: rs(3),
      backgroundColor: theme.colors.backgroundPrimary,
    },
    radioButtonUnselected: {
      width: rs(16),
      height: rs(16),
      borderRadius: rs(8),
      borderWidth: 1.5,
      borderColor: "#C5C6CC",
      backgroundColor: "transparent",
    },
    emptyStateContainer: {
      padding: rs(24),
      alignItems: "center",
      gap: rs(8),
    },
    emptyStateText: {
      fontFamily: "Urbanist",
      fontWeight: "700",
      fontSize: rf(16),
      lineHeight: rf(16) * 1.2,
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
    },
  });
