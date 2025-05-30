import { ThemedText } from "@/components/ThemedText";
import { rs } from "@/constants/Responsive";
import { useTheme } from "@/hooks/useTheme";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  View,
} from "react-native";

// Privacy & Security options
const privacyOptions = [
  {
    id: "privacy-policy",
    title: "Privacy Policy",
    route: "/profile/privacy-policy",
  },
  {
    id: "terms-conditions",
    title: "Terms & Conditions",
    route: "/profile/terms-conditions",
  },
];

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.backgroundPrimary,
    },
    header: {
      paddingHorizontal: theme.spacing["5xl"],
      paddingVertical: theme.spacing["2xl"],
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing["2xl"],
    },
    backButton: {
      padding: theme.spacing.sm,
    },
    backIcon: {
      width: rs(12),
      height: rs(12),
      borderTopWidth: 2,
      borderLeftWidth: 2,
      borderColor: theme.colors.black,
      transform: [{ rotate: "-45deg" }],
    },
    textSection: {
      paddingHorizontal: theme.spacing["5xl"],
      paddingTop: theme.spacing["2xl"],
      gap: theme.spacing.base,
    },
    settingsContainer: {
      paddingHorizontal: theme.spacing["5xl"],
      paddingTop: theme.spacing["5xl"],
      paddingBottom: theme.spacing["4xl"],
    },
    shareDataItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: theme.spacing["2xl"],
      paddingHorizontal: theme.spacing["2xl"],
    },
    shareDataContent: {
      flex: 1,
      gap: theme.spacing.xs,
    },
    settingItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: theme.spacing["2xl"],
      paddingHorizontal: theme.spacing["2xl"],
    },
    settingContent: {
      flex: 1,
    },
    arrowIcon: {
      width: rs(12),
      height: rs(12),
      tintColor: theme.colors.black,
    },
    divider: {
      height: 0.5,
      backgroundColor: theme.colors.gray500,
      marginLeft: theme.spacing["2xl"],
    },
    switch: {
      transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
    },
  });

// Arrow icon component to match profile.tsx
const ArrowRightIcon = ({ style }: { style?: any }) => (
  <View
    style={[
      {
        width: rs(12),
        height: rs(12),
        borderTopWidth: 2,
        borderRightWidth: 2,
        borderColor: "#000000",
        transform: [{ rotate: "45deg" }],
      },
      style,
    ]}
  />
);

export default function PrivacySecurityScreen() {
  const theme = useTheme();
  const styles = createStyles(theme);
  const [shareData, setShareData] = useState(false);

  const handleBack = () => {
    router.back();
  };

  const handleSettingPress = (route: string) => {
    router.push(route as any);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={handleBack}>
          <View style={styles.backIcon} />
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Title and Description Section */}
        <View style={styles.textSection}>
          <ThemedText
            type="h3"
            style={{
              fontFamily: "Urbanist",
              fontWeight: "800",
              fontSize: rs(24),
              lineHeight: rs(24) * 1.2,
              letterSpacing: rs(24) * 0.01,
              color: theme.colors.textPrimary,
            }}
          >
            Privacy & Security
          </ThemedText>
          <ThemedText
            type="caption"
            style={{
              fontFamily: "Inter",
              fontWeight: "500",
              fontSize: rs(12),
              lineHeight: rs(12) * 1.33,
              letterSpacing: rs(12) * 0.01,
              color: theme.colors.textMuted,
            }}
          >
            Check out our policy
          </ThemedText>
        </View>

        {/* Settings List */}
        <View style={styles.settingsContainer}>
          {/* Share Data Toggle */}
          <View style={styles.shareDataItem}>
            <View style={styles.shareDataContent}>
              <ThemedText
                type="body"
                style={{
                  fontFamily: "Urbanist",
                  fontWeight: "700",
                  fontSize: rs(14),
                  lineHeight: rs(14) * 1.2,
                  color: theme.colors.textPrimary,
                }}
              >
                Share Data
              </ThemedText>
              <ThemedText
                type="caption"
                style={{
                  fontFamily: "Inter",
                  fontWeight: "500",
                  fontSize: rs(12),
                  lineHeight: rs(12) * 1.33,
                  letterSpacing: rs(12) * 0.01,
                  color: theme.colors.textMuted,
                }}
              >
                Share data to us for analytics
              </ThemedText>
            </View>
            <Switch
              value={shareData}
              onValueChange={setShareData}
              trackColor={{
                false: theme.colors.gray500,
                true: theme.colors.primary,
              }}
              thumbColor={theme.colors.white}
              style={styles.switch}
            />
          </View>

          <View style={styles.divider} />

          {/* Privacy Policy and Terms & Conditions */}
          {privacyOptions.map((option, index) => (
            <View key={option.id}>
              <Pressable
                style={styles.settingItem}
                onPress={() => handleSettingPress(option.route)}
              >
                <View style={styles.settingContent}>
                  <ThemedText
                    type="body"
                    style={{
                      fontFamily: "Inter",
                      fontWeight: "500",
                      fontSize: rs(14),
                      lineHeight: rs(14) * 1.43,
                      color: theme.colors.textPrimary,
                    }}
                  >
                    {option.title}
                  </ThemedText>
                </View>
                <ArrowRightIcon />
              </Pressable>
              {index < privacyOptions.length - 1 && (
                <View style={styles.divider} />
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
