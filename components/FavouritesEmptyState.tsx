import { getLineHeight, rf, rs } from "@/constants/Responsive";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { FavouritesTab } from "./FavouritesTabs";

interface FavouritesEmptyStateProps {
  tab: FavouritesTab;
}

export const FavouritesEmptyState: React.FC<FavouritesEmptyStateProps> = ({
  tab,
}) => {
  const getEmptyStateContent = () => {
    switch (tab) {
      case FavouritesTab.LIKED:
        return {
          icon: "heart-outline" as const,
          title: "Nothing here. For now.",
          subtitle: "This is where you'll find your liked vendors",
          buttonText: "Go Explore",
          onButtonPress: () => router.push("/(tabs)"),
        };
      case FavouritesTab.SUPERLIKED:
        return {
          icon: "heart" as const,
          title: "Nothing here. For now.",
          subtitle: "This is where you'll find your super liked vendors",
          buttonText: "Go Explore",
          onButtonPress: () => router.push("/(tabs)"),
        };
      case FavouritesTab.CONTACTED:
        return {
          icon: "chatbubble-outline" as const,
          title: "Nothing here. For now.",
          subtitle: "This is where you'll find vendors you've contacted",
          buttonText: "Go Explore",
          onButtonPress: () => router.push("/(tabs)"),
        };
      default:
        return {
          icon: "heart-outline" as const,
          title: "Nothing here. For now.",
          subtitle: "This is where you'll find your favourite vendors",
          buttonText: "Go Explore",
          onButtonPress: () => router.push("/(tabs)"),
        };
    }
  };

  const { icon, title, subtitle, buttonText, onButtonPress } =
    getEmptyStateContent();

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons name={icon} size={rf(32)} color="#FDF2F2" />
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={onButtonPress}>
        <Text style={styles.buttonText}>{buttonText}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: rs(32),
    padding: rs(24),
  },
  iconContainer: {
    width: rs(100),
    height: rs(100),
    borderRadius: rs(24),
    backgroundColor: "#EBEBEB",
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    gap: rs(8),
    alignItems: "center",
  },
  title: {
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    fontWeight: "800",
    fontSize: rf(18),
    lineHeight: getLineHeight(rf(18), 1.2),
    letterSpacing: 0.005,
    color: "#1F2024",
    textAlign: "center",
  },
  subtitle: {
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    fontWeight: "500",
    fontSize: rf(14),
    lineHeight: getLineHeight(rf(14), 1.43),
    color: "#71727A",
    textAlign: "center",
    maxWidth: rs(238),
  },
  button: {
    backgroundColor: "#7B1513",
    borderRadius: rs(12),
    paddingVertical: rs(12),
    paddingHorizontal: rs(16),
    height: rs(40),
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    fontWeight: "600",
    fontSize: rf(12),
    lineHeight: getLineHeight(rf(12), 1.21),
    color: "#FFFFFF",
  },
});
