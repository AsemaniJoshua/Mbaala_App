import React from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Palette } from '@/constants/colors';
import { Fonts, Radii, Shadows, TouchTarget } from '@/constants/theme';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'warning';

export interface TactileButtonProps {
  /** Text label or main title */
  label: string;
  /** Sub-label or pronunciation hint */
  subLabel?: string;
  /** Icon element rendered on the left */
  iconLeft?: React.ReactNode;
  /** Icon element rendered on the right */
  iconRight?: React.ReactNode;
  /** Visual variant */
  variant?: ButtonVariant;
  /** Press handler */
  onPress: () => void;
  /** Loading state */
  loading?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Full width stretching */
  fullWidth?: boolean;
  /** Custom container style */
  style?: StyleProp<ViewStyle>;
  /** Haptic feedback style (default: Medium) */
  hapticFeedback?: 'light' | 'medium' | 'heavy' | 'selection' | 'none';
  /** Accessibility label */
  accessibilityLabel?: string;
}

export const TactileButton: React.FC<TactileButtonProps> = ({
  label,
  subLabel,
  iconLeft,
  iconRight,
  variant = 'primary',
  onPress,
  loading = false,
  disabled = false,
  fullWidth = true,
  style,
  hapticFeedback = 'medium',
  accessibilityLabel,
}) => {
  const triggerHaptics = () => {
    if (Platform.OS === 'web' || hapticFeedback === 'none') return;
    try {
      switch (hapticFeedback) {
        case 'light':
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          break;
        case 'heavy':
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          break;
        case 'selection':
          Haptics.selectionAsync();
          break;
        case 'medium':
        default:
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          break;
      }
    } catch {
      // Haptics fallback gracefully if unsupported
    }
  };

  const handlePress = () => {
    if (disabled || loading) return;
    triggerHaptics();
    onPress();
  };

  // Color mapping based on variant
  const getColors = (pressed: boolean) => {
    switch (variant) {
      case 'secondary':
        return {
          bg: pressed ? Palette.sand[200] : Palette.sand[100],
          border: Palette.sand[300],
          text: Palette.slate[800],
          subText: Palette.slate[500],
        };
      case 'outline':
        return {
          bg: pressed ? Palette.emerald[50] : 'transparent',
          border: Palette.emerald[600],
          text: Palette.emerald[700],
          subText: Palette.emerald[600],
        };
      case 'warning':
        return {
          bg: pressed ? Palette.ochre[600] : Palette.ochre[500],
          border: Palette.ochre[600],
          text: '#FFFFFF',
          subText: Palette.ochre[100],
        };
      case 'danger':
        return {
          bg: pressed ? Palette.crimson[600] : Palette.crimson[500],
          border: Palette.crimson[600],
          text: '#FFFFFF',
          subText: Palette.crimson[100],
        };
      case 'primary':
      default:
        return {
          bg: pressed ? Palette.emerald[800] : Palette.emerald[700],
          border: Palette.emerald[800],
          text: '#FFFFFF',
          subText: Palette.emerald[200],
        };
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || label}
      style={({ pressed }) => {
        const colors = getColors(pressed);
        return [
          styles.container,
          {
            backgroundColor: disabled ? Palette.slate[200] : colors.bg,
            borderColor: disabled ? Palette.slate[300] : colors.border,
            width: fullWidth ? '100%' : undefined,
            transform: [{ scale: pressed ? 0.98 : 1 }],
          },
          !disabled && Shadows.subtle,
          style,
        ];
      }}
    >
      {({ pressed }) => {
        const colors = getColors(pressed);
        const textColor = disabled ? Palette.slate[400] : colors.text;
        const subTextColor = disabled ? Palette.slate[400] : colors.subText;

        return (
          <View style={styles.contentRow}>
            {loading ? (
              <ActivityIndicator size="small" color={textColor} />
            ) : (
              <>
                {iconLeft && <View style={styles.iconWrap}>{iconLeft}</View>}
                <View style={styles.labelColumn}>
                  <Text style={[styles.label, { color: textColor }]}>
                    {label}
                  </Text>
                  {subLabel && (
                    <Text style={[styles.subLabel, { color: subTextColor }]}>
                      {subLabel}
                    </Text>
                  )}
                </View>
                {iconRight && <View style={styles.iconWrap}>{iconRight}</View>}
              </>
            )}
          </View>
        );
      }}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: TouchTarget.generous,
    borderRadius: Radii.lg,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  labelColumn: {
    alignItems: 'center',
  },
  label: {
    fontFamily: Fonts.rounded,
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  subLabel: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    fontWeight: '600',
    marginTop: 1,
  },
  iconWrap: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
