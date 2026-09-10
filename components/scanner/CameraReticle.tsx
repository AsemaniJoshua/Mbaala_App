import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

interface CameraReticleProps {
  instructionText?: string;
  isEyeDetected?: boolean;
}

export const CameraReticle: React.FC<CameraReticleProps> = ({
  instructionText = 'Align lower eyelid',
  isEyeDetected = false,
}) => {
  // Deep emerald color when eyelid is in place, clean muted green when aligning
  const accentCornerColor = isEyeDetected ? '#047857' : '#10B981';

  return (
    <View style={styles.container} pointerEvents="none">
      {/* Target Reticle Frame */}
      <View style={styles.reticleBox}>
        <Svg width="100%" height="100%" viewBox="0 0 240 180" fill="none">
          {/* Top-Left Corner */}
          <Path
            d="M8 32V16C8 11.5817 11.5817 8 16 8H32"
            stroke={accentCornerColor}
            strokeWidth={isEyeDetected ? 4.5 : 3.5}
            strokeLinecap="round"
          />

          {/* Top-Right Corner */}
          <Path
            d="M208 8H224C228.418 8 232 11.5817 232 16V32"
            stroke={accentCornerColor}
            strokeWidth={isEyeDetected ? 4.5 : 3.5}
            strokeLinecap="round"
          />

          {/* Bottom-Left Corner */}
          <Path
            d="M8 148V164C8 168.418 11.5817 172 16 172H32"
            stroke={accentCornerColor}
            strokeWidth={isEyeDetected ? 4.5 : 3.5}
            strokeLinecap="round"
          />

          {/* Bottom-Right Corner */}
          <Path
            d="M208 172H224C228.418 172 232 168.418 232 164V148"
            stroke={accentCornerColor}
            strokeWidth={isEyeDetected ? 4.5 : 3.5}
            strokeLinecap="round"
          />

          {/* Central Eye Icon - Turns Deep Rich Color When Eyelid In Place */}
          {isEyeDetected ? (
            <>
              {/* Deep colored eye contour with tinted fill */}
              <Path
                d="M46 90C72 54 168 54 194 90C168 126 72 126 46 90Z"
                stroke="#047857"
                strokeWidth={3}
                fill="rgba(4, 120, 87, 0.28)"
              />
              {/* Deep colored iris ring */}
              <Circle
                cx="120"
                cy="90"
                r={16}
                stroke="#047857"
                strokeWidth={2.5}
                fill="rgba(4, 120, 87, 0.45)"
              />
              {/* Deep colored solid pupil */}
              <Circle cx="120" cy="90" r={7} fill="#047857" />
            </>
          ) : (
            <>
              {/* Subtle dashed guide outline when positioning */}
              <Path
                d="M46 90C72 54 168 54 194 90C168 126 72 126 46 90Z"
                stroke="rgba(255, 255, 255, 0.4)"
                strokeWidth={1.8}
                strokeDasharray="5 5"
              />
              <Circle
                cx="120"
                cy="90"
                r={14}
                stroke="rgba(255, 255, 255, 0.5)"
                strokeWidth={1.4}
              />
              <Circle cx="120" cy="90" r={4} fill="rgba(255, 255, 255, 0.7)" />
            </>
          )}
        </Svg>
      </View>

      {/* Sleek, Minimal Single-Line Floating Pill */}
      <View
        style={[
          styles.minimalPill,
          isEyeDetected && styles.minimalPillActive,
        ]}
      >
        <View
          style={[
            styles.statusDot,
            isEyeDetected && styles.statusDotActive,
          ]}
        />
        <Text
          style={[
            styles.minimalText,
            isEyeDetected && styles.minimalTextActive,
          ]}
        >
          {instructionText}
        </Text>
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
  minimalPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.72)',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 18,
    marginTop: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    gap: 7,
  },
  minimalPillActive: {
    backgroundColor: 'rgba(6, 78, 59, 0.9)',
    borderColor: '#047857',
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#34D399',
  },
  statusDotActive: {
    backgroundColor: '#10B981',
  },
  minimalText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: -0.1,
  },
  minimalTextActive: {
    color: '#ECFDF5',
    fontWeight: '800',
  },
});
