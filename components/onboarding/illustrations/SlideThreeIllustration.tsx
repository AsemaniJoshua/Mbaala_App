import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import Svg, {
  Circle,
  Defs,
  Ellipse,
  G,
  LinearGradient,
  Path,
  Rect,
  Stop,
} from 'react-native-svg';
import { IllustrationProps } from './SlideOneIllustration';

export const SlideThreeIllustration: React.FC<IllustrationProps> = ({
  width,
  height,
  primaryColor = '#10B981',
  accentColor = '#F59E0B',
  style,
}) => {
  return (
    <View style={[{ width, height, alignItems: 'center', justifyContent: 'center' }, style]}>
      <Svg viewBox="0 0 340 300" width={width} height={height} fill="none">
        <Defs>
          <LinearGradient id="bgGradSlide3" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#FEF3C7" stopOpacity="0.8" />
            <Stop offset="100%" stopColor="#E6F4EA" stopOpacity="0.6" />
          </LinearGradient>
          <LinearGradient id="phoneBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#FFFFFF" />
            <Stop offset="100%" stopColor="#F8FAFC" />
          </LinearGradient>
          <LinearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={primaryColor} />
            <Stop offset="100%" stopColor="#059669" />
          </LinearGradient>
        </Defs>

        {/* Ambient Organic Shapes */}
        <Ellipse cx="170" cy="150" rx="145" ry="120" fill="url(#bgGradSlide3)" />
        <Circle cx="75" cy="190" r="50" fill="#FDE68A" opacity="0.4" />
        <Circle cx="265" cy="85" r="48" fill="#E6F4EA" opacity="0.7" />

        {/* Concentric Soundwave Ripples */}
        <Circle cx="170" cy="140" r="105" stroke={primaryColor} strokeWidth="1" strokeDasharray="4 4" opacity="0.35" />
        <Circle cx="170" cy="140" r="82" stroke={primaryColor} strokeWidth="1.5" strokeDasharray="3 3" opacity="0.45" />

        {/* Dialect Speech Pills */}
        {/* Top Left: Dagbani */}
        <G transform="translate(30, 70)">
          <Rect x="0" y="0" width="80" height="28" rx="14" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" />
          <Circle cx="14" cy="14" r="4" fill={primaryColor} />
          <Path d="M 26 14 L 68 14" stroke={primaryColor} strokeWidth="2.5" strokeLinecap="round" />
        </G>

        {/* Top Right: Hausa */}
        <G transform="translate(230, 60)">
          <Rect x="0" y="0" width="80" height="28" rx="14" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" />
          <Circle cx="14" cy="14" r="4" fill={accentColor} />
          <Path d="M 26 14 L 68 14" stroke={accentColor} strokeWidth="2.5" strokeLinecap="round" />
        </G>

        {/* Bottom Left: Gurune */}
        <G transform="translate(35, 195)">
          <Rect x="0" y="0" width="76" height="28" rx="14" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" />
          <Circle cx="14" cy="14" r="4" fill="#C2410C" />
          <Path d="M 26 14 L 64 14" stroke="#C2410C" strokeWidth="2.5" strokeLinecap="round" />
        </G>

        {/* Bottom Right: English */}
        <G transform="translate(235, 190)">
          <Rect x="0" y="0" width="76" height="28" rx="14" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" />
          <Circle cx="14" cy="14" r="4" fill="#334155" />
          <Path d="M 26 14 L 64 14" stroke="#334155" strokeWidth="2.5" strokeLinecap="round" />
        </G>

        {/* Smartphone */}
        <G transform="translate(125, 45)">
          <Rect
            x="0"
            y="0"
            width="90"
            height="180"
            rx="22"
            fill="url(#phoneBodyGrad)"
            stroke={primaryColor}
            strokeWidth="3.5"
          />

          {/* Notch Speaker */}
          <Rect x="30" y="8" width="30" height="4" rx="2" fill={primaryColor} />

          {/* Speaker Sound Icon in Screen */}
          <G transform="translate(23, 50)">
            <Circle cx="22" cy="22" r="26" fill="#E6F4EA" />
            <Path
              d="M 18 14 L 12 18 H 8 V 26 H 12 L 18 30 V 14 Z"
              fill={primaryColor}
            />
            <Path d="M 24 18 C 26 20 26 24 24 26" stroke={primaryColor} strokeWidth="3" strokeLinecap="round" />
            <Path d="M 28 14 C 32 18 32 26 28 30" stroke={primaryColor} strokeWidth="3" strokeLinecap="round" />
          </G>

          {/* Audio Waveform Bars */}
          <G transform="translate(18, 125)">
            <Rect x="0" y="8" width="4" height="14" rx="2" fill={primaryColor} />
            <Rect x="8" y="2" width="4" height="26" rx="2" fill={primaryColor} />
            <Rect x="16" y="0" width="4" height="30" rx="2" fill={accentColor} />
            <Rect x="24" y="5" width="4" height="20" rx="2" fill={primaryColor} />
            <Rect x="32" y="2" width="4" height="26" rx="2" fill={accentColor} />
            <Rect x="40" y="8" width="4" height="14" rx="2" fill={primaryColor} />
            <Rect x="48" y="12" width="4" height="6" rx="2" fill="#E2E8F0" />
          </G>
        </G>

        {/* Offline Shield Badge */}
        <G transform="translate(105, 238)">
          <Rect x="0" y="0" width="130" height="28" rx="14" fill={primaryColor} />
          <Circle cx="16" cy="14" r="5" fill="#FFFFFF" />
          <Path
            d="M 14 14 L 16 16 L 19 12"
            stroke={primaryColor}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path d="M 30 14 L 115 14" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="3 3" opacity="0.85" />
        </G>
      </Svg>
    </View>
  );
};
