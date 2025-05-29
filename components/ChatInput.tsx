import { rf, rs } from "@/constants/Responsive";
import { useTheme } from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  placeholder?: string;
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      gap: rs(6),
      paddingHorizontal: rs(16),
      paddingVertical: rs(10),
      backgroundColor: theme.colors.backgroundPrimary,
    },
    addButton: {
      padding: rs(8),
    },
    inputContainer: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.backgroundSecondary,
      borderRadius: rs(71),
      paddingHorizontal: rs(16),
      paddingVertical: rs(8),
      minHeight: rs(40),
      gap: rs(12),
    },
    textInput: {
      flex: 1,
      fontSize: rf(14),
      fontFamily: theme.typography.fontFamily.primary,
      color: theme.colors.textPrimary,
      paddingVertical: 0,
    },
    sendButton: {
      width: rs(32),
      height: rs(32),
      borderRadius: rs(16),
      backgroundColor: theme.colors.primary,
      justifyContent: "center",
      alignItems: "center",
    },
    sendButtonDisabled: {
      backgroundColor: theme.colors.gray400,
    },
  });

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  placeholder = "Type a message...",
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const canSend = message.trim().length > 0;

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.addButton}>
        <Ionicons name="add" size={rf(16)} color={theme.colors.primary} />
      </TouchableOpacity>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={message}
          onChangeText={setMessage}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.textDisabled}
          multiline
          maxLength={500}
        />

        <TouchableOpacity
          style={[styles.sendButton, !canSend && styles.sendButtonDisabled]}
          onPress={handleSend}
          disabled={!canSend}
        >
          <Ionicons name="send" size={rf(12)} color={theme.colors.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
};
