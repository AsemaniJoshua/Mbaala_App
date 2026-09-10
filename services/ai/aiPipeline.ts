/**
 * Unified 2-Stage AI Inference Pipeline for Mbaala App
 * Stage 1: Animal Eye Finder (YOLOv8n) -> Extracts eyelid coordinates with 15% padding
 * Stage 2: Goat Anemia Color Judge (MobileNetV3) -> Classifies mucosa redness and grades FAMACHA
 */

import { runEyeFinderModel } from './eyeFinderModel';
import { runFamachaJudgeModel } from './famachaJudgeModel';
import { checkNativeOrtSupport } from './onnxModelLoader';
import { TwoStageInferenceResult } from './types';

export type PipelineStage = 'idle' | 'finding_eye' | 'judging_mucosa' | 'complete';

export interface PipelineProgressCallback {
  (stage: PipelineStage): void;
}

/**
 * Runs the complete two-stage AI pipeline on captured livestock eye
 */
export const runTwoStageInference = async (
  imageUri: string = '',
  animalBreed: 'Goat' | 'Sheep' = 'Goat',
  languageId: 'en' | 'dag' | 'hau' | 'gur' = 'en',
  animalTag: string = '#043',
  onProgress?: PipelineProgressCallback
): Promise<TwoStageInferenceResult> => {
  const pipelineStart = Date.now();

  // Stage 1: Run Model 1 (Animal Eye Finder YOLOv8n)
  onProgress?.('finding_eye');
  const finderResult = await runEyeFinderModel(imageUri);

  // Stage 2: Run Model 2 (FAMACHA Color Judge MobileNetV3) on the 15% padded eyelid crop
  onProgress?.('judging_mucosa');
  const judgeResult = await runFamachaJudgeModel(finderResult.paddedCropBox, languageId);

  onProgress?.('complete');

  const isNative = await checkNativeOrtSupport();
  const totalDurationMs = Date.now() - pipelineStart;

  const result: TwoStageInferenceResult = {
    id: `scan_${Date.now()}`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    animalBreed,
    animalTag,
    finder: finderResult,
    judge: judgeResult,
    totalDurationMs,
    runtimeEngine: isNative ? 'native-onnx' : 'adaptive-pipeline',
  };

  return result;
};
