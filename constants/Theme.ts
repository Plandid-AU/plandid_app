import { Platform } from "react-native";
import { getLineHeight, rf, rh, rs } from "./Responsive";

// Color Palette
const colors = {
  // Primary Brand Colors
  primary: "#7B1513",
  primaryLight: "#FDF2F2",

  // Neutral Colors
  white: "#FFFFFF",
  black: "#000000",

  // Gray Scale
  gray50: "#F5F5F5",
  gray100: "#EBEBEB",
  gray200: "#E5E5E5",
  gray300: "#DDDDDD",
  gray400: "#D9D9D9",
  gray500: "#D4D6DD",
  gray600: "#C5C6CC",
  gray700: "#A0A0A0",
  gray800: "#999999",
  gray900: "#808080",

  // Text Colors
  textPrimary: "#000000",
  textSecondary: "#252525",
  textTertiary: "#1F2024",
  textMuted: "#71727A",
  textLight: "#717171",
  textDisabled: "#8F9098",
  textPlaceholder: "#494A50",

  // Background Colors
  backgroundPrimary: "#FFFFFF",
  backgroundSecondary: "#F5F5F5",
  backgroundTertiary: "#EBEBEB",
  backgroundDark: "#030819",
  backgroundOverlay: "rgba(255, 255, 255, 0.8)",
  backgroundTooltip: "#1F2024",

  // Border Colors
  borderLight: "#F5F5F5",
  borderMedium: "#D4D4D4",
  borderDark: "rgba(0, 0, 0, 0.08)",
  borderStrong: "rgba(0, 0, 0, 0.16)",

  // Status Colors
  success: "#7B1513",
  warning: "#007AFF",
  error: "#FF3B30",
  info: "#0a7ea4",

  // Legacy theme colors (for backward compatibility)
  light: {
    text: "#11181C",
    background: "#fff",
    tint: "#0a7ea4",
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: "#0a7ea4",
  },
  dark: {
    text: "#ECEDEE",
    background: "#151718",
    tint: "#fff",
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: "#fff",
  },
};

// Typography
const typography = {
  fontFamily: {
    primary: Platform.OS === "ios" ? "System" : "Roboto",
    secondary: "Inter",
    tertiary: "Urbanist",
  },

  fontSize: {
    xs: rf(10),
    sm: rf(12),
    base: rf(14),
    md: rf(16),
    lg: rf(18),
    xl: rf(20),
    "2xl": rf(24),
    "3xl": rf(32),
  },

  fontWeight: {
    normal: "400" as const,
    medium: "500" as const,
    semibold: "600" as const,
    bold: "700" as const,
    extrabold: "800" as const,
  },

  lineHeight: {
    xs: getLineHeight(rf(10), 1.4),
    sm: getLineHeight(rf(12), 1.33),
    base: getLineHeight(rf(14), 1.43),
    md: getLineHeight(rf(16), 1.375),
    lg: getLineHeight(rf(18), 1.2),
    xl: getLineHeight(rf(20), 1.2),
    "2xl": getLineHeight(rf(24), 1.2),
    "3xl": getLineHeight(rf(32), 1.0),
  },

  letterSpacing: {
    tight: -0.025,
    normal: 0,
    wide: 0.025,
    wider: 0.05,
    widest: 0.1,
  },
};

// Spacing
const spacing = {
  xs: rs(2),
  sm: rs(4),
  md: rs(6),
  base: rs(8),
  lg: rs(10),
  xl: rs(12),
  "2xl": rs(16),
  "3xl": rs(18),
  "4xl": rs(20),
  "5xl": rs(24),
  "6xl": rs(32),
  "7xl": rs(40),
  "8xl": rs(48),
  "9xl": rs(64),
  "10xl": rs(80),
};

// Border Radius
const borderRadius = {
  none: 0,
  sm: rs(2),
  base: rs(4),
  md: rs(6),
  lg: rs(8),
  xl: rs(12),
  "2xl": rs(16),
  "3xl": rs(20),
  "4xl": rs(24),
  "5xl": rs(28),
  "6xl": rs(32),
  full: 9999,
};

// Shadows
const shadows = {
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: rs(1) },
    shadowOpacity: 0.2,
    shadowRadius: rs(1.41),
    elevation: 2,
  },
  base: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: rs(2) },
    shadowOpacity: 0.1,
    shadowRadius: rs(8),
    elevation: 3,
  },
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: rs(4) },
    shadowOpacity: 0.3,
    shadowRadius: rs(8),
    elevation: 8,
  },
  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: rs(8) },
    shadowOpacity: 0.15,
    shadowRadius: rs(16),
    elevation: 12,
  },
  text: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: rs(2),
  },
};

// Component Sizes
const sizes = {
  icon: {
    xs: rf(10),
    sm: rf(12),
    base: rf(14),
    md: rf(16),
    lg: rf(18),
    xl: rf(20),
    "2xl": rf(22),
    "3xl": rf(24),
    "4xl": rf(32),
    "5xl": rf(50),
  },

  button: {
    sm: { height: rh(32), paddingHorizontal: rs(12) },
    base: { height: rh(40), paddingHorizontal: rs(16) },
    lg: { height: rh(48), paddingHorizontal: rs(20) },
  },

  input: {
    sm: { height: rh(32), paddingHorizontal: rs(12) },
    base: { height: rh(40), paddingHorizontal: rs(16) },
    lg: { height: rh(48), paddingHorizontal: rs(20) },
  },

  avatar: {
    xs: rs(18),
    sm: rs(24),
    base: rs(32),
    md: rs(40),
    lg: rs(48),
    xl: rs(64),
    "2xl": rs(100),
  },

  card: {
    padding: rs(12),
    paddingHorizontal: rs(18),
    borderRadius: rs(12),
  },

  modal: {
    borderRadius: rs(12),
    padding: rs(16),
  },
};

// Text Styles (Pre-defined combinations)
const textStyles = {
  // Headings
  h1: {
    fontFamily: typography.fontFamily.primary,
    fontSize: typography.fontSize["3xl"],
    fontWeight: typography.fontWeight.extrabold,
    lineHeight: typography.lineHeight["3xl"],
    color: colors.textPrimary,
  },

  h2: {
    fontFamily: typography.fontFamily.primary,
    fontSize: typography.fontSize["2xl"],
    fontWeight: typography.fontWeight.extrabold,
    lineHeight: typography.lineHeight["2xl"],
    color: colors.textPrimary,
  },

  h3: {
    fontFamily: typography.fontFamily.primary,
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    lineHeight: typography.lineHeight.xl,
    color: colors.textPrimary,
  },

  h4: {
    fontFamily: typography.fontFamily.primary,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.extrabold,
    lineHeight: typography.lineHeight.lg,
    color: colors.textSecondary,
  },

  // Body Text
  bodyLarge: {
    fontFamily: typography.fontFamily.primary,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    lineHeight: typography.lineHeight.md,
    color: colors.textPrimary,
  },

  body: {
    fontFamily: typography.fontFamily.primary,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    lineHeight: typography.lineHeight.base,
    color: colors.textPrimary,
  },

  bodySmall: {
    fontFamily: typography.fontFamily.primary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    lineHeight: typography.lineHeight.sm,
    color: colors.textPrimary,
  },

  // Labels
  label: {
    fontFamily: typography.fontFamily.primary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    lineHeight: typography.lineHeight.sm,
    color: colors.textPrimary,
  },

  labelSmall: {
    fontFamily: typography.fontFamily.primary,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    lineHeight: typography.lineHeight.xs,
    color: colors.textPrimary,
  },

  // Captions
  caption: {
    fontFamily: typography.fontFamily.primary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    lineHeight: typography.lineHeight.sm,
    letterSpacing: typography.fontSize.sm * 0.01,
    color: colors.textMuted,
  },

  captionSmall: {
    fontFamily: typography.fontFamily.primary,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.normal,
    lineHeight: typography.lineHeight.xs,
    letterSpacing: typography.fontSize.xs * 0.015,
    color: colors.textDisabled,
  },

  // Links
  link: {
    fontFamily: typography.fontFamily.primary,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    lineHeight: getLineHeight(typography.fontSize.md, 1.875),
    color: colors.info,
  },

  // Buttons
  buttonPrimary: {
    fontFamily: typography.fontFamily.primary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    lineHeight: getLineHeight(typography.fontSize.sm, 1.21),
    color: colors.white,
  },

  buttonSecondary: {
    fontFamily: typography.fontFamily.primary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    lineHeight: getLineHeight(typography.fontSize.sm, 1.21),
    color: colors.primary,
  },

  // Vendor Card Specific
  vendorName: {
    fontFamily: typography.fontFamily.primary,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.extrabold,
    lineHeight: getLineHeight(typography.fontSize.md, 1.2),
    letterSpacing: 0.08,
    color: colors.textSecondary,
  },

  vendorLocation: {
    fontFamily: typography.fontFamily.primary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    lineHeight: getLineHeight(typography.fontSize.sm, 1.33),
    letterSpacing: 0.12,
    color: colors.textLight,
  },

  vendorTagline: {
    fontFamily: typography.fontFamily.primary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    lineHeight: getLineHeight(typography.fontSize.sm, 1.33),
    letterSpacing: 0.12,
    color: colors.textPrimary,
  },

  rating: {
    fontFamily: typography.fontFamily.primary,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    lineHeight: getLineHeight(typography.fontSize.md, 1.375),
    color: colors.textSecondary,
  },

  feature: {
    fontFamily: typography.fontFamily.primary,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    lineHeight: getLineHeight(typography.fontSize.base, 1.2),
    color: colors.textSecondary,
  },
};

// Component Styles
const components = {
  card: {
    backgroundColor: colors.backgroundPrimary,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.base,
  },

  button: {
    primary: {
      backgroundColor: colors.primary,
      borderRadius: borderRadius.xl,
      ...sizes.button.base,
      justifyContent: "center" as const,
      alignItems: "center" as const,
    },

    secondary: {
      backgroundColor: "transparent",
      borderRadius: borderRadius.xl,
      borderWidth: 1.5,
      borderColor: colors.primary,
      ...sizes.button.base,
      justifyContent: "center" as const,
      alignItems: "center" as const,
    },

    ghost: {
      backgroundColor: "transparent",
      borderRadius: borderRadius.xl,
      ...sizes.button.base,
      justifyContent: "center" as const,
      alignItems: "center" as const,
    },
  },

  input: {
    backgroundColor: colors.backgroundPrimary,
    borderRadius: borderRadius["5xl"],
    borderWidth: 1,
    borderColor: colors.borderMedium,
    ...sizes.input.base,
    paddingHorizontal: spacing["6xl"],
  },

  modal: {
    backgroundColor: colors.backgroundPrimary,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
  },

  tooltip: {
    backgroundColor: colors.backgroundTooltip,
    borderRadius: borderRadius.xl,
    padding: spacing["2xl"],
    ...shadows.md,
  },

  tag: {
    backgroundColor: colors.backgroundTertiary,
    borderRadius: borderRadius.xl,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
  },

  divider: {
    height: 0.5,
    backgroundColor: colors.gray500,
  },

  pagination: {
    dot: {
      width: spacing.md,
      height: spacing.md,
      borderRadius: spacing.sm,
    },

    dotActive: {
      backgroundColor: colors.white,
    },

    dotInactive: {
      backgroundColor: colors.gray300,
    },
  },
};

// Layout Constants
const layout = {
  screenPadding: spacing["5xl"],
  cardMargin: spacing["6xl"],
  sectionSpacing: spacing["2xl"],
  itemSpacing: spacing.base,

  header: {
    height: rh(56),
    paddingHorizontal: spacing["5xl"],
  },

  tabBar: {
    height: rh(80),
    backgroundColor: colors.backgroundPrimary,
  },

  statusBar: {
    height: Platform.OS === "ios" ? rh(44) : 0,
  },
};

// Main Theme Object
export const theme = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  sizes,
  textStyles,
  components,
  layout,
};

// Type definitions for TypeScript
export type Theme = typeof theme;
export type ThemeColors = typeof colors;
export type ThemeTypography = typeof typography;
export type ThemeSpacing = typeof spacing;
export type ThemeBorderRadius = typeof borderRadius;
export type ThemeShadows = typeof shadows;
export type ThemeSizes = typeof sizes;
export type ThemeTextStyles = typeof textStyles;
export type ThemeComponents = typeof components;
export type ThemeLayout = typeof layout;

// Export individual parts for convenience
export {
  borderRadius,
  colors,
  components,
  layout,
  shadows,
  sizes,
  spacing,
  textStyles,
  typography,
};

// Default export
export default theme;
