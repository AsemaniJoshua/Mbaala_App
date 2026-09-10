import React, { useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Svg, { Path } from 'react-native-svg';
import * as Speech from 'expo-speech';
import * as Haptics from 'expo-haptics';

import { ScanRecord, useApp } from '@/context/AppContext';
import {
  DeleteConfirmModal,
  FlockEmptyState,
  FlockRecordCard,
  FlockStatsCard,
  HealthFilterType,
} from '@/components/flock';

type AnimalFilterType = 'All' | 'Goat' | 'Sheep';

export default function HistoryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    selectedLanguage,
    scanRecords,
    isLoadingRecords,
    deleteScanRecord,
    clearAllScanRecords,
  } = useApp();

  // Local Filter State
  const [animalFilter, setAnimalFilter] = useState<AnimalFilterType>('All');
  const [healthFilter, setHealthFilter] = useState<HealthFilterType>('All');

  // Deletion Modal State
  const [deleteModalState, setDeleteModalState] = useState<{
    visible: boolean;
    mode: 'single' | 'all';
    targetRecord?: ScanRecord | null;
  }>({
    visible: false,
    mode: 'single',
    targetRecord: null,
  });

  // Native Voice Playback
  const handlePlayDiagnosis = (record: ScanRecord) => {
    try {
      Speech.stop();
      Speech.speak(record.speechText, {
        language: selectedLanguage.speechCode,
        pitch: 1.0,
        rate: 0.92,
      });
    } catch {
      // Speech fallback
    }
  };

  // Open Single Delete Confirmation
  const handlePromptDeleteRecord = (record: ScanRecord) => {
    setDeleteModalState({
      visible: true,
      mode: 'single',
      targetRecord: record,
    });
  };

  // Open Bulk Clear Confirmation
  const handlePromptClearAll = () => {
    if (scanRecords.length === 0) return;
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    } catch {}
    setDeleteModalState({
      visible: true,
      mode: 'all',
      targetRecord: null,
    });
  };

  // Perform Deletion
  const handleConfirmDelete = async () => {
    if (deleteModalState.mode === 'single' && deleteModalState.targetRecord) {
      await deleteScanRecord(deleteModalState.targetRecord.id);
    } else if (deleteModalState.mode === 'all') {
      await clearAllScanRecords();
    }
    setDeleteModalState({ visible: false, mode: 'single', targetRecord: null });
  };

  // 1. Records scoped to active animal breed
  const breedScopedRecords = scanRecords.filter((record) => {
    return animalFilter === 'All' || record.animal === animalFilter;
  });

  // 2. Final records matching both breed and health filter
  const filteredRecords = breedScopedRecords.filter((record) => {
    return healthFilter === 'All' || record.status === healthFilter;
  });

  // 3. Dynamic counts for the stats summary card
  const totalInScope = breedScopedRecords.length;
  const healthyCount = breedScopedRecords.filter((r) => r.status === 'Healthy').length;
  const warningCount = breedScopedRecords.filter((r) => r.status === 'Warning').length;
  const criticalCount = breedScopedRecords.filter((r) => r.status === 'Critical').length;

  // Breed counts for the segmented bar
  const goatCount = scanRecords.filter((r) => r.animal === 'Goat').length;
  const sheepCount = scanRecords.filter((r) => r.animal === 'Sheep').length;

  return (
    <View style={styles.screenContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#FBFDF9" />

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top + (Platform.OS === 'android' ? 24 : 18),
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Screen Header & Clear Action */}
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>Flock Records</Text>
            <Text style={styles.subtitle}>
              Offline clinical health history saved on device
            </Text>
          </View>

          {scanRecords.length > 0 && (
            <TouchableOpacity
              activeOpacity={0.75}
              onPress={handlePromptClearAll}
              style={styles.clearAllBtn}
              accessibilityRole="button"
              accessibilityLabel="Clear all flock records"
            >
              <Svg width={15} height={15} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M3 6H5H21M19 6V20C19 21.1046 18.1046 22 17 22H7C5.89543 22 5 21.1046 5 20V6M8 6V4C8 2.89543 8.89543 2 10 2H14C15.1046 2 16 2.89543 16 4V6"
                  stroke="#EF4444"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
              <Text style={styles.clearAllText}>Clear All</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Loading Indicator for Initial Local Storage Hydration */}
        {isLoadingRecords ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator size="small" color="#10B981" />
            <Text style={styles.loadingText}>Loading records from phone storage...</Text>
          </View>
        ) : (
          <>
            {/* 1. Redesigned Premium Segmented Breed Capsule */}
            <View style={styles.segmentedCapsule}>
              {/* Tab: All Flock */}
              <TouchableOpacity
                activeOpacity={0.82}
                onPress={() => {
                  try {
                    Haptics.selectionAsync();
                  } catch {}
                  setAnimalFilter('All');
                }}
                style={[
                  styles.segmentTab,
                  animalFilter === 'All' && styles.segmentTabActive,
                ]}
              >
                <Text style={styles.segmentEmoji}>🐾</Text>
                <Text
                  style={[
                    styles.segmentLabel,
                    animalFilter === 'All' && styles.segmentLabelActive,
                  ]}
                >
                  All Herd
                </Text>
                <View
                  style={[
                    styles.segmentCountBadge,
                    animalFilter === 'All' && styles.segmentCountBadgeActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.segmentCountText,
                      animalFilter === 'All' && styles.segmentCountTextActive,
                    ]}
                  >
                    {scanRecords.length}
                  </Text>
                </View>
              </TouchableOpacity>

              {/* Tab: Goats */}
              <TouchableOpacity
                activeOpacity={0.82}
                onPress={() => {
                  try {
                    Haptics.selectionAsync();
                  } catch {}
                  setAnimalFilter('Goat');
                }}
                style={[
                  styles.segmentTab,
                  animalFilter === 'Goat' && styles.segmentTabActive,
                ]}
              >
                <Text style={styles.segmentEmoji}>🐐</Text>
                <Text
                  style={[
                    styles.segmentLabel,
                    animalFilter === 'Goat' && styles.segmentLabelActive,
                  ]}
                >
                  Goats
                </Text>
                <View
                  style={[
                    styles.segmentCountBadge,
                    animalFilter === 'Goat' && styles.segmentCountBadgeActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.segmentCountText,
                      animalFilter === 'Goat' && styles.segmentCountTextActive,
                    ]}
                  >
                    {goatCount}
                  </Text>
                </View>
              </TouchableOpacity>

              {/* Tab: Sheep */}
              <TouchableOpacity
                activeOpacity={0.82}
                onPress={() => {
                  try {
                    Haptics.selectionAsync();
                  } catch {}
                  setAnimalFilter('Sheep');
                }}
                style={[
                  styles.segmentTab,
                  animalFilter === 'Sheep' && styles.segmentTabActive,
                ]}
              >
                <Text style={styles.segmentEmoji}>🐑</Text>
                <Text
                  style={[
                    styles.segmentLabel,
                    animalFilter === 'Sheep' && styles.segmentLabelActive,
                  ]}
                >
                  Sheep
                </Text>
                <View
                  style={[
                    styles.segmentCountBadge,
                    animalFilter === 'Sheep' && styles.segmentCountBadgeActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.segmentCountText,
                      animalFilter === 'Sheep' && styles.segmentCountTextActive,
                    ]}
                  >
                    {sheepCount}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* 2. Herd Health Summary Stats Card */}
            <FlockStatsCard
              totalCount={totalInScope}
              healthyCount={healthyCount}
              warningCount={warningCount}
              criticalCount={criticalCount}
              selectedFilter={healthFilter}
              selectedBreed={animalFilter}
              onSelectFilter={(f) => {
                try {
                  Haptics.selectionAsync();
                } catch {}
                setHealthFilter(f);
              }}
            />

            {/* 3. Section Title & Current Results Count */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                {animalFilter === 'All'
                  ? 'All Herd Scans'
                  : animalFilter === 'Goat'
                  ? 'Caprine (Goat) Records'
                  : 'Ovine (Sheep) Records'}
              </Text>
              <Text style={styles.sectionCount}>
                Showing {filteredRecords.length} of {scanRecords.length}
              </Text>
            </View>

            {/* 4. Records List or Clean Empty State */}
            {filteredRecords.length > 0 ? (
              <View style={styles.recordsList}>
                {filteredRecords.map((record) => (
                  <FlockRecordCard
                    key={record.id}
                    record={record}
                    onPlayAudio={handlePlayDiagnosis}
                    onDelete={handlePromptDeleteRecord}
                  />
                ))}
              </View>
            ) : (
              <FlockEmptyState
                isFiltered={scanRecords.length > 0}
                onResetFilters={() => {
                  setHealthFilter('All');
                  setAnimalFilter('All');
                }}
                onScanNow={() => router.navigate('/')}
              />
            )}
          </>
        )}
      </ScrollView>

      {/* 5. Safe Deletion Confirmation Bottom Sheet Dialog */}
      <DeleteConfirmModal
        visible={deleteModalState.visible}
        mode={deleteModalState.mode}
        targetRecord={deleteModalState.targetRecord}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteModalState({ visible: false, mode: 'single', targetRecord: null })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#FBFDF9',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 120 : 100, // Safe clearance above floating tabs
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
    gap: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.6,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
    color: '#64748B',
  },
  clearAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FEE2E2',
    marginTop: 2,
  },
  clearAllText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#EF4444',
  },
  loadingWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 12,
  },
  loadingText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },

  // Redesigned Segmented Breed Capsule
  segmentedCapsule: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 20,
    padding: 4,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  segmentTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    paddingHorizontal: 6,
    borderRadius: 16,
    gap: 6,
  },
  segmentTabActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  segmentEmoji: {
    fontSize: 14,
  },
  segmentLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  segmentLabelActive: {
    color: '#0F172A',
    fontWeight: '800',
  },
  segmentCountBadge: {
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 10,
  },
  segmentCountBadgeActive: {
    backgroundColor: '#ECFDF5',
  },
  segmentCountText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  segmentCountTextActive: {
    color: '#047857',
    fontWeight: '800',
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  sectionCount: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  recordsList: {
    marginBottom: 8,
  },
});
