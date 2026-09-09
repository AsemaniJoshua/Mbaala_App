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

export const SlideTwoIllustration: React.FC<IllustrationProps> = ({
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
          <LinearGradient id="bgGradSlide2" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#FEF3C7" stopOpacity="0.8" />
            <Stop offset="100%" stopColor="#E6F4EA" stopOpacity="0.6" />
          </LinearGradient>
          <LinearGradient id="greenCardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#FFFFFF" />
            <Stop offset="100%" stopColor="#F7FAF8" />
          </LinearGradient>
          <LinearGradient id="redCardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#FFFFFF" />
            <Stop offset="100%" stopColor="#FFF9F9" />
          </LinearGradient>
          <LinearGradient id="spectrumGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor={primaryColor} />
            <Stop offset="50%" stopColor={accentColor} />
            <Stop offset="100%" stopColor="#DC2626" />
          </LinearGradient>
        </Defs>

        {/* Ambient Organic Shapes */}
        <Ellipse cx="170" cy="150" rx="145" ry="120" fill="url(#bgGradSlide2)" />
        <Circle cx="70" cy="80" r="45" fill="#E6F4EA" opacity="0.7" />
        <Circle cx="270" cy="210" r="50" fill="#FDE68A" opacity="0.4" />

        {/* Floating Accents */}
        <Circle cx="45" cy="180" r="4" fill={primaryColor} opacity="0.6" />
        <Circle cx="300" cy="100" r="5" fill="#DC2626" opacity="0.5" />
        <Path d="M 60 50 L 68 50 M 64 46 L 64 54" stroke={primaryColor} strokeWidth="2" strokeLinecap="round" />
        <Path d="M 285 70 L 293 70 M 289 66 L 289 74" stroke={accentColor} strokeWidth="2" strokeLinecap="round" />

        {/* Connected Spectrum Bridge */}
        <G transform="translate(45, 235)">
          <Rect x="0" y="0" width="250" height="12" rx="6" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" />
          <Rect x="3" y="3" width="244" height="6" rx="3" fill="url(#spectrumGrad)" />
          <Circle cx="25" cy="6" r="6" fill={primaryColor} stroke="#FFFFFF" strokeWidth="2" />
          <Circle cx="125" cy="6" r="6" fill={accentColor} stroke="#FFFFFF" strokeWidth="2" />
          <Circle cx="225" cy="6" r="6" fill="#DC2626" stroke="#FFFFFF" strokeWidth="2" />
        </G>

        {/* ================= CARD 1: HEALTHY (LEFT) ================= */}
        <G transform="translate(25, 45)">
          <Rect
            x="0"
            y="0"
            width="135"
            height="170"
            rx="20"
            fill="url(#greenCardGrad)"
            stroke={primaryColor}
            strokeWidth="1.5"
          />

          {/* Status Badge */}
          <Rect x="14" y="14" width="76" height="22" rx="11" fill="#E6F4EA" />
          <Circle cx="24" cy="25" r="4" fill={primaryColor} />
          <Path d="M 36 25 L 76 25" stroke={primaryColor} strokeWidth="2" strokeLinecap="round" />

          {/* Eye Graphic */}
          <Ellipse cx="67" cy="82" rx="38" ry="24" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" />
          <Ellipse cx="67" cy="82" rx="18" ry="18" fill="#78350F" />
          <Rect x="54" y="78" width="26" height="8" rx="4" fill="#0F172A" />

          {/* Healthy Deep Red Mucosa */}
          <Path
            d="M 40 90 C 52 110 82 110 94 90 C 88 116 46 116 40 90 Z"
            fill="#E11D48"
          />

          {/* Shield Check Badge */}
          <G transform="translate(48, 122)">
            <Circle cx="19" cy="19" r="17" fill={primaryColor} />
            <Path
              d="M 13 19 L 17 23 L 25 15"
              stroke="#FFFFFF"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </G>
        </G>

        {/* ================= CARD 2: DANGER / SICK (RIGHT) ================= */}
        <G transform="translate(180, 45)">
          <Rect
            x="0"
            y="0"
            width="135"
            height="170"
            rx="20"
            fill="url(#redCardGrad)"
            stroke="#DC2626"
            strokeWidth="1.5"
          />

          {/* Status Badge */}
          <Rect x="14" y="14" width="76" height="22" rx="11" fill="#FEE2E2" />
          <Circle cx="24" cy="25" r="4" fill="#DC2626" />
          <Path d="M 36 25 L 76 25" stroke="#991B1B" strokeWidth="2" strokeLinecap="round" />

          {/* Eye Graphic */}
          <Ellipse cx="67" cy="82" rx="38" ry="24" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" />
          <Ellipse cx="67" cy="82" rx="18" ry="18" fill="#94A3B8" />
          <Rect x="54" y="78" width="26" height="8" rx="4" fill="#0F172A" />

          {/* Pale / White Anemic Eyelid Mucosa */}
          <Path
            d="M 40 90 C 52 110 82 110 94 90 C 88 116 46 116 40 90 Z"
            fill="#FFE4E6"
            stroke="#FDA4AF"
            strokeWidth="1.5"
          />

          {/* Alert Triangle Badge */}
          <G transform="translate(48, 122)">
            <Circle cx="19" cy="19" r="17" fill="#DC2626" />
            <Path
              d="M 19 11 V 20 M 19 25 V 26"
              stroke="#FFFFFF"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </G>
        </G>
      </Svg>
    </View>
  );
};
