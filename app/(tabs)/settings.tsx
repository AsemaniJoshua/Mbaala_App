import React, { useState } from 'react';
import {
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import * as Speech from 'expo-speech';
import Svg, { Path } from 'react-native-svg';

import { LanguageOption, SUPPORTED_LANGUAGES } from '@/constants/languages';
import { useApp } from '@/context/AppContext';

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { selectedLanguage, setSelectedLanguage } = useApp();
  const [playingId, setPlayingId] = useState<string | null>(null);

  const handleSelect = (lang: LanguageOption) => {
    try {
      Haptics.selectionAsync();
    } catch {}
    setSelectedLanguage(lang);
    playGreeting(lang);
  };

  const playGreeting = (lang: LanguageOption) => {
    try {
      Speech.stop();
      setPlayingId(lang.id);
      Speech.speak(lang.greeting, {
        language: lang.speechCode,
        pitch: 1.0,
        rate: 0.92,
        onDone: () => setPlayingId(null),
        onError: () => setPlayingId(null),
      });
    } catch {
      setPlayingId(null);
    }
  };

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor="#FBFDF9" />

      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: insets.top + (Platform.OS === 'android' ? 24 : 18),
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Simple, Clean Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
          <Text style={styles.subtitle}>
            Select the spoken voice language for camera guidance and diagnosis.
          </Text>
        </View>

        {/* Section Label */}
        <Text style={styles.sectionLabel}>SPOKEN DIALECT</Text>

        {/* Minimalist Language List Card */}
        <View style={styles.languageCard}>
          {SUPPORTED_LANGUAGES.map((lang, index) => {
            const isSelected = selectedLanguage.id === lang.id;
            const isLast = index === SUPPORTED_LANGUAGES.length - 1;
            const isPlaying = playingId === lang.id;

            return (
              <View key={lang.id}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => handleSelect(lang)}
                  style={[
                    styles.languageRow,
                    isSelected && styles.languageRowSelected,
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel={`${lang.name} (${lang.nativeName})`}
                >
                  {/* Badge */}
                  <View
                    style={[
                      styles.badgeCircle,
                      isSelected && styles.badgeCircleSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.badgeText,
                        isSelected && styles.badgeTextSelected,
                      ]}
                    >
                      {lang.badge}
                    </Text>
                  </View>

                  {/* Language Info */}
                  <View style={styles.languageInfo}>
                    <Text
                      style={[
                        styles.languageName,
                        isSelected && styles.languageNameSelected,
                      ]}
                    >
                      {lang.name}
                    </Text>
                    <Text style={styles.nativeScript}>
                      {lang.nativeName}
                    </Text>
                  </View>

                  {/* Right Actions: Preview Speaker + Checkmark */}
                  <View style={styles.rightGroup}>
                    {/* Audio Preview Icon Button */}
                    <TouchableOpacity
                      hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                      onPress={(e) => {
                        e.stopPropagation();
                        try {
                          Haptics.selectionAsync();
                        } catch {}
                        playGreeting(lang);
                      }}
                      style={[
                        styles.speakerBtn,
                        isPlaying && styles.speakerBtnPlaying,
                      ]}
                      accessibilityRole="button"
                      accessibilityLabel={`Hear sample of ${lang.name}`}
                    >
                      <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                        <Path
                          d="M11 5L6 9H2V15H6L11 19V5Z"
                          fill={isPlaying ? '#10B981' : '#94A3B8'}
                        />
                        <Path
                          d="M15.54 8.46C16.5 9.42 17 10.7 17 12C17 13.3 16.5 14.58 15.54 15.54"
                          stroke={isPlaying ? '#10B981' : '#94A3B8'}
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </Svg>
                    </TouchableOpacity>

                    {/* Selected Checkmark */}
                    <View style={styles.checkSlot}>
                      {isSelected && (
                        <View style={styles.checkCircle}>
                          <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                            <Path
                              d="M5 13L9 17L19 7"
                              stroke="#FFFFFF"
                              strokeWidth="3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </Svg>
                        </View>
                      )}
                    </View>
                  </View>
                </TouchableOpacity>

                {!isLast && <View style={styles.rowDivider} />}
              </View>
            );
          })}
        </View>

        {/* Minimal Footer */}
        <Text style={styles.footerNote}>
          Mbaala v1.0 • 100% Offline
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FBFDF9',
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 120 : 100,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.4,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: '#64748B',
    fontWeight: '400',
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 0.8,
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  languageCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 32,
  },
  languageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  languageRowSelected: {
    backgroundColor: '#F8FCF9',
  },
  badgeCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  badgeCircleSelected: {
    backgroundColor: '#ECFDF5',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: -0.2,
  },
  badgeTextSelected: {
    color: '#047857',
    fontWeight: '800',
  },
  languageInfo: {
    flex: 1,
  },
  languageName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 2,
  },
  languageNameSelected: {
    color: '#064E3B',
    fontWeight: '700',
  },
  nativeScript: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '400',
  },
  rightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  speakerBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  speakerBtnPlaying: {
    backgroundColor: '#ECFDF5',
    borderColor: '#10B981',
  },
  checkSlot: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginLeft: 68,
  },
  footerNote: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
    fontWeight: '500',
  },
});
