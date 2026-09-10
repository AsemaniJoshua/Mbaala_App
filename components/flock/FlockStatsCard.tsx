import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export type HealthFilterType = 'All' | 'Healthy' | 'Warning' | 'Critical';

interface FlockStatsCardProps {
  totalCount: number;
  healthyCount: number;
  warningCount: number;
  criticalCount: number;
  selectedFilter: HealthFilterType;
  onSelectFilter: (filter: HealthFilterType) => void;
}

export const FlockStatsCard: React.FC<FlockStatsCardProps> = ({
  totalCount,
  healthyCount,
  warningCount,
  criticalCount,
  selectedFilter,
  onSelectFilter,
}) => {
  // Proportional bar width percentages
  const safeTotal = totalCount > 0 ? totalCount : 1;
  const healthyPct = totalCount > 0 ? (healthyCount / safeTotal) * 100 : 0;
  const warningPct = totalCount > 0 ? (warningCount / safeTotal) * 100 : 0;
  const criticalPct = totalCount > 0 ? (criticalCount / safeTotal) * 100 : 0;

  return (
    <View style={styles.card}>
      {/* Top Title & Log Badge */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.totalNumber}>{totalCount}</Text>
          <Text style={styles.totalSubtitle}>Total Herd Health Checks</Text>
        </View>
        <View style={styles.logBadge}>
          <Text style={styles.logBadgeText}>FLOCK SUMMARY</Text>
        </View>
      </View>

      {/* Proportional Multi-Segment Progress Strip */}
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

      {/* Interactive Filter Pills */}
      <View style={styles.filtersRow}>
        {/* Filter: All */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => onSelectFilter('All')}
          style={[styles.filterPill, selectedFilter === 'All' && styles.filterPillActive]}
        >
          <Text style={[styles.filterLabel, selectedFilter === 'All' && styles.filterLabelActive]}>
            All ({totalCount})
          </Text>
        </TouchableOpacity>

        {/* Filter: Healthy */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => onSelectFilter('Healthy')}
          style={[
            styles.filterPill,
            selectedFilter === 'Healthy' && styles.filterPillActiveHealthy,
          ]}
        >
          <View style={[styles.filterDot, { backgroundColor: '#10B981' }]} />
          <Text
            style={[
              styles.filterLabel,
              selectedFilter === 'Healthy' && styles.filterLabelActiveHealthy,
            ]}
          >
            Healthy ({healthyCount})
          </Text>
        </TouchableOpacity>

        {/* Filter: Warning */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => onSelectFilter('Warning')}
          style={[
            styles.filterPill,
            selectedFilter === 'Warning' && styles.filterPillActiveWarning,
          ]}
        >
          <View style={[styles.filterDot, { backgroundColor: '#F59E0B' }]} />
          <Text
            style={[
              styles.filterLabel,
              selectedFilter === 'Warning' && styles.filterLabelActiveWarning,
            ]}
          >
            Monitor ({warningCount})
          </Text>
        </TouchableOpacity>

        {/* Filter: Critical */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => onSelectFilter('Critical')}
          style={[
            styles.filterPill,
            selectedFilter === 'Critical' && styles.filterPillActiveCritical,
          ]}
        >
          <View style={[styles.filterDot, { backgroundColor: '#EF4444' }]} />
          <Text
            style={[
              styles.filterLabel,
              selectedFilter === 'Critical' && styles.filterLabelActiveCritical,
            ]}
          >
            Severe ({criticalCount})
          </Text>
        </TouchableOpacity>
      </View>
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
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  totalNumber: {
    fontSize: 34,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.8,
  },
  totalSubtitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 2,
  },
  logBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  logBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#047857',
    letterSpacing: 0.6,
  },
  progressStrip: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F1F5F9',
    flexDirection: 'row',
    overflow: 'hidden',
    marginBottom: 16,
  },
  progressSegment: {
    height: '100%',
  },
  filtersRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 6,
  },
  filterPillActive: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',
  },
  filterPillActiveHealthy: {
    backgroundColor: '#ECFDF5',
    borderColor: '#10B981',
  },
  filterPillActiveWarning: {
    backgroundColor: '#FFFBEB',
    borderColor: '#F59E0B',
  },
  filterPillActiveCritical: {
    backgroundColor: '#FEF2F2',
    borderColor: '#EF4444',
  },
  filterDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  filterLabelActive: {
    color: '#FFFFFF',
  },
  filterLabelActiveHealthy: {
    color: '#047857',
  },
  filterLabelActiveWarning: {
    color: '#B45309',
  },
  filterLabelActiveCritical: {
    color: '#B91C1C',
  },
});
