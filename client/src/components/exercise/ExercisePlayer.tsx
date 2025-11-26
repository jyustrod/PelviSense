// 💪 Component: ExercisePlayer.tsx
// Reproductor de ejercicios con corrección de postura mediante IA

import React, { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import { usePoseEstimation } from '@/hooks/usePoseEstimation';
import { AlertTriangle, Camera, CameraOff, CheckCircle2 } from 'lucide-react';
import type { PostureWarning } from '@/types/pose.types';

interface ExercisePlayerProps {
  exerciseName: string;
  currentPhase: string;
  timeRemaining: number;
  aiEnabled: boolean;
  onToggleAI: () => void;
  contractionStrength: number; // 0-100
  targetStrength: number; // 0-100
  className?: string;
}

export const ExercisePlayer: React.FC<ExercisePlayerProps> = ({
  exerciseName,
  currentPhase,
  timeRemaining,
  aiEnabled,
  onToggleAI,
  contractionStrength,
  targetStrength,
  className = '',
}) => {
  const webcamRef = useRef<Webcam>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);

  // Hook de pose estimation
  const {
    isModelLoaded,
    isPostureCorrect,
    postureMetrics,
    currentWarnings,
    error: poseError,
    fps,
  } = usePoseEstimation({
    videoRef,
    enabled: aiEnabled && isCameraReady,
  });

  // Asignar video ref cuando webcam esté lista
  useEffect(() => {
    if (webcamRef.current?.video) {
      videoRef.current = webcamRef.current.video;
      setIsCameraReady(true);
    }
  }, [aiEnabled]);

  // Determinar color del borde basado en postura
  const getBorderColor = (): string => {
    if (!aiEnabled) return 'border-gray-300';
    if (!isModelLoaded) return 'border-yellow-500';
    if (poseError) return 'border-red-500';
    return isPostureCorrect ? 'border-green-500' : 'border-red-500';
  };

  // Calcular progreso de contracción
  const contractionProgress = (contractionStrength / targetStrength) * 100;
  const isInTarget = contractionStrength >= targetStrength * 0.9; // 90% del target

  return (
    <div className={`flex flex-col space-y-4 ${className}`}>
      {/* Encabezado */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg p-4 shadow-lg">
        <h2 className="text-2xl font-bold mb-1">{exerciseName}</h2>
        <div className="flex items-center justify-between">
          <div className="text-sm opacity-90">
            Fase: <span className="font-semibold uppercase">{currentPhase}</span>
          </div>
          <div className="text-3xl font-mono font-bold">
            {Math.ceil(timeRemaining)}s
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Biofeedback Circle */}
        <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center justify-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Biofeedback en Tiempo Real
          </h3>

          {/* Círculo de feedback */}
          <div className="relative w-64 h-64">
            {/* Círculo objetivo (fondo) */}
            <svg className="absolute inset-0" viewBox="0 0 200 200">
              <circle
                cx="100"
                cy="100"
                r="80"
                fill="none"
                stroke="#E5E7EB"
                strokeWidth="20"
              />
              {/* Círculo de progreso */}
              <circle
                cx="100"
                cy="100"
                r="80"
                fill="none"
                stroke={isInTarget ? '#10B981' : '#6B46C1'}
                strokeWidth="20"
                strokeDasharray={`${contractionProgress * 5.03} 503`}
                strokeLinecap="round"
                transform="rotate(-90 100 100)"
                className="transition-all duration-200"
              />
            </svg>

            {/* Texto central */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-5xl font-bold text-gray-800">
                {Math.round(contractionStrength)}%
              </div>
              <div className="text-sm text-gray-600 mt-1">
                Target: {targetStrength}%
              </div>
              {isInTarget && (
                <CheckCircle2 className="w-8 h-8 text-green-500 mt-2 animate-pulse" />
              )}
            </div>
          </div>

          {/* Barra de progreso lineal */}
          <div className="w-full mt-6">
            <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className={`h-full transition-all duration-200 ${
                  isInTarget ? 'bg-green-500' : 'bg-primary-500'
                }`}
                style={{ width: `${Math.min(contractionProgress, 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* AI Posture Camera */}
        <div className="bg-white rounded-lg shadow-lg p-4 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-800">
              🤖 Corrección de Postura IA
            </h3>
            <button
              onClick={onToggleAI}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-colors ${
                aiEnabled
                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {aiEnabled ? (
                <>
                  <Camera className="w-4 h-4" />
                  <span>Activado</span>
                </>
              ) : (
                <>
                  <CameraOff className="w-4 h-4" />
                  <span>Desactivado</span>
                </>
              )}
            </button>
          </div>

          {aiEnabled ? (
            <div className="flex-1 flex flex-col">
              {/* Webcam con borde indicador */}
              <div
                className={`relative rounded-lg overflow-hidden border-4 ${getBorderColor()} transition-colors duration-300`}
              >
                <Webcam
                  ref={webcamRef}
                  audio={false}
                  screenshotFormat="image/jpeg"
                  videoConstraints={{
                    width: 640,
                    height: 480,
                    facingMode: 'user',
                  }}
                  className="w-full h-auto"
                  onUserMedia={() => setIsCameraReady(true)}
                />

                {/* Overlay de estado */}
                <div className="absolute top-2 right-2 flex space-x-2">
                  {/* Indicador de modelo cargado */}
                  {!isModelLoaded && aiEnabled && (
                    <div className="bg-yellow-500 text-white px-2 py-1 rounded text-xs font-semibold animate-pulse">
                      Cargando IA...
                    </div>
                  )}

                  {/* FPS Counter */}
                  {isModelLoaded && (
                    <div className="bg-black bg-opacity-60 text-white px-2 py-1 rounded text-xs font-mono">
                      {fps} FPS
                    </div>
                  )}
                </div>

                {/* Indicador de postura */}
                {isModelLoaded && postureMetrics && (
                  <div className="absolute bottom-2 left-2 right-2">
                    <div className="bg-black bg-opacity-70 rounded-lg p-2">
                      <div className="flex items-center justify-between text-white text-xs">
                        <div>
                          <div className="font-semibold">Estabilidad Hombros</div>
                          <div className="w-32 bg-gray-700 rounded-full h-2 mt-1">
                            <div
                              className={`h-full rounded-full transition-all ${
                                postureMetrics.shoulderStability > 80
                                  ? 'bg-green-500'
                                  : postureMetrics.shoulderStability > 60
                                  ? 'bg-yellow-500'
                                  : 'bg-red-500'
                              }`}
                              style={{
                                width: `${postureMetrics.shoulderStability}%`,
                              }}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="font-semibold">Estabilidad Caderas</div>
                          <div className="w-32 bg-gray-700 rounded-full h-2 mt-1">
                            <div
                              className={`h-full rounded-full transition-all ${
                                postureMetrics.hipStability > 80
                                  ? 'bg-green-500'
                                  : postureMetrics.hipStability > 60
                                  ? 'bg-yellow-500'
                                  : 'bg-red-500'
                              }`}
                              style={{ width: `${postureMetrics.hipStability}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Advertencias de postura */}
              <div className="mt-3 space-y-2 flex-1 overflow-y-auto max-h-32">
                {currentWarnings.length > 0 ? (
                  currentWarnings.map((warning: PostureWarning, index: number) => (
                    <div
                      key={index}
                      className={`flex items-start space-x-2 p-2 rounded-lg ${
                        warning.severity === 'high'
                          ? 'bg-red-100 text-red-800'
                          : warning.severity === 'medium'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span className="text-sm font-medium">{warning.message}</span>
                    </div>
                  ))
                ) : isModelLoaded ? (
                  <div className="flex items-center space-x-2 p-2 rounded-lg bg-green-100 text-green-800">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      ✅ Postura correcta
                    </span>
                  </div>
                ) : null}
              </div>

              {/* Error de IA */}
              {poseError && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800">
                    <strong>Error:</strong> {poseError}
                  </p>
                </div>
              )}

              {/* Nota de privacidad */}
              <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-800">
                🔒 <strong>Privacidad:</strong> Todo el procesamiento de video ocurre
                localmente en tu navegador. Ningún dato se envía a servidores.
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 rounded-lg p-8 text-center">
              <CameraOff className="w-16 h-16 text-gray-400 mb-4" />
              <h4 className="text-lg font-semibold text-gray-700 mb-2">
                Corrección de Postura Desactivada
              </h4>
              <p className="text-sm text-gray-600 mb-4">
                Activa la cámara para recibir correcciones en tiempo real basadas en IA
              </p>
              <button
                onClick={onToggleAI}
                className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors flex items-center space-x-2"
              >
                <Camera className="w-5 h-5" />
                <span>Activar Cámara</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Instrucciones */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="font-semibold text-gray-800 mb-2">📋 Instrucciones:</h4>
        <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
          <li>Mantén la espalda recta y hombros relajados</li>
          <li>Contrae el suelo pélvico hasta alcanzar el objetivo ({targetStrength}%)</li>
          <li>Evita compensar con otros músculos (abdomen, glúteos)</li>
          <li>Respira normalmente durante el ejercicio</li>
        </ul>
      </div>
    </div>
  );
};

