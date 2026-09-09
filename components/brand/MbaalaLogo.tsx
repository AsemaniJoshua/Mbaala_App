import React from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { Fonts, Radii, Spacing } from '@/constants/theme';
import { MbaalaMark } from './MbaalaMark';

export interface MbaalaLogoProps {
  /** Mark size in px */
  size?: number;
  /** Layout direction: 'horizontal' or 'stacked' */
  layout?: 'horizontal' | 'stacked';
  /** Mark design style */
  design?: 'lettermark' | 'geometric';
  /** Dark mode flag */
  isDark?: boolean;
  /** Custom container style */
  style?: StyleProp<ViewStyle>;
}

export const MbaalaLogo: React.FC<MbaalaLogoProps> = ({
  size = 48,
  layout = 'horizontal',
  design = 'lettermark',
  isDark = false,
  style,
}) => {
  const primaryColor = isDark ? '#34D399' : '#0F4C3A';
  const textColor = isDark ? '#FFFFFF' : '#0F172A';
  const subtextColor = isDark ? '#94A3B8' : '#64748B';

  const isStacked = layout === 'stacked';

  return (
    <View
      style={[
        isStacked ? styles.stackedContainer : styles.horizontalContainer,
        style,
      ]}
    >
      <MbaalaMark
        size={size}
        color={primaryColor}
        accentColor={isDark ? '#34D399' : '#10B981'}
        design={design}
      />

      <View style={isStacked ? styles.stackedText : styles.horizontalText}>
        <Text
          style={[
            isStacked ? styles.stackedTitle : styles.horizontalTitle,
            { color: textColor },
          ]}
        >
          Mbaala
        </Text>
        <Text
          style={[
            isStacked ? styles.stackedSubtitle : styles.horizontalSubtitle,
            { color: subtextColor },
          ]}
        >
          LIVESTOCK HEALTH
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  horizontalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  horizontalText: {
    justifyContent: 'center',
  },
  horizontalTitle: {
    fontFamily: Fonts.rounded,
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  horizontalSubtitle: {
    fontFamily: Fonts.sans,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginTop: 2,
  },
  stackedContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  stackedText: {
    alignItems: 'center',
    marginTop: 12,
  },
  stackedTitle: {
    fontFamily: Fonts.rounded,
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.8,
  },
  stackedSubtitle: {
    fontFamily: Fonts.sans,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    marginTop: 4,
  },
});
