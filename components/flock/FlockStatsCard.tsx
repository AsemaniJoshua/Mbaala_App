import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as Haptics from 'expo-haptics';

export type HealthFilterType = 'All' | 'Healthy' | 'Warning' | 'Critical';

interface FlockStatsCardProps {
  totalCount: number;
  healthyCount: number;
  warningCount: number;
  criticalCount: number;
  selectedFilter: HealthFilterType;
  selectedBreed?: 'All' | 'Goat' | 'Sheep';
  onSelectFilter: (filter: HealthFilterType) => void;
}

export const FlockStatsCard: React.FC<FlockStatsCardProps> = ({
  totalCount,
  healthyCount,
  warningCount,
  criticalCount,
  selectedFilter,
  selectedBreed = 'All',
  onSelectFilter,
}) => {
  // Proportional progress strip percentages
  const safeTotal = totalCount > 0 ? totalCount : 1;
  const healthyPct = totalCount > 0 ? (healthyCount / safeTotal) * 100 : 0;
  const warningPct = totalCount > 0 ? (warningCount / safeTotal) * 100 : 0;
  const criticalPct = totalCount > 0 ? (criticalCount / safeTotal) * 100 : 0;

  const breedName = selectedBreed === 'All' ? 'Herd' : selectedBreed === 'Goat' ? 'Goat' : 'Sheep';

  const handleTilePress = (filter: HealthFilterType) => {
    try {
      Haptics.selectionAsync();
    } catch {}
    // Tapping active filter resets back to 'All'
    if (selectedFilter === filter) {
      onSelectFilter('All');
    } else {
      onSelectFilter(filter);
    }
  };

  return (
    <View style={styles.card}>
      {/* Top Header: Total Count + "All Records" Quick Filter Toggle */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.totalNumber}>{totalCount}</Text>
          <Text style={styles.totalSubtitle}>{breedName} Clinical Checks</Text>
        </View>

        {/* All Records Filter Pill */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            try {
              Haptics.selectionAsync();
            } catch {}
            onSelectFilter('All');
          }}
          style={[
            styles.allFilterPill,
            selectedFilter === 'All' && styles.allFilterPillActive,
          ]}
          accessibilityRole="button"
          accessibilityLabel="Show all flock records"
        >
          <Text
            style={[
              styles.allFilterText,
              selectedFilter === 'All' && styles.allFilterTextActive,
            ]}
          >
            All Records
          </Text>
        </TouchableOpacity>
      </View>

      {/* Proportional Multi-Segment Health Distribution Strip */}
      {totalCount > 0 ? (
        <View style={styles.progressStrip}>
          {healthyPct > 0 && (
            <View style={[styles.progressSegment, { width: `${healthyPct}%`, backgroundColor: '#10B981' }]} />
          )}
          {warningPct > 0 && (
            <View style={[styles.progressSegment, { width: `${warningPct}%`, backgroundColor: '#F59E0B' }]} />
          )}
          {criticalPct > 0 && (
            <View style={[styles.progressSegment, { width: `${criticalPct}%`, backgroundColor: '#EF4444' }]} />
          )}
        </View>
      ) : (
        <View style={[styles.progressStrip, { backgroundColor: '#F1F5F9' }]} />
      )}

      {/* 3 Equal, Balanced Metric Tiles in 1 Single Row (No Wrapping, Severe is Front and Center!) */}
      <View style={styles.metricsGrid}>
        {/* Healthy Tile */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => handleTilePress('Healthy')}
          style={[
            styles.metricTile,
            selectedFilter === 'Healthy' && styles.metricTileActiveHealthy,
          ]}
          accessibilityRole="button"
          accessibilityLabel={`Filter by Healthy (${healthyCount})`}
        >
          <View style={styles.metricTop}>
            <View style={[styles.statusDot, { backgroundColor: '#10B981' }]} />
            <Text
              style={[
                styles.metricLabel,
                selectedFilter === 'Healthy' && styles.metricLabelActiveHealthy,
              ]}
            >
              Healthy
            </Text>
          </View>
          <Text
            style={[
              styles.metricCount,
              { color: '#047857' },
              selectedFilter === 'Healthy' && styles.metricCountActive,
            ]}
          >
            {healthyCount}
          </Text>
        </TouchableOpacity>

        {/* Monitor / Borderline Tile */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => handleTilePress('Warning')}
          style={[
            styles.metricTile,
            selectedFilter === 'Warning' && styles.metricTileActiveWarning,
          ]}
          accessibilityRole="button"
          accessibilityLabel={`Filter by Monitor (${warningCount})`}
        >
          <View style={styles.metricTop}>
            <View style={[styles.statusDot, { backgroundColor: '#F59E0B' }]} />
            <Text
              style={[
                styles.metricLabel,
                selectedFilter === 'Warning' && styles.metricLabelActiveWarning,
              ]}
            >
              Monitor
            </Text>
          </View>
          <Text
            style={[
              styles.metricCount,
              { color: '#D97706' },
              selectedFilter === 'Warning' && styles.metricCountActive,
            ]}
          >
            {warningCount}
          </Text>
        </TouchableOpacity>

        {/* Severe Anemia Tile (Prominent & Balanced) */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => handleTilePress('Critical')}
          style={[
            styles.metricTile,
            selectedFilter === 'Critical' && styles.metricTileActiveCritical,
          ]}
          accessibilityRole="button"
          accessibilityLabel={`Filter by Severe (${criticalCount})`}
        >
          <View style={styles.metricTop}>
            <View style={[styles.statusDot, { backgroundColor: '#EF4444' }]} />
            <Text
              style={[
                styles.metricLabel,
                selectedFilter === 'Critical' && styles.metricLabelActiveCritical,
              ]}
            >
              Severe
            </Text>
          </View>
          <Text
            style={[
              styles.metricCount,
              { color: '#DC2626' },
              selectedFilter === 'Critical' && styles.metricCountActive,
            ]}
          >
            {criticalCount}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Active Filter Helper Banner */}
      {selectedFilter !== 'All' && (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            try {
              Haptics.selectionAsync();
            } catch {}
            onSelectFilter('All');
          }}
          style={styles.activeFilterBanner}
        >
          <Text style={styles.activeFilterBannerText}>
            Showing{' '}
            <Text style={{ fontWeight: '900' }}>
              {selectedFilter === 'Healthy' ? 'Healthy' : selectedFilter === 'Warning' ? 'Borderline' : 'Severe Anemia'}
            </Text>{' '}
            only • Tap to show all
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  totalNumber: {
    fontSize: 32,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.6,
  },
  totalSubtitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 2,
  },
  allFilterPill: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  allFilterPillActive: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',
  },
  allFilterText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  allFilterTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  progressStrip: {
    height: 7,
    borderRadius: 4,
    backgroundColor: '#F1F5F9',
    flexDirection: 'row',
    overflow: 'hidden',
    marginBottom: 14,
  },
  progressSegment: {
    height: '100%',
  },

  // 3-Column Single Row Grid
  metricsGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  metricTile: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  metricTileActiveHealthy: {
    backgroundColor: '#ECFDF5',
    borderColor: '#10B981',
    transform: [{ scale: 1.02 }],
  },
  metricTileActiveWarning: {
    backgroundColor: '#FFFBEB',
    borderColor: '#F59E0B',
    transform: [{ scale: 1.02 }],
  },
  metricTileActiveCritical: {
    backgroundColor: '#FEF2F2',
    borderColor: '#EF4444',
    transform: [{ scale: 1.02 }],
  },
  metricTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 6,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  metricLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  metricLabelActiveHealthy: {
    color: '#047857',
    fontWeight: '800',
  },
  metricLabelActiveWarning: {
    color: '#B45309',
    fontWeight: '800',
  },
  metricLabelActiveCritical: {
    color: '#B91C1C',
    fontWeight: '800',
  },
  metricCount: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  metricCountActive: {
    fontWeight: '900',
  },

  // Active filter indicator
  activeFilterBanner: {
    marginTop: 12,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    alignItems: 'center',
  },
  activeFilterBannerText: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '600',
  },
});
