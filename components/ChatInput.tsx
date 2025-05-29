/**
 * Enhanced ChatInput Component
 *
 * Features implemented following Instagram/WhatsApp best practices:
 * - Auto-expanding text input (1-5 lines maximum)
 * - Smooth height animations
 * - Better cross-platform compatibility (iOS, Android, Web)
 * - Improved text alignment (center for single line, top for multiline)
 * - Smart paste handling for large text inputs
 * - Proper keyboard behavior (stays focused after sending)
 * - Line height optimized for readability
 * - Responsive design with proper padding and margins
 */

import { rf, rs } from "@/constants/Responsive";
import { useTheme } from "@/hooks/useTheme";
import { Attachment } from "@/types/chat";
import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { ThemedText } from "./ThemedText";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

interface ChatInputProps {
  onSendMessage: (message: string, attachments?: Attachment[]) => void;
  placeholder?: string;
}

// Constants for auto-expanding text input (following WhatsApp/Instagram patterns)
const LINE_HEIGHT = rf(20); // Increased for better readability
const VERTICAL_PADDING = rs(12); // Padding inside the input container
const MIN_INPUT_HEIGHT = rs(44); // Minimum height (1 line + padding)
const MAX_LINES = 5; // Maximum number of lines before scrolling
const MAX_INPUT_HEIGHT = LINE_HEIGHT * MAX_LINES + VERTICAL_PADDING; // 5 lines max

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "flex-end",
      gap: rs(8),
      paddingHorizontal: rs(16),
      paddingVertical: rs(12),
      backgroundColor: theme.colors.backgroundPrimary,
      borderTopWidth: 0.5,
      borderTopColor: theme.colors.borderLight,
    },
    addButton: {
      width: rs(36),
      height: rs(36),
      borderRadius: rs(18),
      backgroundColor: theme.colors.backgroundSecondary,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: rs(2),
    },
    inputContainer: {
      flex: 1,
      backgroundColor: theme.colors.backgroundSecondary,
      borderRadius: rs(20),
      paddingHorizontal: rs(16),
      paddingVertical: rs(6), // Reduced padding for better text alignment
      minHeight: MIN_INPUT_HEIGHT,
      maxHeight: MAX_INPUT_HEIGHT,
      justifyContent: "center",
    },
    textInput: {
      fontSize: rf(16), // Slightly larger for better readability
      fontFamily: theme.typography.fontFamily.primary,
      color: theme.colors.textPrimary,
      lineHeight: LINE_HEIGHT,
      paddingVertical: 0,
      paddingHorizontal: 0,
      margin: 0,
      textAlignVertical: "center", // Better alignment for single line
      includeFontPadding: false, // Android-specific: removes extra padding
    },
    textInputMultiline: {
      textAlignVertical: "top", // Switch to top alignment when multiline
    },
    sendButton: {
      width: rs(36),
      height: rs(36),
      borderRadius: rs(18),
      backgroundColor: theme.colors.primary,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: rs(2),
    },
    sendButtonDisabled: {
      backgroundColor: theme.colors.gray400,
    },
    // Fixed attachments container styling
    attachmentsContainer: {
      paddingHorizontal: rs(16),
      paddingTop: rs(16),
      paddingBottom: rs(4),
      backgroundColor: theme.colors.backgroundPrimary,
    },
    attachmentsScrollView: {
      flexDirection: "row",
      gap: rs(8),
    },
    attachmentPreview: {
      width: rs(60),
      height: rs(60),
      borderRadius: rs(8),
      backgroundColor: theme.colors.backgroundTertiary,
      justifyContent: "center",
      alignItems: "center",
      position: "relative",
      marginTop: rs(8),
    },
    attachmentImage: {
      width: "100%",
      height: "100%",
      borderRadius: rs(8),
    },
    removeAttachmentButton: {
      position: "absolute",
      top: -rs(6),
      right: -rs(6),
      width: rs(20),
      height: rs(20),
      borderRadius: rs(10),
      backgroundColor: theme.colors.error,
      justifyContent: "center",
      alignItems: "center",
    },
    // Updated modal styles to match ChatOptionsModal
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

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  placeholder = "Type a message...",
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const [message, setMessage] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [inputHeight, setInputHeight] = useState(MIN_INPUT_HEIGHT);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isMultiline, setIsMultiline] = useState(false);
  const textInputRef = useRef<TextInput>(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const heightAnim = useRef(new Animated.Value(MIN_INPUT_HEIGHT)).current;

  useEffect(() => {
    if (showUploadModal) {
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
  }, [showUploadModal, overlayOpacity, slideAnim]);

  // Reset height when message is cleared (e.g., after sending)
  useEffect(() => {
    if (!message.trim()) {
      const newHeight = MIN_INPUT_HEIGHT;
      setInputHeight(newHeight);
      setIsMultiline(false);

      Animated.timing(heightAnim, {
        toValue: newHeight,
        duration: 150,
        useNativeDriver: false,
      }).start();
    }
  }, [message]);

  const handleSend = () => {
    if (message.trim() || attachments.length > 0) {
      onSendMessage(message.trim(), attachments);
      setMessage("");
      setAttachments([]);
      // Height will be reset by the useEffect above

      // Blur the input to dismiss keyboard if needed
      textInputRef.current?.blur();

      // Small delay before refocusing to ensure smooth transition
      setTimeout(() => {
        textInputRef.current?.focus();
      }, 100);
    }
  };

  const calculateOptimalHeight = (contentHeight: number): number => {
    // Calculate the number of lines based on content height
    const estimatedLines = Math.max(1, Math.ceil(contentHeight / LINE_HEIGHT));

    // Ensure we don't exceed max lines
    const actualLines = Math.min(estimatedLines, MAX_LINES);

    // Calculate height: (lines * line height) + vertical padding
    const calculatedHeight = actualLines * LINE_HEIGHT + VERTICAL_PADDING;

    // Ensure we stay within bounds
    return Math.max(
      MIN_INPUT_HEIGHT,
      Math.min(calculatedHeight, MAX_INPUT_HEIGHT)
    );
  };

  const handleContentSizeChange = (event: any) => {
    const { height: contentHeight } = event.nativeEvent.contentSize;

    // Calculate optimal height
    const newHeight = calculateOptimalHeight(contentHeight);

    // Determine if we're in multiline mode
    const newIsMultiline = newHeight > MIN_INPUT_HEIGHT;

    // Only update if height actually changed
    if (newHeight !== inputHeight) {
      setInputHeight(newHeight);

      // Smooth animation for height changes
      Animated.timing(heightAnim, {
        toValue: newHeight,
        duration: 100, // Quick but smooth
        useNativeDriver: false,
      }).start();
    }

    // Update multiline state if needed
    if (newIsMultiline !== isMultiline) {
      setIsMultiline(newIsMultiline);
    }
  };

  // Handle text changes for better cross-platform compatibility
  const handleTextChange = (text: string) => {
    setMessage(text);

    // For web platform, we need to manually trigger height recalculation
    if (Platform.OS === "web" && textInputRef.current) {
      // Small delay to ensure DOM is updated
      setTimeout(() => {
        const element = textInputRef.current as any;
        if (element && element.scrollHeight) {
          const contentHeight = element.scrollHeight;
          const newHeight = calculateOptimalHeight(contentHeight);

          if (newHeight !== inputHeight) {
            setInputHeight(newHeight);
            setIsMultiline(newHeight > MIN_INPUT_HEIGHT);

            Animated.timing(heightAnim, {
              toValue: newHeight,
              duration: 100,
              useNativeDriver: false,
            }).start();
          }
        }
      }, 0);
    }

    // Handle large text pastes by immediately checking if we need to expand
    if (text.length > message.length + 10) {
      // Likely a paste operation
      setTimeout(() => {
        // Force a content size change check
        if (textInputRef.current && Platform.OS !== "web") {
          const lines = text.split("\n").length;
          const estimatedHeight = calculateOptimalHeight(lines * LINE_HEIGHT);

          if (estimatedHeight !== inputHeight) {
            setInputHeight(estimatedHeight);
            setIsMultiline(estimatedHeight > MIN_INPUT_HEIGHT);

            Animated.timing(heightAnim, {
              toValue: estimatedHeight,
              duration: 150,
              useNativeDriver: false,
            }).start();
          }
        }
      }, 50);
    }
  };

  const animateButton = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleAddPress = () => {
    if (isProcessing) return;
    animateButton();
    setShowUploadModal(true);
  };

  const handleCloseModal = () => {
    if (isProcessing) return;

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
      setShowUploadModal(false);
    });
  };

  const requestMediaLibraryPermissions = async (): Promise<boolean> => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Please grant permission to access your photo library to upload images.",
          [{ text: "OK" }]
        );
        return false;
      }
      return true;
    } catch (error) {
      console.error("Error requesting media library permissions:", error);
      Alert.alert("Error", "Failed to request permissions. Please try again.");
      return false;
    }
  };

  const requestCameraPermissions = async (): Promise<boolean> => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Please grant permission to access your camera to take photos.",
          [{ text: "OK" }]
        );
        return false;
      }
      return true;
    } catch (error) {
      console.error("Error requesting camera permissions:", error);
      Alert.alert("Error", "Failed to request permissions. Please try again.");
      return false;
    }
  };

  const handleImagePicker = async () => {
    if (isProcessing) return;

    try {
      setIsProcessing(true);
      handleCloseModal();

      // Wait a bit for modal to close
      await new Promise((resolve) => setTimeout(resolve, 300));

      const hasPermission = await requestMediaLibraryPermissions();
      if (!hasPermission) {
        setIsProcessing(false);
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        allowsMultipleSelection: false,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const asset = result.assets[0];
        const newAttachment: Attachment = {
          id: `img_${Date.now()}`,
          type: "image",
          uri: asset.uri,
          name: asset.fileName || `image_${Date.now()}.jpg`,
          size: asset.fileSize,
          mimeType: asset.mimeType,
        };
        setAttachments((prev) => [...prev, newAttachment]);
      }
    } catch (error) {
      console.error("Failed to pick image:", error);
      Alert.alert("Error", "Failed to pick image. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCameraPicker = async () => {
    if (isProcessing) return;

    try {
      setIsProcessing(true);
      handleCloseModal();

      // Wait a bit for modal to close
      await new Promise((resolve) => setTimeout(resolve, 300));

      const hasPermission = await requestCameraPermissions();
      if (!hasPermission) {
        setIsProcessing(false);
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const asset = result.assets[0];
        const newAttachment: Attachment = {
          id: `cam_${Date.now()}`,
          type: "image",
          uri: asset.uri,
          name: asset.fileName || `photo_${Date.now()}.jpg`,
          size: asset.fileSize,
          mimeType: asset.mimeType,
        };
        setAttachments((prev) => [...prev, newAttachment]);
      }
    } catch (error) {
      console.error("Failed to take photo:", error);
      Alert.alert("Error", "Failed to take photo. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDocumentPicker = async () => {
    if (isProcessing) return;

    try {
      setIsProcessing(true);
      handleCloseModal();

      // Wait a bit for modal to close
      await new Promise((resolve) => setTimeout(resolve, 300));

      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const asset = result.assets[0];
        const newAttachment: Attachment = {
          id: `doc_${Date.now()}`,
          type: "document",
          uri: asset.uri,
          name: asset.name,
          size: asset.size,
          mimeType: asset.mimeType,
        };
        setAttachments((prev) => [...prev, newAttachment]);
      }
    } catch (error) {
      console.error("Failed to pick document:", error);
      Alert.alert("Error", "Failed to pick document. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((att) => att.id !== id));
  };

  const renderOption = (
    icon: string,
    title: string,
    description: string,
    onPress: () => void,
    iconColor: string = theme.colors.textPrimary
  ) => (
    <TouchableOpacity
      style={styles.option}
      onPress={onPress}
      disabled={isProcessing}
    >
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

  const canSend = message.trim().length > 0 || attachments.length > 0;

  return (
    <>
      {/* Attachments Preview */}
      {attachments.length > 0 && (
        <View style={styles.attachmentsContainer}>
          <ScrollView
            horizontal
            contentContainerStyle={styles.attachmentsScrollView}
            showsHorizontalScrollIndicator={false}
          >
            {attachments.map((attachment) => (
              <View key={attachment.id} style={styles.attachmentPreview}>
                {attachment.type === "image" ? (
                  <Animated.Image
                    source={{ uri: attachment.uri }}
                    style={styles.attachmentImage}
                    resizeMode="cover"
                  />
                ) : (
                  <Ionicons
                    name="document-text"
                    size={rf(24)}
                    color={theme.colors.primary}
                  />
                )}
                <TouchableOpacity
                  style={styles.removeAttachmentButton}
                  onPress={() => removeAttachment(attachment.id)}
                >
                  <Ionicons
                    name="close"
                    size={rf(12)}
                    color={theme.colors.white}
                  />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Input Container */}
      <View style={styles.container}>
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddPress}
            disabled={isProcessing}
          >
            <Ionicons name="add" size={rf(24)} color={theme.colors.primary} />
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={[styles.inputContainer, { height: heightAnim }]}>
          <TextInput
            ref={textInputRef}
            style={[styles.textInput, isMultiline && styles.textInputMultiline]}
            value={message}
            onChangeText={handleTextChange}
            placeholder={placeholder}
            placeholderTextColor={theme.colors.textDisabled}
            multiline
            maxLength={1000}
            onContentSizeChange={handleContentSizeChange}
            scrollEnabled={inputHeight >= MAX_INPUT_HEIGHT}
            textAlignVertical={isMultiline ? "top" : "center"}
            editable={!isProcessing}
            blurOnSubmit={false} // Prevents keyboard from closing on enter
            returnKeyType="default" // Allow line breaks with enter
          />
        </Animated.View>

        <TouchableOpacity
          style={[styles.sendButton, !canSend && styles.sendButtonDisabled]}
          onPress={handleSend}
          disabled={!canSend || isProcessing}
        >
          <Ionicons name="send" size={rf(16)} color={theme.colors.white} />
        </TouchableOpacity>
      </View>

      {/* Upload Options Modal */}
      <Modal
        visible={showUploadModal}
        transparent
        animationType="none"
        onRequestClose={handleCloseModal}
      >
        <TouchableWithoutFeedback onPress={handleCloseModal}>
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
            <ThemedText type="h3">Choose an option</ThemedText>
            <TouchableOpacity
              onPress={handleCloseModal}
              style={styles.closeButton}
              disabled={isProcessing}
            >
              <Ionicons
                name="close"
                size={rf(18)}
                color={theme.colors.textPrimary}
              />
            </TouchableOpacity>
          </View>

          {/* Options */}
          <View style={styles.optionsContainer}>
            {renderOption(
              "camera",
              "Camera",
              "Take a photo",
              handleCameraPicker
            )}
            {renderDivider()}
            {renderOption(
              "images",
              "Photo Library",
              "Choose from gallery",
              handleImagePicker
            )}
            {renderDivider()}
            {renderOption(
              "document",
              "Document",
              "Upload a file",
              handleDocumentPicker
            )}
          </View>
        </Animated.View>
      </Modal>
    </>
  );
};
