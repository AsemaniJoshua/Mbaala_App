import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import Svg, {
  Circle,
  Ellipse,
  G,
  Path,
  Rect,
} from 'react-native-svg';

export interface FamachaGuideIllustrationProps {
  width?: number;
  height?: number;
  isDark?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const FamachaGuideIllustration: React.FC<FamachaGuideIllustrationProps> = ({
  width = 300,
  height = 170,
  isDark = false,
  style,
}) => {
  const skinTone = isDark ? '#1E293B' : '#F1F5F9';
  const furColor = isDark ? '#334155' : '#E2E8F0';
  const eyeWhite = '#FFFFFF';
  const irisColor = '#78350F';
  const pupilColor = '#0F172A';
  const mucosaHighlight = '#E11D48'; // The inner pink mucous membrane (FAMACHA site)
  const mucosaLip = '#FDA4AF';
  const guideLine = '#059669';

  return (
    <View style={[{ width, height, alignItems: 'center', justifyContent: 'center' }, style]}>
      <Svg viewBox="0 0 300 170" width={width} height={height} fill="none">
        {/* Background Card Rounded Canvas */}
        <Rect
          x="10"
          y="10"
          width="280"
          height="150"
          rx="18"
          fill={skinTone}
          stroke={isDark ? '#334155' : '#CBD5E1'}
          strokeWidth="1.5"
        />

        {/* Goat / Sheep Face Contour (Soft side profile) */}
        <Path
          d="M 40 40 
             C 90 32 150 42 210 60 
             C 240 70 260 95 255 125 
             C 250 145 220 150 170 142 
             C 110 132 60 115 35 90 
             Z"
          fill={furColor}
        />

        {/* Eye Socket Contour */}
        <Ellipse cx="145" cy="85" rx="42" ry="26" fill={eyeWhite} />

        {/* Goat Iris (Amber brown) */}
        <Ellipse cx="145" cy="85" rx="25" ry="22" fill={irisColor} />

        {/* Characteristic Horizontal Goat/Sheep Pupil */}
        <Rect
          x="126"
          y="80"
          width="38"
          height="10"
          rx="5"
          fill={pupilColor}
        />

        {/* Eyelash / Upper Eyelid Fold */}
        <Path
          d="M 103 82 C 120 62 168 62 187 82"
          stroke={pupilColor}
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* Lower Eyelid Gently Pulled Downward (The FAMACHA Technique) */}
        <Path
          d="M 108 90 
             C 125 116 165 116 182 90 
             C 172 124 118 124 108 90 Z"
          fill={mucosaHighlight}
        />

        {/* Mucosa Margin (Soft inner pink edge) */}
        <Path
          d="M 112 92 C 128 112 162 112 178 92"
          stroke={mucosaLip}
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Gentle Finger Position Indicator (Stylized downward arrow & finger tip) */}
        <G transform="translate(145, 122)">
          {/* Subtle downward motion arrow */}
          <Path
            d="M 0 -2 L 0 16 M -5 11 L 0 16 L 5 11"
            stroke={guideLine}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </G>

        {/* Inspection Target Ring (Dotted reticle highlighting the pink mucosa) */}
        <Ellipse
          cx="145"
          cy="104"
          rx="32"
          ry="14"
          stroke={guideLine}
          strokeWidth="2"
          strokeDasharray="4 4"
        />

        {/* "Check This Pink Spot" Visual Pill Badge */}
        <Rect x="188" y="24" width="88" height="22" rx="11" fill="#0F4C3A" />
        <Circle cx="199" cy="35" r="4" fill="#10B981" />
        <Path
          d="M 210 32 L 210 38 M 216 32 L 216 38 M 222 32 L 222 38"
          stroke="#A7F3D0"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <Circle cx="236" cy="35" r="3" fill="#E11D48" />
        <Circle cx="246" cy="35" r="3" fill="#FDA4AF" />
        <Circle cx="256" cy="35" r="3" fill="#FFFFFF" />
      </Svg>
    </View>
  );
};
