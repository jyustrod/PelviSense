// 🤖 Hook: usePoseEstimation.ts
// Custom Hook para detección de postura con TensorFlow.js MoveNet

import { useEffect, useRef, useState, useCallback } from 'react';
import * as poseDetection from '@tensorflow-models/pose-detection';
import '@tensorflow/tfjs-backend-webgl';
import * as tf from '@tensorflow/tfjs';
import type {
  PoseKeypoints,
  PostureMetrics,
  PostureWarning,
  PoseEstimationConfig,
} from '@/types/pose.types';
import { DEFAULT_POSE_CONFIG } from '@/types/pose.types';

interface UsePoseEstimationProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  enabled: boolean;
  config?: Partial<PoseEstimationConfig>;
}

interface UsePoseEstimationReturn {
  isModelLoaded: boolean;
  isPostureCorrect: boolean;
  postureMetrics: PostureMetrics | null;
  currentWarnings: PostureWarning[];
  error: string | null;
  fps: number;
}

export const usePoseEstimation = ({
  videoRef,
  enabled,
  config: userConfig,
}: UsePoseEstimationProps): UsePoseEstimationReturn => {
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isPostureCorrect, setIsPostureCorrect] = useState(true);
  const [postureMetrics, setPostureMetrics] = useState<PostureMetrics | null>(null);
  const [currentWarnings, setCurrentWarnings] = useState<PostureWarning[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [fps, setFps] = useState(0);

  const detectorRef = useRef<poseDetection.PoseDetector | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const baselineRef = useRef<{ shoulderHeight: number; hipHeight: number } | null>(null);
  const fpsCounterRef = useRef({ frames: 0, lastTime: Date.now() });

  // Merge user config with defaults
  const config: PoseEstimationConfig = {
    ...DEFAULT_POSE_CONFIG,
    ...userConfig,
  };

  // 🔧 Cargar modelo TensorFlow
  useEffect(() => {
    const loadModel = async () => {
      try {
        console.log('🤖 Iniciando carga de modelo MoveNet...');

        // Configurar backend WebGL
        await tf.ready();
        await tf.setBackend('webgl');

        // Crear detector
        const detectorConfig = {
          modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
        };

        const detector = await poseDetection.createDetector(
          poseDetection.SupportedModels.MoveNet,
          detectorConfig
        );

        detectorRef.current = detector;
        setIsModelLoaded(true);
        console.log('✅ Modelo MoveNet cargado exitosamente');
      } catch (err) {
        console.error('❌ Error cargando modelo:', err);
        setError('No se pudo cargar el modelo de IA');
      }
    };

    if (enabled) {
      loadModel();
    }

    return () => {
      // Cleanup
      if (detectorRef.current) {
        detectorRef.current.dispose();
        detectorRef.current = null;
      }
    };
  }, [enabled]);

  // 🎯 Extraer keypoints relevantes
  const extractKeypoints = useCallback((pose: poseDetection.Pose): PoseKeypoints => {
    const keypoints = pose.keypoints;

    return {
      leftShoulder: keypoints.find(kp => kp.name === 'left_shoulder') || null,
      rightShoulder: keypoints.find(kp => kp.name === 'right_shoulder') || null,
      leftHip: keypoints.find(kp => kp.name === 'left_hip') || null,
      rightHip: keypoints.find(kp => kp.name === 'right_hip') || null,
      nose: keypoints.find(kp => kp.name === 'nose') || null,
    };
  }, []);

  // 📊 Analizar métricas de postura
  const analyzePosture = useCallback((keypoints: PoseKeypoints): PostureMetrics => {
    const warnings: PostureWarning[] = [];
    let shoulderStability = 100;
    let hipStability = 100;

    const minConfidence = config.minConfidence;

    // Verificar que tengamos los keypoints necesarios
    if (
      !keypoints.leftShoulder || (keypoints.leftShoulder.score ?? 0) < minConfidence ||
      !keypoints.rightShoulder || (keypoints.rightShoulder.score ?? 0) < minConfidence ||
      !keypoints.leftHip || (keypoints.leftHip.score ?? 0) < minConfidence ||
      !keypoints.rightHip || (keypoints.rightHip.score ?? 0) < minConfidence
    ) {
      return {
        shoulderStability: 0,
        hipStability: 0,
        shoulderHeight: 0,
        hipAlignment: 0,
        isPostureCorrect: false,
        warnings: [
          {
            type: 'LEAN_FORWARD',
            message: 'No se puede detectar tu postura. Asegúrate de estar en el encuadre.',
            severity: 'high',
            timestamp: Date.now(),
          },
        ],
      };
    }

    // Calcular alturas
    const shoulderHeight = (keypoints.leftShoulder.y + keypoints.rightShoulder.y) / 2;
    const hipHeight = (keypoints.leftHip.y + keypoints.rightHip.y) / 2;

    // Establecer línea base en la primera detección
    if (!baselineRef.current) {
      baselineRef.current = { shoulderHeight, hipHeight };
    }

    const baseline = baselineRef.current;

    // 🚨 Detectar elevación de hombros
    const shoulderRise = baseline.shoulderHeight - shoulderHeight;
    if (shoulderRise > 30) { // 30px de elevación
      shoulderStability -= 40;
      warnings.push({
        type: 'SHOULDERS_RAISED',
        message: 'Relaja tus hombros',
        severity: 'high',
        timestamp: Date.now(),
      });
    } else if (shoulderRise > 15) {
      shoulderStability -= 20;
      warnings.push({
        type: 'SHOULDERS_RAISED',
        message: 'Hombros ligeramente elevados',
        severity: 'medium',
        timestamp: Date.now(),
      });
    }

    // 🚨 Detectar asimetría de hombros
    const shoulderDiff = Math.abs(keypoints.leftShoulder.y - keypoints.rightShoulder.y);
    if (shoulderDiff > 40) {
      shoulderStability -= 30;
      warnings.push({
        type: 'SHOULDERS_ASYMMETRIC',
        message: 'Mantén los hombros al mismo nivel',
        severity: 'medium',
        timestamp: Date.now(),
      });
    }

    // 🚨 Detectar desplazamiento de caderas
    const hipShift = Math.abs(baseline.hipHeight - hipHeight);
    if (hipShift > 40) {
      hipStability -= 50;
      warnings.push({
        type: 'HIPS_SHIFTED',
        message: 'Mantén las caderas quietas',
        severity: 'high',
        timestamp: Date.now(),
      });
    } else if (hipShift > 20) {
      hipStability -= 25;
      warnings.push({
        type: 'HIPS_SHIFTED',
        message: 'Caderas ligeramente desplazadas',
        severity: 'medium',
        timestamp: Date.now(),
      });
    }

    // 🚨 Detectar inclinación de caderas
    const hipAlignment = Math.abs(keypoints.leftHip.y - keypoints.rightHip.y);
    if (hipAlignment > 30) {
      hipStability -= 30;
      warnings.push({
        type: 'HIPS_TILTED',
        message: 'Mantén las caderas niveladas',
        severity: 'medium',
        timestamp: Date.now(),
      });
    }

    // Determinar si la postura es correcta
    const averageStability = (shoulderStability + hipStability) / 2;
    const isPostureCorrect = averageStability >= (config.stabilityThreshold * 100);

    return {
      shoulderStability: Math.max(0, shoulderStability),
      hipStability: Math.max(0, hipStability),
      shoulderHeight,
      hipAlignment,
      isPostureCorrect,
      warnings,
    };
  }, [config.minConfidence, config.stabilityThreshold]);

  // 🎬 Loop de detección
  const detectPose = useCallback(async () => {
    if (
      !enabled ||
      !detectorRef.current ||
      !videoRef.current ||
      videoRef.current.readyState < 2
    ) {
      return;
    }

    try {
      // Estimar pose
      const poses = await detectorRef.current.estimatePoses(videoRef.current);

      if (poses.length > 0) {
        const pose = poses[0];
        const keypoints = extractKeypoints(pose);
        const metrics = analyzePosture(keypoints);

        setPostureMetrics(metrics);
        setIsPostureCorrect(metrics.isPostureCorrect);
        setCurrentWarnings(metrics.warnings);

        // Calcular FPS
        fpsCounterRef.current.frames++;
        const now = Date.now();
        if (now - fpsCounterRef.current.lastTime >= 1000) {
          setFps(fpsCounterRef.current.frames);
          fpsCounterRef.current.frames = 0;
          fpsCounterRef.current.lastTime = now;
        }
      }
    } catch (err) {
      console.error('Error en detección de pose:', err);
    }

    // Programar siguiente frame
    const delay = config.checkInterval;
    setTimeout(() => {
      animationFrameRef.current = requestAnimationFrame(detectPose);
    }, delay);
  }, [enabled, videoRef, extractKeypoints, analyzePosture, config.checkInterval]);

  // 🚀 Iniciar/detener detección
  useEffect(() => {
    if (enabled && isModelLoaded) {
      detectPose();
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [enabled, isModelLoaded, detectPose]);

  // 🔄 Reset baseline cuando se habilita
  useEffect(() => {
    if (enabled) {
      baselineRef.current = null;
      setCurrentWarnings([]);
    }
  }, [enabled]);

  return {
    isModelLoaded,
    isPostureCorrect,
    postureMetrics,
    currentWarnings,
    error,
    fps,
  };
};
