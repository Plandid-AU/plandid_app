import { ThemedText } from "@/components/ThemedText";
import { rf, rs } from "@/constants/Responsive";
import { useTheme } from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useMemo, useRef } from "react";
import {
  Animated,
  Dimensions,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

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
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingTop: theme.spacing["4xl"],
      paddingBottom: theme.spacing["2xl"],
      paddingHorizontal: theme.spacing["5xl"],
    },
    closeButton: {
      width: rs(18),
      height: rs(18),
      justifyContent: "center",
      alignItems: "center",
    },
    optionsContainer: {
      paddingHorizontal: theme.spacing["3xl"],
      paddingBottom: theme.spacing["2xl"],
    },
    option: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: theme.spacing["2xl"],
      paddingHorizontal: theme.spacing["3xl"],
      gap: theme.spacing["5xl"],
    },
    optionIcon: {
      width: rs(26),
      height: rs(26),
      justifyContent: "center",
      alignItems: "center",
    },
    optionContent: {
      flex: 1,
      gap: rs(4),
    },
    divider: {
      height: rs(0.5),
      backgroundColor: theme.colors.borderLight,
      marginHorizontal: theme.spacing["3xl"],
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
  const styles = useMemo(() => createStyles(theme), [theme]);
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
      onClose();
    });
  };

  const renderOption = (
    icon: string,
    title: string,
    description: string,
    onPress: () => void,
    iconColor: string = theme.colors.textPrimary
  ) => (
    <TouchableOpacity style={styles.option} onPress={onPress}>
      <View style={styles.optionIcon}>
        <Ionicons name={icon as any} size={rf(26)} color={iconColor} />
      </View>
      <View style={styles.optionContent}>
        <ThemedText type="body">{title}</ThemedText>
        <ThemedText type="bodySmall" style={{ color: theme.colors.textMuted }}>
          {description}
        </ThemedText>
      </View>
    </TouchableOpacity>
  );

  const renderDivider = () => <View style={styles.divider} />;

  const renderChatOptions = () => (
    <>
      {renderOption(
        "send",
        "View Profile",
        "Forgot what they're like? Check it out!",
        onViewProfile
      )}
      {renderDivider()}
      {renderOption(
        "share-outline",
        "Share",
        "Show your friends the vendor you discovered",
        onShare
      )}
      {renderDivider()}
      {renderOption(
        "close",
        "Clear Chat",
        "Don't need the chat history anymore? Clear it out!",
        onClearChat
      )}
      {renderDivider()}
      {renderOption(
        "warning",
        "Report Vendor",
        "Something isn't right? Let us know!",
        onReportVendor
      )}
    </>
  );

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
        {/* Header */}
        <View style={styles.header}>
          <ThemedText type="h3">Options</ThemedText>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Ionicons
              name="close"
              size={rf(18)}
              color={theme.colors.textPrimary}
            />
          </TouchableOpacity>
        </View>

        {/* Options */}
        <View style={styles.optionsContainer}>{renderChatOptions()}</View>
      </Animated.View>
    </Modal>
  );
};
