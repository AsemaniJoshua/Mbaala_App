import React from 'react';
import Svg, { Circle, G, Path, Rect } from 'react-native-svg';

interface LanguageIllustrationProps {
  width: number;
  height: number;
  primaryColor?: string;
  accentColor?: string;
}

export const LanguageIllustration: React.FC<LanguageIllustrationProps> = ({
  width,
  height,
  primaryColor = '#10B981',
  accentColor = '#059669',
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 240 160" fill="none">
      {/* Soft circular background glow */}
      <Circle cx="120" cy="80" r="68" fill="#ECFDF5" />
      <Circle cx="120" cy="80" r="54" fill="#D1FAE5" opacity={0.6} />

      {/* Radiating Voice Soundwaves (Left & Right) */}
      <G opacity={0.85}>
        {/* Left soundwaves */}
        <Path
          d="M62 65C58 74 58 86 62 95"
          stroke={primaryColor}
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <Path
          d="M50 56C43 70 43 90 50 104"
          stroke={primaryColor}
          strokeWidth="3"
          strokeLinecap="round"
          opacity={0.5}
        />

        {/* Right soundwaves */}
        <Path
          d="M178 65C182 74 182 86 178 95"
          stroke={primaryColor}
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <Path
          d="M190 56C197 70 197 90 190 104"
          stroke={primaryColor}
          strokeWidth="3"
          strokeLinecap="round"
          opacity={0.5}
        />
      </G>

      {/* Central Friendly Goat Silhouette with Audio Speaker Accent */}
      <G transform="translate(86, 44)">
        {/* Horns */}
        <Path
          d="M18 26C12 16 15 6 26 2C24 9 22 18 22 24"
          stroke={accentColor}
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M50 26C56 16 53 6 42 2C44 9 46 18 46 24"
          stroke={accentColor}
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Head Shape */}
        <Path
          d="M20 28C20 24 24 20 34 20C44 20 48 24 48 28L44 56C43 62 39 66 34 66C29 66 25 62 24 56L20 28Z"
          fill="#FFFFFF"
          stroke={accentColor}
          strokeWidth="3.5"
          strokeLinejoin="round"
        />

        {/* Ears */}
        <Path
          d="M18 28C10 30 5 38 7 42C11 42 16 36 19 32"
          fill="#D1FAE5"
          stroke={accentColor}
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <Path
          d="M50 28C58 30 63 38 61 42C57 42 52 36 49 32"
          fill="#D1FAE5"
          stroke={accentColor}
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* Eyes (Gentle, friendly) */}
        <Circle cx="28" cy="36" r="2.5" fill="#0F172A" />
        <Circle cx="40" cy="36" r="2.5" fill="#0F172A" />

        {/* Muzzle & Smile */}
        <Path
          d="M31 52C32.5 54 35.5 54 37 52"
          stroke="#0F172A"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </G>

      {/* Floating Audio Speech Badge */}
      <G transform="translate(142, 34)">
        <Circle cx="16" cy="16" r="15" fill={primaryColor} />
        {/* Speaker icon inside bubble */}
        <Path
          d="M12 12L9 14H7V18H9L12 20V12Z"
          fill="#FFFFFF"
        />
        <Path
          d="M15 13.5C15.8 14.3 16.2 15.3 16.2 16C16.2 16.7 15.8 17.7 15 18.5"
          stroke="#FFFFFF"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <Path
          d="M17.5 11C19 12.5 19.8 14.2 19.8 16C19.8 17.8 19 19.5 17.5 21"
          stroke="#FFFFFF"
          strokeWidth="1.8"
          strokeLinecap="round"
          opacity={0.8}
        />
      </G>

      {/* Decorative Warm Sparkles */}
      <Circle cx="68" cy="38" r="3" fill="#F59E0B" />
      <Circle cx="182" cy="120" r="2.5" fill="#F59E0B" />
    </Svg>
  );
};
