import { Text, type TextProps } from "react-native";

import { useTextStyles } from "@/hooks/useTheme";
import { useThemeColor } from "@/hooks/useThemeColor";

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?:
    | "default"
    | "title"
    | "defaultSemiBold"
    | "subtitle"
    | "link"
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "body"
    | "bodyLarge"
    | "bodySmall"
    | "label"
    | "labelSmall"
    | "caption"
    | "captionSmall"
    | "buttonPrimary"
    | "buttonSecondary"
    | "vendorName"
    | "vendorLocation"
    | "vendorTagline"
    | "rating"
    | "feature";
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = "default",
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");
  const textStyles = useTextStyles();

  // Map legacy types to new theme types
  const getTextStyle = () => {
    switch (type) {
      case "default":
        return textStyles.body;
      case "title":
        return textStyles.h1;
      case "defaultSemiBold":
        return { ...textStyles.body, fontWeight: textStyles.body.fontWeight };
      case "subtitle":
        return textStyles.h3;
      case "link":
        return textStyles.link;
      // New theme-based types
      case "h1":
      case "h2":
      case "h3":
      case "h4":
      case "body":
      case "bodyLarge":
      case "bodySmall":
      case "label":
      case "labelSmall":
      case "caption":
      case "captionSmall":
      case "buttonPrimary":
      case "buttonSecondary":
      case "vendorName":
      case "vendorLocation":
      case "vendorTagline":
      case "rating":
      case "feature":
        return textStyles[type];
      default:
        return textStyles.body;
    }
  };

  const selectedStyle = getTextStyle();

  return (
    <Text
      style={[
        selectedStyle,
        // Override color if custom colors are provided
        lightColor || darkColor ? { color } : {},
        style,
      ]}
      {...rest}
    />
  );
}
