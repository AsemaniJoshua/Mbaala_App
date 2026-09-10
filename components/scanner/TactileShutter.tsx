import React from 'react';
import {
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import Svg, { Circle, Path } from 'react-native-svg';

interface TactileShutterProps {
  onPress: () => void;
  disabled?: boolean;
}

export const TactileShutter: React.FC<TactileShutterProps> = ({
  onPress,
  disabled = false,
}) => {
  const handlePress = () => {
    if (disabled) return;

    if (Platform.OS !== 'web') {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      } catch {
        // Fallback
      }
    }
    onPress();
  };

  return (
    <View style={styles.outerContainer}>
      {/* Outer Frosted Ring */}
      <View style={styles.outerRing}>
        {/* Inner Tactile Button */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handlePress}
          disabled={disabled}
          accessibilityRole="button"
          accessibilityLabel="Capture animal eye photo"
          style={styles.innerButton}
        >
          {/* Camera Glyph */}
          <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
            <Path
              d="M4 8C4 6.89543 4.89543 6 6 6H7.58579C8.11622 6 8.62493 5.78929 9 5.41421L9.58579 4.82843C9.96086 4.45336 10.4696 4.24264 11 4.24264H13C13.5304 4.24264 14.0391 4.45336 14.4142 4.82843L15 5.41421C15.3751 5.78929 15.8838 6 16.4142 6H18C19.1046 6 20 6.89543 20 8V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V8Z"
              fill="#FFFFFF"
            />
            <Circle cx="12" cy="13" r="3.5" stroke="#10B981" strokeWidth="2.2" fill="#FFFFFF" />
          </Svg>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerRing: {
    width: 86,
    height: 86,
    borderRadius: 43,
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  innerButton: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
});
