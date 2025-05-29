import { rf, rs } from "@/constants/Responsive";
import { useTheme } from "@/hooks/useTheme";
import { Attachment } from "@/types/chat";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { ThemedText } from "./ThemedText";

interface ChatBubbleProps {
  message: string;
  type: "sent" | "received";
  showTip?: boolean;
  attachments?: Attachment[];
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      maxWidth: "85%", // Increased from 80% for better text display
      marginVertical: rs(2),
    },
    sentContainer: {
      alignSelf: "flex-end",
    },
    receivedContainer: {
      alignSelf: "flex-start",
    },
    bubble: {
      paddingVertical: rs(12),
      paddingHorizontal: rs(16),
      borderRadius: rs(20),
      minWidth: rs(60), // Minimum width for small messages
    },
    sentBubble: {
      backgroundColor: theme.colors.primary,
    },
    receivedBubble: {
      backgroundColor: "#F8F9FE", // Light gray background for received messages
    },
    sentBubbleWithTip: {
      borderBottomRightRadius: rs(4),
    },
    receivedBubbleWithTip: {
      borderBottomLeftRadius: rs(4),
    },
    sentText: {
      color: theme.colors.white,
      fontSize: rf(14),
      lineHeight: rf(20),
      flexWrap: "wrap",
    },
    receivedText: {
      color: theme.colors.textPrimary,
      fontSize: rf(14),
      lineHeight: rf(20),
      flexWrap: "wrap",
    },
    attachmentsContainer: {
      gap: rs(8),
    },
    attachmentImage: {
      width: rs(200),
      height: rs(150),
      borderRadius: rs(12),
    },
    documentAttachment: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      borderRadius: rs(8),
      padding: rs(8),
    },
    documentIcon: {
      width: rs(32),
      height: rs(32),
      borderRadius: rs(6),
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      justifyContent: "center",
      alignItems: "center",
      marginRight: rs(8),
    },
    documentInfo: {
      flex: 1,
    },
    documentName: {
      fontSize: rf(12),
      fontWeight: "500",
      color: theme.colors.white,
    },
    documentSize: {
      fontSize: rf(10),
      color: "rgba(255, 255, 255, 0.7)",
      marginTop: rs(2),
    },
    receivedDocumentAttachment: {
      backgroundColor: "rgba(0, 0, 0, 0.05)",
    },
    receivedDocumentIcon: {
      backgroundColor: "rgba(0, 0, 0, 0.1)",
    },
    receivedDocumentName: {
      color: theme.colors.textPrimary,
    },
    receivedDocumentSize: {
      color: theme.colors.textMuted,
    },
    // Separate text and attachments when both exist
    textWithAttachments: {
      marginTop: rs(8),
    },
  });

export const ChatBubble: React.FC<ChatBubbleProps> = ({
  message,
  type,
  showTip = false,
  attachments = [],
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  const isSent = type === "sent";
  const hasAttachments = attachments && attachments.length > 0;
  const hasText = message.trim().length > 0;

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "";
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };

  const renderAttachments = () => {
    if (!hasAttachments) return null;

    return (
      <View style={styles.attachmentsContainer}>
        {attachments.map((attachment) => {
          if (attachment.type === "image") {
            return (
              <TouchableOpacity key={attachment.id}>
                <Image
                  source={{ uri: attachment.uri }}
                  style={styles.attachmentImage}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            );
          } else {
            return (
              <TouchableOpacity
                key={attachment.id}
                style={[
                  styles.documentAttachment,
                  !isSent && styles.receivedDocumentAttachment,
                ]}
              >
                <View
                  style={[
                    styles.documentIcon,
                    !isSent && styles.receivedDocumentIcon,
                  ]}
                >
                  <Ionicons
                    name="document-text"
                    size={rf(16)}
                    color={isSent ? theme.colors.white : theme.colors.primary}
                  />
                </View>
                <View style={styles.documentInfo}>
                  <ThemedText
                    style={[
                      styles.documentName,
                      !isSent && styles.receivedDocumentName,
                    ]}
                    numberOfLines={1}
                  >
                    {attachment.name}
                  </ThemedText>
                  {attachment.size && (
                    <ThemedText
                      style={[
                        styles.documentSize,
                        !isSent && styles.receivedDocumentSize,
                      ]}
                    >
                      {formatFileSize(attachment.size)}
                    </ThemedText>
                  )}
                </View>
              </TouchableOpacity>
            );
          }
        })}
      </View>
    );
  };

  return (
    <View
      style={[
        styles.container,
        isSent ? styles.sentContainer : styles.receivedContainer,
      ]}
    >
      <View
        style={[
          styles.bubble,
          isSent ? styles.sentBubble : styles.receivedBubble,
          showTip && isSent && styles.sentBubbleWithTip,
          showTip && !isSent && styles.receivedBubbleWithTip,
        ]}
      >
        {/* Render attachments first */}
        {renderAttachments()}

        {/* Render text message if it exists */}
        {hasText && (
          <ThemedText
            style={[
              isSent ? styles.sentText : styles.receivedText,
              hasAttachments && styles.textWithAttachments,
            ]}
          >
            {message}
          </ThemedText>
        )}
      </View>
    </View>
  );
};
