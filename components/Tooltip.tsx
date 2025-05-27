import { ThemedText } from "@/components/ThemedText";
import { rs } from "@/constants/Responsive";
import { useTheme } from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface TooltipProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  message: string;
  position: { x: number; y: number };
  arrowDirection?: "up" | "down" | "left" | "right";
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: "transparent",
    },
    tooltip: {
      position: "absolute",
      backgroundColor: theme.colors.backgroundTooltip,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing["2xl"],
      ...theme.shadows.md,
    },
    content: {
      gap: theme.spacing.base,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    title: {
      flex: 1,
    },
    closeButton: {
      width: rs(24),
      height: rs(24),
      alignItems: "center",
      justifyContent: "center",
      marginLeft: theme.spacing.base,
    },
  });

export const Tooltip: React.FC<TooltipProps> = ({
  visible,
  onClose,
  title,
  message,
  position,
  arrowDirection = "up",
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const getTooltipStyle = () => {
    const tooltipWidth = rs(280);
    const tooltipHeight = rs(120);

    // Calculate position to keep tooltip on screen
    let left = position.x - tooltipWidth / 2;
    let top = position.y;

    // Adjust for screen boundaries
    if (left < theme.spacing["2xl"]) {
      left = theme.spacing["2xl"];
    } else if (left + tooltipWidth > SCREEN_WIDTH - theme.spacing["2xl"]) {
      left = SCREEN_WIDTH - tooltipWidth - theme.spacing["2xl"];
    }

    // Adjust vertical position based on arrow direction
    if (arrowDirection === "up") {
      top = position.y - tooltipHeight - rs(20);
    } else if (arrowDirection === "down") {
      top = position.y + rs(20);
    }

    return {
      left,
      top,
      width: tooltipWidth,
    };
  };

  const getArrowStyle = () => {
    const arrowSize = rs(8);
    const tooltipStyle = getTooltipStyle();

    let arrowLeft = position.x - tooltipStyle.left - arrowSize;

    // Keep arrow within tooltip bounds
    if (arrowLeft < theme.spacing["2xl"]) {
      arrowLeft = theme.spacing["2xl"];
    } else if (arrowLeft > tooltipStyle.width - theme.spacing["6xl"]) {
      arrowLeft = tooltipStyle.width - theme.spacing["6xl"];
    }

    const baseStyle = {
      position: "absolute" as const,
      width: 0,
      height: 0,
      backgroundColor: "transparent",
      borderStyle: "solid" as const,
      left: arrowLeft,
    };

    if (arrowDirection === "up") {
      return {
        ...baseStyle,
        bottom: -arrowSize,
        borderLeftWidth: arrowSize,
        borderRightWidth: arrowSize,
        borderTopWidth: arrowSize,
        borderLeftColor: "transparent",
        borderRightColor: "transparent",
        borderTopColor: theme.colors.backgroundTooltip,
      };
    } else {
      return {
        ...baseStyle,
        top: -arrowSize,
        borderLeftWidth: arrowSize,
        borderRightWidth: arrowSize,
        borderBottomWidth: arrowSize,
        borderLeftColor: "transparent",
        borderRightColor: "transparent",
        borderBottomColor: theme.colors.backgroundTooltip,
      };
    }
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <Animated.View
            style={[
              styles.tooltip,
              getTooltipStyle(),
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <View style={styles.content}>
              <View style={styles.header}>
                <ThemedText
                  type="label"
                  style={[styles.title, { color: theme.colors.white }]}
                >
                  {title}
                </ThemedText>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <Ionicons
                    name="close"
                    size={theme.sizes.icon.md}
                    color={theme.colors.white}
                  />
                </TouchableOpacity>
              </View>
              <ThemedText
                type="bodySmall"
                style={{ color: theme.colors.white }}
              >
                {message}
              </ThemedText>
            </View>
            <View style={getArrowStyle()} />
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
