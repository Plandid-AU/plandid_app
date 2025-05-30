import { useTheme } from "@/hooks/useTheme";
import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, TouchableOpacity } from "react-native";

export interface ToggleSwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  size?: "small" | "medium" | "large";
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  value,
  onValueChange,
  disabled = false,
  size = "medium",
}) => {
  const theme = useTheme();
  const translateX = useRef(new Animated.Value(value ? 1 : 0)).current;
  const styles = createStyles(theme, size);

  useEffect(() => {
    Animated.timing(translateX, {
      toValue: value ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [value, translateX]);

  const handlePress = () => {
    if (!disabled) {
      onValueChange(!value);
    }
  };

  const getDimensions = () => {
    switch (size) {
      case "small":
        return { width: 36, height: 20, thumbSize: 16 };
      case "large":
        return { width: 54, height: 32, thumbSize: 28 };
      default:
        return { width: 45, height: 28, thumbSize: 20 };
    }
  };

  const dimensions = getDimensions();
  const translateXValue = translateX.interpolate({
    inputRange: [0, 1],
    outputRange: [4, dimensions.width - dimensions.thumbSize - 4],
  });

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          width: dimensions.width,
          height: dimensions.height,
          backgroundColor: value
            ? theme.colors.primary
            : theme.colors.backgroundSecondary,
          opacity: disabled ? 0.5 : 1,
        },
      ]}
      onPress={handlePress}
      activeOpacity={0.8}
      disabled={disabled}
    >
      <Animated.View
        style={[
          styles.thumb,
          {
            width: dimensions.thumbSize,
            height: dimensions.thumbSize,
            transform: [{ translateX: translateXValue }],
          },
        ]}
      />
    </TouchableOpacity>
  );
};

const createStyles = (theme: any, size: string) =>
  StyleSheet.create({
    container: {
      borderRadius: 200,
      justifyContent: "center",
      position: "relative",
    },
    thumb: {
      backgroundColor: theme.colors.white,
      borderRadius: 200,
      position: "absolute",
      shadowColor: theme.colors.shadow,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
  });
