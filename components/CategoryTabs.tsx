import React from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { VendorCategory } from "../types";

interface CategoryTabsProps {
  selectedCategory: VendorCategory;
  onCategoryChange: (category: VendorCategory) => void;
}

interface TabItemProps {
  title: string;
  isSelected: boolean;
  onPress: () => void;
}

const TabItem: React.FC<TabItemProps> = ({ title, isSelected, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.tabItem}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.tabTitleContainer}>
        <Text style={[styles.tabTitle, isSelected && styles.tabTitleSelected]}>
          {title}
        </Text>
      </View>
      {isSelected && <View style={styles.indicator} />}
    </TouchableOpacity>
  );
};

export const CategoryTabs: React.FC<CategoryTabsProps> = ({
  selectedCategory,
  onCategoryChange,
}) => {
  return (
    <View style={styles.container}>
      <TabItem
        title="Photo"
        isSelected={selectedCategory === VendorCategory.PHOTO}
        onPress={() => onCategoryChange(VendorCategory.PHOTO)}
      />
      <TabItem
        title="Video"
        isSelected={selectedCategory === VendorCategory.VIDEO}
        onPress={() => onCategoryChange(VendorCategory.VIDEO)}
      />
      <TabItem
        title="Content"
        isSelected={selectedCategory === VendorCategory.CONTENT}
        onPress={() => onCategoryChange(VendorCategory.CONTENT)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 4,
    borderRadius: 16,
  },
  tabItem: {
    width: 88,
    height: 44,
    alignItems: "center",
    gap: 4,
    borderRadius: 12,
  },
  tabTitleContainer: {
    height: 36,
    paddingHorizontal: 16,
    paddingVertical: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  tabTitle: {
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    fontWeight: "500",
    fontSize: 14,
    lineHeight: 20,
    color: "#71727A",
    textAlign: "center",
  },
  tabTitleSelected: {
    fontWeight: "700",
    lineHeight: 16.8,
    color: "#7B1513",
  },
  indicator: {
    width: 24,
    height: 4,
    backgroundColor: "#7B1513",
    borderRadius: 2,
  },
});
