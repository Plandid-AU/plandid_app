import { rs } from "@/constants/Responsive";
import { useTheme } from "@/hooks/useTheme";
import React from "react";
import { StyleSheet, View } from "react-native";
import { ThemedText } from "./ThemedText";

interface ChatBubbleProps {
  message: string;
  type: "sent" | "received";
  showTip?: boolean;
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      maxWidth: "80%",
      marginVertical: rs(2),
    },
    sentContainer: {
      alignSelf: "flex-end",
    },
    receivedContainer: {
      alignSelf: "flex-start",
    },
    bubble: {
      paddingVertical: rs(12),
      paddingHorizontal: rs(16),
      borderRadius: rs(20),
    },
    sentBubble: {
      backgroundColor: theme.colors.primary,
    },
    receivedBubble: {
      backgroundColor: "#F8F9FE", // Light gray background for received messages
    },
    sentBubbleWithTip: {
      borderBottomRightRadius: 0,
    },
    receivedBubbleWithTip: {
      borderBottomLeftRadius: 0,
    },
    sentText: {
      color: theme.colors.white,
    },
    receivedText: {
      color: theme.colors.textPrimary,
    },
  });

export const ChatBubble: React.FC<ChatBubbleProps> = ({
  message,
  type,
  showTip = false,
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  const isSent = type === "sent";

  return (
    <View
      style={[
        styles.container,
        isSent ? styles.sentContainer : styles.receivedContainer,
      ]}
    >
      <View
        style={[
          styles.bubble,
          isSent ? styles.sentBubble : styles.receivedBubble,
          showTip && isSent && styles.sentBubbleWithTip,
          showTip && !isSent && styles.receivedBubbleWithTip,
        ]}
      >
        <ThemedText
          type="body"
          style={isSent ? styles.sentText : styles.receivedText}
        >
          {message}
        </ThemedText>
      </View>
    </View>
  );
};
