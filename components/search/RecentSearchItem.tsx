import { getLineHeight, rf, rs } from "@/constants/Responsive";
import { RecentSearch } from "@/stores/searchStore";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface RecentSearchItemProps {
  search: RecentSearch;
  onPress: () => void;
}

export const RecentSearchItem: React.FC<RecentSearchItemProps> = ({
  search,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.iconPlaceholder} />
      <View style={styles.content}>
        <Text style={styles.location}>{search.location}</Text>
        <Text style={styles.details}>
          {search.date} • {search.service}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: rs(10),
    paddingHorizontal: rs(10),
    paddingVertical: rs(7.5),
    marginBottom: rs(8),
  },
  iconPlaceholder: {
    width: rs(40),
    height: rs(40),
    backgroundColor: "#D9D9D9",
    borderRadius: rs(12),
  },
  content: {
    flex: 1,
    gap: rs(2),
  },
  location: {
    fontFamily: "Inter",
    fontWeight: "500",
    fontSize: rf(14),
    lineHeight: getLineHeight(rf(14), 1.43),
    color: "#1F2024",
  },
  details: {
    fontFamily: "Inter",
    fontWeight: "500",
    fontSize: rf(10),
    lineHeight: getLineHeight(rf(10), 1.4),
    letterSpacing: rf(10) * 0.015,
    color: "#8F9098",
  },
});
