import { useTheme } from "@/hooks/useTheme";
import React from "react";
import { StyleSheet, View } from "react-native";

export interface DividerProps {
  style?: any;
  color?: string;
  thickness?: number;
}

export const Divider: React.FC<DividerProps> = ({
  style,
  color,
  thickness = 0.5,
}) => {
  const theme = useTheme();
  const styles = createStyles(theme, thickness, color);

  return <View style={[styles.divider, style]} />;
};

const createStyles = (theme: any, thickness: number, customColor?: string) =>
  StyleSheet.create({
    divider: {
      height: thickness,
      backgroundColor: customColor || theme.colors.border,
      marginLeft: theme.spacing["2xl"],
    },
  });
