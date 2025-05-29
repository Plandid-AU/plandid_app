import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { router } from "expo-router";
import React from "react";
import { Pressable, SafeAreaView, StyleSheet, View } from "react-native";

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.backgroundPrimary,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: theme.spacing["5xl"],
      paddingVertical: theme.spacing["2xl"],
      gap: theme.spacing["2xl"],
    },
    backButton: {
      padding: theme.spacing.sm,
    },
    backIcon: {
      width: 12,
      height: 12,
      borderTopWidth: 2,
      borderLeftWidth: 2,
      borderColor: theme.colors.primary,
      transform: [{ rotate: "-45deg" }],
    },
    content: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: theme.spacing["5xl"],
    },
  });

export default function ReviewsScreen() {
  const theme = useTheme();
  const styles = createStyles(theme);

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={handleBack}>
          <View style={styles.backIcon} />
        </Pressable>
        <ThemedText type="h3">Reviews</ThemedText>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <ThemedText
          type="body"
          style={{
            color: theme.colors.textMuted,
            textAlign: "center",
          }}
        >
          Reviews page will be implemented here
        </ThemedText>
      </View>
    </SafeAreaView>
  );
}
