import { useTheme } from "@/hooks/useTheme";
import React from "react";
import {
  ActivityIndicator,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";
import { ThemedText } from "./ThemedText";

export type ThemedButtonProps = TouchableOpacityProps & {
  title: string;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "base" | "lg";
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
};

export function ThemedButton({
  title,
  variant = "primary",
  size = "base",
  loading = false,
  leftIcon,
  rightIcon,
  style,
  disabled,
  ...rest
}: ThemedButtonProps) {
  const theme = useTheme();

  const buttonStyle = theme.components.button[variant];
  const sizeStyle = theme.sizes.button[size];

  const getTextType = () => {
    return variant === "primary" ? "buttonPrimary" : "buttonSecondary";
  };

  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[
        buttonStyle,
        sizeStyle,
        {
          flexDirection: "row",
          alignItems: "center",
          gap: theme.spacing.base,
          opacity: isDisabled ? 0.6 : 1,
        },
        style,
      ]}
      disabled={isDisabled}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={
            variant === "primary" ? theme.colors.white : theme.colors.primary
          }
        />
      ) : (
        <>
          {leftIcon}
          <ThemedText type={getTextType()}>{title}</ThemedText>
          {rightIcon}
        </>
      )}
    </TouchableOpacity>
  );
}
