import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

interface FlockEmptyStateProps {
  isFiltered?: boolean;
  onScanNow?: () => void;
  onResetFilters?: () => void;
}

export const FlockEmptyState: React.FC<FlockEmptyStateProps> = ({
  isFiltered = false,
  onScanNow,
  onResetFilters,
}) => {
  return (
    <View style={styles.container}>
      {/* Visual Art Orb */}
      <View style={styles.artOrb}>
        <Svg width={48} height={48} viewBox="0 0 24 24" fill="none">
          <Circle cx="12" cy="12" r="10" stroke="#10B981" strokeWidth="2" strokeDasharray="4 4" />
          <Path
            d="M12 7V13M12 17H12.01"
            stroke="#10B981"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
        </Svg>
      </View>

      <Text style={styles.title}>
        {isFiltered ? 'No Matching Records' : 'No Flock Records Yet'}
      </Text>

      <Text style={styles.subtitle}>
        {isFiltered
          ? 'No livestock match your active filter. Try viewing all animals or clearing filters.'
          : 'Hold your phone camera to your goat or sheep’s inner eyelid to record your first offline health scan.'}
      </Text>

      {isFiltered && onResetFilters && (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onResetFilters}
          style={styles.resetButton}
        >
          <Text style={styles.resetButtonText}>View All Records</Text>
        </TouchableOpacity>
      )}

      {!isFiltered && onScanNow && (
        <TouchableOpacity
          activeOpacity={0.88}
          onPress={onScanNow}
          style={styles.scanButton}
        >
          <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
            <Path
              d="M23 19C23 20.1046 22.1046 21 21 21H3C1.89543 21 1 20.1046 1 19V8C1 6.89543 1.89543 6 3 6H7L9 3H15L17 6H21C22.1046 6 23 6.89543 23 8V19Z"
              stroke="#FFFFFF"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Circle cx="12" cy="13" r="4" stroke="#FFFFFF" strokeWidth="2" />
          </Svg>
          <Text style={styles.scanButtonText}>Start Eye Health Check</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 28,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginVertical: 12,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  artOrb: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: '#64748B',
    textAlign: 'center',
    fontWeight: '500',
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  resetButton: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
  },
  resetButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#10B981',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 8,
    elevation: 4,
  },
  scanButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
