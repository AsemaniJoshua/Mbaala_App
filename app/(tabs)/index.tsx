import React, { useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
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
import {
  LanguageCard,
} from '@/components/onboarding';
import {
  SlideOneIllustration,
  SlideThreeIllustration,
  SlideTwoIllustration,
} from '@/components/onboarding/illustrations';
import { LanguageOption, SUPPORTED_LANGUAGES } from '@/constants/languages';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Fresh Light Green Color Theme (Zero Blue)
const THEME = {
  primary: '#10B981',       // Fresh vibrant light emerald
  primaryLight: '#ECFDF5',  // Pistachio / soft mint tint
  canvas: '#FBFDF9',        // Crisp airy botanical canvas
  text: '#0F172A',
  subtext: '#64748B',
  skipBg: '#F3F4F6',        // Soft clean neutral pill
  skipText: '#6B7280',      // Muted neutral gray
  dotInactive: '#E2E8F0',
  accent: '#F59E0B',
};

interface SlideItem {
  id: string;
  index: number;
  title: string;
  description: string;
  spokenAudio: string;
  renderIllustration: (width: number, height: number, primary: string, accent: string) => React.ReactNode;
}

const SLIDES: SlideItem[] = [
  {
    id: 'slide-1',
    index: 0,
    title: 'Instant Eye Health Check',
    description:
      'Point your phone camera at your goat or sheep\'s inner eyelid to detect internal parasites in seconds with on-device AI.',
    spokenAudio:
      'Point your phone camera at your animal\'s inner eyelid to check its health in seconds.',
    renderIllustration: (w, h, p, a) => <SlideOneIllustration width={w} height={h} primaryColor={p} accentColor={a} />,
  },
  {
    id: 'slide-2',
    index: 1,
    title: 'Catch Anemia Early',
    description:
      'Pale eyes mean blood worms are sucking your animal dry. Compare colors instantly to save your livestock before it\'s too late.',
    spokenAudio:
      'Pale eyes mean blood worms. Catch anemia early before your animal becomes too weak.',
    renderIllustration: (w, h, p, a) => <SlideTwoIllustration width={w} height={h} primaryColor={p} accentColor={a} />,
  },
  {
    id: 'slide-3',
    index: 2,
    title: '100% Offline & Voice Guided',
    description:
      'Built for remote villages with no network. Hear spoken voice instructions in your native tongue immediately.',
    spokenAudio:
      'Works everywhere with no internet. Hear clear spoken voice advice in your own language.',
    renderIllustration: (w, h, p, a) => <SlideThreeIllustration width={w} height={h} primaryColor={p} accentColor={a} />,
  },
];

export default function OnboardingScreen() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showLanguageSelect, setShowLanguageSelect] = useState(false);
  const [selectedLang, setSelectedLang] = useState<LanguageOption>(SUPPORTED_LANGUAGES[0]);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const flatListRef = useRef<FlatList>(null);
  const theme = THEME;

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

  const stopAudio = () => {
    try {
      Speech.stop();
      setIsSpeaking(false);
    } catch {
      // Fallback
    }
  };


  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(offsetX / SCREEN_WIDTH);
    if (newIndex !== activeIndex && newIndex >= 0 && newIndex < SLIDES.length) {
      setActiveIndex(newIndex);
      triggerHaptic();
      stopAudio();
    }
  };

  const handleNext = () => {
    triggerHaptic();
    stopAudio();
    if (activeIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: activeIndex + 1,
        animated: true,
      });
      setActiveIndex(activeIndex + 1);
    } else {
      setShowLanguageSelect(true);
    }
  };

  const handleSkip = () => {
    triggerHaptic('success');
    stopAudio();
    setShowLanguageSelect(true);
  };

  const speakSlideAudio = (text: string) => {
    try {
      Speech.stop();
      setIsSpeaking(true);
      Speech.speak(text, {
        language: 'en-US',
        pitch: 1.0,
        rate: 0.95,
        onDone: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false),
      });
    } catch {
      setIsSpeaking(false);
    }
  };

  // =========================================================================
  // DEDICATED LANGUAGE SELECTION (AFTER ALL ONBOARDING SLIDES)
  // =========================================================================
  if (showLanguageSelect) {
    return (
      <SafeAreaView edges={['top', 'bottom']} style={[styles.langSafeArea, { backgroundColor: theme.canvas }]}>
        <StatusBar barStyle="dark-content" backgroundColor={theme.canvas} />

        <ScrollView
          contentContainerStyle={styles.langScroll}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.langHeader}>
            <View style={[styles.langStepPill, { backgroundColor: theme.primary }]}>
              <Text style={styles.langStepPillText}>FINAL STEP</Text>
            </View>
            <Text style={[styles.langHeading, { color: theme.text }]}>Choose Your Language</Text>
            <Text style={[styles.langSubheading, { color: theme.subtext }]}>
              Select the dialect you want Mbaala to speak when diagnosing your livestock.
            </Text>
          </View>

          {/* Cards */}
          <View style={styles.langCards}>
            {SUPPORTED_LANGUAGES.map((lang) => (
              <LanguageCard
                key={lang.id}
                language={lang}
                isSelected={selectedLang.id === lang.id}
                onSelect={setSelectedLang}
                isDark={false}
              />
            ))}
          </View>

          {/* Unified Solid Action Button */}
          <TouchableOpacity
            activeOpacity={0.88}
            onPress={() => {
              triggerHaptic('success');
              stopAudio();
              try {
                Speech.speak(selectedLang.greeting, {
                  language: selectedLang.speechCode,
                });
              } catch {
                // Fallback
              }
              alert(`Selected Language: ${selectedLang.name} (${selectedLang.nativeName})\n\nReady for Phase 5: Camera Screen.`);
            }}
            style={[styles.langContinueButton, { backgroundColor: theme.primary, shadowColor: theme.primary }]}
            accessibilityRole="button"
          >
            <Text style={styles.langContinueButtonText}>
              Start Scanning • Pillim Womika
            </Text>
            <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
              <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                fill="#FFFFFF"
              />
            </Svg>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // =========================================================================
  // SOLID SWIPABLE ONBOARDING SCREENS (FRESH LIGHT GREEN & CREATIVE PALETTES)
  // =========================================================================
  const isLastSlide = activeIndex === SLIDES.length - 1;
  const illustrationHeight = Math.min(SCREEN_HEIGHT * 0.36, 250);
  const illustrationWidth = Math.min(SCREEN_WIDTH - 48, 300);

  return (
    <SafeAreaView edges={['top', 'bottom']} style={[styles.safeArea, { backgroundColor: theme.canvas }]}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.canvas} />

      {/* Top Bar: Clean Skip Button on Top Right */}
      <View style={styles.topBar}>
        <View style={styles.topBarSpacer} />
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleSkip}
          style={[styles.skipButton, { backgroundColor: theme.skipBg }]}
          accessibilityLabel="Skip onboarding"
        >
          <Text style={[styles.skipText, { color: theme.skipText }]}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Horizontal Swipable Slide List */}
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onMomentumScrollEnd={handleScroll}
        getItemLayout={(_, index) => ({
          length: SCREEN_WIDTH,
          offset: SCREEN_WIDTH * index,
          index,
        })}
        renderItem={({ item }) => (
          <View style={styles.solidSlideScreen}>
            {/* Visual Upper Area: Centered gracefully in the middle */}
            <View style={styles.illustrationWrap}>
              {item.renderIllustration(illustrationWidth, illustrationHeight, theme.primary, theme.accent)}
            </View>

            {/* Unified Bottom Content & Controls */}
            <View style={styles.bottomContentWrap}>
              {/* Pagination Dots */}
              <View style={styles.dotsRow}>
                {SLIDES.map((slide, i) => {
                  const isActive = i === activeIndex;
                  return (
                    <View
                      key={slide.id}
                      style={[
                        styles.dot,
                        isActive
                          ? [styles.activeDot, { backgroundColor: theme.primary }]
                          : [styles.inactiveDot, { backgroundColor: theme.dotInactive }],
                      ]}
                    />
                  );
                })}
              </View>

              {/* Title & Description */}
              <Text style={[styles.headline, { color: theme.text }]}>{item.title}</Text>
              <Text style={[styles.description, { color: theme.subtext }]}>{item.description}</Text>

              {/* Audio Speaker Pill for Non-Literate Users */}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => speakSlideAudio(item.spokenAudio)}
                style={[styles.audioPill, { backgroundColor: theme.primaryLight }]}
              >
                <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                  <Path d="M11 5L6 9H2V15H6L11 19V5Z" fill={theme.primary} />
                  <Path d="M15.54 8.46C16.5 9.42 17 10.7 17 12C17 13.3 16.5 14.58 15.54 15.54" stroke={theme.primary} strokeWidth="2" strokeLinecap="round" />
                </Svg>
                <Text style={[styles.audioPillText, { color: theme.primary }]}>
                  {isSpeaking ? 'Playing voice...' : 'Tap to listen'}
                </Text>
              </TouchableOpacity>

              {/* Solid Integrated Next / Get Started Button */}
              <TouchableOpacity
                activeOpacity={0.88}
                onPress={handleNext}
                style={[styles.solidNextButton, { backgroundColor: theme.primary, shadowColor: theme.primary }]}
                accessibilityRole="button"
                accessibilityLabel={isLastSlide ? 'Get Started' : 'Next screen'}
              >
                <Text style={styles.solidNextButtonText}>
                  {isLastSlide ? 'Get Started' : 'Next'}
                </Text>
                <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
                  <Path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    fill="#FFFFFF"
                  />
                </Svg>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 6,
    height: 52,
  },
  topBarSpacer: {
    width: 48,
  },
  skipButton: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
  },
  skipText: {
    fontSize: 14,
    fontWeight: '600',
  },
  solidSlideScreen: {
    width: SCREEN_WIDTH,
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  illustrationWrap: {
    width: '100%',
    flex: 1,
    justifyContent: 'center', // Centered gracefully in the middle
    alignItems: 'center',
    paddingVertical: 10,
  },
  bottomContentWrap: {
    alignItems: 'center',
    width: '100%',
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 18,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  activeDot: {
    width: 32,
  },
  inactiveDot: {
    width: 8,
  },
  headline: {
    fontSize: 27,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: -0.6,
    marginBottom: 10,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    fontWeight: '500',
    paddingHorizontal: 12,
    marginBottom: 14,
  },
  audioPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    marginBottom: 20,
  },
  audioPillText: {
    fontSize: 12,
    fontWeight: '700',
  },
  solidNextButton: {
    width: '100%',
    height: 58,
    borderRadius: 29,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4,
  },
  solidNextButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  langSafeArea: {
    flex: 1,
  },
  langScroll: {
    padding: 24,
    paddingBottom: 40,
  },
  langHeader: {
    marginBottom: 24,
  },
  langStepPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    marginBottom: 12,
  },
  langStepPillText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  langHeading: {
    fontSize: 30,
    fontWeight: '900',
    letterSpacing: -0.8,
  },
  langSubheading: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '500',
    marginTop: 8,
  },
  langCards: {
    marginBottom: 24,
  },
  langContinueButton: {
    width: '100%',
    height: 58,
    borderRadius: 29,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4,
  },
  langContinueButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
});
