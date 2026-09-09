import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

export interface DaylightCheckCardProps {
  isDark?: boolean;
}

export const DaylightCheckCard: React.FC<DaylightCheckCardProps> = ({
  isDark = false,
}) => {
  const cardBg = isDark ? '#111827' : '#FFFFFF';
  const borderColor = isDark ? '#1F2937' : '#E2E8F0';
  const titleColor = isDark ? '#F9FAFB' : '#0F172A';
  const descColor = isDark ? '#9CA3AF' : '#64748B';

  return (
    <View style={[styles.container, { backgroundColor: cardBg, borderColor }]}>
      {/* Visual Checklist: Good Sunlight vs Bad Shade */}
      <View style={styles.comparisonRow}>
        {/* Good: Bright Sunlight */}
        <View
          style={[
            styles.checklistColumn,
            {
              backgroundColor: isDark ? '#064E3B' : '#ECFDF5',
              borderColor: isDark ? '#059669' : '#A7F3D0',
            },
          ]}
        >
          <View style={styles.badgeRow}>
            <View style={[styles.statusBadge, { backgroundColor: '#10B981' }]}>
              <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M5 13L9 17L19 7"
                  stroke="#FFFFFF"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </View>
            <Text style={[styles.badgeText, { color: '#0F4C3A' }]}>CORRECT</Text>
          </View>

          {/* Sun Vector */}
          <Svg width={36} height={36} viewBox="0 0 24 24" fill="none" style={styles.iconCenter}>
            <Circle cx="12" cy="12" r="5" fill="#F59E0B" />
            <Path
              d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
              stroke="#D97706"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </Svg>

          <Text style={[styles.conditionTitle, { color: isDark ? '#FFFFFF' : '#064E3B' }]}>
            Bright Daylight
          </Text>
          <Text style={[styles.conditionSub, { color: isDark ? '#A7F3D0' : '#047857' }]}>
            Clear natural sunlight
          </Text>
        </View>

        {/* Bad: Dark Pen / Shadows */}
        <View
          style={[
            styles.checklistColumn,
            {
              backgroundColor: isDark ? '#3B0707' : '#FEF2F2',
              borderColor: isDark ? '#7F1D1D' : '#FECACA',
            },
          ]}
        >
          <View style={styles.badgeRow}>
            <View style={[styles.statusBadge, { backgroundColor: '#EF4444' }]}>
              <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M6 18L18 6M6 6l12 12"
                  stroke="#FFFFFF"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </View>
            <Text style={[styles.badgeText, { color: '#7F1D1D' }]}>AVOID</Text>
          </View>

          {/* Dark Cloud / Shadow Vector */}
          <Svg width={36} height={36} viewBox="0 0 24 24" fill="none" style={styles.iconCenter}>
            <Path
              d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"
              fill="#64748B"
            />
            <Path
              d="M8 15l4 4m0-4l-4 4"
              stroke="#EF4444"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </Svg>

          <Text style={[styles.conditionTitle, { color: isDark ? '#FFFFFF' : '#7F1D1D' }]}>
            Dark Pen / Shade
          </Text>
          <Text style={[styles.conditionSub, { color: isDark ? '#FCA5A5' : '#991B1B' }]}>
            Colors will look false
          </Text>
        </View>
      </View>

      {/* Distance & Offline Guarantee Pill */}
      <View style={styles.footerRow}>
        <View style={styles.guaranteePill}>
          <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
            <Path
              d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
              fill="#10B981"
            />
            <Path
              d="M9 12l2 2 4-4"
              stroke="#FFFFFF"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
          <Text style={styles.guaranteeText}>
            100% OFFLINE • NO INTERNET NEEDED
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    borderWidth: 1.5,
    padding: 16,
    marginBottom: 16,
  },
  comparisonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  checklistColumn: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1.5,
    padding: 14,
    alignItems: 'center',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  statusBadge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  iconCenter: {
    marginVertical: 6,
  },
  conditionTitle: {
    fontSize: 13,
    fontWeight: '800',
    textAlign: 'center',
  },
  conditionSub: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 2,
  },
  footerRow: {
    marginTop: 14,
    alignItems: 'center',
  },
  guaranteePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#ECFDF5',
    gap: 6,
  },
  guaranteeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#065F46',
    letterSpacing: 0.6,
  },
});
