/**
 * Model Loader & Session Manager for ONNX Runtime in Mbaala App
 * Manages Model 1 (Animal Eye Finder YOLO) and Model 2 (FAMACHA Color Judge MobileNet)
 */

import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system/legacy';

// Safe dynamic import of onnxruntime-react-native to prevent hard crash if running in Expo Go
let ort: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  ort = require('onnxruntime-react-native');
} catch {
  ort = null;
}

export interface ModelSessions {
  finderSession: any | null;
  judgeSession: any | null;
  nativeAvailable: boolean;
  isLoaded: boolean;
}

let finderSessionCache: any | null = null;
let judgeSessionCache: any | null = null;
let isNativeSupported: boolean | null = null;
let isModelsLoaded = false;

/**
 * Checks if native ONNX Runtime C++ bindings are operational in current environment
 */
export const checkNativeOrtSupport = async (): Promise<boolean> => {
  if (isNativeSupported !== null) return isNativeSupported;
  if (!ort || !ort.InferenceSession) {
    isNativeSupported = false;
    return false;
  }

  try {
    // Check if JSI / C++ bridge is alive
    if (typeof ort.InferenceSession.create !== 'function') {
      isNativeSupported = false;
      return false;
    }
    isNativeSupported = true;
    return true;
  } catch {
    isNativeSupported = false;
    return false;
  }
};

/**
 * Copies bundled model assets to a persistent writable directory where ONNX Runtime
 * can locate relative external data files (like judge_mobilenet.onnx.data)
 */
export const prepareModelFiles = async (): Promise<{
  finderPath: string | null;
  judgePath: string | null;
}> => {
  try {
    const docDir = FileSystem.documentDirectory || FileSystem.cacheDirectory;
    if (!docDir) return { finderPath: null, judgePath: null };

    const modelsDir = `${docDir}mobile_models/`;
    const dirInfo = await FileSystem.getInfoAsync(modelsDir);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(modelsDir, { intermediates: true });
    }

    const finderDest = `${modelsDir}finder_yolo.onnx`;
    const judgeDest = `${modelsDir}judge_mobilenet.onnx`;
    const judgeDataDest = `${modelsDir}judge_mobilenet.onnx.data`;

    // 1. Resolve and copy Finder YOLO
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const finderAsset = Asset.fromModule(require('@/assets/mobile_models/finder_yolo.onnx'));
    await finderAsset.downloadAsync();
    if (finderAsset.localUri) {
      const finderInfo = await FileSystem.getInfoAsync(finderDest);
      if (!finderInfo.exists) {
        await FileSystem.copyAsync({ from: finderAsset.localUri, to: finderDest });
      }
    }

    // 2. Resolve and copy Judge MobileNet and external .data weights together
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const judgeAsset = Asset.fromModule(require('@/assets/mobile_models/judge_mobilenet.onnx'));
    await judgeAsset.downloadAsync();
    if (judgeAsset.localUri) {
      const judgeInfo = await FileSystem.getInfoAsync(judgeDest);
      if (!judgeInfo.exists) {
        await FileSystem.copyAsync({ from: judgeAsset.localUri, to: judgeDest });
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const judgeDataAsset = Asset.fromModule(require('@/assets/mobile_models/judge_mobilenet.onnx.data'));
    await judgeDataAsset.downloadAsync();
    if (judgeDataAsset.localUri) {
      const judgeDataInfo = await FileSystem.getInfoAsync(judgeDataDest);
      if (!judgeDataInfo.exists) {
        await FileSystem.copyAsync({ from: judgeDataAsset.localUri, to: judgeDataDest });
      }
    }

    return {
      finderPath: finderDest,
      judgePath: judgeDest,
    };
  } catch {
    return { finderPath: null, judgePath: null };
  }
};

/**
 * Initializes and caches ONNX inference sessions for both models
 */
export const loadAllAiModels = async (): Promise<ModelSessions> => {
  if (isModelsLoaded) {
    return {
      finderSession: finderSessionCache,
      judgeSession: judgeSessionCache,
      nativeAvailable: !!isNativeSupported,
      isLoaded: true,
    };
  }

  const nativeOk = await checkNativeOrtSupport();

  if (nativeOk) {
    try {
      const { finderPath, judgePath } = await prepareModelFiles();

      if (finderPath && judgePath) {
        finderSessionCache = await ort.InferenceSession.create(finderPath);
        judgeSessionCache = await ort.InferenceSession.create(judgePath);
        isModelsLoaded = true;
        return {
          finderSession: finderSessionCache,
          judgeSession: judgeSessionCache,
          nativeAvailable: true,
          isLoaded: true,
        };
      }
    } catch {
      // Fallback if session creation fails in standard Expo Go
      isNativeSupported = false;
    }
  }

  // Graceful fallback mode for Expo Go / Web
  isModelsLoaded = true;
  return {
    finderSession: null,
    judgeSession: null,
    nativeAvailable: false,
    isLoaded: true,
  };
};

export const getOrtInstance = () => ort;
