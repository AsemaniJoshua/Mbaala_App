import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

interface CameraReticleProps {
  instructionText?: string;
  isEyeDetected?: boolean;
}

export const CameraReticle: React.FC<CameraReticleProps> = ({
  instructionText = 'Align Inner Eyelid Inside Frame',
  isEyeDetected = false,
}) => {
  const accentColor = isEyeDetected ? '#10B981' : '#34D399';

  return (
    <View style={styles.container} pointerEvents="none">
      {/* Target Reticle Frame */}
      <View style={styles.reticleBox}>
        <Svg width="100%" height="100%" viewBox="0 0 240 180" fill="none">
          {/* Top-Left Corner */}
          <Path
            d="M8 32V16C8 11.5817 11.5817 8 16 8H32"
            stroke={accentColor}
            strokeWidth="4"
            strokeLinecap="round"
          />

          {/* Top-Right Corner */}
          <Path
            d="M208 8H224C228.418 8 232 11.5817 232 16V32"
            stroke={accentColor}
            strokeWidth="4"
            strokeLinecap="round"
          />

          {/* Bottom-Left Corner */}
          <Path
            d="M8 148V164C8 168.418 11.5817 172 16 172H32"
            stroke={accentColor}
            strokeWidth="4"
            strokeLinecap="round"
          />

          {/* Bottom-Right Corner */}
          <Path
            d="M208 172H224C228.418 172 232 168.418 232 164V148"
            stroke={accentColor}
            strokeWidth="4"
            strokeLinecap="round"
          />

          {/* Subtle Central Eye Target Contour */}
          <Path
            d="M50 90C75 60 165 60 190 90C165 120 75 120 50 90Z"
            stroke="rgba(255, 255, 255, 0.4)"
            strokeWidth="2"
            strokeDasharray="4 6"
          />
          <Circle cx="120" cy="90" r="14" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="1.5" />
          <Circle cx="120" cy="90" r="4" fill={accentColor} />
        </Svg>
      </View>

      {/* Clean Reticle Guidance Pill */}
      <View style={styles.guidancePill}>
        <Text style={styles.guidanceText}>{instructionText}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  reticleBox: {
    width: 260,
    height: 195,
  },
  guidancePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    marginTop: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  guidanceText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
});
