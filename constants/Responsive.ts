import { Dimensions, PixelRatio } from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// Base dimensions (iPhone 12/13/14 as reference)
const BASE_WIDTH = 390;
const BASE_HEIGHT = 844;

// Get responsive width
export const wp = (percentage: number): number => {
  const value = (percentage * SCREEN_WIDTH) / 100;
  return Math.round(PixelRatio.roundToNearestPixel(value));
};

// Get responsive height
export const hp = (percentage: number): number => {
  const value = (percentage * SCREEN_HEIGHT) / 100;
  return Math.round(PixelRatio.roundToNearestPixel(value));
};

// Get responsive font size
export const rf = (size: number): number => {
  const scale = SCREEN_WIDTH / BASE_WIDTH;
  const newSize = size * scale;

  // Clamp the font size to reasonable bounds
  const minSize = size * 0.8;
  const maxSize = size * 1.3;

  return Math.round(
    PixelRatio.roundToNearestPixel(
      Math.max(minSize, Math.min(maxSize, newSize))
    )
  );
};

// Get responsive spacing/margin/padding
export const rs = (size: number): number => {
  const scale = SCREEN_WIDTH / BASE_WIDTH;
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

// Get responsive height based on screen width ratio
export const rh = (size: number): number => {
  const scale = SCREEN_WIDTH / BASE_WIDTH;
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

// Screen size utilities
export const isSmallScreen = (): boolean => SCREEN_WIDTH < 375;
export const isMediumScreen = (): boolean =>
  SCREEN_WIDTH >= 375 && SCREEN_WIDTH < 414;
export const isLargeScreen = (): boolean => SCREEN_WIDTH >= 414;

// Get responsive line height based on font size
export const getLineHeight = (
  fontSize: number,
  multiplier: number = 1.2
): number => {
  return Math.round(fontSize * multiplier);
};

// Device info
export const deviceInfo = {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
  isSmall: isSmallScreen(),
  isMedium: isMediumScreen(),
  isLarge: isLargeScreen(),
};

// Responsive breakpoints
export const breakpoints = {
  small: 375,
  medium: 414,
  large: 500,
};

// Get value based on screen size
export const getResponsiveValue = (
  small: number,
  medium: number,
  large: number
): number => {
  if (isSmallScreen()) return small;
  if (isMediumScreen()) return medium;
  return large;
};
