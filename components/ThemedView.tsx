import { View, type ViewProps } from "react-native";

import { useThemeColors } from "@/hooks/useTheme";
import { useThemeColor } from "@/hooks/useThemeColor";

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  variant?: "primary" | "secondary" | "tertiary" | "dark" | "card";
};

export function ThemedView({
  style,
  lightColor,
  darkColor,
  variant = "primary",
  ...otherProps
}: ThemedViewProps) {
  const colors = useThemeColors();
  const themeColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background"
  );

  // If custom colors are provided, use the legacy behavior
  const backgroundColor =
    lightColor || darkColor ? themeColor : getBackgroundColor(variant, colors);

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}

function getBackgroundColor(variant: string, colors: any) {
  switch (variant) {
    case "primary":
      return colors.backgroundPrimary;
    case "secondary":
      return colors.backgroundSecondary;
    case "tertiary":
      return colors.backgroundTertiary;
    case "dark":
      return colors.backgroundDark;
    case "card":
      return colors.backgroundPrimary;
    default:
      return colors.backgroundPrimary;
  }
}
