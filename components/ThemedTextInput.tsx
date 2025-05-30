import { useTheme } from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import React, { forwardRef, useState } from "react";
import {
  StyleSheet,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { ThemedText } from "./ThemedText";

export type ThemedTextInputProps = TextInputProps & {
  label?: string;
  supportText?: string;
  showSupportText?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  showIcon?: boolean;
  error?: string;
  variant?: "default" | "filled" | "outlined";
  size?: "sm" | "base" | "lg";
  isPassword?: boolean;
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      gap: theme.spacing.base,
    },
    label: {
      color: theme.colors.textSecondary,
    },
    fieldContainer: {
      borderWidth: 1,
      borderColor: theme.colors.gray600,
      borderRadius: theme.borderRadius.xl,
      backgroundColor: theme.colors.backgroundPrimary,
    },
    fieldContainerFocused: {
      borderColor: theme.colors.primary,
    },
    fieldContainerError: {
      borderColor: theme.colors.error,
    },
    contentContainer: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: theme.spacing["2xl"],
      paddingVertical: theme.spacing["2xl"],
      gap: theme.spacing.base,
      minHeight: 56,
      overflow: "hidden",
    },
    textInput: {
      flex: 1,
      fontFamily: theme.typography.fontFamily.primary,
      fontSize: theme.typography.fontSize.base,
      fontWeight: theme.typography.fontWeight.medium,
      lineHeight: Math.round(theme.typography.fontSize.base * 1.2),
      color: theme.colors.textPrimary,
      padding: 0,
      margin: 0,
      textAlignVertical: "center",
      includeFontPadding: false,
      height: Math.round(theme.typography.fontSize.base * 1.4),
    },
    placeholder: {
      color: theme.colors.textDisabled,
    },
    iconContainer: {
      width: theme.sizes.icon.md,
      height: theme.sizes.icon.md,
      justifyContent: "center",
      alignItems: "center",
    },
    supportText: {
      color: theme.colors.textMuted,
    },
    errorText: {
      color: theme.colors.error,
    },
    // Size variants
    sizeSmall: {
      paddingVertical: theme.spacing.xl,
      minHeight: 48,
    },
    sizeLarge: {
      paddingVertical: theme.spacing["4xl"],
      minHeight: 64,
    },
  });

export const ThemedTextInput = forwardRef<TextInput, ThemedTextInputProps>(
  (
    {
      label,
      supportText,
      showSupportText = false,
      leftIcon,
      rightIcon,
      showIcon = false,
      error,
      variant = "default",
      size = "base",
      isPassword = false,
      style,
      onFocus,
      onBlur,
      ...props
    },
    ref
  ) => {
    const theme = useTheme();
    const styles = createStyles(theme);
    const [isFocused, setIsFocused] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const handleFocus = (e: any) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: any) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    const togglePasswordVisibility = () => {
      setIsPasswordVisible(!isPasswordVisible);
    };

    const getSizeStyle = () => {
      switch (size) {
        case "sm":
          return styles.sizeSmall;
        case "lg":
          return styles.sizeLarge;
        default:
          return {};
      }
    };

    const getFieldContainerStyle = (): ViewStyle[] => {
      const baseStyles: ViewStyle[] = [styles.fieldContainer];

      if (error) {
        baseStyles.push(styles.fieldContainerError);
      } else if (isFocused) {
        baseStyles.push(styles.fieldContainerFocused);
      }

      return baseStyles;
    };

    const renderPasswordIcon = () => {
      if (!isPassword) return null;

      return (
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={togglePasswordVisibility}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons
            name={isPasswordVisible ? "eye" : "eye-off"}
            size={theme.sizes.icon.md}
            color={theme.colors.textDisabled}
          />
        </TouchableOpacity>
      );
    };

    return (
      <View style={styles.container}>
        {label && (
          <ThemedText type="label" style={styles.label}>
            {label}
          </ThemedText>
        )}

        <View style={getFieldContainerStyle()}>
          <View style={[styles.contentContainer, getSizeStyle()]}>
            {leftIcon && <View style={styles.iconContainer}>{leftIcon}</View>}

            <View style={{ flex: 1, justifyContent: "center" }}>
              <TextInput
                ref={ref}
                style={[styles.textInput, style]}
                placeholderTextColor={theme.colors.textDisabled}
                onFocus={handleFocus}
                onBlur={handleBlur}
                secureTextEntry={isPassword && !isPasswordVisible}
                autoCapitalize={isPassword ? "none" : props.autoCapitalize}
                autoCorrect={isPassword ? false : props.autoCorrect}
                {...props}
              />
            </View>

            {isPassword && renderPasswordIcon()}
            {!isPassword && rightIcon && (
              <View style={styles.iconContainer}>{rightIcon}</View>
            )}
          </View>
        </View>

        {showSupportText && supportText && !error && (
          <ThemedText type="caption" style={styles.supportText}>
            {supportText}
          </ThemedText>
        )}

        {error && (
          <ThemedText type="caption" style={styles.errorText}>
            {error}
          </ThemedText>
        )}
      </View>
    );
  }
);

ThemedTextInput.displayName = "ThemedTextInput";
