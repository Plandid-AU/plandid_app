import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import { rs } from "@/constants/Responsive";
import { useTheme } from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useMemo } from "react";
import {
  Modal,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

interface SettingsChangeModalProps {
  visible: boolean;
  onClose: () => void;
  type: "name" | "date";
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: "rgba(31, 32, 36, 0.4)",
      justifyContent: "flex-end",
    },
    modalContainer: {
      backgroundColor: theme.colors.backgroundPrimary,
      borderTopLeftRadius: rs(12),
      borderTopRightRadius: rs(12),
      paddingHorizontal: rs(18),
      paddingVertical: rs(24),
      gap: rs(16),
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: rs(6),
      paddingTop: rs(8),
    },
    title: {
      fontSize: rs(24),
      fontWeight: "700",
      color: theme.colors.textPrimary,
      fontFamily: theme.typography.fontFamily.primary,
      lineHeight: rs(29),
      letterSpacing: 0.24,
    },
    closeButton: {
      width: rs(18),
      height: rs(18),
      justifyContent: "center",
      alignItems: "center",
    },
    content: {
      paddingHorizontal: rs(4),
    },
    description: {
      fontSize: rs(12),
      fontWeight: "500",
      color: theme.colors.textMuted,
      fontFamily: theme.typography.fontFamily.primary,
      lineHeight: rs(16),
      letterSpacing: 0.12,
    },
    buttonContainer: {
      alignSelf: "flex-start",
    },
  });

export const SettingsChangeModal: React.FC<SettingsChangeModalProps> = ({
  visible,
  onClose,
  type,
}) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const getTitle = () => {
    return type === "name" ? "Who's Your Partner?" : "When's Your Wedding?";
  };

  const getDescription = () => {
    return type === "name"
      ? "Changing your partner's name will update your profile across all vendors. Therefore you can only change this information in settings"
      : "Changing your wedding date means that vendor that are previously available may not be. Therefore you can only change your date in settings";
  };

  const handleGoToSettings = () => {
    onClose();
    if (type === "name") {
      router.push("/profile/your-partner");
    } else {
      router.push("/profile/wedding-details");
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={styles.modalContainer}>
              <View style={styles.header}>
                <ThemedText style={styles.title}>{getTitle()}</ThemedText>
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                  <Ionicons
                    name="close"
                    size={rs(18)}
                    color={theme.colors.primary}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.content}>
                <ThemedText style={styles.description}>
                  {getDescription()}
                </ThemedText>
              </View>

              <View style={styles.buttonContainer}>
                <ThemedButton
                  title="Go To Settings"
                  onPress={handleGoToSettings}
                  rightIcon={
                    <Ionicons
                      name="arrow-forward"
                      size={rs(16)}
                      color={theme.colors.white}
                    />
                  }
                  style={{
                    paddingHorizontal: rs(16),
                    paddingVertical: rs(12),
                    height: rs(40),
                  }}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
