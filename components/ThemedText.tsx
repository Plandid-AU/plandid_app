import { StyleSheet, Text, type TextProps } from "react-native";

import { getLineHeight, rf } from "@/constants/Responsive";
import { useThemeColor } from "@/hooks/useThemeColor";

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: "default" | "title" | "defaultSemiBold" | "subtitle" | "link";
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = "default",
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

  return (
    <Text
      style={[
        { color },
        type === "default" ? styles.default : undefined,
        type === "title" ? styles.title : undefined,
        type === "defaultSemiBold" ? styles.defaultSemiBold : undefined,
        type === "subtitle" ? styles.subtitle : undefined,
        type === "link" ? styles.link : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: rf(16),
    lineHeight: getLineHeight(rf(16), 1.5),
  },
  defaultSemiBold: {
    fontSize: rf(16),
    lineHeight: getLineHeight(rf(16), 1.5),
    fontWeight: "600",
  },
  title: {
    fontSize: rf(32),
    fontWeight: "bold",
    lineHeight: getLineHeight(rf(32), 1.0),
  },
  subtitle: {
    fontSize: rf(20),
    fontWeight: "bold",
    lineHeight: getLineHeight(rf(20), 1.2),
  },
  link: {
    lineHeight: getLineHeight(rf(16), 1.875),
    fontSize: rf(16),
    color: "#0a7ea4",
  },
});
