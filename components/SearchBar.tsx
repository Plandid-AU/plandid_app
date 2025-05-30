import { ThemedText } from "@/components/ThemedText";
import { rf, rs } from "@/constants/Responsive";
import { theme } from "@/constants/Theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

interface SearchBarProps {
  onPress: () => void;
}

// Create styles statically to avoid useInsertionEffect issues
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: rs(10),
    paddingVertical: rs(17),
    paddingHorizontal: rs(87),
    backgroundColor: theme.colors.backgroundPrimary,
    borderRadius: theme.borderRadius["6xl"],
    borderWidth: 1,
    borderColor: theme.colors.gray400,
  },
});

export const SearchBar: React.FC<SearchBarProps> = ({ onPress }) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Ionicons name="search" size={rf(20)} color={theme.colors.primary} />
      <ThemedText type="body" style={{ textAlign: "center" }}>
        Start your search
      </ThemedText>
    </TouchableOpacity>
  );
};
