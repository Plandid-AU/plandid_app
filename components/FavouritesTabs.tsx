import { rh, rs } from "@/constants/Responsive";
import { useTheme } from "@/hooks/useTheme";
import * as Haptics from "expo-haptics";
import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, TouchableOpacity, View } from "react-native";

export enum FavouritesTab {
  LIKED = "LIKED",
  SUPERLIKED = "SUPERLIKED",
  CONTACTED = "CONTACTED",
}

interface FavouritesTabsProps {
  selectedTab: FavouritesTab;
  onTabChange: (tab: FavouritesTab) => void;
}

interface TabItemProps {
  title: string;
  isSelected: boolean;
  onPress: () => void;
  theme: any;
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: rs(4),
      borderRadius: theme.borderRadius["2xl"],
      position: "relative",
    },
    tabItem: {
      width: rs(118),
      height: rh(44),
      alignItems: "center",
      justifyContent: "center",
      borderRadius: theme.borderRadius.xl,
    },
    tabTitleContainer: {
      height: rh(36),
      paddingHorizontal: theme.spacing["2xl"],
      paddingVertical: theme.spacing.base,
      justifyContent: "center",
      alignItems: "center",
    },
    tabTitle: {
      fontFamily: theme.typography.fontFamily.primary,
      fontSize: theme.typography.fontSize.base,
      lineHeight: theme.typography.lineHeight.base,
      textAlign: "center",
    },
    indicator: {
      width: rs(24),
      height: rs(4),
      backgroundColor: theme.colors.primary,
      borderRadius: rs(2),
    },
  });

const TabItem: React.FC<TabItemProps> = ({
  title,
  isSelected,
  onPress,
  theme,
}) => {
  const textColorAnim = useRef(new Animated.Value(isSelected ? 1 : 0)).current;
  const scaleAnim = useRef(new Animated.Value(isSelected ? 1 : 0.95)).current;
  const styles = createStyles(theme);

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
  }, [isSelected, textColorAnim, scaleAnim]);

  const textColor = textColorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [theme.colors.textMuted, theme.colors.primary],
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
              fontWeight: isSelected
                ? theme.typography.fontWeight.bold
                : theme.typography.fontWeight.medium,
            },
          ]}
        >
          {title}
        </Animated.Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

export const FavouritesTabs: React.FC<FavouritesTabsProps> = ({
  selectedTab,
  onTabChange,
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const indicatorAnim = useRef(new Animated.Value(0)).current;

  const tabs = [
    FavouritesTab.LIKED,
    FavouritesTab.SUPERLIKED,
    FavouritesTab.CONTACTED,
  ];
  const selectedIndex = tabs.indexOf(selectedTab);

  useEffect(() => {
    // Animate indicator position
    Animated.spring(indicatorAnim, {
      toValue: selectedIndex,
      tension: 100,
      friction: 8,
      useNativeDriver: true,
    }).start();
  }, [selectedIndex, indicatorAnim]);

  const tabWidth = rs(118);
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
        title="Liked"
        isSelected={selectedTab === FavouritesTab.LIKED}
        onPress={() => onTabChange(FavouritesTab.LIKED)}
        theme={theme}
      />
      <TabItem
        title="Super Liked"
        isSelected={selectedTab === FavouritesTab.SUPERLIKED}
        onPress={() => onTabChange(FavouritesTab.SUPERLIKED)}
        theme={theme}
      />
      <TabItem
        title="Contacted"
        isSelected={selectedTab === FavouritesTab.CONTACTED}
        onPress={() => onTabChange(FavouritesTab.CONTACTED)}
        theme={theme}
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
