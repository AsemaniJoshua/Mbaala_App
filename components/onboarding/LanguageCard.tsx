import React from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import Svg, { Path } from 'react-native-svg';
import { LanguageOption } from '@/constants/languages';

export interface LanguageCardProps {
  language: LanguageOption;
  isSelected: boolean;
  onSelect: (lang: LanguageOption) => void;
  isPlaying?: boolean;
  onPlayAudio?: (lang: LanguageOption) => void;
}

export const LanguageCard: React.FC<LanguageCardProps> = ({
  language,
  isSelected,
  onSelect,
  isPlaying = false,
  onPlayAudio,
}) => {
  const triggerHaptic = () => {
    if (Platform.OS !== 'web') {
      try {
        Haptics.selectionAsync();
      } catch {
        // Fallback
      }
    }
  };

  const handleCardPress = () => {
    triggerHaptic();
    onSelect(language);
  };

  const handleSpeakerPress = (e: any) => {
    e.stopPropagation?.();
    triggerHaptic();
    if (onPlayAudio) {
      onPlayAudio(language);
    }
  };

  return (
    <Pressable
      onPress={handleCardPress}
      accessibilityRole="button"
      accessibilityLabel={`${language.nativeName}, ${language.name}. Tap to select.`}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: isSelected ? '#ECFDF5' : '#FFFFFF',
          borderColor: isSelected ? '#10B981' : '#E5E7EB',
          borderWidth: isSelected ? 1.5 : 1,
          transform: [{ scale: pressed ? 0.985 : 1 }],
          shadowColor: isSelected ? '#10B981' : '#000000',
          shadowOpacity: isSelected ? 0.12 : 0.03,
          shadowRadius: isSelected ? 6 : 3,
          elevation: isSelected ? 3 : 1,
        },
      ]}
    >
      {/* Left Language Code Badge */}
      <View
        style={[
          styles.badgeWrap,
          {
            backgroundColor: isSelected ? '#D1FAE5' : '#F3F4F6',
          },
        ]}
      >
        <Text
          style={[
            styles.badgeText,
            {
              color: isSelected ? '#047857' : '#6B7280',
            },
          ]}
        >
          {language.badge}
        </Text>
      </View>

      {/* Middle: Native Name & Region / Greeting */}
      <View style={styles.textWrap}>
        <Text style={styles.nativeName}>{language.nativeName}</Text>
        <Text numberOfLines={1} style={styles.subtext}>
          {language.region} • “{language.phoneticGreeting}”
        </Text>
      </View>

      {/* Right: Speaker Audio Button & Check Ring */}
      <View style={styles.actionsWrap}>
        {/* Speaker Button */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleSpeakerPress}
          accessibilityLabel={`Listen to ${language.name} sample greeting`}
          style={[
            styles.speakerButton,
            {
              backgroundColor: isPlaying ? '#10B981' : '#F3F4F6',
            },
          ]}
        >
          {isPlaying ? (
            /* Equalizer Waveform Bars */
            <View style={styles.equalizerRow}>
              <View style={[styles.equalizerBar, { height: 9 }]} />
              <View style={[styles.equalizerBar, { height: 15 }]} />
              <View style={[styles.equalizerBar, { height: 7 }]} />
            </View>
          ) : (
            /* Crisp Speaker Icon */
            <Svg width={15} height={15} viewBox="0 0 24 24" fill="none">
              <Path
                d="M11 5L6 9H2V15H6L11 19V5Z"
                fill={isSelected ? '#059669' : '#6B7280'}
              />
              <Path
                d="M15.54 8.46C16.5 9.42 17 10.7 17 12C17 13.3 16.5 14.58 15.54 15.54"
                stroke={isSelected ? '#059669' : '#6B7280'}
                strokeWidth="2"
                strokeLinecap="round"
              />
              <Path
                d="M19.07 4.93C20.94 6.8 22 9.35 22 12C22 14.65 20.94 17.2 19.07 19.07"
                stroke={isSelected ? '#059669' : '#6B7280'}
                strokeWidth="2"
                strokeLinecap="round"
              />
            </Svg>
          )}
        </TouchableOpacity>

        {/* Selection Check Circle */}
        <View
          style={[
            styles.checkCircle,
            {
              borderColor: isSelected ? '#10B981' : '#D1D5DB',
              backgroundColor: isSelected ? '#10B981' : 'transparent',
            },
          ]}
        >
          {isSelected && (
            <Svg width={11} height={11} viewBox="0 0 24 24" fill="none">
              <Path
                d="M5 13L9 17L19 7"
                stroke="#FFFFFF"
                strokeWidth="3.2"
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
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 18,
    marginBottom: 10,
    shadowOffset: { width: 0, height: 2 },
  },
  badgeWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  textWrap: {
    flex: 1,
    paddingHorizontal: 12,
  },
  nativeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
    letterSpacing: -0.1,
  },
  subtext: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 2,
  },
  actionsWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  speakerButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  equalizerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  equalizerBar: {
    width: 2.5,
    backgroundColor: '#FFFFFF',
    borderRadius: 1.25,
  },
  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
