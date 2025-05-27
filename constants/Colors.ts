/**
 * Legacy Colors file - now imports from the universal Theme system
 * This file is maintained for backward compatibility.
 *
 * For new development, please use:
 * - import { theme } from '@/constants/Theme'
 * - import { useTheme, useThemeColors } from '@/hooks/useTheme'
 */

import { theme } from "./Theme";

const tintColorLight = theme.colors.info;
const tintColorDark = theme.colors.white;

export const Colors = {
  light: {
    text: theme.colors.light.text,
    background: theme.colors.light.background,
    tint: tintColorLight,
    icon: theme.colors.light.icon,
    tabIconDefault: theme.colors.light.tabIconDefault,
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: theme.colors.dark.text,
    background: theme.colors.dark.background,
    tint: tintColorDark,
    icon: theme.colors.dark.icon,
    tabIconDefault: theme.colors.dark.tabIconDefault,
    tabIconSelected: tintColorDark,
  },
};
