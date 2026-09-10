import React, { createContext, useContext, useState } from 'react';
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
}

const INITIAL_RECORDS: ScanRecord[] = [
  {
    id: '1',
    tag: '#042',
    animal: 'Goat',
    status: 'Healthy',
    statusColor: '#10B981',
    statusBg: '#ECFDF5',
    statusLabel: 'Healthy • Kpɛŋ',
    timeAgo: '15m ago',
    speechText: 'Tag 042 is healthy. Eye mucosa is bright pink.',
    famachaScore: 1,
    confidence: 0.94,
  },
  {
    id: '2',
    tag: '#089',
    animal: 'Sheep',
    status: 'Healthy',
    statusColor: '#10B981',
    statusBg: '#ECFDF5',
    statusLabel: 'Healthy • Lafiya',
    timeAgo: '42m ago',
    speechText: 'Tag 089 is healthy. No deworming needed.',
    famachaScore: 2,
    confidence: 0.91,
  },
  {
    id: '3',
    tag: '#017',
    animal: 'Goat',
    status: 'Warning',
    statusColor: '#F59E0B',
    statusBg: '#FEF3C7',
    statusLabel: 'Borderline • Gbalagba',
    timeAgo: '2h ago',
    speechText: 'Tag 017 is borderline. Monitor closely and re-check in two weeks.',
    famachaScore: 3,
    confidence: 0.82,
  },
  {
    id: '4',
    tag: '#105',
    animal: 'Sheep',
    status: 'Critical',
    statusColor: '#EF4444',
    statusBg: '#FEE2E2',
    statusLabel: 'Severe Anemia • Dorro',
    timeAgo: 'Yesterday',
    speechText: 'Tag 105 has severe blood worms. Administer dewormer immediately.',
    famachaScore: 5,
    confidence: 0.88,
  },
];

interface AppContextType {
  selectedLanguage: LanguageOption;
  setSelectedLanguage: (lang: LanguageOption) => void;
  hasCompletedOnboarding: boolean;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
  scanRecords: ScanRecord[];
  addScanRecord: (record: ScanRecord) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageOption>(SUPPORTED_LANGUAGES[0]);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean>(false);
  const [scanRecords, setScanRecords] = useState<ScanRecord[]>(INITIAL_RECORDS);

  const completeOnboarding = () => {
    setHasCompletedOnboarding(true);
  };

  const resetOnboarding = () => {
    setHasCompletedOnboarding(false);
  };

  const addScanRecord = (record: ScanRecord) => {
    setScanRecords((prev) => [record, ...prev]);
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
        addScanRecord,
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
