import { ThemedText } from "@/components/ThemedText";
import { rf, rs } from "@/constants/Responsive";
import { useTheme } from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

interface LocationSelectorModalProps {
  visible: boolean;
  onClose: () => void;
  onLocationSelect: (location: string) => void;
  selectedLocation?: string;
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

const createStyles = (theme: any) =>
  StyleSheet.create({
    overlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(31, 32, 36, 0.4)",
    },
    modal: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: theme.colors.backgroundPrimary,
      borderTopLeftRadius: theme.borderRadius.xl,
      borderTopRightRadius: theme.borderRadius.xl,
      paddingBottom: theme.layout.safeAreaBottom,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingTop: theme.spacing["4xl"],
      paddingBottom: theme.spacing["2xl"],
      paddingHorizontal: theme.spacing["5xl"],
    },
    closeButton: {
      width: rs(18),
      height: rs(18),
      justifyContent: "center",
      alignItems: "center",
    },
    content: {
      paddingHorizontal: theme.spacing["3xl"],
      paddingBottom: theme.spacing["2xl"],
    },
    searchContainer: {
      backgroundColor: theme.colors.backgroundPrimary,
      borderWidth: 1,
      borderColor: theme.colors.borderLight,
      borderRadius: theme.borderRadius.xl,
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: theme.spacing["4xl"],
      paddingVertical: theme.spacing["3xl"],
      marginBottom: theme.spacing["4xl"],
    },
    searchIcon: {
      marginRight: theme.spacing["2xl"],
    },
    searchInput: {
      flex: 1,
      fontSize: rf(14),
      fontWeight: "500",
      color: theme.colors.textPrimary,
    },
    recommendedSection: {
      gap: theme.spacing["2xl"],
    },
    sectionTitle: {
      fontSize: rf(14),
      fontWeight: "700",
      color: "#252525",
      marginBottom: theme.spacing["2xl"],
    },
    locationItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: theme.spacing["2xl"],
      paddingVertical: 0,
      gap: theme.spacing["2xl"],
      height: rs(55),
    },
    locationIcon: {
      width: rs(40),
      height: rs(40),
      backgroundColor: "#D9D9D9",
      borderRadius: theme.borderRadius.xl,
    },
    locationContent: {
      flex: 1,
      justifyContent: "center",
      gap: rs(2),
    },
    locationName: {
      fontSize: rf(14),
      fontWeight: "500",
      color: theme.colors.textPrimary,
    },
    locationDescription: {
      fontSize: rf(10),
      fontWeight: "500",
      color: "#8F9098",
      letterSpacing: 0.15,
    },
  });

export const LocationSelectorModal: React.FC<LocationSelectorModalProps> = ({
  visible,
  onClose,
  onLocationSelect,
  selectedLocation,
}) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  const [searchText, setSearchText] = useState("");
  const [filteredLocations, setFilteredLocations] = useState(LOCATIONS);

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(overlayOpacity, {
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
  }, [visible, overlayOpacity, slideAnim]);

  useEffect(() => {
    if (searchText.trim() === "") {
      setFilteredLocations(LOCATIONS);
    } else {
      const filtered = LOCATIONS.filter((location) =>
        location.name.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredLocations(filtered);
    }
  }, [searchText]);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(overlayOpacity, {
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

  const handleLocationPress = (location: string) => {
    onLocationSelect(location);
  };

  if (!visible) {
    return null;
  }

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
              opacity: overlayOpacity,
            },
          ]}
        />
      </TouchableWithoutFeedback>

      <Animated.View
        style={[
          styles.modal,
          {
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <ThemedText type="h3">Where's Your Wedding?</ThemedText>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Ionicons
              name="close"
              size={rf(18)}
              color={theme.colors.textPrimary}
            />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Ionicons
              name="search"
              size={rf(20)}
              color={theme.colors.primary}
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Start your search"
              placeholderTextColor={theme.colors.textPrimary}
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>

          {/* Recommended Locations */}
          <ScrollView
            style={styles.recommendedSection}
            showsVerticalScrollIndicator={false}
          >
            <ThemedText style={styles.sectionTitle}>Recommended</ThemedText>
            {filteredLocations.map((location, index) => (
              <TouchableOpacity
                key={index}
                style={styles.locationItem}
                onPress={() => handleLocationPress(location.name)}
                activeOpacity={0.7}
              >
                <View style={styles.locationIcon} />
                <View style={styles.locationContent}>
                  <ThemedText style={styles.locationName}>
                    {location.name}
                  </ThemedText>
                  <ThemedText style={styles.locationDescription}>
                    {location.description}
                  </ThemedText>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </Animated.View>
    </Modal>
  );
};
