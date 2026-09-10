import React from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import { ScanRecord } from '@/context/AppContext';

interface DeleteConfirmModalProps {
  visible: boolean;
  mode: 'single' | 'all';
  targetRecord?: ScanRecord | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  visible,
  mode,
  targetRecord,
  onConfirm,
  onCancel,
}) => {
  const isSingle = mode === 'single';

  const handleConfirmPress = () => {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    } catch {}
    onConfirm();
  };

  const handleCancelPress = () => {
    try {
      Haptics.selectionAsync();
    } catch {}
    onCancel();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.backdrop}>
        {/* Backdrop Tap */}
        <TouchableOpacity
          style={StyleSheet.absoluteFillObject}
          activeOpacity={1}
          onPress={onCancel}
        />

        {/* Modal Sheet Card */}
        <View style={styles.modalCard}>
          <View style={styles.dragHandle} />

          {/* Warning Icon Circle */}
          <View style={styles.warningCircle}>
            <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
              <Path
                d="M3 6H5H21M19 6V20C19 21.1046 18.1046 22 17 22H7C5.89543 22 5 21.1046 5 20V6M8 6V4C8 2.89543 8.89543 2 10 2H14C15.1046 2 16 2.89543 16 4V6M10 11V17M14 11V17"
                stroke="#EF4444"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </View>

          {/* Title & Description */}
          <Text style={styles.title}>
            {isSingle
              ? `Delete ${targetRecord ? `${targetRecord.animal} ${targetRecord.tag}` : 'Record'}?`
              : 'Clear All Flock Records?'}
          </Text>

          <Text style={styles.description}>
            {isSingle
              ? 'This action will permanently delete this inspection record from your phone storage.'
              : 'Are you sure you want to delete all flock history from your device? This action is permanent and cannot be undone.'}
          </Text>

          {/* Action Buttons */}
          <View style={styles.actionsRow}>
            {/* Cancel */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleCancelPress}
              style={styles.cancelButton}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            {/* Confirm Delete */}
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleConfirmPress}
              style={styles.confirmButton}
            >
              <Text style={styles.confirmButtonText}>
                {isSingle ? 'Delete Record' : 'Clear All'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 36,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 20,
  },
  dragHandle: {
    width: 44,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#CBD5E1',
    marginBottom: 20,
  },
  warningCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FEF2F2',
    borderWidth: 1.5,
    borderColor: '#FCA5A5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.3,
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: '#64748B',
    textAlign: 'center',
    fontWeight: '500',
    marginBottom: 24,
    paddingHorizontal: 10,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#475569',
  },
  confirmButton: {
    flex: 1.2,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  confirmButtonText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
