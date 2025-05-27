import { getLineHeight, rf, rs } from "@/constants/Responsive";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Modal,
  StyleSheet,
  Text,
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

export const Tooltip: React.FC<TooltipProps> = ({
  visible,
  onClose,
  title,
  message,
  position,
  arrowDirection = "up",
}) => {
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
    if (left < rs(16)) {
      left = rs(16);
    } else if (left + tooltipWidth > SCREEN_WIDTH - rs(16)) {
      left = SCREEN_WIDTH - tooltipWidth - rs(16);
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
    if (arrowLeft < rs(16)) {
      arrowLeft = rs(16);
    } else if (arrowLeft > tooltipStyle.width - rs(32)) {
      arrowLeft = tooltipStyle.width - rs(32);
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
        borderTopColor: "#1F2024",
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
        borderBottomColor: "#1F2024",
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
                <Text style={styles.title}>{title}</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <Ionicons name="close" size={rf(16)} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
              <Text style={styles.message}>{message}</Text>
            </View>
            <View style={getArrowStyle()} />
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "transparent",
  },
  tooltip: {
    position: "absolute",
    backgroundColor: "#1F2024",
    borderRadius: rs(12),
    padding: rs(16),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: rs(4),
    },
    shadowOpacity: 0.3,
    shadowRadius: rs(8),
    elevation: 8,
  },
  content: {
    gap: rs(8),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontFamily: "System",
    fontWeight: "700",
    fontSize: rf(14),
    lineHeight: getLineHeight(rf(14), 1.2),
    color: "#FFFFFF",
    flex: 1,
  },
  closeButton: {
    width: rs(24),
    height: rs(24),
    alignItems: "center",
    justifyContent: "center",
    marginLeft: rs(8),
  },
  message: {
    fontFamily: "System",
    fontWeight: "400",
    fontSize: rf(12),
    lineHeight: getLineHeight(rf(12), 1.33),
    color: "#FFFFFF",
  },
});
