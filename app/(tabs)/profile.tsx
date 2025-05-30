import { ThemedText } from "@/components/ThemedText";
import { rs } from "@/constants/Responsive";
import { useTheme } from "@/hooks/useTheme";
import { router } from "expo-router";
import React from "react";
import {
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

// Profile settings options
const profileOptions = [
  {
    id: "your-details",
    title: "Your Details",
    route: "/profile/your-details",
  },
  {
    id: "wedding-details",
    title: "Wedding Details",
    route: "/profile/wedding-details",
  },
  {
    id: "my-quotes",
    title: "My Quotes",
    route: "/profile/my-quotes",
  },
  {
    id: "your-partner",
    title: "Your Partner",
    route: "/profile/your-partner",
  },
  {
    id: "reviews",
    title: "Reviews",
    route: "/profile/reviews",
  },
  {
    id: "notifications",
    title: "Notifications",
    route: "/profile/notifications",
  },
  {
    id: "privacy-security",
    title: "Privacy & Security",
    route: "/profile/privacy-security",
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
    },
    profileInfoContainer: {
      alignItems: "center",
      paddingVertical: theme.spacing["2xl"],
      paddingHorizontal: theme.spacing["5xl"],
    },
    avatarContainer: {
      position: "relative",
      marginBottom: theme.spacing["2xl"],
    },
    avatar: {
      width: rs(80),
      height: rs(80),
      borderRadius: rs(40),
      backgroundColor: theme.colors.gray200,
    },
    editButton: {
      position: "absolute",
      bottom: 0,
      right: 0,
      width: rs(24),
      height: rs(24),
      borderRadius: rs(12),
      backgroundColor: theme.colors.primary,
      justifyContent: "center",
      alignItems: "center",
    },
    editIcon: {
      width: rs(10),
      height: rs(10),
      tintColor: theme.colors.white,
    },
    nameContainer: {
      alignItems: "center",
      gap: theme.spacing.sm,
    },
    settingsContainer: {
      paddingHorizontal: theme.spacing["5xl"],
      paddingBottom: theme.spacing["4xl"],
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
      tintColor: theme.colors.primary,
    },
    divider: {
      height: 0.5,
      backgroundColor: theme.colors.gray500,
      marginLeft: theme.spacing["2xl"],
    },
  });

// Placeholder arrow icon component (you might want to use an actual icon library)
const ArrowRightIcon = ({ style }: { style?: any }) => (
  <View
    style={[
      {
        width: rs(12),
        height: rs(12),
        borderTopWidth: 2,
        borderRightWidth: 2,
        borderColor: "#7B1513",
        transform: [{ rotate: "45deg" }],
      },
      style,
    ]}
  />
);

// Placeholder check icon for edit button
const CheckIcon = ({ style }: { style?: any }) => (
  <View
    style={[
      {
        width: rs(10),
        height: rs(6),
        borderBottomWidth: 2,
        borderLeftWidth: 2,
        borderColor: "#FFFFFF",
        transform: [{ rotate: "-45deg" }],
      },
      style,
    ]}
  />
);

export default function ProfileScreen() {
  const theme = useTheme();
  const styles = createStyles(theme);

  const handleSettingPress = (route: string) => {
    router.push(route as any);
  };

  const handleEditProfile = () => {
    // Handle edit profile action
    console.log("Edit profile pressed");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <ThemedText type="h3">Profile</ThemedText>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Info Section */}
        <View style={styles.profileInfoContainer}>
          <View style={styles.avatarContainer}>
            <Image
              source={{
                uri: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
              }}
              style={styles.avatar}
            />
            <Pressable style={styles.editButton} onPress={handleEditProfile}>
              <CheckIcon />
            </Pressable>
          </View>

          <View style={styles.nameContainer}>
            <ThemedText
              type="bodyLarge"
              style={{
                fontWeight: "800",
                fontSize: rs(16),
                letterSpacing: 0.5,
              }}
            >
              Jane Doe
            </ThemedText>
            <ThemedText
              type="caption"
              style={{
                fontSize: rs(12),
                letterSpacing: 0.12,
              }}
            >
              jane_doe@mail.com
            </ThemedText>
          </View>
        </View>

        {/* Settings List */}
        <View style={styles.settingsContainer}>
          {profileOptions.map((option, index) => (
            <View key={option.id}>
              <Pressable
                style={styles.settingItem}
                onPress={() => handleSettingPress(option.route)}
              >
                <View style={styles.settingContent}>
                  <ThemedText
                    type="body"
                    style={{
                      fontWeight: "500",
                      fontSize: rs(14),
                    }}
                  >
                    {option.title}
                  </ThemedText>
                </View>
                <ArrowRightIcon />
              </Pressable>
              {index < profileOptions.length - 1 && (
                <View style={styles.divider} />
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
