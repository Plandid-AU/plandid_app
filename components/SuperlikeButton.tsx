import { Tooltip } from "@/components/Tooltip";
import { rf, rs } from "@/constants/Responsive";
import { useFavoritesStore } from "@/stores/favoritesStore";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, TouchableOpacity } from "react-native";

// const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface SuperlikeButtonProps {
  vendorId: string;
  style?: any;
  iconSize?: number;
  iconColor?: string;
  onPress?: () => void;
  showTooltips?: boolean;
}

export const SuperlikeButton: React.FC<SuperlikeButtonProps> = ({
  vendorId,
  style,
  iconSize = rf(22),
  iconColor = "#FFFAFC",
  onPress,
  showTooltips = true,
}) => {
  const {
    isFavorited,
    isSuperliked,
    toggleFavoriteVendor,
    toggleSuperlikeVendor,
    hasSeenSuperlikeTooltip,
    hasSeenUndoSuperlikeTooltip,
    hasCompletedFirstSuperlike,
    markTooltipSeen,
    loadUserPreferences,
  } = useFavoritesStore();

  // Animation refs
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const lightningAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  // State
  const [isLongPressing, setIsLongPressing] = useState(false);
  const [showSuperlikeTooltip, setShowSuperlikeTooltip] = useState(false);
  const [showUndoTooltip, setShowUndoTooltip] = useState(false);
  const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 });
  const buttonRef = useRef<any>(null);

  // Long press timer
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load user preferences on mount
  useEffect(() => {
    loadUserPreferences();
  }, [loadUserPreferences]);

  // Get current states
  const isCurrentlyFavorited = isFavorited(vendorId);
  const isCurrentlySuperliked = isSuperliked(vendorId);

  // Measure button position for tooltip
  const measureButton = useCallback(() => {
    if (buttonRef.current) {
      buttonRef.current.measure(
        (
          x: number,
          y: number,
          width: number,
          height: number,
          pageX: number,
          pageY: number
        ) => {
          setButtonPosition({
            x: pageX + width / 2,
            y: pageY,
          });
        }
      );
    }
  }, []);

  // Lightning animation for superlike
  const animateLightning = useCallback(() => {
    Animated.sequence([
      Animated.timing(lightningAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(lightningAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      rotateAnim.setValue(0);
    });
  }, [lightningAnim, rotateAnim]);

  // Pulse animation for regular like
  const animatePulse = useCallback(() => {
    Animated.sequence([
      Animated.timing(pulseAnim, {
        toValue: 1.2,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  }, [pulseAnim]);

  // Scale animation for press feedback
  const animatePress = useCallback(
    (pressed: boolean) => {
      Animated.timing(scaleAnim, {
        toValue: pressed ? 0.9 : 1,
        duration: 100,
        useNativeDriver: true,
      }).start();
    },
    [scaleAnim]
  );

  // Handle press start (for long press detection)
  const handlePressIn = useCallback(() => {
    animatePress(true);
    setIsLongPressing(false);

    // Start long press timer only if already favorited
    if (isCurrentlyFavorited && !isCurrentlySuperliked) {
      longPressTimer.current = setTimeout(() => {
        setIsLongPressing(true);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

        // Trigger superlike
        toggleSuperlikeVendor(vendorId).then((result) => {
          if (result.isSuperliked) {
            animateLightning();

            // Show undo tooltip if first time superliking
            if (showTooltips && !hasSeenUndoSuperlikeTooltip) {
              measureButton();
              setTimeout(() => setShowUndoTooltip(true), 500);
            }
          }
        });
      }, 800); // 800ms for long press
    }
  }, [
    isCurrentlyFavorited,
    isCurrentlySuperliked,
    toggleSuperlikeVendor,
    vendorId,
    animatePress,
    animateLightning,
    measureButton,
    showTooltips,
    hasSeenUndoSuperlikeTooltip,
  ]);

  // Handle press end
  const handlePressOut = useCallback(() => {
    animatePress(false);

    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }

    // If it wasn't a long press, handle regular tap
    if (!isLongPressing) {
      if (isCurrentlySuperliked) {
        // Tap on superliked item - remove superlike, keep as favorite
        toggleSuperlikeVendor(vendorId);
        animatePulse();
      } else if (isCurrentlyFavorited) {
        // Tap on favorited item - remove favorite completely
        toggleFavoriteVendor(vendorId);
        animatePulse();
      } else {
        // Tap on unfavorited item - add as favorite
        toggleFavoriteVendor(vendorId).then(() => {
          animatePulse();

          // Show superlike tooltip if conditions are met
          if (
            showTooltips &&
            !hasCompletedFirstSuperlike &&
            !hasSeenSuperlikeTooltip
          ) {
            measureButton();
            setTimeout(() => setShowSuperlikeTooltip(true), 300);
          }
        });
      }
    }

    setIsLongPressing(false);
    onPress?.();
  }, [
    isLongPressing,
    isCurrentlyFavorited,
    isCurrentlySuperliked,
    toggleFavoriteVendor,
    toggleSuperlikeVendor,
    vendorId,
    animatePress,
    animatePulse,
    measureButton,
    showTooltips,
    hasCompletedFirstSuperlike,
    hasSeenSuperlikeTooltip,
    onPress,
  ]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
      }
    };
  }, []);

  // Get icon name based on state
  const getIconName = () => {
    if (isCurrentlySuperliked) {
      return "flash"; // Lightning icon for superliked
    } else if (isCurrentlyFavorited) {
      return "heart"; // Filled heart for favorited
    } else {
      return "heart-outline"; // Outline heart for not favorited
    }
  };

  // Get icon color based on state
  const getIconColor = () => {
    if (isCurrentlySuperliked) {
      return "#FFD700"; // Gold for superliked
    } else {
      return iconColor;
    }
  };

  // Lightning overlay animation values
  const lightningOpacity = lightningAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const lightningScale = lightningAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 1.5],
  });

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <>
      <TouchableOpacity
        ref={buttonRef}
        style={[styles.heartButton, style]}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        <Animated.View
          style={[
            styles.heartIconContainer,
            {
              transform: [{ scale: Animated.multiply(scaleAnim, pulseAnim) }],
            },
          ]}
        >
          <Ionicons
            name={getIconName()}
            size={iconSize}
            color={getIconColor()}
            style={styles.heartIcon}
          />

          {/* Lightning overlay for superlike animation */}
          {isCurrentlySuperliked && (
            <Animated.View
              style={[
                styles.lightningOverlay,
                {
                  opacity: lightningOpacity,
                  transform: [
                    { scale: lightningScale },
                    { rotate: rotateInterpolate },
                  ],
                },
              ]}
            >
              <Ionicons name="flash" size={iconSize * 1.2} color="#FFD700" />
            </Animated.View>
          )}
        </Animated.View>
      </TouchableOpacity>

      {/* Superlike Tooltip */}
      <Tooltip
        visible={showSuperlikeTooltip}
        onClose={() => {
          setShowSuperlikeTooltip(false);
          markTooltipSeen("superlike");
        }}
        title="Superlike Available!"
        message="Hold the heart button to superlike this vendor and show extra interest!"
        position={buttonPosition}
        arrowDirection="up"
      />

      {/* Undo Superlike Tooltip */}
      <Tooltip
        visible={showUndoTooltip}
        onClose={() => {
          setShowUndoTooltip(false);
          markTooltipSeen("undoSuperlike");
        }}
        title="Superliked!"
        message="Tap the lightning icon again to revert back to a regular like."
        position={buttonPosition}
        arrowDirection="up"
      />
    </>
  );
};

const styles = StyleSheet.create({
  heartButton: {
    position: "relative",
  },
  heartIconContainer: {
    width: rs(24),
    height: rs(22),
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  heartIcon: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: rs(2),
  },
  lightningOverlay: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
});
