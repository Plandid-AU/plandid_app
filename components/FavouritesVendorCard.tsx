import { getLineHeight, rf, rs } from "@/constants/Responsive";
import React from "react";
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Vendor } from "../types";

interface FavouritesVendorCardProps {
  vendor: Vendor;
  onPress: () => void;
  onMenuPress: () => void;
}

export const FavouritesVendorCard: React.FC<FavouritesVendorCardProps> = ({
  vendor,
  onPress,
  onMenuPress,
}) => {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.95}
    >
      <View style={styles.cardContent}>
        {/* Avatar */}
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: vendor.images[0]?.url }}
            style={styles.avatar}
            resizeMode="cover"
          />
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.vendorName}>{vendor.name}</Text>
          <Text style={styles.vendorLocation}>{vendor.location}</Text>
        </View>

        {/* Three dots menu */}
        <TouchableOpacity
          style={styles.menuButton}
          onPress={onMenuPress}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <View style={styles.dotsContainer}>
            <View style={styles.dot} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: rs(16),
    borderWidth: 1,
    borderColor: "#D9D9D9",
    marginBottom: rs(18),
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: rs(16),
    gap: rs(16),
  },
  avatarContainer: {
    width: rs(40),
    height: rs(40),
    borderRadius: rs(20),
    backgroundColor: "#FDF2F2",
    overflow: "hidden",
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    gap: rs(4),
  },
  vendorName: {
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    fontWeight: "700",
    fontSize: rf(14),
    lineHeight: getLineHeight(rf(14), 1.2),
    color: "#1F2024",
  },
  vendorLocation: {
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    fontWeight: "500",
    fontSize: rf(12),
    lineHeight: getLineHeight(rf(12), 1.33),
    letterSpacing: 0.01,
    color: "#71727A",
  },
  menuButton: {
    padding: rs(4),
  },
  dotsContainer: {
    width: rs(24),
    height: rs(5.33),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dot: {
    width: rs(5.33),
    height: rs(5.33),
    borderRadius: rs(2.67),
    backgroundColor: "#030819",
  },
});
