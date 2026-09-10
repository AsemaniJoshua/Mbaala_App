import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Speech from 'expo-speech';
import Svg, { Circle, Path } from 'react-native-svg';

interface CameraPermissionCardProps {
  onRequestPermission: () => void;
  selectedLanguageCode?: string;
  selectedLanguageGreeting?: string;
}

export const CameraPermissionCard: React.FC<CameraPermissionCardProps> = ({
  onRequestPermission,
  selectedLanguageCode = 'en-US',
  selectedLanguageGreeting = 'Mbaala needs camera access to inspect your animal for anemia. Tap to enable.',
}) => {
  const speakPermissionPrompt = () => {
    try {
      Speech.stop();
      Speech.speak(selectedLanguageGreeting, {
        language: selectedLanguageCode,
        pitch: 1.0,
        rate: 0.92,
      });
    } catch {
      // Fallback
    }
  };

  return (
    <View style={styles.card}>
      {/* Visual Camera Orb */}
      <View style={styles.iconOrb}>
        <Svg width={44} height={44} viewBox="0 0 24 24" fill="none">
          <Path
            d="M4 8C4 6.89543 4.89543 6 6 6H7.58579C8.11622 6 8.62493 5.78929 9 5.41421L9.58579 4.82843C9.96086 4.45336 10.4696 4.24264 11 4.24264H13C13.5304 4.24264 14.0391 4.45336 14.4142 4.82843L15 5.41421C15.3751 5.78929 15.8838 6 16.4142 6H18C19.1046 6 20 6.89543 20 8V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V8Z"
            fill="#10B981"
          />
          <Circle cx="12" cy="13" r="3.5" stroke="#FFFFFF" strokeWidth="2" fill="#10B981" />
        </Svg>
      </View>

      <Text style={styles.title}>Camera Access Needed</Text>
      <Text style={styles.description}>
        Mbaala needs camera access to inspect your livestock{"'"}s inner eyelid for anemia.
      </Text>

      {/* Spoken Guidance Button */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={speakPermissionPrompt}
        style={styles.audioPrompt}
        accessibilityRole="button"
        accessibilityLabel="Listen to permission explanation"
      >
        <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
          <Path d="M11 5L6 9H2V15H6L11 19V5Z" fill="#047857" />
          <Path d="M15.54 8.46C16.5 9.42 17 10.7 17 12C17 13.3 16.5 14.58 15.54 15.54" stroke="#047857" strokeWidth="2" strokeLinecap="round" />
        </Svg>
        <Text style={styles.audioPromptText}>Tap to hear explanation</Text>
      </TouchableOpacity>

      {/* Solid Enable Button */}
      <TouchableOpacity
        activeOpacity={0.88}
        onPress={onRequestPermission}
        style={styles.enableButton}
        accessibilityRole="button"
      >
        <Text style={styles.enableButtonText}>Enable Camera</Text>
        {/* Full Solid Arrow */}
        <Svg width={20} height={20} viewBox="0 0 24 24" fill="#FFFFFF">
          <Path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
        </Svg>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    marginHorizontal: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  iconOrb: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.4,
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 16,
  },
  audioPrompt: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    marginBottom: 20,
    gap: 6,
  },
  audioPromptText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#047857',
  },
  enableButton: {
    width: '100%',
    height: 54,
    borderRadius: 27,
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
  enableButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
});
