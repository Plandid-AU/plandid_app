import { ThemedText } from "@/components/ThemedText";
import { rf, rs } from "@/constants/Responsive";
import { useTheme } from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

interface DateSelectorModalProps {
  visible: boolean;
  onClose: () => void;
  onDateSelect: (date: Date) => void;
  selectedDate?: Date;
}

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
    warningText: {
      paddingHorizontal: theme.spacing.lg,
      paddingBottom: theme.spacing["4xl"],
      color: theme.colors.textMuted,
      textAlign: "left",
    },
    calendarContainer: {
      backgroundColor: theme.colors.backgroundPrimary,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing["4xl"],
      marginHorizontal: theme.spacing.lg,
    },
    calendarHeader: {
      flexDirection: "column",
      gap: rs(2),
      marginBottom: theme.spacing["2xl"],
    },
    monthYearContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: theme.spacing["2xl"],
      paddingVertical: theme.spacing["2xl"],
    },
    monthYearText: {
      fontSize: rf(14),
      fontWeight: "700",
      color: theme.colors.textPrimary,
    },
    navButton: {
      width: rs(12),
      height: rs(12),
      justifyContent: "center",
      alignItems: "center",
    },
    navControls: {
      flexDirection: "row",
      gap: rs(22),
    },
    weekDaysContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: theme.spacing["2xl"],
    },
    weekDay: {
      width: rs(40),
      height: rs(38),
      justifyContent: "center",
      alignItems: "center",
    },
    weekDayText: {
      fontSize: rf(10),
      fontWeight: "600",
      color: theme.colors.textMuted,
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    daysContainer: {
      gap: 0,
    },
    weekRow: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    dayButton: {
      width: rs(40),
      height: rs(40),
      borderRadius: rs(20),
      justifyContent: "center",
      alignItems: "center",
      margin: 0,
    },
    dayButtonEmpty: {
      backgroundColor: "transparent",
    },
    dayButtonDefault: {
      backgroundColor: "transparent",
    },
    dayButtonCurrent: {
      backgroundColor: "#F8F9FE",
    },
    dayButtonSelected: {
      backgroundColor: theme.colors.primary,
    },
    dayText: {
      fontSize: rf(12),
      fontWeight: "700",
      textAlign: "center",
    },
    dayTextEmpty: {
      color: "transparent",
    },
    dayTextDefault: {
      color: "#494A50",
    },
    dayTextCurrent: {
      color: "#494A50",
    },
    dayTextSelected: {
      color: theme.colors.backgroundPrimary,
    },
  });

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const WEEK_DAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

export const DateSelectorModal: React.FC<DateSelectorModalProps> = ({
  visible,
  onClose,
  onDateSelect,
  selectedDate,
}) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  // Initialize animations with useMemo to prevent recreation
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewDate, setViewDate] = useState(() => selectedDate || new Date());

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

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(viewDate);
    if (direction === "prev") {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setViewDate(newDate);
  };

  const getDaysInMonth = () => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();

    // Get the day of week for the first day (0 = Sunday, 1 = Monday, etc.)
    // Convert to Monday = 0, Sunday = 6
    let startDay = firstDay.getDay();
    startDay = startDay === 0 ? 6 : startDay - 1;

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const isToday = (date: Date) => {
    return (
      date.getDate() === currentDate.getDate() &&
      date.getMonth() === currentDate.getMonth() &&
      date.getFullYear() === currentDate.getFullYear()
    );
  };

  const isSelected = (date: Date) => {
    if (!selectedDate) return false;
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  const handleDatePress = (date: Date) => {
    onDateSelect(date);
  };

  const renderCalendar = () => {
    const days = getDaysInMonth();
    const weeks = [];

    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }

    return (
      <View style={styles.calendarContainer}>
        {/* Calendar Header */}
        <View style={styles.calendarHeader}>
          <View style={styles.monthYearContainer}>
            <ThemedText style={styles.monthYearText}>
              {MONTHS[viewDate.getMonth()]} {viewDate.getFullYear()}
            </ThemedText>
            <View style={styles.navControls}>
              <TouchableOpacity
                style={styles.navButton}
                onPress={() => navigateMonth("prev")}
              >
                <Ionicons
                  name="chevron-back"
                  size={rf(12)}
                  color={theme.colors.primary}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.navButton}
                onPress={() => navigateMonth("next")}
              >
                <Ionicons
                  name="chevron-forward"
                  size={rf(12)}
                  color={theme.colors.primary}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Week Days */}
          <View style={styles.weekDaysContainer}>
            {WEEK_DAYS.map((day) => (
              <View key={day} style={styles.weekDay}>
                <ThemedText style={styles.weekDayText}>{day}</ThemedText>
              </View>
            ))}
          </View>
        </View>

        {/* Calendar Days */}
        <View style={styles.daysContainer}>
          {weeks.map((week, weekIndex) => (
            <View key={weekIndex} style={styles.weekRow}>
              {week.map((date, dayIndex) => {
                if (!date) {
                  return (
                    <View
                      key={`empty-${dayIndex}`}
                      style={[styles.dayButton, styles.dayButtonEmpty]}
                    >
                      <ThemedText style={[styles.dayText, styles.dayTextEmpty]}>
                        0
                      </ThemedText>
                    </View>
                  );
                }

                const today = isToday(date);
                const selected = isSelected(date);

                return (
                  <TouchableOpacity
                    key={date.getTime()}
                    style={[
                      styles.dayButton,
                      selected
                        ? styles.dayButtonSelected
                        : today
                        ? styles.dayButtonCurrent
                        : styles.dayButtonDefault,
                    ]}
                    onPress={() => handleDatePress(date)}
                  >
                    <ThemedText
                      style={[
                        styles.dayText,
                        selected
                          ? styles.dayTextSelected
                          : today
                          ? styles.dayTextCurrent
                          : styles.dayTextDefault,
                      ]}
                    >
                      {date.getDate()}
                    </ThemedText>
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </View>
      </View>
    );
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
          <ThemedText type="h3">Select Date</ThemedText>
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
          {/* Warning Text */}
          <ThemedText type="bodySmall" style={styles.warningText}>
            Changing your wedding date means that vendor that are previously
            available may not be
          </ThemedText>

          {/* Calendar */}
          {renderCalendar()}
        </View>
      </Animated.View>
    </Modal>
  );
};
