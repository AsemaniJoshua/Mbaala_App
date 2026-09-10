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
import { SafeAreaView } from 'react-native-safe-area-context';
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
  const {
    selectedLanguage,
    scanRecords,
    isLoadingRecords,
    deleteScanRecord,
    clearAllScanRecords,
  } = useApp();

  // Local Filter State
  const [healthFilter, setHealthFilter] = useState<HealthFilterType>('All');
  const [animalFilter, setAnimalFilter] = useState<AnimalFilterType>('All');

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

  // Filter Records
  const filteredRecords = scanRecords.filter((record) => {
    const matchesHealth = healthFilter === 'All' || record.status === healthFilter;
    const matchesAnimal = animalFilter === 'All' || record.animal === animalFilter;
    return matchesHealth && matchesAnimal;
  });

  // Calculate Overall Statistics
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
        {/* Screen Header & Clear Action */}
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>Flock Records</Text>
            <Text style={styles.subtitle}>
              Offline FAMACHA inspection history saved on device.
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
              <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
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
            {/* 1. Herd Health Summary Stats Card */}
            <FlockStatsCard
              totalCount={scanRecords.length}
              healthyCount={healthyCount}
              warningCount={warningCount}
              criticalCount={criticalCount}
              selectedFilter={healthFilter}
              onSelectFilter={(f) => {
                try {
                  Haptics.selectionAsync();
                } catch {}
                setHealthFilter(f);
              }}
            />

            {/* 2. Animal Breed Filter Segmented Bar */}
            <View style={styles.animalFilterRow}>
              {(['All', 'Goat', 'Sheep'] as AnimalFilterType[]).map((animal) => {
                const isSelected = animalFilter === animal;
                const count =
                  animal === 'All'
                    ? scanRecords.length
                    : scanRecords.filter((r) => r.animal === animal).length;
                return (
                  <TouchableOpacity
                    key={animal}
                    activeOpacity={0.8}
                    onPress={() => {
                      try {
                        Haptics.selectionAsync();
                      } catch {}
                      setAnimalFilter(animal);
                    }}
                    style={[
                      styles.animalFilterPill,
                      isSelected && styles.animalFilterPillActive,
                    ]}
                  >
                    <Text style={styles.animalFilterEmoji}>
                      {animal === 'Goat' ? '🐐' : animal === 'Sheep' ? '🐑' : '🐾'}
                    </Text>
                    <Text
                      style={[
                        styles.animalFilterText,
                        isSelected && styles.animalFilterTextActive,
                      ]}
                    >
                      {animal === 'All' ? 'All Breeds' : `${animal}s`} ({count})
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* 3. Section Title & Current Results Count */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Inspection History</Text>
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
    paddingVertical: 8,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#FEE2E2',
    marginTop: 4,
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
  animalFilterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  animalFilterPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
    paddingVertical: 10,
    borderRadius: 16,
    gap: 6,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  animalFilterPillActive: {
    backgroundColor: '#ECFDF5',
    borderColor: '#10B981',
  },
  animalFilterEmoji: {
    fontSize: 15,
  },
  animalFilterText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  animalFilterTextActive: {
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
    fontSize: 17,
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
