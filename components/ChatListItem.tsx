import { rf, rs } from "@/constants/Responsive";
import { useTheme } from "@/hooks/useTheme";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { ThemedText } from "./ThemedText";

interface ChatListItemProps {
  id: string;
  name: string;
  lastMessage: string;
  unreadCount?: number;
  avatar?: string;
  onPress: (id: string) => void;
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: rs(16),
      paddingVertical: rs(16),
      backgroundColor: theme.colors.backgroundPrimary,
      gap: rs(16),
    },
    avatar: {
      width: rs(40),
      height: rs(40),
      borderRadius: rs(20),
      backgroundColor: theme.colors.backgroundTertiary,
      justifyContent: "center",
      alignItems: "center",
    },
    avatarText: {
      fontSize: rf(16),
      fontWeight: "600",
      color: theme.colors.primary,
    },
    content: {
      flex: 1,
      gap: rs(4),
    },
    name: {
      fontSize: rf(12),
      fontWeight: "700",
      color: theme.colors.textPrimary,
    },
    lastMessage: {
      fontSize: rf(12),
      fontWeight: "500",
      color: theme.colors.textMuted,
      lineHeight: rf(16),
    },
    badge: {
      minWidth: rs(24),
      height: rs(24),
      borderRadius: rs(12),
      backgroundColor: theme.colors.primary,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: rs(6),
    },
    badgeText: {
      fontSize: rf(10),
      fontWeight: "600",
      color: theme.colors.white,
      textAlign: "center",
    },
  });

export const ChatListItem: React.FC<ChatListItemProps> = (props) => {
  const { id, name, lastMessage, unreadCount, onPress } = props;
  const theme = useTheme();
  const styles = createStyles(theme);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(id)}
      activeOpacity={0.7}
    >
      <View style={styles.avatar}>
        <ThemedText style={styles.avatarText}>{getInitials(name)}</ThemedText>
      </View>

      <View style={styles.content}>
        <ThemedText style={styles.name}>{name}</ThemedText>
        <ThemedText
          style={styles.lastMessage}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {lastMessage}
        </ThemedText>
      </View>

      {unreadCount != null && unreadCount > 0 && (
        <View style={styles.badge}>
          <ThemedText style={styles.badgeText}>
            {unreadCount > 99 ? "99+" : unreadCount.toString()}
          </ThemedText>
        </View>
      )}
    </TouchableOpacity>
  );
};
