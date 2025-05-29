import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

interface ConfirmationModalProps {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmStyle?: "default" | "destructive";
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    overlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(31, 32, 36, 0.4)",
    },
    modal: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: theme.colors.backgroundPrimary,
      borderTopLeftRadius: theme.borderRadius.xl,
      borderTopRightRadius: theme.borderRadius.xl,
      paddingBottom: theme.layout.safeAreaBottom,
    },
    content: {
      paddingHorizontal: theme.spacing["5xl"],
      paddingTop: theme.spacing["4xl"],
      paddingBottom: theme.spacing["2xl"],
    },
    buttonContainer: {
      flexDirection: "row",
      gap: theme.spacing["3xl"],
    },
    destructiveButton: {
      backgroundColor: theme.colors.error,
    },
  });

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  visible,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  confirmStyle = "default",
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(overlayOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: SCREEN_HEIGHT,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, overlayOpacity, slideAnim]);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: SCREEN_HEIGHT,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onCancel();
    });
  };

  const handleConfirm = () => {
    onConfirm();
  };

  const handleCancel = () => {
    onCancel();
  };

  if (!visible) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback onPress={handleClose}>
        <Animated.View
          style={[
            styles.overlay,
            {
              opacity: overlayOpacity,
            },
          ]}
        />
      </TouchableWithoutFeedback>

      <Animated.View
        style={[
          styles.modal,
          {
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View style={styles.content}>
          <ThemedText
            type="h3"
            style={{ textAlign: "center", marginBottom: theme.spacing["2xl"] }}
          >
            {title}
          </ThemedText>
          <ThemedText
            type="body"
            style={{
              textAlign: "center",
              marginBottom: theme.spacing["4xl"],
              color: theme.colors.textMuted,
            }}
          >
            {message}
          </ThemedText>

          <View style={styles.buttonContainer}>
            <ThemedButton
              title={cancelText}
              variant="secondary"
              size="lg"
              onPress={handleCancel}
              style={{ flex: 1 }}
            />

            <ThemedButton
              title={confirmText}
              variant="primary"
              size="lg"
              onPress={handleConfirm}
              style={[
                { flex: 1 },
                confirmStyle === "destructive" && styles.destructiveButton,
              ]}
            />
          </View>
        </View>
      </Animated.View>
    </Modal>
  );
};
