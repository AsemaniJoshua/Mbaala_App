import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LanguageOption, SUPPORTED_LANGUAGES } from '@/constants/languages';

export interface ScanRecord {
  id: string;
  tag: string;
  animal: 'Goat' | 'Sheep';
  status: 'Healthy' | 'Warning' | 'Critical';
  statusColor: string;
  statusBg: string;
  statusLabel: string;
  timeAgo: string;
  speechText: string;
  famachaScore?: 1 | 2 | 3 | 4 | 5;
  confidence?: number;
  timestamp?: number;
}

const STORAGE_KEY_RECORDS = '@mbaala_flock_records_v1';
const STORAGE_KEY_TAG_COUNTER = '@mbaala_tag_counter_v1';
const STORAGE_KEY_LANGUAGE = '@mbaala_selected_language_v1';
const STORAGE_KEY_ONBOARDING = '@mbaala_onboarding_completed_v1';

const INITIAL_RECORDS: ScanRecord[] = [
  {
    id: '1',
    tag: '#001',
    animal: 'Goat',
    status: 'Healthy',
    statusColor: '#10B981',
    statusBg: '#ECFDF5',
    statusLabel: 'Healthy • Kpɛŋ',
    timeAgo: '15m ago',
    speechText: 'Tag 001 is healthy. Eye mucosa is bright pink.',
    famachaScore: 1,
    confidence: 0.94,
    timestamp: Date.now() - 15 * 60 * 1000,
  },
  {
    id: '2',
    tag: '#002',
    animal: 'Sheep',
    status: 'Healthy',
    statusColor: '#10B981',
    statusBg: '#ECFDF5',
    statusLabel: 'Healthy • Lafiya',
    timeAgo: '42m ago',
    speechText: 'Tag 002 is healthy. No deworming needed.',
    famachaScore: 2,
    confidence: 0.91,
    timestamp: Date.now() - 42 * 60 * 1000,
  },
  {
    id: '3',
    tag: '#003',
    animal: 'Goat',
    status: 'Warning',
    statusColor: '#F59E0B',
    statusBg: '#FEF3C7',
    statusLabel: 'Borderline • Gbalagba',
    timeAgo: '2h ago',
    speechText: 'Tag 003 is borderline. Monitor closely and re-check in two weeks.',
    famachaScore: 3,
    confidence: 0.82,
    timestamp: Date.now() - 2 * 60 * 60 * 1000,
  },
  {
    id: '4',
    tag: '#004',
    animal: 'Sheep',
    status: 'Critical',
    statusColor: '#EF4444',
    statusBg: '#FEE2E2',
    statusLabel: 'Severe Anemia • Dorro',
    timeAgo: 'Yesterday',
    speechText: 'Tag 004 has severe blood worms. Administer dewormer immediately.',
    famachaScore: 5,
    confidence: 0.88,
    timestamp: Date.now() - 24 * 60 * 60 * 1000,
  },
];

interface AppContextType {
  selectedLanguage: LanguageOption;
  setSelectedLanguage: (lang: LanguageOption) => void;
  hasCompletedOnboarding: boolean;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
  scanRecords: ScanRecord[];
  isLoadingRecords: boolean;
  addScanRecord: (record: ScanRecord) => Promise<void>;
  deleteScanRecord: (id: string) => Promise<void>;
  clearAllScanRecords: () => Promise<void>;
  getNextTagNumber: (animal: 'Goat' | 'Sheep') => Promise<string>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedLanguage, setSelectedLanguageState] = useState<LanguageOption>(SUPPORTED_LANGUAGES[0]);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean>(false);
  const [scanRecords, setScanRecords] = useState<ScanRecord[]>(INITIAL_RECORDS);
  const [tagCounter, setTagCounter] = useState<number>(4);
  const [isLoadingRecords, setIsLoadingRecords] = useState<boolean>(true);

  // Load persistent state on startup
  useEffect(() => {
    const hydrateStorage = async () => {
      try {
        const [savedRecords, savedCounter, savedLanguage, savedOnboarding] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEY_RECORDS),
          AsyncStorage.getItem(STORAGE_KEY_TAG_COUNTER),
          AsyncStorage.getItem(STORAGE_KEY_LANGUAGE),
          AsyncStorage.getItem(STORAGE_KEY_ONBOARDING),
        ]);

        // 1. Records
        if (savedRecords !== null) {
          try {
            const parsed = JSON.parse(savedRecords);
            if (Array.isArray(parsed)) {
              setScanRecords(parsed);
            }
          } catch (err) {
            console.warn('[Mbaala Storage] Error parsing saved records:', err);
          }
        } else {
          // Initialize with default records
          await AsyncStorage.setItem(STORAGE_KEY_RECORDS, JSON.stringify(INITIAL_RECORDS));
        }

        // 2. Tag Counter
        if (savedCounter !== null) {
          const num = parseInt(savedCounter, 10);
          if (!isNaN(num)) {
            setTagCounter(num);
          }
        } else {
          await AsyncStorage.setItem(STORAGE_KEY_TAG_COUNTER, '4');
        }

        // 3. Language
        if (savedLanguage !== null) {
          const matchedLang = SUPPORTED_LANGUAGES.find((l) => l.id === savedLanguage);
          if (matchedLang) {
            setSelectedLanguageState(matchedLang);
          }
        }

        // 4. Onboarding
        if (savedOnboarding === 'true') {
          setHasCompletedOnboarding(true);
        }
      } catch (err) {
        console.error('[Mbaala Storage] Hydration failed:', err);
      } finally {
        setIsLoadingRecords(false);
      }
    };

    hydrateStorage();
  }, []);

  const setSelectedLanguage = (lang: LanguageOption) => {
    setSelectedLanguageState(lang);
    AsyncStorage.setItem(STORAGE_KEY_LANGUAGE, lang.id).catch((err) =>
      console.warn('[Mbaala Storage] Language save failed:', err)
    );
  };

  const completeOnboarding = () => {
    setHasCompletedOnboarding(true);
    AsyncStorage.setItem(STORAGE_KEY_ONBOARDING, 'true').catch((err) =>
      console.warn('[Mbaala Storage] Onboarding save failed:', err)
    );
  };

  const resetOnboarding = () => {
    setHasCompletedOnboarding(false);
    AsyncStorage.removeItem(STORAGE_KEY_ONBOARDING).catch((err) =>
      console.warn('[Mbaala Storage] Reset onboarding failed:', err)
    );
  };

  // Add a new scan record with persistence
  const addScanRecord = async (record: ScanRecord) => {
    const recordWithTimestamp: ScanRecord = {
      ...record,
      timestamp: record.timestamp || Date.now(),
    };
    setScanRecords((prev) => {
      const updated = [recordWithTimestamp, ...prev];
      AsyncStorage.setItem(STORAGE_KEY_RECORDS, JSON.stringify(updated)).catch((err) =>
        console.error('[Mbaala Storage] Failed to persist new scan record:', err)
      );
      return updated;
    });
  };

  // Delete an individual record by ID
  const deleteScanRecord = async (id: string) => {
    setScanRecords((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      AsyncStorage.setItem(STORAGE_KEY_RECORDS, JSON.stringify(updated)).catch((err) =>
        console.error('[Mbaala Storage] Failed to persist after deletion:', err)
      );
      return updated;
    });
  };

  // Clear all records from state and phone storage
  const clearAllScanRecords = async () => {
    setScanRecords([]);
    try {
      await AsyncStorage.setItem(STORAGE_KEY_RECORDS, JSON.stringify([]));
    } catch (err) {
      console.error('[Mbaala Storage] Failed to clear records in storage:', err);
    }
  };

  // Generate consistent sequential tag numbering (e.g. #005, #006, etc.)
  const getNextTagNumber = async (_animal: 'Goat' | 'Sheep'): Promise<string> => {
    const nextNum = tagCounter + 1;
    setTagCounter(nextNum);
    try {
      await AsyncStorage.setItem(STORAGE_KEY_TAG_COUNTER, String(nextNum));
    } catch (err) {
      console.warn('[Mbaala Storage] Failed to persist tag counter:', err);
    }
    return `#${String(nextNum).padStart(3, '0')}`;
  };

  return (
    <AppContext.Provider
      value={{
        selectedLanguage,
        setSelectedLanguage,
        hasCompletedOnboarding,
        completeOnboarding,
        resetOnboarding,
        scanRecords,
        isLoadingRecords,
        addScanRecord,
        deleteScanRecord,
        clearAllScanRecords,
        getNextTagNumber,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
