import React, { useState } from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import * as Speech from 'expo-speech';
import Svg, { Path } from 'react-native-svg';
import { LanguageOption } from '@/constants/languages';

export interface LanguageCardProps {
  language: LanguageOption;
  isSelected: boolean;
  onSelect: (lang: LanguageOption) => void;
  isDark?: boolean;
}

export const LanguageCard: React.FC<LanguageCardProps> = ({
  language,
  isSelected,
  onSelect,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const cardBg = isSelected ? '#ECFDF5' : '#FFFFFF';
  const borderColor = isSelected ? '#10B981' : '#E2E8F0';
  const titleColor = '#0F172A';
  const subtitleColor = '#64748B';

  const speakGreeting = () => {
    try {
      Speech.stop();
      setIsPlaying(true);
      Speech.speak(language.greeting, {
        language: language.speechCode,
        pitch: 1.0,
        rate: 0.92,
        onDone: () => setIsPlaying(false),
        onError: () => setIsPlaying(false),
      });
    } catch {
      setIsPlaying(false);
    }
  };

  const handlePressCard = () => {
    if (Platform.OS !== 'web') {
      try {
        Haptics.selectionAsync();
      } catch {
        // Fallback
      }
    }
    onSelect(language);
    speakGreeting();
  };

  return (
    <Pressable
      onPress={handlePressCard}
      accessibilityRole="button"
      accessibilityLabel={`${language.nativeName}, ${language.name}. Tap to select.`}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: cardBg,
          borderColor: borderColor,
          transform: [{ scale: pressed ? 0.985 : 1 }],
          shadowColor: isSelected ? '#10B981' : '#000000',
          shadowOpacity: isSelected ? 0.12 : 0.03,
          shadowRadius: isSelected ? 10 : 4,
          elevation: isSelected ? 3 : 1,
        },
      ]}
    >
      <View style={styles.leftContent}>
        {/* Region Tag Pill */}
        <View
          style={[
            styles.tagPill,
            {
              backgroundColor: isSelected ? '#D1FAE5' : '#F1F5F9',
            },
          ]}
        >
          <Text
            style={[
              styles.tagText,
              {
                color: isSelected ? '#047857' : '#64748B',
              },
            ]}
          >
            {language.tag}
          </Text>
        </View>

        {/* Native Language Name (Bold & Large) */}
        <Text style={[styles.primaryName, { color: titleColor }]}>
          {language.nativeName}
        </Text>

        {/* English Name & Region Description */}
        <Text style={[styles.regionName, { color: subtitleColor }]}>
          {language.name} • {language.region}
        </Text>
      </View>

      <View style={styles.rightActions}>
        {/* Speaker Button with Soundwave SVG */}
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={(e) => {
            e.stopPropagation?.();
            speakGreeting();
          }}
          accessibilityLabel={`Listen to ${language.name} sample greeting`}
          style={[
            styles.speakerButton,
            {
              backgroundColor: isPlaying
                ? '#10B981'
                : isSelected
                ? '#D1FAE5'
                : '#F1F5F9',
            },
          ]}
        >
          <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
            <Path
              d="M11 5L6 9H2V15H6L11 19V5Z"
              fill={isPlaying ? '#FFFFFF' : isSelected ? '#047857' : '#64748B'}
            />
            <Path
              d="M15.54 8.46C16.5 9.42 17 10.7 17 12C17 13.3 16.5 14.58 15.54 15.54"
              stroke={isPlaying ? '#FFFFFF' : isSelected ? '#047857' : '#64748B'}
              strokeWidth="2"
              strokeLinecap="round"
            />
            <Path
              d="M19.07 4.93C20.94 6.8 22 9.35 22 12C22 14.65 20.94 17.2 19.07 19.07"
              stroke={isPlaying ? '#FFFFFF' : isSelected ? '#047857' : '#64748B'}
              strokeWidth="2"
              strokeLinecap="round"
            />
          </Svg>
        </TouchableOpacity>

        {/* Selection Check Ring */}
        <View
          style={[
            styles.checkRing,
            {
              borderColor: isSelected ? '#10B981' : '#CBD5E1',
              backgroundColor: isSelected ? '#10B981' : 'transparent',
            },
          ]}
        >
          {isSelected && (
            <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
              <Path
                d="M5 13L9 17L19 7"
                stroke="#FFFFFF"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          )}
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderRadius: 20,
    borderWidth: 1.5,
    marginBottom: 12,
    shadowOffset: { width: 0, height: 3 },
  },
  leftContent: {
    flex: 1,
    paddingRight: 14,
  },
  tagPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginBottom: 6,
  },
  tagText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  primaryName: {
    fontSize: 19,
    fontWeight: '900',
    letterSpacing: -0.4,
  },
  regionName: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: 2,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  speakerButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkRing: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
