import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

export interface MbaalaMarkProps {
  /** Size in pixels (aspect ratio 1:1) */
  size?: number;
  /** Primary mark color (defaults to deep heritage forest green) */
  color?: string;
  /** Accent color for the subtle center indicator */
  accentColor?: string;
  /** Visual design concept */
  design?: 'lettermark' | 'geometric';
  /** Custom container style */
  style?: StyleProp<ViewStyle>;
}

export const MbaalaMark: React.FC<MbaalaMarkProps> = ({
  size = 56,
  color = '#0F4C3A',
  accentColor = '#10B981',
  design = 'lettermark',
  style,
}) => {
  return (
    <View style={[{ width: size, height: size }, style]}>
      {design === 'lettermark' ? (
        // Design 1: Modern "M" Lettermark + Ram Horns
        // Masterful geometric union of the letter 'M' (for Mbaala) with sweeping ram horns.
        <Svg viewBox="0 0 100 100" width={size} height={size} fill="none">
          {/* Left Horn & Left Stem of "M" */}
          <Path
            d="M 50 76 
               C 45 52 38 34 32 24 
               C 24 12 8 20 8 36 
               C 8 50 20 60 30 52
               C 34 49 34 43 30 43
               C 24 43 17 38 18 32
               C 19 24 28 20 33 28
               C 38 36 43 54 48 76 Z"
            fill={color}
          />

          {/* Right Horn & Right Stem of "M" */}
          <Path
            d="M 50 76 
               C 55 52 62 34 68 24 
               C 76 12 92 20 92 36 
               C 92 50 80 60 70 52
               C 66 49 66 43 70 43
               C 76 43 83 38 82 32
               C 81 24 72 20 67 28
               C 62 36 57 54 52 76 Z"
            fill={color}
          />

          {/* Center Crown / Face Contour */}
          <Path
            d="M 45 36 
               C 45 36 47 48 50 56 
               C 53 48 55 36 55 36 
               Z"
            fill={color}
          />

          {/* Vitality Focus Dot (Subtle, clean optical mark) */}
          <Circle cx="50" cy="62" r="3" fill={accentColor} />
        </Svg>
      ) : (
        // Design 2: Pure Minimalist Geometric Ram Head
        <Svg viewBox="0 0 100 100" width={size} height={size} fill="none">
          {/* Left Horn */}
          <Path
            d="M 50 32 
               C 42 20 28 18 18 28 
               C 8 38 7 56 18 67 
               C 24 73 34 73 38 66 
               C 40 62 38 56 33 55 
               C 27 54 22 58 20 54 
               C 18 48 18 37 26 31 
               C 33 26 42 28 47 35 Z"
            fill={color}
          />

          {/* Right Horn */}
          <Path
            d="M 50 32 
               C 58 20 72 18 82 28 
               C 92 38 93 56 82 67 
               C 76 73 66 73 62 66 
               C 60 62 62 56 67 55 
               C 73 54 78 58 80 54 
               C 82 48 82 37 74 31 
               C 67 26 58 28 53 35 Z"
            fill={color}
          />

          {/* Face Shield */}
          <Path
            d="M 44 35 
               L 56 35 
               C 57 44 60 54 58 64 
               C 57 74 50 88 50 88 
               C 50 88 43 74 42 64 
               C 40 54 43 44 44 35 Z"
            fill={color}
          />

          {/* Ears */}
          <Path d="M 40 44 C 32 46 24 50 20 56 C 26 56 34 52 38 48 Z" fill={color} />
          <Path d="M 60 44 C 68 46 76 50 80 56 C 74 56 66 52 62 48 Z" fill={color} />
        </Svg>
      )}
    </View>
  );
};
