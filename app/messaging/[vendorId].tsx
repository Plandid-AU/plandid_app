import { ProgressDots } from "@/components/ProgressDots";
import { SettingsChangeModal } from "@/components/SettingsChangeModal";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import { rs } from "@/constants/Responsive";
import { mockChats } from "@/data/mockChats";
import { mockVendors } from "@/data/mockData";
import { useTheme } from "@/hooks/useTheme";
import { useFavoritesStore } from "@/stores/favoritesStore";
import { useUserStore } from "@/stores/userStore";
import { Chat, Message } from "@/types/chat";
import { MessageFlowData } from "@/types/messaging";
import { generateVendorMessage, MessageContext } from "@/utils/gemini";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.backgroundPrimary,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: rs(24),
      paddingVertical: rs(12),
      backgroundColor: theme.colors.backgroundPrimary,
    },
    backButton: {
      width: rs(20),
      height: rs(20),
      justifyContent: "center",
      alignItems: "center",
    },
    content: {
      flex: 1,
      paddingHorizontal: rs(24),
      paddingVertical: rs(8),
    },
    imageSection: {
      backgroundColor: "#EBEBEB",
      paddingVertical: rs(40),
      paddingHorizontal: rs(40),
      alignItems: "center",
      justifyContent: "center",
      marginVertical: rs(16),
      flex: 1,
    },
    placeholderImage: {
      width: rs(32),
      height: rs(32),
      backgroundColor: "#FDF2F2",
      borderRadius: rs(16),
      justifyContent: "center",
      alignItems: "center",
    },
    closeIconContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: rs(60),
      paddingLeft: rs(21),
      marginVertical: rs(16),
    },
    closeButton: {
      width: rs(32),
      height: rs(32),
      borderRadius: rs(16),
      borderWidth: 1,
      borderColor: "#DDDDDD",
      backgroundColor: theme.colors.backgroundPrimary,
      justifyContent: "center",
      alignItems: "center",
    },
    textSection: {
      alignItems: "center",
      gap: rs(32),
      paddingHorizontal: rs(8),
      paddingVertical: rs(16),
    },
    textSectionBottom: {
      alignItems: "center",
      gap: rs(32),
      paddingHorizontal: rs(8),
      paddingVertical: rs(16),
      marginTop: "auto",
    },
    textContent: {
      alignSelf: "stretch",
      gap: rs(24),
      paddingVertical: rs(16),
    },
    title: {
      fontSize: rs(24),
      fontWeight: "800",
      color: theme.colors.textPrimary,
      fontFamily: "Urbanist",
      lineHeight: rs(29),
      letterSpacing: 0.24,
      textAlign: "left",
    },
    description: {
      fontSize: rs(12),
      fontWeight: "500",
      color: theme.colors.textMuted,
      fontFamily: theme.typography.fontFamily.primary,
      lineHeight: rs(16),
      letterSpacing: 0.12,
      textAlign: "left",
    },
    fieldContainer: {
      gap: rs(16),
      alignSelf: "stretch",
    },
    fieldLabel: {
      fontSize: rs(12),
      fontWeight: "700",
      color: "#2F3036",
      fontFamily: "Urbanist",
      lineHeight: rs(14),
    },
    field: {
      borderWidth: 1,
      borderColor: "#C5C6CC",
      borderRadius: rs(12),
      paddingHorizontal: rs(16),
      paddingVertical: rs(16),
      minHeight: rs(56),
      justifyContent: "center",
      backgroundColor: theme.colors.backgroundPrimary,
      alignSelf: "stretch",
    },
    fieldText: {
      fontSize: rs(16),
      fontWeight: "500",
      color: "#2F3036",
      fontFamily: theme.typography.fontFamily.primary,
      lineHeight: rs(20),
    },
    textArea: {
      borderWidth: 1,
      borderColor: "#C5C6CC",
      borderRadius: rs(12),
      paddingHorizontal: rs(16),
      paddingVertical: rs(16),
      height: rs(200),
      textAlignVertical: "top",
      fontSize: rs(16),
      fontWeight: "500",
      color: theme.colors.textPrimary,
      fontFamily: theme.typography.fontFamily.primary,
      backgroundColor: theme.colors.backgroundPrimary,
      alignSelf: "stretch",
    },
    writeForMeContainer: {
      flexDirection: "row",
      justifyContent: "flex-end",
      alignItems: "center",
      gap: rs(6),
      alignSelf: "stretch",
    },
    writeForMeText: {
      fontSize: rs(12),
      fontWeight: "700",
      color: theme.colors.textPrimary,
      fontFamily: "Urbanist",
      lineHeight: rs(14),
    },
    aiIcon: {
      width: rs(17),
      height: rs(18),
    },
    bottomSection: {
      paddingHorizontal: rs(32),
      paddingVertical: rs(8),
      gap: rs(24),
      alignItems: "center",
    },
  });

export default function MessagingFlowScreen() {
  const { vendorId } = useLocalSearchParams<{ vendorId: string }>();
  const router = useRouter();
  const theme = useTheme();
  const styles = createStyles(theme);
  const { user, loadUser } = useUserStore();
  const { addContactedVendor } = useFavoritesStore();

  const [flowData, setFlowData] = useState<MessageFlowData>({
    vendorId: vendorId || "",
    vendorName: "",
    step: 0,
  });
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [settingsModalType, setSettingsModalType] = useState<"name" | "date">(
    "name"
  );
  const [isGeneratingMessage, setIsGeneratingMessage] = useState(false);

  // Find vendor data
  const vendor = mockVendors.find((v) => v.id === vendorId);

  // Check if user has already messaged this vendor
  useEffect(() => {
    const existingChat = mockChats.find((chat) => chat.vendorId === vendorId);
    if (existingChat) {
      // Redirect to existing chat
      router.replace(`/chat/${existingChat.id}`);
      return;
    }
  }, [vendorId, router]);

  // Reload user data when screen comes into focus (e.g., returning from settings)
  useFocusEffect(
    useCallback(() => {
      loadUser("current-user");
    }, [loadUser])
  );

  useEffect(() => {
    if (vendor && user) {
      setFlowData((prev) => ({
        ...prev,
        vendorName: vendor.name,
        partnerName: user?.partnerName,
        weddingDate: user?.weddingDate
          ? typeof user.weddingDate === "string"
            ? new Date(user.weddingDate)
            : user.weddingDate
          : undefined,
        weddingLocation: user?.weddingLocation,
      }));
    }
  }, [vendor, user]);

  // Additional effect to ensure data sync when user changes
  useEffect(() => {
    if (user) {
      setFlowData((prev) => ({
        ...prev,
        partnerName: user.partnerName,
        weddingDate: user.weddingDate
          ? typeof user.weddingDate === "string"
            ? new Date(user.weddingDate)
            : user.weddingDate
          : undefined,
        weddingLocation: user.weddingLocation,
      }));
    }
  }, [user?.partnerName, user?.weddingDate, user?.weddingLocation, user]);

  const handleNext = () => {
    // Validate required data for specific steps
    if (flowData.step === 1 && !flowData.partnerName && !user?.partnerName) {
      Alert.alert(
        "Partner Name Required",
        "Please enter your partner's name to continue."
      );
      handleFieldPress("name");
      return;
    }

    if (flowData.step === 2 && !flowData.weddingDate && !user?.weddingDate) {
      Alert.alert(
        "Wedding Date Required",
        "Please select your wedding date to continue."
      );
      handleFieldPress("date");
      return;
    }

    if (flowData.step < 3) {
      setFlowData((prev) => ({ ...prev, step: prev.step + 1 }));
    } else {
      handleSendMessage();
    }
  };

  const handleBack = () => {
    if (flowData.step > 0) {
      setFlowData((prev) => ({ ...prev, step: prev.step - 1 }));
    } else {
      router.back();
    }
  };

  const handleFieldPress = (type: "name" | "date") => {
    setSettingsModalType(type);
    setShowSettingsModal(true);
  };

  const generateAIMessage = async () => {
    if (!vendor || !user) {
      Alert.alert("Error", "Unable to generate message. Please try again.");
      return;
    }

    setIsGeneratingMessage(true);
    try {
      const context: MessageContext = {
        vendorName: vendor.name,
        vendorType: vendor.category,
        userName: user.name,
        partnerName: flowData.partnerName || user.partnerName,
        weddingDate:
          flowData.weddingDate || user.weddingDate
            ? typeof (flowData.weddingDate || user.weddingDate) === "string"
              ? new Date(flowData.weddingDate || (user.weddingDate as string))
              : ((flowData.weddingDate || user.weddingDate) as Date)
            : undefined,
        weddingLocation: flowData.weddingLocation || user.weddingLocation,
      };

      const generatedMessage = await generateVendorMessage(context);

      setFlowData((prev) => ({
        ...prev,
        userMessage: generatedMessage,
        isGeneratedMessage: true,
      }));
    } catch (error) {
      console.error("Error generating message:", error);
      Alert.alert("Error", "Failed to generate message. Please try again.");
    } finally {
      setIsGeneratingMessage(false);
    }
  };

  const handleSendMessage = async () => {
    if (!flowData.userMessage?.trim() || !vendor) {
      Alert.alert("Error", "Please write a message before sending.");
      return;
    }

    try {
      // Create new message
      const newMessage: Message = {
        id: `${Date.now()}`,
        text: flowData.userMessage,
        type: "sent",
        timestamp: new Date(),
        showTip: true,
      };

      // Create or update chat
      const existingChatIndex = mockChats.findIndex(
        (chat) => chat.vendorId === vendorId
      );

      if (existingChatIndex >= 0) {
        // Update existing chat
        const updatedChat = {
          ...mockChats[existingChatIndex],
          messages: [...mockChats[existingChatIndex].messages, newMessage],
          lastMessage: flowData.userMessage,
          lastMessageTime: new Date(),
        };
        mockChats[existingChatIndex] = updatedChat;
      } else {
        // Create new chat
        const newChat: Chat = {
          id: `chat-${vendorId}`,
          vendorName: vendor.name,
          vendorId: vendorId || "",
          lastMessage: flowData.userMessage,
          lastMessageTime: new Date(),
          unreadCount: 0,
          messages: [newMessage],
        };
        mockChats.push(newChat);
      }

      // Add vendor to contacted list
      if (vendorId) {
        addContactedVendor(vendorId);
      }

      Alert.alert("Success", "Your message has been sent!", [
        {
          text: "OK",
          onPress: () => router.replace("/(tabs)/messages"),
        },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
      Alert.alert("Error", "Failed to send message. Please try again.");
    }
  };

  const renderStepContent = () => {
    switch (flowData.step) {
      case 0:
        return (
          <>
            <View style={styles.imageSection}>
              <View style={styles.placeholderImage}>
                <Ionicons name="image" size={rs(16)} color="#FDF2F2" />
              </View>
            </View>

            <View style={styles.textSectionBottom}>
              <View style={styles.textContent}>
                <ThemedText style={styles.title}>
                  Just a Few Quick Questions First
                </ThemedText>
                <ThemedText style={styles.description}>
                  Share a few details about you so your wedding specialist can
                  offer the right support.
                </ThemedText>
              </View>
            </View>
          </>
        );

      case 1:
        return (
          <View style={styles.textSection}>
            <View style={styles.textContent}>
              <ThemedText style={styles.title}>
                Who are you tying the knot with?
              </ThemedText>
              <ThemedText style={styles.description}>
                Let us know your partner&apos;s name so vendors can personalise
                their response and make things a little more special
              </ThemedText>
            </View>

            <View style={styles.fieldContainer}>
              <ThemedText style={styles.fieldLabel}>Name</ThemedText>
              <TouchableOpacity
                style={styles.field}
                onPress={() => handleFieldPress("name")}
              >
                <ThemedText style={styles.fieldText}>
                  {flowData.partnerName ||
                    user?.partnerName ||
                    "Enter partner's name"}
                </ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        );

      case 2:
        return (
          <View style={styles.textSection}>
            <View style={styles.textContent}>
              <ThemedText style={styles.title}>
                When&apos;s the big day?
              </ThemedText>
              <ThemedText style={styles.description}>
                Sharing your wedding date helps vendors confirm their
                availability before getting in touch.
              </ThemedText>
            </View>

            <View style={styles.fieldContainer}>
              <ThemedText style={styles.fieldLabel}>Date</ThemedText>
              <TouchableOpacity
                style={styles.field}
                onPress={() => handleFieldPress("date")}
              >
                <ThemedText style={styles.fieldText}>
                  {flowData.weddingDate
                    ? new Date(flowData.weddingDate).toLocaleDateString(
                        "en-US",
                        {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        }
                      )
                    : user?.weddingDate
                    ? (typeof user.weddingDate === "string"
                        ? new Date(user.weddingDate)
                        : user.weddingDate
                      ).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : "Select wedding date"}
                </ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        );

      case 3:
        return (
          <View style={styles.textSection}>
            <View style={styles.textContent}>
              <ThemedText style={styles.title}>Ready to reach out?</ThemedText>
              <ThemedText style={styles.description}>
                Write your message to the vendor—or use AI to help craft the
                perfect note. Share your vision, ask questions, or just say
                hello!
              </ThemedText>
            </View>

            <View style={styles.fieldContainer}>
              <TextInput
                style={styles.textArea}
                placeholder="Write a message to the vendor"
                placeholderTextColor="#8F9098"
                multiline
                value={flowData.userMessage}
                onChangeText={(text) =>
                  setFlowData((prev) => ({
                    ...prev,
                    userMessage: text,
                    isGeneratedMessage: false,
                  }))
                }
              />

              <TouchableOpacity
                style={styles.writeForMeContainer}
                onPress={generateAIMessage}
                disabled={isGeneratingMessage}
              >
                <Image
                  source={{ uri: "data:image/svg+xml;base64,..." }} // Replace with actual AI icon
                  style={styles.aiIcon}
                />
                <ThemedText style={styles.writeForMeText}>
                  {isGeneratingMessage ? "Generating..." : "Write for me"}
                </ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  if (!vendor) {
    return (
      <SafeAreaView style={styles.container}>
        <ThemedText>Vendor not found</ThemedText>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Ionicons
              name="arrow-back"
              size={rs(20)}
              color={theme.colors.primary}
            />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {renderStepContent()}
        </ScrollView>

        {/* Bottom Section */}
        <View style={styles.bottomSection}>
          <ProgressDots currentStep={flowData.step} totalSteps={4} />
          <ThemedButton
            title={flowData.step === 3 ? "Send" : "Next"}
            onPress={handleNext}
            style={{ alignSelf: "stretch" }}
          />
        </View>

        {/* Settings Modal */}
        <SettingsChangeModal
          visible={showSettingsModal}
          onClose={() => setShowSettingsModal(false)}
          type={settingsModalType}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
