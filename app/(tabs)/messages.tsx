import { ThemedText } from "@/components/ThemedText";
import { rs } from "@/constants/Responsive";
import { useTheme } from "@/hooks/useTheme";
import React from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.backgroundPrimary,
    },
    content: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: theme.spacing["5xl"],
    },
  });

export default function MessagesScreen() {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <ThemedText type="h3" style={{ marginBottom: rs(8) }}>
          Messages
        </ThemedText>
        <ThemedText
          type="body"
          style={{
            color: theme.colors.textMuted,
            textAlign: "center",
          }}
        >
          Your conversations with vendors will appear here
        </ThemedText>
      </View>
    </SafeAreaView>
  );
}
