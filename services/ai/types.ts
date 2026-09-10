/**
 * Type definitions for Mbaala 2-stage AI Pipeline
 * Model 1: Animal Eye Finder (YOLOv8n)
 * Model 2: Goat Anemia Color Judge (MobileNetV3-Small)
 */

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface EyeDetectionResult {
  /** Raw eye bounding box in normalized [0..1] coordinates */
  box: BoundingBox;
  /** Bounding box with 15% padding applied for eyelid extraction */
  paddedCropBox: BoundingBox;
  /** Detection confidence score (0.0 - 1.0) */
  confidence: number;
  /** Class label detected (always 'eye') */
  label: 'eye';
  /** Model inference duration in milliseconds */
  inferenceTimeMs: number;
}

export type FamachaClassification = 'Green_Healthy' | 'Yellow_Borderline' | 'Red_Severe';

export interface FamachaJudgeResult {
  /** Winning classification */
  classification: FamachaClassification;
  /** Estimated FAMACHA 1-5 clinical score */
  famachaScore: 1 | 2 | 3 | 4 | 5;
  /** Softmax probability scores for each class */
  probabilities: {
    Green_Healthy: number;
    Yellow_Borderline: number;
    Red_Severe: number;
  };
  /** Primary confidence score (0.0 - 1.0) */
  confidence: number;
  /** Hex color for UI representation */
  badgeColor: string;
  /** Soft background tint for UI cards */
  badgeBg: string;
  /** English clinical recommendation */
  adviceEn: string;
  /** Localized spoken guidance for the selected dialect */
  localizedSpeech: string;
  /** Model inference duration in milliseconds */
  inferenceTimeMs: number;
}

export interface TwoStageInferenceResult {
  /** Timestamp when scan occurred */
  id: string;
  timestamp: string;
  /** Animal breed tagged during scan */
  animalBreed: 'Goat' | 'Sheep';
  animalTag: string;
  /** Stage 1: Eye Finder YOLO Output */
  finder: EyeDetectionResult;
  /** Stage 2: FAMACHA Judge MobileNet Output */
  judge: FamachaJudgeResult;
  /** Total pipeline execution time */
  totalDurationMs: number;
  /** Mode used for execution */
  runtimeEngine: 'native-onnx' | 'adaptive-pipeline';
}
