import { rs } from "@/constants/Responsive";
import { useTheme } from "@/hooks/useTheme";
import React from "react";
import { StyleSheet, View } from "react-native";

interface ProgressDotsProps {
  currentStep: number;
  totalSteps: number;
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      gap: rs(8),
    },
    dot: {
      height: rs(8),
      borderRadius: rs(4),
    },
    activeDot: {
      width: rs(32),
      backgroundColor: theme.colors.primary,
    },
    inactiveDot: {
      width: rs(8),
      backgroundColor: theme.colors.textPrimary,
      opacity: 0.1,
    },
  });

export const ProgressDots: React.FC<ProgressDotsProps> = ({
  currentStep,
  totalSteps,
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      {Array.from({ length: totalSteps }, (_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            index === currentStep ? styles.activeDot : styles.inactiveDot,
          ]}
        />
      ))}
    </View>
  );
};
