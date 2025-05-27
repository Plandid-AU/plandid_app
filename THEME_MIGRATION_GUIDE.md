# Universal Theme System Migration Guide

## Overview

This guide documents the migration to a universal theme system for the PlanDid app. The new system provides consistent styling across the entire application and makes it easy to update colors, fonts, and other design tokens from a single location.

## What's Been Implemented

### 1. Universal Theme File (`constants/Theme.ts`)

A comprehensive theme system that includes:

- **Colors**: Primary brand colors, neutrals, grays, text colors, backgrounds, borders, and status colors
- **Typography**: Font families, sizes, weights, line heights, and letter spacing
- **Spacing**: Responsive spacing values for margins, padding, and gaps
- **Border Radius**: Consistent border radius values
- **Shadows**: Pre-defined shadow styles for different elevations
- **Component Sizes**: Standard sizes for buttons, inputs, icons, avatars, etc.
- **Text Styles**: Pre-defined text style combinations for headings, body text, labels, etc.
- **Component Styles**: Base styles for common components like cards, buttons, inputs, etc.
- **Layout Constants**: Screen padding, header heights, and other layout values

### 2. Theme Hooks (`hooks/useTheme.ts`)

Convenient hooks for accessing theme values:

- `useTheme()`: Access the complete theme object
- `useThemeColors()`: Get theme colors with light/dark mode support
- `useTextStyles()`: Get pre-defined text styles
- `useComponentStyles()`: Get component styles
- `useLayout()`: Get layout constants
- And more specialized hooks for different theme sections

### 3. Updated Components

#### ThemedText Component

- Extended with new text types: `h1`, `h2`, `h3`, `h4`, `body`, `bodyLarge`, `bodySmall`, `label`, `caption`, `buttonPrimary`, `vendorName`, etc.
- Automatically uses theme colors and typography
- Maintains backward compatibility with existing types

#### ThemedView Component

- Added variant support: `primary`, `secondary`, `tertiary`, `dark`, `card`
- Uses theme background colors
- Maintains backward compatibility

#### New ThemedButton Component

- Consistent button styling using theme system
- Variants: `primary`, `secondary`, `ghost`
- Sizes: `sm`, `base`, `lg`
- Built-in loading states and icon support

#### New ThemedCard Component

- Consistent card styling
- Variants: `default`, `elevated`, `outlined`, `flat`
- Configurable padding using theme spacing

#### Updated VendorCard Component

- Migrated to use theme colors instead of hardcoded hex values
- Uses ThemedText components for consistent typography
- Dynamic styles based on theme values

### 4. Backward Compatibility

The existing `Colors.ts` file has been updated to import from the new theme system while maintaining the same API, ensuring existing code continues to work.

## Migration Strategy

### Phase 1: Core Components (✅ COMPLETED)

- [x] Create universal theme system
- [x] Update ThemedText and ThemedView components
- [x] Create new ThemedButton and ThemedCard components
- [x] Migrate VendorCard component as example

### Phase 2: Component Migration (IN PROGRESS)

#### High Priority Components to Migrate:

1. **SuperlikeButton** (`components/SuperlikeButton.tsx`)
2. **CategoryTabs** (`components/CategoryTabs.tsx`)
3. **FavouritesTabs** (`components/FavouritesTabs.tsx`)
4. **SearchBar** (`components/SearchBar.tsx`)
5. **Tooltip** (`components/Tooltip.tsx`)

#### Medium Priority Components:

1. **FavouritesEmptyState** (`components/FavouritesEmptyState.tsx`)
2. **FavouritesVendorCard** (`components/FavouritesVendorCard.tsx`)
3. **VendorOptionsModal** (`components/VendorOptionsModal.tsx`)

### Phase 3: Screen Migration

#### Screens to Migrate:

1. **Main Tab Screens**:

   - `app/(tabs)/index.tsx`
   - `app/(tabs)/favourites.tsx`
   - `app/(tabs)/messages.tsx`
   - `app/(tabs)/profile.tsx`

2. **Search Screens**:

   - `app/search/index.tsx`
   - `app/search/results.tsx`

3. **Vendor Detail Screen**:

   - `app/vendor/[id].tsx`

4. **Search Components**:
   - `components/search/SearchFilterModal.tsx`
   - `components/search/SearchResultsFilterModal.tsx`

## Migration Steps for Each Component

### 1. Import Theme Hooks

```typescript
import { useTheme, useTextStyles, useThemeColors } from "@/hooks/useTheme";
```

### 2. Replace Hardcoded Colors

**Before:**

```typescript
color: "#7B1513";
backgroundColor: "#FFFFFF";
borderColor: "#E5E5E5";
```

**After:**

```typescript
color: theme.colors.primary;
backgroundColor: theme.colors.backgroundPrimary;
borderColor: theme.colors.borderLight;
```

### 3. Replace Text Components

**Before:**

```typescript
<Text style={styles.vendorName}>{vendor.name}</Text>
```

**After:**

```typescript
<ThemedText type="vendorName">{vendor.name}</ThemedText>
```

### 4. Update StyleSheet to Use Theme

**Before:**

```typescript
const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
  },
});
```

**After:**

```typescript
const createStyles = (theme: any) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.colors.backgroundPrimary,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing["2xl"],
    },
  });

// In component:
const theme = useTheme();
const styles = createStyles(theme);
```

### 5. Replace Responsive Functions with Theme Values

**Before:**

```typescript
fontSize: rf(16);
padding: rs(12);
marginBottom: rs(16);
```

**After:**

```typescript
fontSize: theme.typography.fontSize.md;
padding: theme.spacing.xl;
marginBottom: theme.spacing["2xl"];
```

## Color Mapping Reference

| Old Hardcoded Color | New Theme Color                                             |
| ------------------- | ----------------------------------------------------------- |
| `#7B1513`           | `theme.colors.primary`                                      |
| `#FFFFFF`           | `theme.colors.white` or `theme.colors.backgroundPrimary`    |
| `#000000`           | `theme.colors.black` or `theme.colors.textPrimary`          |
| `#252525`           | `theme.colors.textSecondary`                                |
| `#1F2024`           | `theme.colors.textTertiary`                                 |
| `#71727A`           | `theme.colors.textMuted`                                    |
| `#717171`           | `theme.colors.textLight`                                    |
| `#8F9098`           | `theme.colors.textDisabled`                                 |
| `#F5F5F5`           | `theme.colors.gray50` or `theme.colors.backgroundSecondary` |
| `#EBEBEB`           | `theme.colors.gray100` or `theme.colors.backgroundTertiary` |
| `#E5E5E5`           | `theme.colors.gray200` or `theme.colors.borderLight`        |
| `#D9D9D9`           | `theme.colors.gray400`                                      |
| `#D4D6DD`           | `theme.colors.gray500`                                      |

## Typography Mapping Reference

| Old Style               | New Theme Style                                       |
| ----------------------- | ----------------------------------------------------- |
| Vendor name styling     | `theme.textStyles.vendorName`                         |
| Vendor location styling | `theme.textStyles.vendorLocation`                     |
| Vendor tagline styling  | `theme.textStyles.vendorTagline`                      |
| Rating text styling     | `theme.textStyles.rating`                             |
| Feature text styling    | `theme.textStyles.feature`                            |
| Button text styling     | `theme.textStyles.buttonPrimary` or `buttonSecondary` |
| Body text styling       | `theme.textStyles.body`                               |
| Caption text styling    | `theme.textStyles.caption`                            |

## Benefits of the New System

1. **Consistency**: All components use the same design tokens
2. **Maintainability**: Change colors/fonts globally from one file
3. **Scalability**: Easy to add new theme variants or dark mode
4. **Developer Experience**: IntelliSense support for theme values
5. **Responsive**: All values are responsive by default
6. **Type Safety**: Full TypeScript support for theme values

## Testing the Migration

After migrating each component:

1. **Visual Testing**: Ensure the component looks identical to before
2. **Responsive Testing**: Test on different screen sizes
3. **Theme Consistency**: Verify colors match the design system
4. **Performance**: Ensure no performance regressions

## Future Enhancements

1. **Dark Mode Support**: The theme system is ready for dark mode implementation
2. **Theme Variants**: Easy to add seasonal themes or brand variations
3. **Animation Values**: Add consistent animation durations and easing
4. **Accessibility**: Add accessibility-focused theme values
5. **Design Tokens**: Export theme values for design tools

## Getting Help

- Check existing migrated components (VendorCard, ThemedText, ThemedView) for examples
- Refer to the theme file (`constants/Theme.ts`) for available values
- Use TypeScript IntelliSense to discover available theme properties
- Test thoroughly after each migration to ensure visual consistency
