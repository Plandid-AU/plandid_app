import { ThemedText } from "@/components/ThemedText";
import { rs } from "@/constants/Responsive";
import { useTheme } from "@/hooks/useTheme";
import React, { useMemo } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { Vendor } from "../types";

interface FavouritesVendorCardProps {
  vendor: Vendor;
  onPress: () => void;
  onMenuPress: () => void;
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.colors.backgroundPrimary,
      borderRadius: theme.borderRadius["2xl"],
      borderWidth: 1,
      borderColor: theme.colors.gray400,
      marginBottom: rs(18),
    },
    cardContent: {
      flexDirection: "row",
      alignItems: "center",
      padding: theme.spacing["2xl"],
      gap: theme.spacing["2xl"],
    },
    avatarContainer: {
      width: rs(40),
      height: rs(40),
      borderRadius: rs(20),
      backgroundColor: theme.colors.primaryLight,
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
      backgroundColor: theme.colors.backgroundDark,
    },
  });

export const FavouritesVendorCard: React.FC<FavouritesVendorCardProps> = ({
  vendor,
  onPress,
  onMenuPress,
}) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

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
          <ThemedText type="label">{vendor.name}</ThemedText>
          <ThemedText
            type="captionSmall"
            style={{ color: theme.colors.textMuted }}
          >
            {vendor.location}
          </ThemedText>
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
