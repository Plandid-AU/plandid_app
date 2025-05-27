import { useTheme } from "@/hooks/useTheme";
import React from "react";
import { View, ViewProps } from "react-native";

export type ThemedCardProps = ViewProps & {
  variant?: "default" | "elevated" | "outlined" | "flat";
  padding?: keyof typeof import("@/constants/Theme").spacing;
};

export function ThemedCard({
  variant = "default",
  padding = "2xl",
  style,
  children,
  ...rest
}: ThemedCardProps) {
  const theme = useTheme();

  const getCardStyle = () => {
    const baseStyle = {
      backgroundColor: theme.colors.backgroundPrimary,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing[padding],
    };

    switch (variant) {
      case "elevated":
        return {
          ...baseStyle,
          ...theme.shadows.base,
        };
      case "outlined":
        return {
          ...baseStyle,
          borderWidth: 1,
          borderColor: theme.colors.borderLight,
        };
      case "flat":
        return {
          ...baseStyle,
          backgroundColor: "transparent",
        };
      case "default":
      default:
        return {
          ...baseStyle,
          borderWidth: 1,
          borderColor: theme.colors.borderLight,
          ...theme.shadows.base,
        };
    }
  };

  return (
    <View style={[getCardStyle(), style]} {...rest}>
      {children}
    </View>
  );
}
