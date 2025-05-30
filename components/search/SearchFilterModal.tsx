import { getLineHeight, rf, rs } from "@/constants/Responsive";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

interface SearchFilterModalProps {
  visible: boolean;
  onClose: () => void;
  type: "location" | "date" | "service";
  value: string | null;
  onSelect: (value: string) => void;
}

const LOCATIONS = [
  {
    name: "Melbourne",
    description: "Classic and great city to have your wedding",
  },
  { name: "Sydney", description: "Harbor views and iconic landmarks" },
  { name: "Brisbane", description: "Tropical vibes and riverside venues" },
  { name: "Perth", description: "Beautiful beaches and sunset ceremonies" },
  { name: "Adelaide", description: "Wine country and historic charm" },
  { name: "Albury", description: "Get the vibes of small town" },
];

const SERVICES = [
  { name: "Photographer", selected: false },
  { name: "Videographer", selected: false },
  { name: "Content Creator", selected: false },
];

export const SearchFilterModal: React.FC<SearchFilterModalProps> = ({
  visible,
  onClose,
  type,
  value,
  onSelect,
}) => {
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: SCREEN_HEIGHT,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: SCREEN_HEIGHT,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  };

  const renderLocationModal = () => (
    <>
      <View style={styles.header}>
        <Text style={styles.title}>Where's Your Wedding?</Text>
        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
          <Ionicons name="close" size={rf(18)} color="#7B1513" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchBar}>
        <Ionicons name="search" size={rf(20)} color="#7B1513" />
        <TextInput
          style={styles.searchInput}
          placeholder="Start your search"
          placeholderTextColor="#1F2024"
        />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Recommended</Text>
        {LOCATIONS.map((location, index) => (
          <TouchableOpacity
            key={index}
            style={styles.locationItem}
            onPress={() => {
              onSelect(location.name);
              handleClose();
            }}
            activeOpacity={0.7}
          >
            <View style={styles.locationIcon} />
            <View style={styles.locationContent}>
              <Text style={styles.locationName}>{location.name}</Text>
              <Text style={styles.locationDescription}>
                {location.description}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </>
  );

  const renderDateModal = () => (
    <>
      <View style={styles.header}>
        <Text style={styles.title}>When's Your Wedding?</Text>
        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
          <Ionicons name="close" size={rf(18)} color="#7B1513" />
        </TouchableOpacity>
      </View>

      <View style={styles.dateContent}>
        <Text style={styles.dateMessage}>
          Changing your wedding date means that vendor that are previously
          available may not be. Therefore you can only change your date in
          settings
        </Text>
      </View>

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => {
          handleClose();
          router.push("/profile");
        }}
        activeOpacity={0.8}
      >
        <Text style={styles.primaryButtonText}>Go To Settings</Text>
        <Ionicons name="chevron-forward" size={rf(12)} color="#FFFFFF" />
      </TouchableOpacity>
    </>
  );

  const renderServiceModal = () => (
    <>
      <View style={styles.header}>
        <Text style={styles.serviceTitle}>What do you need?</Text>
        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
          <Ionicons name="close" size={rf(18)} color="#7B1513" />
        </TouchableOpacity>
      </View>

      {SERVICES.map((service, index) => (
        <View key={index} style={styles.serviceItem}>
          <Text style={styles.serviceName}>{service.name}</Text>
          <TouchableOpacity
            style={[
              styles.serviceButton,
              value === service.name && styles.serviceButtonSelected,
            ]}
            onPress={() => {
              onSelect(service.name);
              handleClose();
            }}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.serviceButtonText,
                value === service.name && styles.serviceButtonTextSelected,
              ]}
            >
              {value === service.name ? "Selected" : "Select"}
            </Text>
          </TouchableOpacity>
        </View>
      ))}
    </>
  );

  const getModalHeight = () => {
    switch (type) {
      case "location":
        return SCREEN_HEIGHT * 0.7;
      case "date":
        return SCREEN_HEIGHT * 0.3;
      case "service":
        return SCREEN_HEIGHT * 0.4;
      default:
        return SCREEN_HEIGHT * 0.5;
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback onPress={handleClose}>
        <Animated.View
          style={[
            styles.overlay,
            {
              opacity: fadeAnim,
            },
          ]}
        />
      </TouchableWithoutFeedback>

      <Animated.View
        style={[
          styles.modalContainer,
          {
            height: getModalHeight(),
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {type === "location" && renderLocationModal()}
        {type === "date" && renderDateModal()}
        {type === "service" && renderServiceModal()}
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(31, 32, 36, 0.4)",
  },
  modalContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: rs(12),
    borderTopRightRadius: rs(12),
    paddingHorizontal: rs(18),
    paddingTop: rs(24),
    paddingBottom: rs(34),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: rs(6),
    paddingTop: rs(8),
    marginBottom: rs(16),
  },
  title: {
    fontFamily: "Inter",
    fontWeight: "700",
    fontSize: rf(24),
    lineHeight: getLineHeight(rf(24), 1.21),
    letterSpacing: rf(24) * 0.01,
    color: "#000000",
  },
  serviceTitle: {
    fontFamily: "Inter",
    fontWeight: "700",
    fontSize: rf(26),
    lineHeight: getLineHeight(rf(26), 1.31),
    color: "#000000",
  },
  closeButton: {
    width: rs(18),
    height: rs(18),
    alignItems: "center",
    justifyContent: "center",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: rs(10),
    paddingVertical: rs(17),
    paddingHorizontal: rs(24),
    borderRadius: rs(12),
    borderWidth: 1,
    borderColor: "#000000",
    marginBottom: rs(16),
  },
  searchInput: {
    flex: 1,
    fontFamily: "Inter",
    fontWeight: "400",
    fontSize: rf(14),
    lineHeight: getLineHeight(rf(14), 1.43),
    color: "#1F2024",
  },
  scrollView: {
    flex: 1,
  },
  sectionTitle: {
    fontFamily: "Inter",
    fontWeight: "600",
    fontSize: rf(14),
    lineHeight: getLineHeight(rf(14), 1.14),
    color: "#252525",
    marginBottom: rs(8),
  },
  locationItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: rs(10),
    paddingHorizontal: rs(10),
    paddingVertical: rs(7.5),
    marginBottom: rs(8),
  },
  locationIcon: {
    width: rs(40),
    height: rs(40),
    backgroundColor: "#D9D9D9",
    borderRadius: rs(12),
  },
  locationContent: {
    flex: 1,
    gap: rs(2),
  },
  locationName: {
    fontFamily: "Inter",
    fontWeight: "400",
    fontSize: rf(14),
    lineHeight: getLineHeight(rf(14), 1.43),
    color: "#1F2024",
  },
  locationDescription: {
    fontFamily: "Inter",
    fontWeight: "400",
    fontSize: rf(10),
    lineHeight: getLineHeight(rf(10), 1.4),
    letterSpacing: rf(10) * 0.015,
    color: "#8F9098",
  },
  dateContent: {
    paddingHorizontal: rs(4),
    marginBottom: rs(16),
  },
  dateMessage: {
    fontFamily: "Inter",
    fontWeight: "500",
    fontSize: rf(12),
    lineHeight: getLineHeight(rf(12), 1.33),
    letterSpacing: rf(12) * 0.01,
    color: "#71727A",
  },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: rs(8),
    paddingVertical: rs(12),
    paddingHorizontal: rs(16),
    backgroundColor: "#7B1513",
    borderRadius: rs(12),
    minHeight: rs(40),
  },
  primaryButtonText: {
    fontFamily: "Inter",
    fontWeight: "600",
    fontSize: rf(12),
    lineHeight: getLineHeight(rf(12), 1.21),
    color: "#FFFFFF",
  },
  serviceItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: rs(16),
    paddingHorizontal: rs(24),
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.16)",
  },
  serviceName: {
    fontFamily: "Inter",
    fontWeight: "600",
    fontSize: rf(16),
    lineHeight: getLineHeight(rf(16), 1.21),
    color: "#000000",
  },
  serviceButton: {
    paddingVertical: rs(12),
    paddingHorizontal: rs(16),
    borderRadius: rs(12),
    borderWidth: 1.5,
    borderColor: "#7B1513",
    minHeight: rs(40),
    justifyContent: "center",
  },
  serviceButtonSelected: {
    backgroundColor: "#7B1513",
    borderColor: "#7B1513",
  },
  serviceButtonText: {
    fontFamily: "Inter",
    fontWeight: "600",
    fontSize: rf(12),
    lineHeight: getLineHeight(rf(12), 1.21),
    color: "#7B1513",
  },
  serviceButtonTextSelected: {
    color: "#FFFFFF",
  },
});
