import { ChatListItem } from "@/components/ChatListItem";
import { ThemedText } from "@/components/ThemedText";
import { rf, rs } from "@/constants/Responsive";
import { mockChats } from "@/data/mockChats";
import { useTheme } from "@/hooks/useTheme";
import { Chat } from "@/types/chat";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.backgroundPrimary,
    },
    header: {
      paddingHorizontal: rs(12),
      paddingTop: rs(8),
      paddingBottom: rs(8),
      backgroundColor: theme.colors.backgroundPrimary,
    },
    title: {
      fontSize: rf(24),
      fontWeight: "800",
      color: theme.colors.textPrimary,
      textAlign: "center",
      marginBottom: rs(16),
    },
    searchContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.backgroundSecondary,
      borderRadius: rs(24),
      paddingHorizontal: rs(16),
      paddingVertical: rs(12),
      marginHorizontal: rs(12),
      marginBottom: rs(8),
      gap: rs(16),
    },
    searchIcon: {
      opacity: 0.6,
    },
    searchInput: {
      flex: 1,
      fontSize: rf(14),
      fontFamily: theme.typography.fontFamily.primary,
      color: theme.colors.textPrimary,
      paddingVertical: 0,
    },
    chatsList: {
      flex: 1,
      paddingHorizontal: rs(8),
      paddingBottom: rs(16),
    },
    emptyState: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: rs(40),
    },
    emptyIcon: {
      marginBottom: rs(16),
    },
    emptyTitle: {
      fontSize: rf(18),
      fontWeight: "600",
      color: theme.colors.textPrimary,
      textAlign: "center",
      marginBottom: rs(8),
    },
    emptyText: {
      fontSize: rf(14),
      color: theme.colors.textMuted,
      textAlign: "center",
      lineHeight: rf(20),
    },
    separator: {
      height: 0.5,
      backgroundColor: theme.colors.borderLight,
      marginLeft: rs(72),
    },
  });

export default function MessagesScreen() {
  const theme = useTheme();
  const styles = createStyles(theme);
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [chats] = useState<Chat[]>(mockChats);

  const filteredChats = chats.filter(
    (chat) =>
      chat.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleChatPress = (chatId: string) => {
    router.push(`/chat/${chatId}`);
  };

  const renderChatItem = ({ item, index }: { item: Chat; index: number }) => (
    <>
      <ChatListItem
        id={item.id}
        name={item.vendorName}
        lastMessage={item.lastMessage}
        unreadCount={item.unreadCount}
        onPress={handleChatPress}
      />
      {index < filteredChats.length - 1 && <View style={styles.separator} />}
    </>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons
        name="chatbubbles-outline"
        size={rf(80)}
        color={theme.colors.textMuted}
        style={styles.emptyIcon}
      />
      <ThemedText style={styles.emptyTitle}>
        {searchQuery ? "No chats found" : "No messages yet"}
      </ThemedText>
      <ThemedText style={styles.emptyText}>
        {searchQuery
          ? `No conversations match "${searchQuery}"`
          : "Your conversations with vendors will appear here"}
      </ThemedText>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <ThemedText style={styles.title}>Messages</ThemedText>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={rf(16)}
            color={theme.colors.textMuted}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor={theme.colors.textDisabled}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Chats List */}
      <View style={styles.chatsList}>
        {filteredChats.length > 0 ? (
          <FlatList
            data={filteredChats}
            renderItem={renderChatItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1 }}
          />
        ) : (
          renderEmptyState()
        )}
      </View>
    </SafeAreaView>
  );
}
