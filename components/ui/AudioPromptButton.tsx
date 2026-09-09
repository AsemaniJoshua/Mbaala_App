import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Platform,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Palette } from '@/constants/colors';
import { Fonts, Radii, Shadows, TouchTarget } from '@/constants/theme';
import Svg, { Path, Rect } from 'react-native-svg';

export interface AudioPromptButtonProps {
  /** Label for sighted users / accessibility */
  label?: string;
  /** Sub-hint (e.g. "Kpatu yaali" or "Listen") */
  hint?: string;
  /** Whether the audio is currently playing */
  isPlaying?: boolean;
  /** Press handler to trigger audio speech */
  onPress: () => void;
  /** Visual theme */
  themeMode?: 'light' | 'dark';
  /** Accent color */
  accentColor?: string;
  /** Compact or hero mode */
  size?: 'compact' | 'standard' | 'hero';
  /** Custom container style */
  style?: StyleProp<ViewStyle>;
}

export const AudioPromptButton: React.FC<AudioPromptButtonProps> = ({
  label = 'Listen',
  hint = 'Tap to hear voice advice',
  isPlaying = false,
  onPress,
  themeMode = 'light',
  accentColor = Palette.emerald[600],
  size = 'standard',
  style,
}) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const isDark = themeMode === 'dark';

  // Pulsing animation when idle or playing to attract illiterate farmer's attention
  useEffect(() => {
    let animation: Animated.CompositeAnimation;
    if (isPlaying) {
      animation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.15,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
        ])
      );
      animation.start();
    } else {
      pulseAnim.setValue(1);
    }

    return () => {
      if (animation) animation.stop();
    };
  }, [isPlaying, pulseAnim]);

  const handlePress = () => {
    if (Platform.OS !== 'web') {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch {
        // Fallback
      }
    }
    onPress();
  };

  const isHero = size === 'hero';
  const isCompact = size === 'compact';
  const buttonSize = isHero ? 72 : isCompact ? 44 : TouchTarget.generous;

  return (
    <Pressable
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={`${label}. ${hint}`}
      style={({ pressed }) => [
        styles.container,
        {
          opacity: pressed ? 0.85 : 1,
          transform: [{ scale: pressed ? 0.96 : 1 }],
        },
        style,
      ]}
    >
      <Animated.View
        style={[
          styles.iconOrb,
          {
            width: buttonSize,
            height: buttonSize,
            backgroundColor: isPlaying
              ? Palette.emerald[500]
              : isDark
              ? Palette.slate[800]
              : Palette.emerald[50],
            borderColor: isPlaying ? Palette.emerald[400] : accentColor,
            transform: [{ scale: pulseAnim }],
          },
          isPlaying && Shadows.glowGreen,
        ]}
      >
        {/* Speaker with Soundwaves SVG */}
        <Svg width={buttonSize * 0.46} height={buttonSize * 0.46} viewBox="0 0 24 24" fill="none">
          <Path
            d="M11 5L6 9H2V15H6L11 19V5Z"
            fill={isPlaying ? '#FFFFFF' : accentColor}
            stroke={isPlaying ? '#FFFFFF' : accentColor}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          {/* Wave 1 */}
          <Path
            d="M15.54 8.46C16.5 9.42 17 10.7 17 12C17 13.3 16.5 14.58 15.54 15.54"
            stroke={isPlaying ? '#FFFFFF' : accentColor}
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Wave 2 */}
          <Path
            d="M19.07 4.93C20.94 6.8 22 9.35 22 12C22 14.65 20.94 17.2 19.07 19.07"
            stroke={isPlaying ? '#FFFFFF' : accentColor}
            strokeWidth="2"
            strokeLinecap="round"
          />
        </Svg>
      </Animated.View>

      {!isCompact && (
        <View style={styles.textColumn}>
          <Text
            style={[
              styles.labelText,
              { color: isDark ? '#F8FAFC' : Palette.slate[900] },
            ]}
          >
            {label}
          </Text>
          <Text
            style={[
              styles.hintText,
              { color: isDark ? Palette.slate[400] : Palette.slate[500] },
            ]}
          >
            {hint}
          </Text>
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconOrb: {
    borderRadius: Radii.full,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textColumn: {
    justifyContent: 'center',
  },
  labelText: {
    fontFamily: Fonts.rounded,
    fontSize: 16,
    fontWeight: '800',
  },
  hintText: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    fontWeight: '500',
    marginTop: 1,
  },
});
