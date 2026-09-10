import React from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Path } from 'react-native-svg';
import * as Speech from 'expo-speech';
import { useApp } from '@/context/AppContext';

interface ScanRecord {
  id: string;
  tag: string;
  animal: 'Goat' | 'Sheep';
  status: 'Healthy' | 'Warning' | 'Critical';
  statusColor: string;
  statusBg: string;
  statusLabel: string;
  timeAgo: string;
  speechText: string;
}

export default function HistoryScreen() {
  const { selectedLanguage, scanRecords } = useApp();

  const handlePlayDiagnosis = (record: ScanRecord) => {
    try {
      Speech.stop();
      Speech.speak(record.speechText, {
        language: selectedLanguage.speechCode,
        pitch: 1.0,
        rate: 0.92,
      });
    } catch {
      // Fallback
    }
  };

  const healthyCount = scanRecords.filter((r) => r.status === 'Healthy').length;
  const warningCount = scanRecords.filter((r) => r.status === 'Warning').length;
  const criticalCount = scanRecords.filter((r) => r.status === 'Critical').length;

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FBFDF9" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Screen Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Flock Records</Text>
          <Text style={styles.subtitle}>
            Daily FAMACHA anemia inspection history for your herd.
          </Text>
        </View>

        {/* Daily Tally Summary Card */}
        <View style={styles.tallyCard}>
          <View style={styles.tallyTopRow}>
            <View>
              <Text style={styles.tallyMainNumber}>{scanRecords.length}</Text>
              <Text style={styles.tallySubLabel}>Animals Checked Today</Text>
            </View>
            <View style={styles.tallyBadge}>
              <Text style={styles.tallyBadgeText}>DAILY LOG</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* 3 Status Columns */}
          <View style={styles.metricsRow}>
            <View style={styles.metricCol}>
              <View style={[styles.metricDot, { backgroundColor: '#10B981' }]} />
              <Text style={styles.metricVal}>{healthyCount}</Text>
              <Text style={styles.metricLabel}>Healthy</Text>
            </View>
            <View style={styles.metricCol}>
              <View style={[styles.metricDot, { backgroundColor: '#F59E0B' }]} />
              <Text style={styles.metricVal}>{warningCount}</Text>
              <Text style={styles.metricLabel}>Monitor</Text>
            </View>
            <View style={styles.metricCol}>
              <View style={[styles.metricDot, { backgroundColor: '#EF4444' }]} />
              <Text style={styles.metricVal}>{criticalCount}</Text>
              <Text style={styles.metricLabel}>Drenched</Text>
            </View>
          </View>
        </View>

        {/* Section Title */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Eye Scans</Text>
          <Text style={styles.sectionCount}>{scanRecords.length} entries</Text>
        </View>

        {/* Records List */}
        <View style={styles.recordsList}>
          {scanRecords.map((record) => (
            <View key={record.id} style={styles.recordItem}>
              {/* Left Avatar Orb */}
              <View style={[styles.recordAvatar, { backgroundColor: record.statusBg }]}>
                <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                  <Path
                    d="M12 4.5C7 4.5 2.73 7.61 1 12C2.73 16.39 7 19.5 12 19.5C17 19.5 21.27 16.39 23 12C21.27 7.61 17 4.5 12 4.5Z"
                    stroke={record.statusColor}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <Circle cx="12" cy="12" r="3" fill={record.statusColor} />
                </Svg>
              </View>

              {/* Middle Info */}
              <View style={styles.recordInfo}>
                <View style={styles.recordTagRow}>
                  <Text style={styles.recordTag}>{record.animal} {record.tag}</Text>
                  <Text style={styles.recordTime}>{record.timeAgo}</Text>
                </View>
                <View
                  style={[
                    styles.statusPill,
                    { backgroundColor: record.statusBg, borderColor: record.statusColor },
                  ]}
                >
                  <Text style={[styles.statusPillText, { color: record.statusColor }]}>
                    {record.statusLabel}
                  </Text>
                </View>
              </View>

              {/* Right Audio Replay Button */}
              <TouchableOpacity
                activeOpacity={0.75}
                onPress={() => handlePlayDiagnosis(record)}
                style={[styles.audioReplayBtn, { backgroundColor: record.statusBg }]}
                accessibilityRole="button"
                accessibilityLabel={`Hear diagnosis for ${record.animal} ${record.tag}`}
              >
                <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                  <Path d="M11 5L6 9H2V15H6L11 19V5Z" fill={record.statusColor} />
                  <Path d="M15.54 8.46C16.5 9.42 17 10.7 17 12C17 13.3 16.5 14.58 15.54 15.54" stroke={record.statusColor} strokeWidth="2" strokeLinecap="round" />
                </Svg>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FBFDF9',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 110, // Extra clearance for the floating bottom tab bar
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.6,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
    color: '#64748B',
  },
  tallyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 24,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  tallyTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tallyMainNumber: {
    fontSize: 32,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.6,
  },
  tallySubLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 2,
  },
  tallyBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tallyBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#047857',
    letterSpacing: 0.5,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 14,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  metricCol: {
    alignItems: 'center',
  },
  metricDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 4,
  },
  metricVal: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  metricLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1E293B',
    letterSpacing: -0.3,
  },
  sectionCount: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
  },
  recordsList: {
    width: '100%',
  },
  recordItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 10,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  recordAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  recordInfo: {
    flex: 1,
  },
  recordTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
    paddingRight: 8,
  },
  recordTag: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  recordTime: {
    fontSize: 11,
    fontWeight: '500',
    color: '#94A3B8',
  },
  statusPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: 8,
    borderWidth: 1,
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  audioReplayBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
});
