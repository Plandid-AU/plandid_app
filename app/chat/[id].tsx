import { ChatBubble } from "@/components/ChatBubble";
import { ChatInput } from "@/components/ChatInput";
import { ChatOptionsModal } from "@/components/ChatOptionsModal";
import { ThemedText } from "@/components/ThemedText";
import { rf, rs } from "@/constants/Responsive";
import { mockChats } from "@/data/mockChats";
import { useTheme } from "@/hooks/useTheme";
import { Attachment, Chat, Message } from "@/types/chat";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.backgroundPrimary,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: rs(24),
      paddingVertical: rs(18),
      backgroundColor: theme.colors.backgroundPrimary,
      borderBottomWidth: 0.5,
      borderBottomColor: theme.colors.borderLight,
    },
    headerLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: rs(12),
    },
    backButton: {
      width: rs(20),
      height: rs(20),
      justifyContent: "center",
      alignItems: "center",
    },
    headerTitle: {
      fontSize: rf(16),
      fontWeight: "700",
      color: theme.colors.textPrimary,
    },
    avatar: {
      width: rs(40),
      height: rs(40),
      borderRadius: rs(20),
      backgroundColor: theme.colors.backgroundTertiary,
      justifyContent: "center",
      alignItems: "center",
    },
    avatarText: {
      fontSize: rf(16),
      fontWeight: "600",
      color: theme.colors.primary,
    },
    messagesContainer: {
      flex: 1,
      paddingHorizontal: rs(12),
    },
    messagesList: {
      paddingVertical: rs(16),
      flexGrow: 1,
    },
    emptyState: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: rs(40),
    },
    emptyText: {
      fontSize: rf(16),
      color: theme.colors.textMuted,
      textAlign: "center",
      marginTop: rs(16),
      lineHeight: rf(24),
    },
  });

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const theme = useTheme();
  const styles = createStyles(theme);
  const flatListRef = useRef<FlatList>(null);

  const [chat, setChat] = useState<Chat | null>(null);
  const [showOptionsModal, setShowOptionsModal] = useState(false);

  useEffect(() => {
    const foundChat = mockChats.find((c) => c.id === id);
    if (foundChat) {
      setChat(foundChat);
    }
  }, [id]);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (chat && chat.messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [chat?.messages.length, chat]);

  const handleSendMessage = (
    messageText: string,
    attachments?: Attachment[]
  ) => {
    if (!chat) return;

    const newMessage: Message = {
      id: `${chat.id}-${Date.now()}`,
      text: messageText,
      type: "sent",
      timestamp: new Date(),
      showTip: true,
      attachments: attachments || [],
    };

    // Update the last message in the previous sent message to not show tip
    const updatedMessages = chat.messages.map((msg, index) => {
      if (index === chat.messages.length - 1 && msg.type === "sent") {
        return { ...msg, showTip: false };
      }
      return msg;
    });

    // Create display text for last message
    let displayText = messageText;
    if (attachments && attachments.length > 0) {
      const imageCount = attachments.filter(
        (att) => att.type === "image"
      ).length;
      const docCount = attachments.filter(
        (att) => att.type === "document"
      ).length;

      if (imageCount > 0 && docCount > 0) {
        displayText = messageText ? `${messageText} 📎📷` : "📎📷 Attachments";
      } else if (imageCount > 0) {
        displayText = messageText ? `${messageText} 📷` : "📷 Photo";
      } else if (docCount > 0) {
        displayText = messageText ? `${messageText} 📎` : "📎 Document";
      }
    }

    setChat({
      ...chat,
      messages: [...updatedMessages, newMessage],
      lastMessage: displayText,
      lastMessageTime: new Date(),
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleViewProfile = () => {
    setShowOptionsModal(false);
    Alert.alert("View Profile", "Navigate to vendor profile");
  };

  const handleShare = () => {
    setShowOptionsModal(false);
    Alert.alert("Share", "Share vendor with friends");
  };

  const handleClearChat = () => {
    setShowOptionsModal(false);
    Alert.alert(
      "Clear Chat",
      "Are you sure you want to clear this chat history?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: () => {
            if (chat) {
              setChat({ ...chat, messages: [] });
            }
          },
        },
      ]
    );
  };

  const handleReportVendor = () => {
    setShowOptionsModal(false);
    Alert.alert("Report Vendor", "Report this vendor to support");
  };

  if (!chat) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyState}>
          <ThemedText style={styles.emptyText}>Chat not found</ThemedText>
        </View>
      </SafeAreaView>
    );
  }

  const renderMessage = ({ item, index }: { item: Message; index: number }) => {
    // Determine if this message should show a tip
    const nextMessage = chat.messages[index + 1];
    const showTip = !nextMessage || nextMessage.type !== item.type;

    return (
      <ChatBubble
        message={item.text}
        type={item.type}
        showTip={showTip}
        attachments={item.attachments}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
        enabled
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons
                name="chevron-back"
                size={rf(20)}
                color={theme.colors.primary}
              />
            </TouchableOpacity>
            <ThemedText style={styles.headerTitle}>
              {chat.vendorName}
            </ThemedText>
          </View>

          <TouchableOpacity
            style={styles.avatar}
            onPress={() => setShowOptionsModal(true)}
          >
            <ThemedText style={styles.avatarText}>
              {getInitials(chat.vendorName)}
            </ThemedText>
          </TouchableOpacity>
        </View>

        {/* Messages */}
        <View style={styles.messagesContainer}>
          {chat.messages.length > 0 ? (
            <FlatList
              ref={flatListRef}
              data={chat.messages}
              renderItem={renderMessage}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.messagesList}
              showsVerticalScrollIndicator={false}
              maintainVisibleContentPosition={{
                minIndexForVisible: 0,
                autoscrollToTopThreshold: 10,
              }}
              onContentSizeChange={() => {
                // Only auto-scroll if user is near the bottom
                flatListRef.current?.scrollToEnd({ animated: true });
              }}
              onLayout={() => {
                // Scroll to bottom on initial layout
                setTimeout(() => {
                  flatListRef.current?.scrollToEnd({ animated: false });
                }, 100);
              }}
            />
          ) : (
            <View style={styles.emptyState}>
              <Ionicons
                name="chatbubbles-outline"
                size={rf(64)}
                color={theme.colors.textMuted}
              />
              <ThemedText style={styles.emptyText}>
                No messages yet. Start the conversation!
              </ThemedText>
            </View>
          )}
        </View>

        {/* Input */}
        <ChatInput onSendMessage={handleSendMessage} />
      </KeyboardAvoidingView>

      {/* Options Modal */}
      <ChatOptionsModal
        visible={showOptionsModal}
        onClose={() => setShowOptionsModal(false)}
        onViewProfile={handleViewProfile}
        onShare={handleShare}
        onClearChat={handleClearChat}
        onReportVendor={handleReportVendor}
      />
    </SafeAreaView>
  );
}
