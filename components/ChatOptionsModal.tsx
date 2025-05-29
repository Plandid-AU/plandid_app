import { rf, rs } from "@/constants/Responsive";
import { useTheme } from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Modal,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { ThemedText } from "./ThemedText";

interface ChatOptionsModalProps {
  visible: boolean;
  onClose: () => void;
  onViewProfile: () => void;
  onShare: () => void;
  onClearChat: () => void;
  onReportVendor: () => void;
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: "rgba(31, 32, 36, 0.4)",
      justifyContent: "flex-end",
    },
    modal: {
      backgroundColor: theme.colors.backgroundPrimary,
      borderTopLeftRadius: rs(12),
      borderTopRightRadius: rs(12),
      paddingHorizontal: rs(18),
      paddingVertical: rs(16),
      gap: rs(10),
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: rs(6),
      paddingVertical: rs(8),
    },
    title: {
      fontSize: rf(24),
      fontWeight: "800",
      color: theme.colors.textPrimary,
    },
    closeButton: {
      width: rs(18),
      height: rs(18),
      justifyContent: "center",
      alignItems: "center",
    },
    option: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: rs(18),
      paddingVertical: rs(16),
      gap: rs(24),
    },
    iconContainer: {
      width: rs(26),
      height: rs(26),
      justifyContent: "center",
      alignItems: "center",
    },
    optionContent: {
      flex: 1,
      gap: rs(4),
    },
    optionTitle: {
      fontSize: rf(14),
      fontWeight: "500",
      color: theme.colors.textPrimary,
    },
    optionDescription: {
      fontSize: rf(12),
      fontWeight: "500",
      color: theme.colors.textMuted,
      lineHeight: rf(16),
    },
    divider: {
      height: 0.5,
      backgroundColor: theme.colors.borderMedium,
      marginHorizontal: rs(18),
    },
    warningIcon: {
      backgroundColor: theme.colors.gray400,
      borderRadius: rs(13),
    },
  });

export const ChatOptionsModal: React.FC<ChatOptionsModalProps> = ({
  visible,
  onClose,
  onViewProfile,
  onShare,
  onClearChat,
  onReportVendor,
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  const options = [
    {
      icon: "send" as const,
      title: "View Profile",
      description: "Forgot what they're like? Check it out!",
      onPress: onViewProfile,
    },
    {
      icon: "share-outline" as const,
      title: "Share",
      description: "Show your friends the vendor you discovered",
      onPress: onShare,
    },
    {
      icon: "close" as const,
      title: "Clear Chat",
      description: "Don't need the chat history anymore? Clear it out!",
      onPress: onClearChat,
      showDivider: true,
    },
    {
      icon: "warning" as const,
      title: "Report Vendor",
      description: "Something isn't right? Let us know!",
      onPress: onReportVendor,
      isWarning: true,
    },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modal}>
              <View style={styles.header}>
                <ThemedText style={styles.title}>Options</ThemedText>
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                  <Ionicons
                    name="close"
                    size={rf(18)}
                    color={theme.colors.primary}
                  />
                </TouchableOpacity>
              </View>

              {options.map((option, index) => (
                <React.Fragment key={option.title}>
                  {option.showDivider && <View style={styles.divider} />}

                  <TouchableOpacity
                    style={styles.option}
                    onPress={option.onPress}
                    activeOpacity={0.7}
                  >
                    <View
                      style={[
                        styles.iconContainer,
                        option.isWarning && styles.warningIcon,
                      ]}
                    >
                      <Ionicons
                        name={option.icon}
                        size={rf(16)}
                        color={
                          option.isWarning
                            ? theme.colors.white
                            : theme.colors.primary
                        }
                      />
                    </View>

                    <View style={styles.optionContent}>
                      <ThemedText style={styles.optionTitle}>
                        {option.title}
                      </ThemedText>
                      <ThemedText style={styles.optionDescription}>
                        {option.description}
                      </ThemedText>
                    </View>
                  </TouchableOpacity>

                  {index < options.length - 1 && !option.showDivider && (
                    <View style={styles.divider} />
                  )}
                </React.Fragment>
              ))}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
