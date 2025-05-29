import { ThemedText } from "@/components/ThemedText";
import { rf, rs } from "@/constants/Responsive";
import { useTheme } from "@/hooks/useTheme";
import React from "react";
import {
  Dimensions,
  Modal,
  StyleSheet,
  TouchableOpacity,
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
    title: {
      fontSize: rf(18),
      fontWeight: "700",
      color: theme.colors.textPrimary,
      marginBottom: theme.spacing["2xl"],
      textAlign: "center",
    },
    message: {
      fontSize: rf(14),
      fontWeight: "400",
      color: theme.colors.textMuted,
      lineHeight: rf(20),
      textAlign: "center",
      marginBottom: theme.spacing["4xl"],
    },
    buttonContainer: {
      flexDirection: "row",
      gap: theme.spacing["3xl"],
    },
    button: {
      flex: 1,
      paddingVertical: theme.spacing["3xl"],
      paddingHorizontal: theme.spacing["4xl"],
      borderRadius: theme.borderRadius.xl,
      alignItems: "center",
      justifyContent: "center",
      minHeight: rs(48),
    },
    cancelButton: {
      borderWidth: 1.5,
      borderColor: theme.colors.primary,
      backgroundColor: "transparent",
    },
    confirmButton: {
      backgroundColor: theme.colors.primary,
    },
    destructiveButton: {
      backgroundColor: "#DC3545",
    },
    buttonText: {
      fontSize: rf(12),
      fontWeight: "600",
      lineHeight: rf(14.5),
    },
    cancelButtonText: {
      color: theme.colors.primary,
    },
    confirmButtonText: {
      color: theme.colors.backgroundPrimary,
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

  const handleClose = () => {
    onCancel();
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
      animationType="slide"
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback onPress={handleClose}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>

      <View style={styles.modal}>
        <View style={styles.content}>
          <ThemedText style={styles.title}>{title}</ThemedText>
          <ThemedText style={styles.message}>{message}</ThemedText>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleCancel}
              activeOpacity={0.8}
            >
              <ThemedText style={[styles.buttonText, styles.cancelButtonText]}>
                {cancelText}
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.button,
                confirmStyle === "destructive"
                  ? styles.destructiveButton
                  : styles.confirmButton,
              ]}
              onPress={handleConfirm}
              activeOpacity={0.8}
            >
              <ThemedText style={[styles.buttonText, styles.confirmButtonText]}>
                {confirmText}
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
