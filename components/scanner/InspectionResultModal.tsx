import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  PanResponder,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import * as Speech from 'expo-speech';
import * as Haptics from 'expo-haptics';

import { TwoStageInferenceResult } from '@/services/ai';
import { LanguageOption } from '@/constants/languages';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface InspectionResultModalProps {
  visible: boolean;
  result: TwoStageInferenceResult | null;
  selectedLanguage: LanguageOption;
  onClose: () => void;
  onViewFlock: () => void;
}

const getLocalizedStatusHeadline = (classification: string, langId: string) => {
  if (classification === 'Green_Healthy') {
    switch (langId) {
      case 'dag':
        return 'A BIŊ MAA KPƐŊ VIƐNYƐLA';
      case 'hau':
        return 'DABBARKA TANA DA LAFIYA';
      case 'gur':
        return 'DOO LA DE LAFIYA';
      default:
        return 'HEALTHY • OPTIMAL BLOOD';
    }
  } else if (classification === 'Yellow_Borderline') {
    switch (langId) {
      case 'dag':
        return 'GBALAGBA • GULSI NYAHI';
      case 'hau':
        return 'GARGADI • KULA DA DABBA';
      case 'gur':
        return 'ZƐƔA • GULƐ TIŊA';
      default:
        return 'BORDERLINE • MONITOR CLOSELY';
    }
  } else {
    switch (langId) {
      case 'dag':
        return 'DORRO KPEENI • TIM BƆRA';
      case 'hau':
        return 'CIWO MAI TSANANI • MAGANI';
      case 'gur':
        return 'BAAŊA KPEENI • TIMA BƆRA';
      default:
        return 'SEVERE ANEMIA • DEWORM NOW';
    }
  }
};

export const InspectionResultModal: React.FC<InspectionResultModalProps> = ({
  visible,
  result,
  selectedLanguage,
  onClose,
  onViewFlock,
}) => {
  const [showTechDetails, setShowTechDetails] = useState(false);
  const panY = useRef(new Animated.Value(0)).current;

  // Draggable PanResponder to swipe down and dismiss
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => gestureState.dy > 6,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          panY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 70 || gestureState.vy > 0.6) {
          Animated.timing(panY, {
            toValue: 600,
            duration: 180,
            useNativeDriver: true,
          }).start(() => {
            onClose();
            panY.setValue(0);
          });
        } else {
          Animated.spring(panY, {
            toValue: 0,
            bounciness: 4,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  // Auto-play localized diagnosis audio when opened
  useEffect(() => {
    if (visible && result?.judge.localizedSpeech) {
      panY.setValue(0);
      try {
        Speech.stop();
        Speech.speak(result.judge.localizedSpeech, {
          language: selectedLanguage.speechCode,
          pitch: 1.0,
          rate: 0.92,
        });
      } catch {
        // Fallback
      }
    }
  }, [visible, result, panY, selectedLanguage.speechCode]);

  if (!result) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalBackdrop}>
        {/* Clickable Backdrop to close when tapping empty space */}
        <TouchableOpacity
          style={StyleSheet.absoluteFillObject}
          activeOpacity={1}
          onPress={onClose}
        />

        {/* Draggable Animated Bottom Sheet Card */}
        <Animated.View
          style={[
            styles.modalCard,
            { transform: [{ translateY: panY }] },
          ]}
        >
          {/* Draggable Header Area with PanResponder */}
          <View {...panResponder.panHandlers} style={styles.dragArea}>
            <View style={styles.modalDragHandle} />
          </View>

          {/* Animal Header Row */}
          <View style={styles.modalHeaderRow}>
            <View style={styles.animalHeaderPill}>
              <Text style={styles.animalHeaderEmoji}>
                {result.animalBreed === 'Goat' ? '🐐' : '🐑'}
              </Text>
              <Text style={styles.animalHeaderTag}>
                {result.animalBreed} {result.animalTag}
              </Text>
            </View>

            <TouchableOpacity
              onPress={onClose}
              hitSlop={{ top: 14, bottom: 14, left: 14, right: 14 }}
              style={styles.closeModalCircle}
              accessibilityRole="button"
              accessibilityLabel="Close diagnosis"
            >
              <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                <Path d="M18 6L6 18M6 6L18 18" stroke="#64748B" strokeWidth="2.4" strokeLinecap="round" />
              </Svg>
            </TouchableOpacity>
          </View>

          <ScrollView style={{ maxHeight: SCREEN_HEIGHT * 0.58 }} showsVerticalScrollIndicator={false}>
            {/* 1. Large High-Contrast Hero Status Banner */}
            <View
              style={[
                styles.heroDiagnosisCard,
                {
                  backgroundColor:
                    result.judge.classification === 'Green_Healthy'
                      ? '#ECFDF5'
                      : result.judge.classification === 'Yellow_Borderline'
                      ? '#FFFBEB'
                      : '#FEF2F2',
                  borderColor: result.judge.badgeColor,
                },
              ]}
            >
              <View
                style={[
                  styles.heroIconCircle,
                  { backgroundColor: result.judge.badgeColor },
                ]}
              >
                {result.judge.classification === 'Green_Healthy' ? (
                  <Svg width={30} height={30} viewBox="0 0 24 24" fill="none">
                    <Path
                      d="M5 13L9 17L19 7"
                      stroke="#FFFFFF"
                      strokeWidth="3.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </Svg>
                ) : result.judge.classification === 'Yellow_Borderline' ? (
                  <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
                    <Path
                      d="M12 8V12M12 16H12.01M10.29 3.86L1.82 18A2 2 0 003.55 21H20.45A2 2 0 0022.18 18L13.71 3.86A2 2 0 0010.29 3.86Z"
                      stroke="#FFFFFF"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </Svg>
                ) : (
                  <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
                    <Circle cx="12" cy="12" r="9" stroke="#FFFFFF" strokeWidth="2.4" />
                    <Path d="M12 8V12M12 16H12.01" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
                  </Svg>
                )}
              </View>

              <View style={{ flex: 1 }}>
                <Text style={[styles.heroStatusTitle, { color: result.judge.badgeColor }]}>
                  {getLocalizedStatusHeadline(result.judge.classification, selectedLanguage.id)}
                </Text>
                <Text style={styles.heroStatusSubtitle}>
                  FAMACHA Grade {result.judge.famachaScore} •{' '}
                  {result.judge.classification === 'Green_Healthy'
                    ? 'Healthy Blood'
                    : result.judge.classification === 'Yellow_Borderline'
                    ? 'Mild Pallor'
                    : 'Immediate Deworming'}
                </Text>
              </View>
            </View>

            {/* 2. Large Dialect Audio Pill */}
            <TouchableOpacity
              activeOpacity={0.82}
              onPress={() => {
                if (result.judge.localizedSpeech) {
                  if (Platform.OS !== 'web') {
                    try {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                    } catch {}
                  }
                  try {
                    Speech.stop();
                    Speech.speak(result.judge.localizedSpeech, {
                      language: selectedLanguage.speechCode,
                      pitch: 1.0,
                      rate: 0.92,
                    });
                  } catch {
                    // Fallback
                  }
                }
              }}
              style={[
                styles.largeAudioDiagnosisPill,
                { borderColor: result.judge.badgeColor || '#10B981' },
              ]}
            >
              <View
                style={[
                  styles.audioSpeakerCircle,
                  { backgroundColor: result.judge.badgeColor || '#10B981' },
                ]}
              >
                <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
                  <Path d="M11 5L6 9H2V15H6L11 19V5Z" fill="#FFFFFF" />
                  <Path
                    d="M15.54 8.46C16.5 9.42 17 10.7 17 12C17 13.3 16.5 14.58 15.54 15.54"
                    stroke="#FFFFFF"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                  />
                </Svg>
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={[styles.largeAudioTitle, { color: result.judge.badgeColor || '#10B981' }]}>
                  🔊 {selectedLanguage.name} Voice (Tap to Replay):
                </Text>
                <Text style={styles.largeAudioSpeechText}>
                  {`"${result.judge.localizedSpeech}"`}
                </Text>
              </View>
            </TouchableOpacity>

            {/* 3. Visual FAMACHA Color Needle Bar */}
            <View style={styles.famachaVisualStripCard}>
              <View style={styles.famachaVisualHeader}>
                <Text style={styles.famachaVisualTitle}>FAMACHA Color Scale</Text>
                <Text style={[styles.famachaVisualScore, { color: result.judge.badgeColor }]}>
                  Score {result.judge.famachaScore} of 5
                </Text>
              </View>

              <View style={styles.famachaColorBar}>
                <View style={[styles.famachaSegment, { backgroundColor: '#DC2626' }]} />
                <View style={[styles.famachaSegment, { backgroundColor: '#EA580C' }]} />
                <View style={[styles.famachaSegment, { backgroundColor: '#F59E0B' }]} />
                <View style={[styles.famachaSegment, { backgroundColor: '#F87171' }]} />
                <View style={[styles.famachaSegment, { backgroundColor: '#F1F5F9' }]} />
              </View>

              {/* Active Needle Indicator */}
              <View style={styles.famachaPointerRow}>
                {[1, 2, 3, 4, 5].map((score) => (
                  <View key={score} style={styles.famachaPointerCol}>
                    {result.judge.famachaScore === score ? (
                      <View style={styles.activePointerBadge}>
                        <Text style={styles.activePointerArrow}>▲</Text>
                        <Text style={styles.activePointerText}>Score {score}</Text>
                      </View>
                    ) : (
                      <Text style={styles.inactivePointerText}>{score}</Text>
                    )}
                  </View>
                ))}
              </View>

              <View style={styles.famachaSpectrumLabels}>
                <Text style={styles.famachaSpectrumLeft}>✓ Healthy (Deep Red)</Text>
                <Text style={styles.famachaSpectrumRight}>🚨 Critical (White)</Text>
              </View>
            </View>

            {/* 4. Collapsible Technical AI Specs Accordion with Clean Vector Tuning Icon */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setShowTechDetails((prev) => !prev)}
              style={styles.techToggleRow}
            >
              <View style={styles.techToggleLeft}>
                {/* Modern Vector Analytics / Parameter Sliders Icon (Zero Emojis) */}
                <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                  <Path
                    d="M4 21V14M4 10V3M12 21V12M12 8V3M20 21V16M20 12V3M1 14H7M9 8H15M17 16H23"
                    stroke="#10B981"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </Svg>
                <Text style={styles.techToggleText}>
                  {showTechDetails ? 'Hide' : 'View'} Technical AI Metrics
                </Text>
              </View>

              <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                <Path
                  d={showTechDetails ? 'M18 15L12 9L6 15' : 'M6 9L12 15L18 9'}
                  stroke="#64748B"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </TouchableOpacity>

            {showTechDetails && (
              <View style={styles.techDetailsWrap}>
                {/* Model 1 YOLO details */}
                <View style={styles.aiStageCard}>
                  <View style={styles.aiStageHeader}>
                    <Text style={styles.aiStageTitle}>MODEL 1 • EYE FINDER (YOLOv8n)</Text>
                    <Text style={styles.aiStageConfidence}>
                      {((result.finder.confidence || 0) * 100).toFixed(1)}% Match
                    </Text>
                  </View>
                  <Text style={styles.aiStageDesc}>
                    Extracted eyelid mucosa crop with 15% padding in {result.finder.inferenceTimeMs}ms.
                  </Text>
                </View>

                {/* Model 2 MobileNet details */}
                <View style={styles.aiStageCard}>
                  <View style={styles.aiStageHeader}>
                    <Text style={styles.aiStageTitle}>MODEL 2 • COLOR JUDGE (MobileNetV3)</Text>
                    <Text style={[styles.aiStageConfidence, { color: result.judge.badgeColor }]}>
                      {((result.judge.confidence || 0) * 100).toFixed(1)}%
                    </Text>
                  </View>
                  <View style={styles.probRow}>
                    <View style={styles.probItem}>
                      <Text style={styles.probLabel}>Healthy</Text>
                      <Text style={[styles.probVal, { color: '#10B981' }]}>
                        {((result.judge.probabilities.Green_Healthy || 0) * 100).toFixed(0)}%
                      </Text>
                    </View>
                    <View style={styles.probItem}>
                      <Text style={styles.probLabel}>Borderline</Text>
                      <Text style={[styles.probVal, { color: '#F59E0B' }]}>
                        {((result.judge.probabilities.Yellow_Borderline || 0) * 100).toFixed(0)}%
                      </Text>
                    </View>
                    <View style={styles.probItem}>
                      <Text style={styles.probLabel}>Severe</Text>
                      <Text style={[styles.probVal, { color: '#EF4444' }]}>
                        {((result.judge.probabilities.Red_Severe || 0) * 100).toFixed(0)}%
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            )}
          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.modalActionsRow}>
            <TouchableOpacity
              activeOpacity={0.88}
              onPress={onClose}
              style={styles.modalPrimaryAction}
            >
              <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M23 19C23 20.1046 22.1046 21 21 21H3C1.89543 21 1 20.1046 1 19V8C1 6.89543 1.89543 6 3 6H7L9 3H15L17 6H21C22.1046 6 23 6.89543 23 8V19Z"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <Circle cx="12" cy="13" r="4" stroke="#FFFFFF" strokeWidth="2" />
              </Svg>
              <Text style={styles.modalPrimaryActionText}>Scan Next Animal</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={onViewFlock}
              style={styles.modalSecondaryAction}
            >
              <Text style={styles.modalSecondaryActionText}>View Flock</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 20,
  },
  dragArea: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 10,
  },
  modalDragHandle: {
    width: 44,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#CBD5E1',
  },
  modalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  animalHeaderPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
  },
  animalHeaderEmoji: {
    fontSize: 18,
  },
  animalHeaderTag: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  closeModalCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Hero Status Card
  heroDiagnosisCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    borderWidth: 2,
    gap: 14,
    marginBottom: 14,
  },
  heroIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  heroStatusTitle: {
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: -0.3,
    textTransform: 'uppercase',
  },
  heroStatusSubtitle: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '700',
    marginTop: 3,
  },

  // Large Dialect Audio Pill
  largeAudioDiagnosisPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 14,
    borderRadius: 18,
    borderWidth: 1.5,
    marginBottom: 14,
  },
  audioSpeakerCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  largeAudioTitle: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.2,
    textTransform: 'uppercase',
    marginBottom: 3,
  },
  largeAudioSpeechText: {
    fontSize: 13,
    color: '#0F172A',
    fontWeight: '600',
    lineHeight: 18,
  },

  // Visual FAMACHA Strip Card
  famachaVisualStripCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 18,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  famachaVisualHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  famachaVisualTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  famachaVisualScore: {
    fontSize: 13,
    fontWeight: '800',
  },
  famachaColorBar: {
    height: 18,
    borderRadius: 9,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  famachaSegment: {
    flex: 1,
  },
  famachaPointerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
    height: 34,
  },
  famachaPointerCol: {
    flex: 1,
    alignItems: 'center',
  },
  activePointerBadge: {
    alignItems: 'center',
  },
  activePointerArrow: {
    fontSize: 12,
    color: '#0F172A',
    lineHeight: 12,
  },
  activePointerText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0F172A',
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 1,
  },
  inactivePointerText: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
  },
  famachaSpectrumLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  famachaSpectrumLeft: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
  },
  famachaSpectrumRight: {
    fontSize: 11,
    fontWeight: '700',
    color: '#DC2626',
  },

  // Tech Specs Accordion Toggle with Vector Sliders Icon
  techToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 4,
    marginBottom: 8,
  },
  techToggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  techToggleText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#334155',
  },
  techDetailsWrap: {
    marginBottom: 12,
  },
  aiStageCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  aiStageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  aiStageTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#475569',
    letterSpacing: 0.6,
  },
  aiStageConfidence: {
    fontSize: 12,
    fontWeight: '800',
    color: '#10B981',
  },
  aiStageDesc: {
    fontSize: 13,
    lineHeight: 18,
    color: '#334155',
    fontWeight: '500',
    marginBottom: 8,
  },
  probRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    gap: 8,
  },
  probItem: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  probLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  probVal: {
    fontSize: 14,
    fontWeight: '800',
    marginTop: 2,
  },

  // Modal Action Buttons
  modalActionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  modalPrimaryAction: {
    flex: 1.3,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#10B981',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  modalPrimaryActionText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  modalSecondaryAction: {
    flex: 0.9,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalSecondaryActionText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
  },
});
