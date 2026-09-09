import React from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { FamachaColors, Palette } from '@/constants/colors';
import { Fonts, Radii, Shadows, Spacing } from '@/constants/theme';
import Svg, { Circle, Path } from 'react-native-svg';

export type FamachaScore = 'healthy' | 'borderline' | 'critical';

export interface FamachaBeaconProps {
  /** The FAMACHA classification */
  score: FamachaScore;
  /** Size of the beacon ring */
  size?: number;
  /** Whether to show the glowing ambient shadow */
  showGlow?: boolean;
  /** Optional secondary text label (English or local translated) */
  label?: string;
  /** Optional local dialect text */
  localLabel?: string;
  /** Custom container style */
  style?: StyleProp<ViewStyle>;
}

export const FamachaBeacon: React.FC<FamachaBeaconProps> = ({
  score,
  size = 110,
  showGlow = true,
  label,
  localLabel,
  style,
}) => {
  const config = FamachaColors[score];

  const getShadow = () => {
    if (!showGlow) return {};
    switch (score) {
      case 'healthy':
        return Shadows.glowGreen;
      case 'borderline':
        return Shadows.glowAmber;
      case 'critical':
      default:
        return Shadows.glowRed;
    }
  };

  const renderIcon = () => {
    const iconSize = size * 0.44;
    switch (score) {
      case 'healthy':
        // Shield with checkmark (Vital / Strong)
        return (
          <Svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none">
            <Path
              d="M12 22S3 18 3 12V5L12 2L21 5V12C21 18 12 22 12 22Z"
              fill={config.primary}
            />
            <Path
              d="M9 12L11 14L15 10"
              stroke="#FFFFFF"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        );

      case 'borderline':
        // Alert Watch / Pupil attention
        return (
          <Svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none">
            <Circle cx="12" cy="12" r="10" fill={config.primary} />
            <Path
              d="M12 7V13M12 16V16.5"
              stroke="#FFFFFF"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </Svg>
        );

      case 'critical':
      default:
        // Triangle Alert / Danger
        return (
          <Svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none">
            <Path
              d="M10.29 3.86L1.82 18A2 2 0 003.55 21H20.45A2 2 0 0022.18 18L13.71 3.86A2 2 0 0010.29 3.86Z"
              fill={config.primary}
            />
            <Path
              d="M12 9V13M12 17V17.5"
              stroke="#FFFFFF"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </Svg>
        );
    }
  };

  return (
    <View style={[styles.container, style]}>
      <View
        style={[
          styles.beaconRing,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: config.surface,
            borderColor: config.border,
          },
          getShadow(),
        ]}
      >
        <View
          style={[
            styles.innerPill,
            {
              width: size * 0.76,
              height: size * 0.76,
              borderRadius: (size * 0.76) / 2,
              backgroundColor: '#FFFFFF',
              borderColor: config.primary,
            },
          ]}
        >
          {renderIcon()}
        </View>
      </View>

      {(label || localLabel) && (
        <View style={styles.labelContainer}>
          {localLabel && (
            <Text style={[styles.localLabel, { color: config.dark }]}>
              {localLabel}
            </Text>
          )}
          {label && <Text style={styles.standardLabel}>{label}</Text>}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  beaconRing: {
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerPill: {
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelContainer: {
    alignItems: 'center',
  },
  localLabel: {
    fontFamily: Fonts.rounded,
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: -0.3,
  },
  standardLabel: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    fontWeight: '600',
    color: Palette.slate[500],
    marginTop: 2,
  },
});
