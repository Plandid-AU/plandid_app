import { getLineHeight, rf, rh, rs } from "@/constants/Responsive";
import * as Haptics from "expo-haptics";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Platform,
  StyleSheet,
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
  const textColorAnim = useRef(new Animated.Value(isSelected ? 1 : 0)).current;
  const scaleAnim = useRef(new Animated.Value(isSelected ? 1 : 0.95)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(textColorAnim, {
        toValue: isSelected ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.spring(scaleAnim, {
        toValue: isSelected ? 1 : 0.95,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isSelected]);

  const textColor = textColorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#71727A", "#7B1513"],
  });

  const handlePress = () => {
    // Add haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <TouchableOpacity
      style={styles.tabItem}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <Animated.View
        style={[
          styles.tabTitleContainer,
          {
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Animated.Text
          style={[
            styles.tabTitle,
            {
              color: textColor,
              fontWeight: isSelected ? "700" : "500",
            },
          ]}
        >
          {title}
        </Animated.Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

export const CategoryTabs: React.FC<CategoryTabsProps> = ({
  selectedCategory,
  onCategoryChange,
}) => {
  const indicatorAnim = useRef(new Animated.Value(0)).current;

  const categories = [
    VendorCategory.PHOTO,
    VendorCategory.VIDEO,
    VendorCategory.CONTENT,
  ];
  const selectedIndex = categories.indexOf(selectedCategory);

  useEffect(() => {
    // Animate indicator position
    Animated.spring(indicatorAnim, {
      toValue: selectedIndex,
      tension: 100,
      friction: 8,
      useNativeDriver: true,
    }).start();
  }, [selectedIndex]);

  const tabWidth = rs(88);
  const indicatorWidth = rs(24);
  const centerOffset = (tabWidth - indicatorWidth) / 2;

  const indicatorTranslateX = indicatorAnim.interpolate({
    inputRange: [0, 1, 2],
    outputRange: [
      centerOffset, // First tab center
      tabWidth + centerOffset, // Second tab center
      tabWidth * 2 + centerOffset, // Third tab center
    ],
  });

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

      {/* Animated Indicator */}
      <Animated.View
        style={[
          styles.indicator,
          {
            position: "absolute",
            bottom: rs(4),
            left: 0,
            transform: [{ translateX: indicatorTranslateX }],
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: rs(4),
    borderRadius: rs(16),
    position: "relative",
  },
  tabItem: {
    width: rs(88),
    height: rh(44),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: rs(12),
  },
  tabTitleContainer: {
    height: rh(36),
    paddingHorizontal: rs(16),
    paddingVertical: rs(8),
    justifyContent: "center",
    alignItems: "center",
  },
  tabTitle: {
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
    fontSize: rf(14),
    lineHeight: getLineHeight(rf(14), 1.43),
    textAlign: "center",
  },
  indicator: {
    width: rs(24),
    height: rs(4),
    backgroundColor: "#7B1513",
    borderRadius: rs(2),
  },
});
