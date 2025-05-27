import { theme, type Theme } from "@/constants/Theme";
import { useColorScheme } from "@/hooks/useColorScheme";

/**
 * Hook to access the universal theme
 * @returns The complete theme object
 */
export function useTheme(): Theme {
  return theme;
}

/**
 * Hook to get theme colors with light/dark mode support
 * @returns Theme colors object
 */
export function useThemeColors() {
  const colorScheme = useColorScheme() ?? "light";
  return {
    ...theme.colors,
    // Current theme colors based on color scheme
    current: theme.colors[colorScheme],
  };
}

/**
 * Hook to get responsive typography
 * @returns Typography object with responsive font sizes
 */
export function useThemeTypography() {
  return theme.typography;
}

/**
 * Hook to get responsive spacing
 * @returns Spacing object with responsive values
 */
export function useThemeSpacing() {
  return theme.spacing;
}

/**
 * Hook to get text styles
 * @returns Pre-defined text styles
 */
export function useTextStyles() {
  return theme.textStyles;
}

/**
 * Hook to get component styles
 * @returns Pre-defined component styles
 */
export function useComponentStyles() {
  return theme.components;
}

/**
 * Hook to get layout constants
 * @returns Layout constants
 */
export function useLayout() {
  return theme.layout;
}

/**
 * Hook to get shadows
 * @returns Shadow styles
 */
export function useShadows() {
  return theme.shadows;
}

/**
 * Hook to get border radius values
 * @returns Border radius values
 */
export function useBorderRadius() {
  return theme.borderRadius;
}

/**
 * Hook to get size constants
 * @returns Size constants for various components
 */
export function useSizes() {
  return theme.sizes;
}

// Export the main hook as default
export default useTheme;
