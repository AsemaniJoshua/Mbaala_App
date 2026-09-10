import React, { useState } from 'react';
import {
  Alert,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import * as Speech from 'expo-speech';
import Svg, { Path } from 'react-native-svg';
import { LanguageCard } from '@/components/onboarding';
import { LanguageOption, SUPPORTED_LANGUAGES } from '@/constants/languages';
import { useApp } from '@/context/AppContext';

export default function SettingsScreen() {
  const { selectedLanguage, setSelectedLanguage, resetOnboarding } = useApp();
  const [playingLangId, setPlayingLangId] = useState<string | null>(null);

  const triggerHaptic = (type: 'selection' | 'success' = 'selection') => {
    if (Platform.OS !== 'web') {
      try {
        if (type === 'success') {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } else {
          Haptics.selectionAsync();
        }
      } catch {
        // Fallback
      }
    }
  };

  const handlePlayLanguageAudio = (lang: LanguageOption) => {
    try {
      Speech.stop();
      setPlayingLangId(lang.id);
      Speech.speak(lang.greeting, {
        language: lang.speechCode,
        pitch: 1.0,
        rate: 0.92,
        onDone: () => setPlayingLangId(null),
        onError: () => setPlayingLangId(null),
      });
    } catch {
      setPlayingLangId(null);
    }
  };

  const handleSelectLanguage = (lang: LanguageOption) => {
    setSelectedLanguage(lang);
    handlePlayLanguageAudio(lang);
  };

  const handleResetOnboarding = () => {
    triggerHaptic('success');
    Speech.stop();
    Alert.alert(
      'Reset Onboarding',
      'Would you like to replay the introduction and language setup slides?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Replay',
          style: 'default',
          onPress: () => {
            resetOnboarding();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FBFDF9" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Screen Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
          <Text style={styles.subtitle}>
            Manage your dialect, voice advice, and flock preferences.
          </Text>
        </View>

        {/* Section: Language Dialect Switcher */}
        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <Text style={styles.sectionTitle}>Voice Dialect</Text>
            <View style={styles.activePill}>
              <Text style={styles.activePillText}>{selectedLanguage.name}</Text>
            </View>
          </View>
          <Text style={styles.sectionDescription}>
            Mbaala speaks veterinary advice in your selected language:
          </Text>

          <View style={styles.cardsContainer}>
            {SUPPORTED_LANGUAGES.map((lang) => (
              <LanguageCard
                key={lang.id}
                language={lang}
                isSelected={selectedLanguage.id === lang.id}
                isPlaying={playingLangId === lang.id}
                onPlayAudio={handlePlayLanguageAudio}
                onSelect={handleSelectLanguage}
              />
            ))}
          </View>
        </View>

        {/* Section: Inspection Tips */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Inspection Guide</Text>
          <View style={styles.tipCard}>
            <View style={styles.tipIconOrb}>
              <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M12 3V5M12 19V21M5 12H3M21 12H19M18.364 5.636L16.95 7.05M7.05 16.95L5.636 18.364M18.364 18.364L16.95 16.95M7.05 7.05L5.636 5.636"
                  stroke="#10B981"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
              </Svg>
            </View>
            <View style={styles.tipTextWrap}>
              <Text style={styles.tipTitle}>Natural Daylight Recommended</Text>
              <Text style={styles.tipBody}>
                Inspect your animals outdoors under direct sunlight for the most accurate FAMACHA color reading.
              </Text>
            </View>
          </View>
        </View>

        {/* Section: Replay Onboarding (Developer / User testing) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={handleResetOnboarding}
            style={styles.replayButton}
            accessibilityRole="button"
          >
            <Text style={styles.replayButtonText}>Replay Onboarding & Tutorial</Text>
          </TouchableOpacity>
        </View>

        {/* Version Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Mbaala App • Offline Livestock AI v1.0</Text>
          <Text style={styles.footerSubtext}>Northern Ghana FAMACHA Anemia Detection</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FBFDF9',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 110, // Extra clearance for the floating bottom tab bar
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.6,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
    color: '#64748B',
  },
  section: {
    marginBottom: 28,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1E293B',
    letterSpacing: -0.3,
  },
  activePill: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  activePillText: {
    color: '#047857',
    fontSize: 11,
    fontWeight: '800',
  },
  sectionDescription: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 14,
  },
  cardsContainer: {
    width: '100%',
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 10,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  tipIconOrb: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  tipTextWrap: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 2,
  },
  tipBody: {
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '500',
    color: '#64748B',
  },
  replayButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 10,
  },
  replayButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#059669',
  },
  footer: {
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 16,
  },
  footerText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
  },
  footerSubtext: {
    fontSize: 11,
    fontWeight: '500',
    color: '#CBD5E1',
    marginTop: 2,
  },
});
