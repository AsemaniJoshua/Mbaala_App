import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

export interface GuideStepCardProps {
  stepNumber: number;
  title: string;
  localTitle: string;
  description: string;
  iconType: 'hold' | 'eyelid' | 'daylight';
  isDark?: boolean;
}

export const GuideStepCard: React.FC<GuideStepCardProps> = ({
  stepNumber,
  title,
  localTitle,
  description,
  iconType,
  isDark = false,
}) => {
  const cardBg = isDark ? '#111827' : '#FFFFFF';
  const borderColor = isDark ? '#1F2937' : '#E2E8F0';
  const titleColor = isDark ? '#F9FAFB' : '#0F172A';
  const localColor = isDark ? '#34D399' : '#0F4C3A';
  const descColor = isDark ? '#9CA3AF' : '#64748B';

  const renderIcon = () => {
    switch (iconType) {
      case 'hold':
        // Calm hand / animal face grip icon
        return (
          <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
            <Path
              d="M7 11V7a2 2 0 0 1 4 0v4m0-2a2 2 0 0 1 4 0v2m0-1a2 2 0 0 1 4 0v4a7 7 0 0 1-14 0v-3a2 2 0 0 1 2-2z"
              stroke="#0F4C3A"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        );

      case 'eyelid':
        // Eye with downward arrow indicator
        return (
          <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
            <Path
              d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
              stroke="#0F4C3A"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Circle cx="12" cy="12" r="3" fill="#E11D48" />
            <Path
              d="M12 17v4m-2-2l2 2 2-2"
              stroke="#0F4C3A"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        );

      case 'daylight':
      default:
        // Sun / Daylight beam icon
        return (
          <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
            <Circle cx="12" cy="12" r="5" fill="#F59E0B" />
            <Path
              d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
              stroke="#D97706"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </Svg>
        );
    }
  };

  return (
    <View style={[styles.card, { backgroundColor: cardBg, borderColor }]}>
      {/* Step Badge & Icon */}
      <View style={styles.leftColumn}>
        <View style={styles.iconCircle}>{renderIcon()}</View>
        <View style={styles.numberPill}>
          <Text style={styles.numberText}>{stepNumber}</Text>
        </View>
      </View>

      {/* Content */}
      <View style={styles.rightColumn}>
        <View style={styles.titleRow}>
          <Text style={[styles.title, { color: titleColor }]}>{title}</Text>
          <Text style={[styles.localTitle, { color: localColor }]}>
            • {localTitle}
          </Text>
        </View>
        <Text style={[styles.description, { color: descColor }]}>
          {description}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    marginBottom: 12,
    gap: 14,
  },
  leftColumn: {
    alignItems: 'center',
    position: 'relative',
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#ECFDF5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  numberPill: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#0F4C3A',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  numberText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  rightColumn: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  localTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  description: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
    marginTop: 3,
  },
});
