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
  LanguageIllustration,
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
  const [playingLangId, setPlayingLangId] = useState<string | null>(null);

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
      setPlayingLangId(null);
    } catch {
      // Fallback
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

  const handleBackToOnboarding = () => {
    triggerHaptic();
    stopAudio();
    setShowLanguageSelect(false);
    // Explicitly align FlatList with activeIndex so image & indicator match perfectly
    setTimeout(() => {
      flatListRef.current?.scrollToIndex({
        index: activeIndex,
        animated: false,
      });
    }, 40);
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

  const isLastSlide = activeIndex === SLIDES.length - 1;
  const illustrationHeight = Math.min(SCREEN_HEIGHT * 0.36, 250);
  const illustrationWidth = Math.min(SCREEN_WIDTH - 48, 300);

  return (
    <SafeAreaView edges={['top', 'bottom']} style={[styles.safeArea, { backgroundColor: theme.canvas }]}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.canvas} />

      {/* ========================================================================= */}
      {/* 1. ONBOARDING SCREEN (KEPT MOUNTED TO PRESERVE SCROLL POSITION)           */}
      {/* ========================================================================= */}
      <View style={[styles.screenWrap, { display: showLanguageSelect ? 'none' : 'flex' }]}>
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
          initialScrollIndex={activeIndex}
          getItemLayout={(_, index) => ({
            length: SCREEN_WIDTH,
            offset: SCREEN_WIDTH * index,
            index,
          })}
          onScrollToIndexFailed={(info) => {
            setTimeout(() => {
              flatListRef.current?.scrollToIndex({
                index: info.index,
                animated: false,
              });
            }, 50);
          }}
          onMomentumScrollEnd={handleScroll}
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
                  {/* Full Bold Solid Arrow */}
                  <Svg width={22} height={22} viewBox="0 0 24 24" fill="#FFFFFF">
                    <Path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
                  </Svg>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </View>

      {/* ========================================================================= */}
      {/* 2. DEDICATED LANGUAGE SELECTION (CONNECTED & VISUALLY RICH)                */}
      {/* ========================================================================= */}
      <View style={[styles.screenWrap, { display: showLanguageSelect ? 'flex' : 'none' }]}>
        {/* Top Bar: Clean Left Back Button */}
        <View style={styles.topBar}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleBackToOnboarding}
            style={styles.langBackButton}
            accessibilityLabel="Back to onboarding slides"
          >
            <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
              <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                fill="#0F172A"
              />
            </Svg>
          </TouchableOpacity>
          <View style={styles.topBarSpacer} />
        </View>

        {/* Centered Scroll Content */}
        <ScrollView
          contentContainerStyle={styles.langScrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* Custom Language Illustration */}
          <View style={styles.langIllustrationWrap}>
            <LanguageIllustration
              width={Math.min(SCREEN_WIDTH - 64, 200)}
              height={100}
              primaryColor={theme.primary}
              accentColor={theme.accent}
            />
          </View>

          {/* Header */}
          <View style={styles.langHeader}>
            <Text style={styles.langHeading}>Choose Your Language</Text>
            <Text style={styles.langSubheading}>
              Select your dialect to hear spoken instructions.
            </Text>
          </View>

          {/* 4 Clean Language Cards */}
          <View style={styles.langCards}>
            {SUPPORTED_LANGUAGES.map((lang) => (
              <LanguageCard
                key={lang.id}
                language={lang}
                isSelected={selectedLang.id === lang.id}
                isPlaying={playingLangId === lang.id}
                onPlayAudio={handlePlayLanguageAudio}
                onSelect={(selected) => {
                  setSelectedLang(selected);
                  handlePlayLanguageAudio(selected);
                }}
              />
            ))}
          </View>
        </ScrollView>

        {/* Solid Action Button at Bottom */}
        <View style={styles.langBottomWrap}>
          <TouchableOpacity
            activeOpacity={0.88}
            onPress={() => {
              triggerHaptic('success');
              stopAudio();
              alert(`Selected Language: ${selectedLang.name} (${selectedLang.nativeName})\n\nReady for Phase 5: Real-time Eye Finder Camera Screen.`);
            }}
            style={[styles.langContinueButton, { backgroundColor: theme.primary, shadowColor: theme.primary }]}
            accessibilityRole="button"
          >
            <Text style={styles.langContinueButtonText}>Continue</Text>
            {/* Full Bold Solid Arrow */}
            <Svg width={22} height={22} viewBox="0 0 24 24" fill="#FFFFFF">
              <Path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
            </Svg>
          </TouchableOpacity>
        </View>
      </View>
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
  screenWrap: {
    flex: 1,
  },
  langBackButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  langScrollContent: {
    paddingHorizontal: 24,
    paddingTop: 6,
    paddingBottom: 16,
  },
  langIllustrationWrap: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  langHeader: {
    marginBottom: 16,
  },
  langHeading: {
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: -0.6,
    color: '#0F172A',
    marginBottom: 4,
  },
  langSubheading: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
    color: '#64748B',
  },
  langCards: {
    width: '100%',
    marginBottom: 8,
  },
  langBottomWrap: {
    paddingHorizontal: 24,
    paddingBottom: 24,
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
