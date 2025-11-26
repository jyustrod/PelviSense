// 🤖 Tipos para Computer Vision y Pose Estimation

import { Keypoint, Pose } from '@tensorflow-models/pose-detection';

export interface PoseKeypoints {
  leftShoulder: Keypoint | null;
  rightShoulder: Keypoint | null;
  leftHip: Keypoint | null;
  rightHip: Keypoint | null;
  nose: Keypoint | null;
}

export interface PostureMetrics {
  shoulderStability: number; // 0-100 (100 = perfectamente estable)
  hipStability: number; // 0-100
  shoulderHeight: number; // Altura promedio de los hombros
  hipAlignment: number; // Diferencia de altura entre caderas
  isPostureCorrect: boolean;
  warnings: PostureWarning[];
}

export type PostureWarningType =
  | 'SHOULDERS_RAISED'
  | 'SHOULDERS_ASYMMETRIC'
  | 'HIPS_SHIFTED'
  | 'HIPS_TILTED'
  | 'LEAN_FORWARD'
  | 'LEAN_BACKWARD';

export interface PostureWarning {
  type: PostureWarningType;
  message: string;
  severity: 'low' | 'medium' | 'high';
  timestamp: number;
}

export interface PoseEstimationConfig {
  modelType: 'MoveNet.SinglePose.Lightning' | 'MoveNet.SinglePose.Thunder';
  minConfidence: number; // 0-1
  checkInterval: number; // ms entre análisis
  stabilityThreshold: number; // Threshold para considerar postura estable
}

export const DEFAULT_POSE_CONFIG: PoseEstimationConfig = {
  modelType: 'MoveNet.SinglePose.Lightning',
  minConfidence: 0.3,
  checkInterval: 100, // 10 veces por segundo
  stabilityThreshold: 0.85, // 85% de estabilidad
};

export interface PoseFrame {
  timestamp: number;
  pose: Pose | null;
  keypoints: PoseKeypoints;
  metrics: PostureMetrics;
}

export interface PoseSession {
  sessionId: string;
  startTime: number;
  endTime?: number;
  frames: PoseFrame[];
  warningCount: Record<PostureWarningType, number>;
  averageStability: number;
}

