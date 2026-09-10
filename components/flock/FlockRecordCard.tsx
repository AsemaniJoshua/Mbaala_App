import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import { ScanRecord } from '@/context/AppContext';

interface FlockRecordCardProps {
  record: ScanRecord;
  onPlayAudio: (record: ScanRecord) => void;
  onDelete: (record: ScanRecord) => void;
}

export const FlockRecordCard: React.FC<FlockRecordCardProps> = ({
  record,
  onPlayAudio,
  onDelete,
}) => {
  const handleAudioPress = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
    onPlayAudio(record);
  };

  const handleDeletePress = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {}
    onDelete(record);
  };

  const isGoat = record.animal === 'Goat';
  const confidencePct = record.confidence ? Math.round(record.confidence * 100) : null;

  return (
    <View style={styles.cardContainer}>
      <View style={styles.cardHeader}>
        {/* Left: Animal Breed Avatar + Tag */}
        <View style={styles.animalMetaRow}>
          <View style={[styles.avatarCircle, { backgroundColor: record.statusBg }]}>
            <Text style={styles.avatarEmoji}>{isGoat ? '🐐' : '🐑'}</Text>
          </View>
          <View>
            <View style={styles.tagRow}>
              <Text style={styles.animalBreed}>{record.animal}</Text>
              <Text style={styles.tagNumber}>{record.tag}</Text>
            </View>
            <Text style={styles.timeText}>{record.timeAgo}</Text>
          </View>
        </View>

        {/* Right: Actions (Voice Replay & Delete) */}
        <View style={styles.actionButtonsRow}>
          {/* Audio Replay Button */}
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={handleAudioPress}
            style={[styles.actionBtn, { backgroundColor: record.statusBg, borderColor: record.statusColor }]}
            accessibilityRole="button"
            accessibilityLabel={`Play spoken diagnosis for ${record.animal} ${record.tag}`}
          >
            <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
              <Path d="M11 5L6 9H2V15H6L11 19V5Z" fill={record.statusColor} />
              <Path
                d="M15.54 8.46C16.5 9.42 17 10.7 17 12C17 13.3 16.5 14.58 15.54 15.54"
                stroke={record.statusColor}
                strokeWidth="2.2"
                strokeLinecap="round"
              />
            </Svg>
          </TouchableOpacity>

          {/* Delete Record Button */}
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={handleDeletePress}
            style={styles.deleteBtn}
            accessibilityRole="button"
            accessibilityLabel={`Delete record for ${record.animal} ${record.tag}`}
          >
            <Svg width={15} height={15} viewBox="0 0 24 24" fill="none">
              <Path
                d="M3 6H5H21M19 6V20C19 21.1046 18.1046 22 17 22H7C5.89543 22 5 21.1046 5 20V6M8 6V4C8 2.89543 8.89543 2 10 2H14C15.1046 2 16 2.89543 16 4V6M10 11V17M14 11V17"
                stroke="#EF4444"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </TouchableOpacity>
        </View>
      </View>

      {/* Badges Footer Row: Status Pill + FAMACHA Score + Confidence */}
      <View style={styles.cardFooter}>
        <View style={[styles.statusBadge, { backgroundColor: record.statusBg, borderColor: record.statusColor }]}>
          <View style={[styles.statusDot, { backgroundColor: record.statusColor }]} />
          <Text style={[styles.statusBadgeText, { color: record.statusColor }]}>
            {record.statusLabel}
          </Text>
        </View>

        {record.famachaScore !== undefined && (
          <View style={styles.scoreBadge}>
            <Text style={styles.scoreBadgeText}>Grade {record.famachaScore}</Text>
          </View>
        )}

        {confidencePct !== null && (
          <View style={styles.confidenceBadge}>
            <Text style={styles.confidenceBadgeText}>{confidencePct}% AI</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  animalMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: {
    fontSize: 22,
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  animalBreed: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  tagNumber: {
    fontSize: 14,
    fontWeight: '800',
    color: '#10B981',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 7,
    paddingVertical: 1,
    borderRadius: 8,
  },
  timeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 2,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  deleteBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: -0.1,
  },
  scoreBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  scoreBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#334155',
  },
  confidenceBadge: {
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  confidenceBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
});
