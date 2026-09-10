import React, { useState } from 'react';
import {
  Modal,
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

import { LanguageOption } from '@/constants/languages';

interface FamachaReferenceModalProps {
  visible: boolean;
  selectedLanguage: LanguageOption;
  selectedAnimal: 'Goat' | 'Sheep';
  onClose: () => void;
}

interface FamachaReferenceGrade {
  grade: 1 | 2 | 3 | 4 | 5;
  color: string;
  badgeBg: string;
  classification: 'Green_Healthy' | 'Yellow_Borderline' | 'Red_Severe';
  headline: Record<string, string>;
  actionText: Record<string, string>;
  speech: Record<string, string>;
}

const FAMACHA_GRADES: FamachaReferenceGrade[] = [
  {
    grade: 1,
    color: '#10B981',
    badgeBg: '#ECFDF5',
    classification: 'Green_Healthy',
    headline: {
      dag: 'A BIŊ MAA KPƐŊ VIƐNYƐLA',
      hau: 'DABBARKA TANA DA LAFIYA',
      gur: 'DOO LA DE LAFIYA',
      en: 'OPTIMAL • DEEP RED BLOOD',
    },
    actionText: {
      dag: 'Nini ʒee kpeeni. A biŋ maa kpiŋ viɛnyɛla, tim shɛli bi bɔra zuŋɔ.',
      hau: 'Fatar ido tana da ja sosai. Dabba tana da lafiya, babu bukatar magani a yau.',
      gur: "Nini zɛ'a kpeeni. Doo la de lafiya, tima bi bɔra zuo.",
      en: 'Optimal blood volume. Mucous membrane is deep red. No dewormer needed.',
    },
    speech: {
      dag: 'A biŋ maa kpiŋ viɛnyɛla. Tim shɛli bi bɔra zuŋɔ.',
      hau: 'Dabbarka tana da lafiya kalau. Babu buƙatar magani a yau.',
      gur: 'Doo la de lafiya kpeeni. Tima bi bɔra zuo.',
      en: 'Your animal has healthy blood volume. No medicine is needed today.',
    },
  },
  {
    grade: 2,
    color: '#10B981',
    badgeBg: '#ECFDF5',
    classification: 'Green_Healthy',
    headline: {
      dag: 'LAFIYA BƆNA ME • ƷEE',
      hau: 'LAFIYA • JINI MAI KYAU',
      gur: 'LAFIYA • DE LAFIYA',
      en: 'ACCEPTABLE • RED-PINK',
    },
    actionText: {
      dag: 'Ʒee-pieligu. Biŋ maa lafiya viɛnyɛla, che ka o chaŋ kuuni.',
      hau: 'Fatar ido tana da ja da fari kadan. Tana da jini mai kyau.',
      gur: "Zɛ'a-pɛɛlɛŋa. Lafiya bɔna me, chee ka o chaŋ moori.",
      en: 'Acceptable red-pink mucosa. Good animal vigor. No deworming needed.',
    },
    speech: {
      dag: 'Biŋ maa lafiya viɛnyɛla. Che ka o chaŋ kuuni.',
      hau: 'Tana da jini mai kyau. Babu buƙatar magani.',
      gur: 'Lafiya bɔna me. Chee ka o chaŋ moori.',
      en: 'Good health status. No deworming is required.',
    },
  },
  {
    grade: 3,
    color: '#F59E0B',
    badgeBg: '#FFFBEB',
    classification: 'Yellow_Borderline',
    headline: {
      dag: 'GBALAGBA • GULSI NYAHI',
      hau: 'GARGADI • KULA DA DABBA',
      gur: 'ZƐƔA • GULƐ TIŊA',
      en: 'BORDERLINE • MONITOR CLOSELY',
    },
    actionText: {
      dag: 'Gbalagba. Gulsi nyahi ka zahim yaha bakoi ayi sunsuuni.',
      hau: 'Fatar ido ta fara kodewa. Kula da dabba, a sake dubawa bayan mako biyu.',
      gur: 'Zɛɣa. Gulɛ tiŋa ka le zahisi yɛ bakoi ayi poan.',
      en: 'Mild worm pallor detected. Monitor body condition and re-check in two weeks.',
    },
    speech: {
      dag: 'Gbalagba. Gulsi nyahi ka zahim yaha bakoi ayi sunsuuni.',
      hau: 'Kula da dabba. A sake dubawa bayan mako biyu.',
      gur: 'Gulɛ tiŋa ka le zahisi yɛ bakoi ayi poan.',
      en: 'Borderline pallor detected. Monitor closely and re-check in two weeks.',
    },
  },
  {
    grade: 4,
    color: '#EF4444',
    badgeBg: '#FEF2F2',
    classification: 'Red_Severe',
    headline: {
      dag: 'DORRO KPEENI • TIM BƆRA',
      hau: 'CIWO MAI TSANANI • MAGANI',
      gur: 'BAAŊA KPEENI • TIMA BƆRA',
      en: 'DANGEROUS ANEMIA • DEWORM',
    },
    actionText: {
      dag: 'Kɔŋsim kpeeni. Barber pole worms nyuri ʒim. Ti tim ni yomyom.',
      hau: 'Fatar ido ta yi fari sosai. Tsutsotsi suna shan jini, a ba da magani yau.',
      gur: 'Baaŋa paɛ me. Ziim la kɔŋe me, ti tima yom-yom.',
      en: 'High parasite burden. Mucosa is pale pink. Drench with anthelmintic dewormer today.',
    },
    speech: {
      dag: 'Kɔŋsim kpeeni. Ti tim ni yomyom domin kpiŋ maa gbaaya.',
      hau: 'Karancin jini mai tsanani. A ba da maganin tsutsotsi yau.',
      gur: 'Baaŋa paɛ me. Ti tima yom-yom.',
      en: 'High parasite load detected. Administer anthelmintic medicine today.',
    },
  },
  {
    grade: 5,
    color: '#EF4444',
    badgeBg: '#FEF2F2',
    classification: 'Red_Severe',
    headline: {
      dag: 'PIELIGU ZAƔALA • TILGI O',
      hau: 'CIWO MAI TSANANI SOSAI',
      gur: 'PƐƐLƐŊA KPEENI • BAAŊA',
      en: 'FATAL ANEMIA • CRITICAL ALERT',
    },
    actionText: {
      dag: 'Nini pieligu zaɣala. Dorro kpeeni. Ti tim n-tilgi o nyɛvuli yomyom!',
      hau: 'Fatar ido ta yi fari fat. Jini ya kare kusan duka. A ba da magani nan da nan!',
      gur: 'Nini pɛɛlɛŋa kpeeni. Ti tima bala bala n tilge doo la!',
      en: 'White mucosa. Severe blood exhaustion. Deworm immediately to prevent death.',
    },
    speech: {
      dag: 'Dorro kpeeni. Ti tim n-tilgi o nyɛvuli yomyom!',
      hau: 'Ciwo mai tsanani sosai. A ba da magani nan da nan!',
      gur: 'Baaŋa kpeeni. Ti tima bala bala n tilge doo la!',
      en: 'Critical emergency. Treat immediately to prevent animal death.',
    },
  },
];

export const FamachaReferenceModal: React.FC<FamachaReferenceModalProps> = ({
  visible,
  selectedLanguage,
  selectedAnimal,
  onClose,
}) => {
  const [activeGradeNum, setActiveGradeNum] = useState<1 | 2 | 3 | 4 | 5>(1);

  const activeGrade = FAMACHA_GRADES.find((g) => g.grade === activeGradeNum) || FAMACHA_GRADES[0];
  const langKey = selectedLanguage.id in activeGrade.headline ? selectedLanguage.id : 'en';

  const handleSelectGrade = (grade: 1 | 2 | 3 | 4 | 5) => {
    setActiveGradeNum(grade);
    if (Platform.OS !== 'web') {
      try {
        Haptics.selectionAsync();
      } catch {}
    }
    const target = FAMACHA_GRADES.find((g) => g.grade === grade);
    if (target) {
      try {
        Speech.stop();
        Speech.speak(target.speech[langKey] || target.speech.en, {
          language: selectedLanguage.speechCode,
          pitch: 1.0,
          rate: 0.92,
        });
      } catch {}
    }
  };

  const handlePlayVoice = () => {
    if (Platform.OS !== 'web') {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      } catch {}
    }
    try {
      Speech.stop();
      Speech.speak(activeGrade.speech[langKey] || activeGrade.speech.en, {
        language: selectedLanguage.speechCode,
        pitch: 1.0,
        rate: 0.92,
      });
    } catch {}
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalBackdrop}>
        {/* Clickable Backdrop to close */}
        <TouchableOpacity
          style={StyleSheet.absoluteFillObject}
          activeOpacity={1}
          onPress={onClose}
        />

        {/* Bottom Sheet Card with the Exact Clean Style as the Result Sheet */}
        <View style={styles.modalCard}>
          <View style={styles.dragArea}>
            <View style={styles.modalDragHandle} />
          </View>

          {/* Header Row */}
          <View style={styles.modalHeaderRow}>
            <View style={styles.headerPill}>
              <Text style={styles.headerEmoji}>{selectedAnimal === 'Goat' ? '🐐' : '🐑'}</Text>
              <Text style={styles.headerTitle}>FAMACHA© Reference Scale</Text>
            </View>

            <TouchableOpacity
              onPress={onClose}
              hitSlop={{ top: 14, bottom: 14, left: 14, right: 14 }}
              style={styles.closeModalCircle}
              accessibilityRole="button"
              accessibilityLabel="Close reference guide"
            >
              <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                <Path d="M18 6L6 18M6 6L18 18" stroke="#64748B" strokeWidth="2.4" strokeLinecap="round" />
              </Svg>
            </TouchableOpacity>
          </View>

          <ScrollView style={{ maxHeight: 520 }} showsVerticalScrollIndicator={false}>
            {/* 1. Large High-Contrast Hero Status Banner (Identical in Style to Results Sheet) */}
            <View
              style={[
                styles.heroDiagnosisCard,
                {
                  backgroundColor: activeGrade.badgeBg,
                  borderColor: activeGrade.color,
                },
              ]}
            >
              <View
                style={[
                  styles.heroIconCircle,
                  { backgroundColor: activeGrade.color },
                ]}
              >
                {activeGrade.classification === 'Green_Healthy' ? (
                  <Svg width={30} height={30} viewBox="0 0 24 24" fill="none">
                    <Path
                      d="M5 13L9 17L19 7"
                      stroke="#FFFFFF"
                      strokeWidth="3.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </Svg>
                ) : activeGrade.classification === 'Yellow_Borderline' ? (
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
                <Text style={[styles.heroStatusTitle, { color: activeGrade.color }]}>
                  {activeGrade.headline[langKey] || activeGrade.headline.en}
                </Text>
                <Text style={styles.heroStatusSubtitle}>
                  FAMACHA Grade {activeGrade.grade} of 5
                </Text>
              </View>
            </View>

            {/* 2. Interactive FAMACHA 5-Color Comparison Bar with Needle Pointer */}
            <View style={styles.famachaVisualStripCard}>
              <View style={styles.famachaVisualHeader}>
                <Text style={styles.famachaVisualTitle}>Tap Any Color Swatch to Inspect</Text>
                <Text style={[styles.famachaVisualScore, { color: activeGrade.color }]}>
                  Grade {activeGrade.grade}
                </Text>
              </View>

              {/* 5 Interactive Color Segments */}
              <View style={styles.famachaColorBar}>
                {([1, 2, 3, 4, 5] as const).map((gradeNum) => {
                  const colors = ['#DC2626', '#EA580C', '#F59E0B', '#F87171', '#F1F5F9'];
                  const isSelected = activeGradeNum === gradeNum;
                  return (
                    <TouchableOpacity
                      key={gradeNum}
                      activeOpacity={0.8}
                      onPress={() => handleSelectGrade(gradeNum)}
                      style={[
                        styles.famachaSegment,
                        { backgroundColor: colors[gradeNum - 1] },
                        isSelected && styles.famachaSegmentActive,
                      ]}
                    />
                  );
                })}
              </View>

              {/* Needle Indicator Row */}
              <View style={styles.famachaPointerRow}>
                {([1, 2, 3, 4, 5] as const).map((gradeNum) => (
                  <TouchableOpacity
                    key={gradeNum}
                    onPress={() => handleSelectGrade(gradeNum)}
                    style={styles.famachaPointerCol}
                  >
                    {activeGradeNum === gradeNum ? (
                      <View style={styles.activePointerBadge}>
                        <Text style={styles.activePointerArrow}>▲</Text>
                        <Text style={styles.activePointerText}>Grade {gradeNum}</Text>
                      </View>
                    ) : (
                      <Text style={styles.inactivePointerText}>{gradeNum}</Text>
                    )}
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.famachaSpectrumLabels}>
                <Text style={styles.famachaSpectrumLeft}>✓ Healthy (Deep Red)</Text>
                <Text style={styles.famachaSpectrumRight}>🚨 Critical (White)</Text>
              </View>
            </View>

            {/* 3. Large Dialect Audio Pill */}
            <TouchableOpacity
              activeOpacity={0.82}
              onPress={handlePlayVoice}
              style={[
                styles.largeAudioDiagnosisPill,
                { borderColor: activeGrade.color },
              ]}
            >
              <View
                style={[
                  styles.audioSpeakerCircle,
                  { backgroundColor: activeGrade.color },
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
                <Text style={[styles.largeAudioTitle, { color: activeGrade.color }]}>
                  🔊 {selectedLanguage.name} Clinical Voice (Tap to Hear):
                </Text>
                <Text style={styles.largeAudioSpeechText}>
                  {`"${activeGrade.actionText[langKey] || activeGrade.actionText.en}"`}
                </Text>
              </View>
            </TouchableOpacity>
          </ScrollView>

          {/* Clean Action Button */}
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
              <Text style={styles.modalPrimaryActionText}>Back to Scanner</Text>
            </TouchableOpacity>
          </View>
        </View>
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
  headerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
  },
  headerEmoji: {
    fontSize: 18,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.2,
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
    fontSize: 17,
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
    height: 22,
    borderRadius: 11,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  famachaSegment: {
    flex: 1,
  },
  famachaSegmentActive: {
    borderWidth: 2,
    borderColor: '#0F172A',
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

  // Action Button
  modalActionsRow: {
    marginTop: 6,
  },
  modalPrimaryAction: {
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
});
