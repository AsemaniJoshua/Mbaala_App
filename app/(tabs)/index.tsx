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
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import * as Speech from 'expo-speech';
import Svg, { Circle, Path } from 'react-native-svg';

import { useApp } from '@/context/AppContext';
import { MbaalaMark } from '@/components/brand/MbaalaMark';
import { LanguageCard } from '@/components/onboarding';
import {
  runTwoStageInference,
  PipelineStage,
  TwoStageInferenceResult,
} from '@/services/ai';
import {
  LanguageIllustration,
  SlideOneIllustration,
  SlideThreeIllustration,
  SlideTwoIllustration,
} from '@/components/onboarding/illustrations';
import {
  CameraPermissionCard,
  CameraReticle,
  TactileShutter,
  InspectionResultModal,
  FamachaReferenceModal,
} from '@/components/scanner';
import { LanguageOption, SUPPORTED_LANGUAGES } from '@/constants/languages';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Fresh Light Green Color Theme (Zero Blue)
const THEME = {
  primary: '#10B981',       // Fresh vibrant light emerald
  primaryLight: '#ECFDF5',  // Soft mint / pistachio tint
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
      "Point your phone camera at your goat or sheep's inner eyelid to detect internal parasites in seconds with on-device AI.",
    spokenAudio:
      "Point your phone camera at your animal's inner eyelid to check its health in seconds.",
    renderIllustration: (w, h, p, a) => (
      <SlideOneIllustration width={w} height={h} primaryColor={p} accentColor={a} />
    ),
  },
  {
    id: 'slide-2',
    index: 1,
    title: 'Catch Anemia Early',
    description:
      "Pale eyes mean blood worms are sucking your animal dry. Compare colors instantly to save your livestock before it's too late.",
    spokenAudio:
      'Pale eyes mean blood worms. Catch anemia early before your animal becomes too weak.',
    renderIllustration: (w, h, p, a) => (
      <SlideTwoIllustration width={w} height={h} primaryColor={p} accentColor={a} />
    ),
  },
  {
    id: 'slide-3',
    index: 2,
    title: '100% Offline & Voice Guided',
    description:
      'Built for remote villages with no network. Hear spoken voice instructions in your native tongue immediately.',
    spokenAudio:
      'Works everywhere with no internet. Hear clear spoken voice advice in your own language.',
    renderIllustration: (w, h, p, a) => (
      <SlideThreeIllustration width={w} height={h} primaryColor={p} accentColor={a} />
    ),
  },
];

export default function MainScanScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    hasCompletedOnboarding,
    completeOnboarding,
    selectedLanguage,
    setSelectedLanguage,
    addScanRecord,
    getNextTagNumber,
  } = useApp();

  // Onboarding & Language Selection Local State
  const [activeIndex, setActiveIndex] = useState(0);
  const [showLanguageSelect, setShowLanguageSelect] = useState(false);
  const [selectedLang, setSelectedLang] = useState<LanguageOption>(selectedLanguage);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [playingLangId, setPlayingLangId] = useState<string | null>(null);

  const flatListRef = useRef<FlatList>(null);
  const theme = THEME;

  // Camera & AI State
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [torchOn, setTorchOn] = useState(false);
  const [selectedAnimal, setSelectedAnimal] = useState<'Goat' | 'Sheep'>('Goat');
  const [isEyeDetected, setIsEyeDetected] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [pipelineStage, setPipelineStage] = useState<PipelineStage>('idle');
  const [latestAiResult, setLatestAiResult] = useState<TwoStageInferenceResult | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showFamachaModal, setShowFamachaModal] = useState(false);



  // Clean, concise single-line reticle guidance reacting to language, animal, and eyelid alignment
  const getReticleInstruction = () => {
    if (isEyeDetected) {
      switch (selectedLanguage.id) {
        case 'dag':
          return 'Nini pɔɣu maa zani viɛnyɛla';
        case 'hau':
          return 'Fatar ido tana tsakiya';
        case 'gur':
          return 'Nini pɔka la zani sukuura';
        default:
          return 'Eyelid in position • Hold still';
      }
    }
    switch (selectedLanguage.id) {
      case 'dag':
        return `Kpa ${selectedAnimal === 'Goat' ? 'buɣa' : 'piɛɣu'} nini pɔɣu`;
      case 'hau':
        return `Nuna fatar idon ${selectedAnimal === 'Goat' ? 'akuya' : 'rago'}`;
      case 'gur':
        return `Zaleni ${selectedAnimal === 'Goat' ? 'bua' : 'pɛka'} nini pɔka`;
      default:
        return `Align ${selectedAnimal.toLowerCase()} lower eyelid`;
    }
  };

  const triggerHaptic = (type: 'selection' | 'success' | 'heavy' = 'selection') => {
    if (Platform.OS !== 'web') {
      try {
        if (type === 'success') {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } else if (type === 'heavy') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
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

  const speakGuidancePrompt = () => {
    try {
      triggerHaptic();
      Speech.stop();
      const prompt =
        selectedLanguage.id === 'dag'
          ? 'Zalmi nyahi din viɛnyɛla ka kpa nini pɔɣu maa gbunni viɛnyɛla.'
          : selectedLanguage.id === 'hau'
          ? 'Riƙe wayar da kyau ka nuna fatar idon dabba a tsakiya.'
          : selectedLanguage.id === 'gur'
          ? 'Zaleni telefɔŋ la viilɛŋa baa gee zɛri nini pɔka la sukuura la poan.'
          : 'Hold phone steady and center your animal\'s lower eyelid inside the reticle frame.';

      Speech.speak(prompt, {
        language: selectedLanguage.speechCode,
        pitch: 1.0,
        rate: 0.92,
      });
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

  // Complete Onboarding: Save language and transition to Camera
  const handleCompleteLanguageSelection = () => {
    triggerHaptic('success');
    stopAudio();
    setSelectedLanguage(selectedLang);
    completeOnboarding();
  };

  // Camera Actions
  const handleToggleTorch = () => {
    triggerHaptic('heavy');
    setTorchOn((prev) => {
      const next = !prev;
      console.log('[Mbaala Scanner] Hardware torch toggled:', next ? 'ON' : 'OFF');
      return next;
    });
  };

  const handleToggleAnimal = () => {
    triggerHaptic();
    setIsEyeDetected(false);
    setSelectedAnimal((prev) => (prev === 'Goat' ? 'Sheep' : 'Goat'));
  };

  const handleOpenFamachaInfo = () => {
    triggerHaptic('selection');
    stopAudio();
    setShowFamachaModal(true);
  };

  const handleCapture = async () => {
    if (isCapturing) return;
    triggerHaptic('heavy');
    setIsCapturing(true);
    setIsEyeDetected(true);
    stopAudio();

    const consistentTag = await getNextTagNumber(selectedAnimal);
    let photoUri = '';

    try {
      // 1. Capture real live camera frame
      if (cameraRef.current) {
        try {
          const photo = await cameraRef.current.takePictureAsync({
            quality: 0.85,
            skipProcessing: true,
          });
          if (photo?.uri) {
            photoUri = photo.uri;
            console.log('[Mbaala Scanner] Captured live frame URI:', photoUri);
          }
        } catch (camErr) {
          console.log('[Mbaala Scanner] Live frame capture fallback:', camErr);
        }
      }

      // 2. Execute 2-stage AI pipeline: Finder (YOLOv8) + Judge (MobileNetV3)
      const result = await runTwoStageInference(
        photoUri,
        selectedAnimal,
        selectedLanguage.id,
        consistentTag,
        (stage) => setPipelineStage(stage)
      );

      setLatestAiResult(result);

      // Map to flock record and add to history
      const statusMap: Record<string, 'Healthy' | 'Warning' | 'Critical'> = {
        Green_Healthy: 'Healthy',
        Yellow_Borderline: 'Warning',
        Red_Severe: 'Critical',
      };
      const labelMap: Record<string, string> = {
        Green_Healthy: 'Healthy • Kpɛŋ',
        Yellow_Borderline: 'Borderline • Gbalagba',
        Red_Severe: 'Severe Anemia • Dorro',
      };

      addScanRecord({
        id: result.id,
        tag: result.animalTag,
        animal: result.animalBreed,
        status: statusMap[result.judge.classification] || 'Healthy',
        statusColor: result.judge.badgeColor,
        statusBg: result.judge.badgeBg,
        statusLabel: labelMap[result.judge.classification] || 'Healthy',
        timeAgo: 'Just now',
        speechText: result.judge.localizedSpeech,
        famachaScore: result.judge.famachaScore,
        confidence: result.judge.confidence,
      });

      setShowPreviewModal(true);
    } catch {
      // Fallback
    } finally {
      setIsCapturing(false);
      setPipelineStage('idle');
    }
  };

  const isLastSlide = activeIndex === SLIDES.length - 1;
  const illustrationHeight = Math.min(SCREEN_HEIGHT * 0.36, 250);
  const illustrationWidth = Math.min(SCREEN_WIDTH - 48, 300);

  // =========================================================================
  // VIEW 1: FIRST-RUN ONBOARDING & LANGUAGE SELECTION (NO BOTTOM TABS)
  // =========================================================================
  if (!hasCompletedOnboarding) {
    return (
      <SafeAreaView edges={['top', 'bottom']} style={[styles.safeArea, { backgroundColor: theme.canvas }]}>
        <StatusBar barStyle="dark-content" backgroundColor={theme.canvas} />

        {/* 1A. Onboarding Slides */}
        <View style={[styles.screenWrap, { display: showLanguageSelect ? 'none' : 'flex' }]}>
          {/* Top Bar with Skip */}
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

          {/* Swipable Carousel */}
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
                {/* Visual Illustration Centered */}
                <View style={styles.illustrationWrap}>
                  {item.renderIllustration(illustrationWidth, illustrationHeight, theme.primary, theme.accent)}
                </View>

                {/* Bottom Content & Controls */}
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

                  <Text style={[styles.headline, { color: theme.text }]}>{item.title}</Text>
                  <Text style={[styles.description, { color: theme.subtext }]}>{item.description}</Text>

                  {/* Spoken Voice Guidance Pill */}
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => speakSlideAudio(item.spokenAudio)}
                    style={[styles.audioPill, { backgroundColor: theme.primaryLight }]}
                  >
                    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                      <Path d="M11 5L6 9H2V15H6L11 19V5Z" fill={theme.primary} />
                      <Path
                        d="M15.54 8.46C16.5 9.42 17 10.7 17 12C17 13.3 16.5 14.58 15.54 15.54"
                        stroke={theme.primary}
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </Svg>
                    <Text style={[styles.audioPillText, { color: theme.primary }]}>
                      {isSpeaking ? 'Playing voice...' : 'Tap to listen'}
                    </Text>
                  </TouchableOpacity>

                  {/* Next / Get Started Action Button */}
                  <TouchableOpacity
                    activeOpacity={0.88}
                    onPress={handleNext}
                    style={[styles.solidNextButton, { backgroundColor: theme.primary, shadowColor: theme.primary }]}
                    accessibilityRole="button"
                    accessibilityLabel={isLastSlide ? 'Get Started' : 'Next screen'}
                  >
                    <Text style={styles.solidNextButtonText}>{isLastSlide ? 'Get Started' : 'Next'}</Text>
                    {/* Full Solid Arrow */}
                    <Svg width={22} height={22} viewBox="0 0 24 24" fill="#FFFFFF">
                      <Path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
                    </Svg>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        </View>

        {/* 1B. One-Time Language Selection (No Back Button as requested) */}
        <View style={[styles.screenWrap, { display: showLanguageSelect ? 'flex' : 'none' }]}>
          {/* Header Spacer (No Back Button) */}
          <View style={styles.langTopSpacer} />

          <ScrollView contentContainerStyle={styles.langScrollContent} showsVerticalScrollIndicator={false} bounces={false}>
            {/* Custom Language Illustration */}
            <View style={styles.langIllustrationWrap}>
              <LanguageIllustration
                width={Math.min(SCREEN_WIDTH - 64, 200)}
                height={95}
                primaryColor={theme.primary}
                accentColor={theme.accent}
              />
            </View>

            {/* Header */}
            <View style={styles.langHeader}>
              <Text style={styles.langHeading}>Choose Your Language</Text>
              <Text style={styles.langSubheading}>
                Select your dialect for spoken advice. You can change this anytime in Settings.
              </Text>
            </View>

            {/* Language Cards */}
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

          {/* Continue Button with Full Solid Arrow */}
          <View style={styles.langBottomWrap}>
            <TouchableOpacity
              activeOpacity={0.88}
              onPress={handleCompleteLanguageSelection}
              style={[styles.langContinueButton, { backgroundColor: theme.primary, shadowColor: theme.primary }]}
              accessibilityRole="button"
            >
              <Text style={styles.langContinueButtonText}>Continue to Camera</Text>
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

  // =========================================================================
  // VIEW 2: CAMERA PERMISSION REQUEST CARD (IF CAMERA NOT YET GRANTED)
  // =========================================================================
  if (!permission?.granted) {
    return (
      <SafeAreaView edges={['top', 'bottom']} style={[styles.safeArea, { backgroundColor: theme.canvas, justifyContent: 'center' }]}>
        <StatusBar barStyle="dark-content" backgroundColor={theme.canvas} />
        <CameraPermissionCard
          onRequestPermission={requestPermission}
          selectedLanguageCode={selectedLanguage.speechCode}
          selectedLanguageGreeting={selectedLanguage.greeting}
        />
      </SafeAreaView>
    );
  }

  // =========================================================================
  // VIEW 3: LIVE HERO CAMERA SCANNER SCREEN (NO BACK BUTTON, MODERNIZED TAB BAR)
  // =========================================================================
  return (
    <View style={styles.cameraContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      {/* 3A. Fullscreen Camera View */}
      <CameraView
        ref={cameraRef}
        style={StyleSheet.absoluteFillObject}
        facing="back"
        enableTorch={torchOn}
        flash={torchOn ? 'on' : 'off'}
      />

      {/* 3B. Camera Center Alignment Reticle with Tap-to-Align Simulation */}
      <View style={styles.reticleOverlay} pointerEvents="box-none">
        <TouchableOpacity
          activeOpacity={0.88}
          onPress={() => {
            triggerHaptic('selection');
            setIsEyeDetected((prev) => !prev);
          }}
          accessibilityRole="button"
          accessibilityLabel={
            isEyeDetected
              ? 'Eyelid in position. Tap to re-align.'
              : 'Tap to align eyelid.'
          }
        >
          <CameraReticle
            isEyeDetected={isEyeDetected}
            instructionText={getReticleInstruction()}
          />
        </TouchableOpacity>
      </View>

      {/* 3C. Top HUD Overlay: Audio Prompt + Clean Mbaala Brand + Torch Button */}
      <View
        pointerEvents="box-none"
        style={[
          styles.topHudContainer,
          { paddingTop: insets.top + (Platform.OS === 'android' ? 12 : 6) },
        ]}
      >
        <View style={styles.topHudRow} pointerEvents="box-none">
          {/* Left: Dialect Spoken Audio Button */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={speakGuidancePrompt}
            style={styles.hudAudioPill}
            accessibilityRole="button"
            accessibilityLabel="Listen to inspection voice guidance"
          >
            <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
              <Path d="M11 5L6 9H2V15H6L11 19V5Z" fill="#10B981" />
              <Path
                d="M15.54 8.46C16.5 9.42 17 10.7 17 12C17 13.3 16.5 14.58 15.54 15.54"
                stroke="#10B981"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
            </Svg>
            <Text style={styles.hudAudioText}>{selectedLanguage.name}</Text>
          </TouchableOpacity>

          {/* Center: Clean Mbaala Brand Header (Zero AI glitters) */}
          <View style={styles.brandHeader}>
            <MbaalaMark size={20} color="#10B981" accentColor="#10B981" design="geometric" />
            <Text style={styles.brandHeaderText}>Mbaala</Text>
          </View>

          {/* Right: Torch / Flashlight Button */}
          <TouchableOpacity
            activeOpacity={0.7}
            hitSlop={{ top: 18, bottom: 18, left: 18, right: 18 }}
            onPress={handleToggleTorch}
            style={[styles.hudIconButton, torchOn && styles.hudIconButtonActive]}
            accessibilityRole="button"
            accessibilityLabel={torchOn ? 'Turn off camera flashlight' : 'Turn on camera flashlight'}
            accessibilityState={{ selected: torchOn }}
          >
            <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
              <Path
                d="M13 2L3 14H12L11 22L21 10H12L13 2Z"
                stroke={torchOn ? '#D97706' : '#FFFFFF'}
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill={torchOn ? '#F59E0B' : 'none'}
              />
            </Svg>
          </TouchableOpacity>
        </View>
      </View>

      {/* 3D. Bottom Viewfinder Controls (Floating comfortably above modern bottom tab bar) */}
      <View style={styles.bottomControlsArea} pointerEvents="box-none">
        {/* Left: Animal Breed Switcher (Caprine / Ovine) */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleToggleAnimal}
          style={styles.animalSelectorPill}
          accessibilityRole="button"
          accessibilityLabel={`Currently scanning ${selectedAnimal}. Tap to switch.`}
        >
          <Text style={styles.animalEmoji}>{selectedAnimal === 'Goat' ? '🐐' : '🐑'}</Text>
          <Text style={styles.animalLabel}>{selectedAnimal}</Text>
        </TouchableOpacity>

        {/* Center: Tactile Shutter Button */}
        <TactileShutter onPress={handleCapture} disabled={isCapturing} />

        {/* Right: Quick FAMACHA Color Chart Reference Button (Clean Info Icon) */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleOpenFamachaInfo}
          style={styles.chartTipButton}
          accessibilityRole="button"
          accessibilityLabel="Hear FAMACHA color reference advice"
        >
          <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
            <Circle cx="12" cy="12" r="9" stroke="rgba(255, 255, 255, 0.7)" strokeWidth="2" />
            <Path d="M12 8H12.01M12 11V16" stroke="#10B981" strokeWidth="2.4" strokeLinecap="round" />
          </Svg>
        </TouchableOpacity>
      </View>

      {/* Real-time AI Pipeline Scanning Progress Overlay */}
      {isCapturing && (
        <View style={styles.aiScanningBanner} pointerEvents="none">
          <View style={styles.aiScanningPill}>
            <View style={styles.aiScanningDot} />
            <Text style={styles.aiScanningText}>
              {pipelineStage === 'finding_eye'
                ? 'Model 1: Locating eye & eyelid mucosa (YOLOv8)...'
                : 'Model 2: Grading FAMACHA anemia (MobileNetV3)...'}
            </Text>
          </View>
        </View>
      )}

      {/* 3E. Illiterate-Friendly Two-Stage AI Inspection Results Bottom Sheet Modal */}
      <InspectionResultModal
        visible={showPreviewModal}
        result={latestAiResult}
        selectedLanguage={selectedLanguage}
        onClose={() => {
          setShowPreviewModal(false);
          setIsEyeDetected(false);
        }}
        onViewFlock={() => {
          setShowPreviewModal(false);
          setIsEyeDetected(false);
          router.navigate('/history');
        }}
      />

      {/* 3F. Language-Specific FAMACHA Reference Guide Modal (Interactive Veterinary Card) */}
      <FamachaReferenceModal
        visible={showFamachaModal}
        selectedLanguage={selectedLanguage}
        selectedAnimal={selectedAnimal}
        onClose={() => setShowFamachaModal(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  screenWrap: {
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
    justifyContent: 'center',
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
  // Language Selection
  langTopSpacer: {
    height: 24,
  },
  langScrollContent: {
    paddingHorizontal: 24,
    paddingTop: 4,
    paddingBottom: 16,
  },
  langIllustrationWrap: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  langHeader: {
    marginBottom: 16,
  },
  langHeading: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.4,
    color: '#334155',
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

  // =========================================================================
  // CAMERA SCANNER STYLES
  // =========================================================================
  cameraContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  reticleOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topHudContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 999,
    elevation: 20,
  },
  topHudRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    zIndex: 1000,
    elevation: 21,
  },
  hudAudioPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  hudAudioText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  brandHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  brandHeaderText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  hudIconButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.18)',
  },
  hudIconButtonActive: {
    backgroundColor: '#FEF3C7',
    borderColor: '#F59E0B',
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 8,
  },

  // Bottom Viewfinder Controls
  bottomControlsArea: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 104 : 94,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 28,
    zIndex: 10,
  },
  animalSelectorPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  animalEmoji: {
    fontSize: 16,
  },
  animalLabel: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  chartTipButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },

  // AI Pipeline Scanning HUD Overlay
  aiScanningBanner: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 110 : 85,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 20,
  },
  aiScanningPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.88)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#10B981',
    gap: 8,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  aiScanningDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  aiScanningText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
});
