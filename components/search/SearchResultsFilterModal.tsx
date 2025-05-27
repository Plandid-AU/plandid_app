import { getLineHeight, rf, rs } from "@/constants/Responsive";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
}

interface FilterState {
  sortBy: string;
  confirmedAvailability: boolean;
  instantQuote: boolean;
  shootingStyle: string;
  editingStyle: string;
  editingPace: string;
  offerings: string;
}

const mockFilterData = {
  sortOptions: [
    "Relevance",
    "Price: Low to High",
    "Price: High to Low",
    "Rating",
    "Distance",
  ],
  shootingStyles: ["All", "Documentary", "Editorial", "Vintage"],
  editingStyles: ["All", "Story-Driven", "Visuals Driven"],
  editingPaces: [
    "All",
    "Slow and Emotional",
    "Bold",
    "Upbeat and Energetic",
    "Creative Transitions",
  ],
  offerings: [
    "All",
    "Highlight Film",
    "Ceremony Recording",
    "Speeches Recording",
    "Raw Footage",
    "Social Media Teaser",
    "First Dance Recording",
    "Super 8/Film Footage",
    "Drone Footage",
    "Same-Day Edit",
  ],
};

export const SearchResultsFilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
}) => {
  const [filters, setFilters] = useState<FilterState>({
    sortBy: "Relevance",
    confirmedAvailability: false,
    instantQuote: false,
    shootingStyle: "All",
    editingStyle: "All",
    editingPace: "All",
    offerings: "All",
  });

  const [showSortDropdown, setShowSortDropdown] = useState(false);

  const updateFilter = (key: keyof FilterState, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const renderTag = (
    text: string,
    isSelected: boolean,
    onPress: () => void
  ) => (
    <TouchableOpacity
      key={text}
      style={[styles.tag, isSelected && styles.tagSelected]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.tagText, isSelected && styles.tagTextSelected]}>
        {text}
      </Text>
    </TouchableOpacity>
  );

  const renderCheckbox = (checked: boolean, onPress: () => void) => (
    <TouchableOpacity style={styles.checkbox} onPress={onPress}>
      <View style={[styles.checkboxInner, checked && styles.checkboxChecked]}>
        {checked && <Ionicons name="checkmark" size={rf(10)} color="#FFFFFF" />}
      </View>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Filter</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={rf(18)} color="#7B1513" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Sort By */}
          <View style={styles.filterCard}>
            <View style={styles.filterHeader}>
              <Text style={styles.filterTitle}>Sort By</Text>
              <TouchableOpacity
                style={styles.dropdownButton}
                onPress={() => setShowSortDropdown(!showSortDropdown)}
              >
                <Text style={styles.dropdownText}>{filters.sortBy}</Text>
                <Ionicons
                  name="chevron-down"
                  size={rf(16)}
                  color="#1F2024"
                  style={[
                    styles.dropdownIcon,
                    showSortDropdown && styles.dropdownIconRotated,
                  ]}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Confirmed Availability */}
          <View style={styles.filterCard}>
            <View style={styles.filterRow}>
              <Text style={styles.filterTitle}>
                Only show vendors with Confirmed Availability
              </Text>
              {renderCheckbox(filters.confirmedAvailability, () =>
                updateFilter(
                  "confirmedAvailability",
                  !filters.confirmedAvailability
                )
              )}
            </View>
          </View>

          {/* Instant Quote */}
          <View style={styles.filterCard}>
            <View style={styles.filterRow}>
              <Text style={styles.filterTitle}>
                Only show vendors with Instant Quote
              </Text>
              {renderCheckbox(filters.instantQuote, () =>
                updateFilter("instantQuote", !filters.instantQuote)
              )}
            </View>
          </View>

          {/* Shooting Style */}
          <View style={styles.filterCard}>
            <Text style={styles.filterTitle}>Shooting Style</Text>
            <View style={styles.tagsContainer}>
              {mockFilterData.shootingStyles.map((style) =>
                renderTag(style, filters.shootingStyle === style, () =>
                  updateFilter("shootingStyle", style)
                )
              )}
            </View>
          </View>

          {/* Editing Style */}
          <View style={styles.filterCard}>
            <Text style={styles.filterTitle}>Editing Style</Text>
            <View style={styles.tagsContainer}>
              {mockFilterData.editingStyles.map((style) =>
                renderTag(style, filters.editingStyle === style, () =>
                  updateFilter("editingStyle", style)
                )
              )}
            </View>
          </View>

          {/* Editing Pace */}
          <View style={styles.filterCard}>
            <Text style={styles.filterTitle}>Editing Pace</Text>
            <View style={styles.tagsContainer}>
              {mockFilterData.editingPaces.map((pace) =>
                renderTag(pace, filters.editingPace === pace, () =>
                  updateFilter("editingPace", pace)
                )
              )}
            </View>
          </View>

          {/* Offerings */}
          <View style={styles.filterCard}>
            <Text style={styles.filterTitle}>Offerings</Text>
            <View style={styles.tagsContainer}>
              {mockFilterData.offerings.map((offering) =>
                renderTag(offering, filters.offerings === offering, () =>
                  updateFilter("offerings", offering)
                )
              )}
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: rs(12),
    borderTopRightRadius: rs(12),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: rs(18),
    paddingVertical: rs(16),
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
  },
  headerTitle: {
    fontFamily: "Urbanist",
    fontWeight: "800",
    fontSize: rf(24),
    lineHeight: getLineHeight(rf(24), 1.2),
    letterSpacing: rf(24) * 0.01,
    color: "#1F2024",
  },
  closeButton: {
    width: rs(18),
    height: rs(18),
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
    paddingHorizontal: rs(18),
    paddingTop: rs(12),
  },
  filterCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D9D9D9",
    borderRadius: rs(16),
    padding: rs(16),
    marginBottom: rs(12),
  },
  filterHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  filterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  filterTitle: {
    fontFamily: "Urbanist",
    fontWeight: "700",
    fontSize: rf(14),
    lineHeight: getLineHeight(rf(14), 1.2),
    color: "#1F2024",
    flex: 1,
  },
  dropdownButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: rs(12),
  },
  dropdownText: {
    fontFamily: "Urbanist",
    fontWeight: "700",
    fontSize: rf(14),
    lineHeight: getLineHeight(rf(14), 1.2),
    color: "#1F2024",
    textAlign: "right",
  },
  dropdownIcon: {
    transform: [{ rotate: "0deg" }],
  },
  dropdownIconRotated: {
    transform: [{ rotate: "180deg" }],
  },
  checkbox: {
    width: rs(16),
    height: rs(16),
  },
  checkboxInner: {
    width: "100%",
    height: "100%",
    borderWidth: 1.5,
    borderColor: "#C5C6CC",
    borderRadius: rs(4),
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: "#7B1513",
    borderColor: "#7B1513",
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: rs(12),
    marginTop: rs(6),
  },
  tag: {
    backgroundColor: "#EBEBEB",
    borderRadius: rs(12),
    paddingHorizontal: rs(8),
    paddingVertical: rs(6),
  },
  tagSelected: {
    backgroundColor: "#1F2024",
  },
  tagText: {
    fontFamily: "Urbanist",
    fontWeight: "600",
    fontSize: rf(10),
    lineHeight: getLineHeight(rf(10), 1.2),
    letterSpacing: rf(10) * 0.05,
    textTransform: "uppercase",
    color: "#1F2024",
    textAlign: "center",
  },
  tagTextSelected: {
    color: "#FFFFFF",
  },
});
