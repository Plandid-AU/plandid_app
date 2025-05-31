import { rs } from "@/constants/Responsive";
import { useTheme } from "@/hooks/useTheme";
import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";

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
      marginBottom: rs(8),
    },
    dot: {
      height: rs(8),
      borderRadius: rs(4),
    },
  });

export const ProgressDots: React.FC<ProgressDotsProps> = ({
  currentStep,
  totalSteps,
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  // Create animation refs for each dot
  const dotAnimations = useRef<Animated.Value[]>([]);
  const opacityAnimations = useRef<Animated.Value[]>([]);

  // Initialize animations if not already done
  if (dotAnimations.current.length !== totalSteps) {
    dotAnimations.current = Array.from(
      { length: totalSteps },
      (_, index) => new Animated.Value(index === currentStep ? 1 : 0)
    );
    opacityAnimations.current = Array.from(
      { length: totalSteps },
      (_, index) => new Animated.Value(index === currentStep ? 1 : 0.1)
    );
  }

  useEffect(() => {
    // Animate all dots to their new states
    const animations = dotAnimations.current.map((anim, index) => {
      const isActive = index === currentStep;
      return Animated.parallel([
        Animated.spring(anim, {
          toValue: isActive ? 1 : 0,
          tension: 100,
          friction: 8,
          useNativeDriver: false,
        }),
        Animated.timing(opacityAnimations.current[index], {
          toValue: isActive ? 1 : 0.1,
          duration: 300,
          useNativeDriver: false,
        }),
      ]);
    });

    Animated.parallel(animations).start();
  }, [currentStep]);

  return (
    <View style={styles.container}>
      {Array.from({ length: totalSteps }, (_, index) => {
        const widthAnim = dotAnimations.current[index].interpolate({
          inputRange: [0, 1],
          outputRange: [rs(8), rs(32)],
        });

        const backgroundColorAnim = opacityAnimations.current[
          index
        ].interpolate({
          inputRange: [0, 1],
          outputRange: [theme.colors.textPrimary, theme.colors.primary],
        });

        return (
          <Animated.View
            key={index}
            style={[
              styles.dot,
              {
                width: widthAnim,
                backgroundColor: backgroundColorAnim,
                opacity: opacityAnimations.current[index],
              },
            ]}
          />
        );
      })}
    </View>
  );
};
