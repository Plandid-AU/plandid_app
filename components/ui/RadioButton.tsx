import { rs } from "@/constants/Responsive";
import { useTheme } from "@/hooks/useTheme";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export interface RadioButtonProps {
  selected: boolean;
  onPress: () => void;
  size?: "small" | "medium" | "large";
  disabled?: boolean;
}

const createStyles = (theme: any, size: string) => {
  const sizes = {
    small: { width: rs(16), height: rs(16), innerSize: rs(6) },
    medium: { width: rs(20), height: rs(20), innerSize: rs(8) },
    large: { width: rs(24), height: rs(24), innerSize: rs(10) },
  };

  const currentSize = sizes[size as keyof typeof sizes] || sizes.medium;

  return StyleSheet.create({
    container: {
      width: currentSize.width,
      height: currentSize.height,
      borderRadius: currentSize.width / 2,
      borderWidth: 1.5,
      borderColor: theme.colors.borderLight,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.colors.backgroundPrimary,
    },
    containerSelected: {
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.backgroundPrimary,
    },
    containerDisabled: {
      opacity: 0.5,
    },
    inner: {
      width: currentSize.innerSize,
      height: currentSize.innerSize,
      borderRadius: currentSize.innerSize / 2,
      backgroundColor: theme.colors.primary,
    },
  });
};

export const RadioButton: React.FC<RadioButtonProps> = ({
  selected,
  onPress,
  size = "medium",
  disabled = false,
}) => {
  const theme = useTheme();
  const styles = createStyles(theme, size);

  return (
    <TouchableOpacity
      style={[
        styles.container,
        selected && styles.containerSelected,
        disabled && styles.containerDisabled,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      {selected && <View style={styles.inner} />}
    </TouchableOpacity>
  );
};
