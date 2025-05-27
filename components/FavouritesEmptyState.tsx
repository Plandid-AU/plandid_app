import { ThemedText } from "@/components/ThemedText";
import { rs } from "@/constants/Responsive";
import { useTheme } from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { FavouritesTab } from "./FavouritesTabs";

interface FavouritesEmptyStateProps {
  tab: FavouritesTab;
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      gap: theme.spacing["6xl"],
      padding: theme.spacing["5xl"],
    },
    iconContainer: {
      width: rs(100),
      height: rs(100),
      borderRadius: theme.borderRadius["5xl"],
      backgroundColor: theme.colors.backgroundTertiary,
      justifyContent: "center",
      alignItems: "center",
    },
    textContainer: {
      gap: theme.spacing.base,
      alignItems: "center",
    },
    subtitle: {
      textAlign: "center",
      maxWidth: rs(238),
    },
    button: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.borderRadius.xl,
      paddingVertical: theme.spacing.xl,
      paddingHorizontal: theme.spacing["2xl"],
      height: theme.sizes.button.base.height,
      justifyContent: "center",
      alignItems: "center",
    },
  });

export const FavouritesEmptyState: React.FC<FavouritesEmptyStateProps> = ({
  tab,
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);

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
        <Ionicons
          name={icon}
          size={theme.sizes.icon["4xl"]}
          color={theme.colors.primaryLight}
        />
      </View>

      <View style={styles.textContainer}>
        <ThemedText type="h4">{title}</ThemedText>
        <ThemedText
          type="body"
          style={[styles.subtitle, { color: theme.colors.textMuted }]}
        >
          {subtitle}
        </ThemedText>
      </View>

      <TouchableOpacity style={styles.button} onPress={onButtonPress}>
        <ThemedText type="buttonPrimary">{buttonText}</ThemedText>
      </TouchableOpacity>
    </View>
  );
};
