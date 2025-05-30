import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export interface ListItemProps {
  title: string;
  subtitle?: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
  showArrow?: boolean;
  disabled?: boolean;
}

export const ListItem: React.FC<ListItemProps> = ({
  title,
  subtitle,
  onPress,
  rightElement,
  showArrow = false,
  disabled = false,
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  const handlePress = () => {
    if (!disabled && onPress) {
      onPress();
    }
  };

  const content = (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.textContainer}>
          <ThemedText type="body" style={styles.title}>
            {title}
          </ThemedText>
          {subtitle && (
            <ThemedText type="caption" style={styles.subtitle}>
              {subtitle}
            </ThemedText>
          )}
        </View>
        <View style={styles.rightContainer}>
          {rightElement}
          {showArrow && (
            <Ionicons
              name="chevron-forward"
              size={theme.sizes.icon.sm}
              color={theme.colors.textMuted}
              style={styles.arrow}
            />
          )}
        </View>
      </View>
    </View>
  );

  if (onPress && !disabled) {
    return (
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.7}
        style={styles.touchable}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return <View style={styles.touchable}>{content}</View>;
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    touchable: {
      backgroundColor: theme.colors.backgroundPrimary,
    },
    container: {
      paddingHorizontal: theme.spacing["2xl"],
      paddingVertical: theme.spacing["2xl"],
    },
    contentContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: theme.spacing["2xl"],
    },
    textContainer: {
      flex: 1,
      gap: theme.spacing.xs,
    },
    title: {
      fontSize: theme.typography.fontSize.body,
      fontWeight: theme.typography.fontWeight.semiBold,
      color: theme.colors.textPrimary,
    },
    subtitle: {
      fontSize: theme.typography.fontSize.caption,
      color: theme.colors.textMuted,
    },
    rightContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.sm,
    },
    arrow: {
      marginLeft: theme.spacing.xs,
    },
  });
