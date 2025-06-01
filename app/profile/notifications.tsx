import { ThemedText } from "@/components/ThemedText";
import { rs } from "@/constants/Responsive";
import { useTheme } from "@/hooks/useTheme";
import { useNotificationsStore } from "@/stores/notificationsStore";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Linking,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  View,
} from "react-native";

// Notification settings options
const notificationOptions = [
  {
    id: "messages",
    title: "Messages",
    description: "Get notified when receive a message",
  },
  {
    id: "recommendations",
    title: "Recommendations",
    description: "Get recommendation notification",
  },
  {
    id: "reminders",
    title: "Reminders",
    description: "Get reminder notification from us",
  },
  {
    id: "email",
    title: "Email",
    description: "Get Email Updates from Plandid",
  },
] as const;

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.backgroundPrimary,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: theme.spacing["5xl"],
      paddingVertical: theme.spacing["2xl"],
      gap: theme.spacing["2xl"],
    },
    backButton: {
      padding: theme.spacing.sm,
    },
    backIcon: {
      width: 12,
      height: 12,
      borderTopWidth: 2,
      borderLeftWidth: 2,
      borderColor: theme.colors.primary,
      transform: [{ rotate: "-45deg" }],
    },
    scrollContainer: {
      flex: 1,
    },
    content: {
      flex: 1,
      paddingHorizontal: theme.spacing["5xl"],
      paddingBottom: theme.spacing["5xl"],
    },
    titleSection: {
      gap: theme.spacing.base,
      paddingVertical: theme.spacing["2xl"],
    },
    subtitle: {
      color: theme.colors.textMuted,
    },
    enableButtonContainer: {
      paddingTop: theme.spacing["4xl"],
      paddingBottom: theme.spacing.base,
    },
    enableButton: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      gap: rs(8),
      paddingVertical: rs(12),
      paddingHorizontal: rs(16),
      backgroundColor: theme.colors.primary,
      borderRadius: rs(12),
    },
    bellIcon: {
      width: rs(14),
      height: rs(14),
    },
    settingsContainer: {
      paddingTop: theme.spacing["3xl"],
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
      gap: theme.spacing.xs,
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

export default function NotificationsScreen() {
  const theme = useTheme();
  const styles = createStyles(theme);

  const {
    settings,
    isLoading,
    permissionGranted,
    loadNotificationSettings,
    updateNotificationSetting,
    checkPermissionStatus,
    requestNotificationPermission,
  } = useNotificationsStore();

  const [localSettings, setLocalSettings] = useState(settings);

  useEffect(() => {
    const loadData = async () => {
      await loadNotificationSettings();
      await checkPermissionStatus();
    };
    loadData();
  }, [loadNotificationSettings, checkPermissionStatus]);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleBack = () => {
    router.back();
  };

  const handleEnableNotifications = async () => {
    // This will trigger the native iOS/Android permission dialog
    // On iOS: "App would like to send you notifications" with Allow/Don't Allow
    // On Android: Similar system permission dialog
    const result = await requestNotificationPermission();

    if (result.granted) {
      // Optionally enable some default settings when permissions are granted
      await updateNotificationSetting("messages", true);
      await updateNotificationSetting("reminders", true);
    } else if (result.shouldShowSettings) {
      // Permission was denied and user needs to enable in Settings
      Alert.alert(
        "Enable Notifications",
        "To receive notifications, please enable them in your device settings.",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Open Settings",
            onPress: () => {
              Linking.openSettings();
            },
          },
        ]
      );
    }
    // If neither granted nor shouldShowSettings, the dialog was dismissed/cancelled
  };

  const handleToggleSetting = async (
    key: keyof typeof settings,
    value: boolean
  ) => {
    // Update local state immediately for responsive UI
    setLocalSettings((prev) => ({
      ...prev,
      [key]: value,
    }));

    // Update in store/database
    await updateNotificationSetting(key, value);
  };

  // Bell ring icon component
  const BellRingIcon = () => (
    <View style={styles.bellIcon}>
      <Ionicons
        name="notifications-outline"
        size={rs(14)}
        color={theme.colors.white}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={handleBack}>
          <View style={styles.backIcon} />
        </Pressable>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Title Section */}
          <View style={styles.titleSection}>
            <ThemedText type="h3">Notifications</ThemedText>
            <ThemedText type="caption" style={styles.subtitle}>
              Choose what you want to be notified on
            </ThemedText>
          </View>

          {/* Enable Notifications Button - Only show if permissions not granted */}
          {!permissionGranted && (
            <View style={styles.enableButtonContainer}>
              <Pressable
                style={styles.enableButton}
                onPress={handleEnableNotifications}
              >
                <BellRingIcon />
                <ThemedText
                  type="body"
                  style={{
                    fontFamily: "Inter",
                    fontWeight: "600",
                    fontSize: rs(12),
                    lineHeight: rs(12) * 1.21,
                    color: theme.colors.white,
                  }}
                >
                  Enable Notification
                </ThemedText>
              </Pressable>
            </View>
          )}

          {/* Settings List */}
          <View style={styles.settingsContainer}>
            {notificationOptions.map((option, index) => (
              <View key={option.id}>
                <View style={styles.settingItem}>
                  <View style={styles.settingContent}>
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
                      {option.title}
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
                      {option.description}
                    </ThemedText>
                  </View>
                  <Switch
                    value={
                      localSettings[option.id as keyof typeof localSettings]
                    }
                    onValueChange={(value) =>
                      handleToggleSetting(
                        option.id as keyof typeof settings,
                        value
                      )
                    }
                    trackColor={{
                      false: theme.colors.gray500,
                      true: theme.colors.primary,
                    }}
                    thumbColor={theme.colors.white}
                    style={styles.switch}
                    disabled={isLoading}
                  />
                </View>
                {index < notificationOptions.length - 1 && (
                  <View style={styles.divider} />
                )}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
