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

export interface IllustrationProps {
  width: number;
  height: number;
  primaryColor?: string;
  accentColor?: string;
  style?: StyleProp<ViewStyle>;
}

export const SlideOneIllustration: React.FC<IllustrationProps> = ({
  width,
  height,
  primaryColor = '#10B981', // Default: Fresh Light Green
  accentColor = '#F59E0B',
  style,
}) => {
  return (
    <View style={[{ width, height, alignItems: 'center', justifyContent: 'center' }, style]}>
      <Svg viewBox="0 0 340 300" width={width} height={height} fill="none">
        <Defs>
          {/* Soft Airy Pastel Backdrops (Zero Blue) */}
          <LinearGradient id="blobGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#E6F4EA" stopOpacity="0.85" />
            <Stop offset="100%" stopColor="#D1FAE5" stopOpacity="0.45" />
          </LinearGradient>
          <LinearGradient id="blobGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#FEF3C7" stopOpacity="0.85" />
            <Stop offset="100%" stopColor="#FDE68A" stopOpacity="0.35" />
          </LinearGradient>
          <LinearGradient id="glassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
            <Stop offset="100%" stopColor="#F7FAF8" stopOpacity="0.8" />
          </LinearGradient>
        </Defs>

        {/* Ambient Organic Background Shapes */}
        <Ellipse cx="170" cy="155" rx="145" ry="125" fill="url(#blobGrad1)" />
        <Circle cx="245" cy="90" r="55" fill="url(#blobGrad2)" />
        <Circle cx="85" cy="210" r="42" fill="#FDF8EE" />

        {/* Decorative Floating Accents */}
        <Circle cx="50" cy="90" r="4" fill={primaryColor} opacity="0.6" />
        <Circle cx="290" cy="180" r="5" fill={accentColor} opacity="0.7" />
        <Circle cx="120" cy="40" r="3" fill={primaryColor} opacity="0.5" />
        <Path d="M 280 65 L 290 65 M 285 60 L 285 70" stroke={primaryColor} strokeWidth="2" strokeLinecap="round" />
        <Path d="M 60 160 L 68 160 M 64 156 L 64 164" stroke={accentColor} strokeWidth="2" strokeLinecap="round" />

        {/* Stylized Ram Silhouette */}
        <G transform="translate(10, 15)">
          {/* Head Profile */}
          <Path
            d="M 80 200 
               C 70 145 105 95 155 80 
               C 195 70 240 90 255 130 
               C 265 155 250 195 205 210 
               C 155 220 95 215 80 200 Z"
            fill="#FFFFFF"
          />

          {/* Sweeping Majestic Ram Horn */}
          <Path
            d="M 148 85 
               C 125 45 80 40 50 68 
               C 25 90 28 132 50 155 
               C 62 166 80 165 86 152 
               C 72 142 58 122 62 98 
               C 68 74 100 68 138 92 Z"
            fill={primaryColor}
          />

          {/* Eye Contour */}
          <Ellipse cx="190" cy="135" rx="34" ry="22" fill="#F8FAFC" />
          <Ellipse cx="190" cy="135" rx="20" ry="18" fill="#78350F" />
          <Rect x="175" y="130" width="30" height="10" rx="5" fill="#0F172A" />

          {/* Inner Lower Eyelid Mucosa (FAMACHA Check Site) */}
          <Path
            d="M 160 142 
               C 174 162 206 162 220 142 
               C 212 168 168 168 160 142 Z"
            fill="#E11D48"
          />
        </G>

        {/* Floating Holographic AI Scanner Bracket */}
        <G transform="translate(155, 105)">
          <Rect
            x="0"
            y="0"
            width="100"
            height="90"
            rx="16"
            fill="url(#glassGrad)"
            stroke={primaryColor}
            strokeWidth="1.5"
          />

          {/* Target Reticle */}
          <Circle cx="50" cy="45" r="28" stroke={primaryColor} strokeWidth="1.5" strokeDasharray="4 4" />
          <Circle cx="50" cy="45" r="8" fill={primaryColor} fillOpacity="0.2" stroke={primaryColor} strokeWidth="2" />
          <Circle cx="50" cy="45" r="3" fill="#0F172A" />

          {/* Framing Brackets */}
          <Path d="M 12 24 L 12 12 L 24 12" stroke={primaryColor} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
          <Path d="M 88 24 L 88 12 L 76 12" stroke={primaryColor} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
          <Path d="M 12 66 L 12 78 L 24 78" stroke={primaryColor} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
          <Path d="M 88 66 L 88 78 L 76 78" stroke={primaryColor} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        </G>

        {/* Floating AI Match Tag */}
        <G transform="translate(160, 205)">
          <Rect x="0" y="0" width="92" height="26" rx="13" fill={primaryColor} />
          <Circle cx="13" cy="13" r="4" fill="#FFFFFF" />
          <Path d="M 26 13 L 78 13" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="3 3" opacity="0.85" />
        </G>
      </Svg>
    </View>
  );
};
