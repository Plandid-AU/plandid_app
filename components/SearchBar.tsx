import { getLineHeight, rf, rs } from "@/constants/Responsive";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Platform, StyleSheet, Text, TouchableOpacity } from "react-native";

interface SearchBarProps {
  onPress: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onPress }) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Ionicons name="search" size={rf(20)} color="#7B1513" />
      <Text style={styles.text}>Start your search</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: rs(10),
    paddingVertical: rs(17),
    paddingHorizontal: rs(87),
    backgroundColor: "#FFFFFF",
    borderRadius: rs(32),
    borderWidth: 1,
    borderColor: "#D9D9D9",
  },
  text: {
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    fontWeight: "500",
    fontSize: rf(14),
    lineHeight: getLineHeight(rf(14), 1.43),
    color: "#1F2024",
    textAlign: "center",
  },
});
