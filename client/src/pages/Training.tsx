import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ExercisePlayer } from '@/components/exercise/ExercisePlayer';
import { ArrowLeft, Play, Pause, RotateCcw } from 'lucide-react';
import type { ExercisePhase } from '@/types/exercise.types';

const Training: React.FC = () => {
  const navigate = useNavigate();

  const [currentPhase, setCurrentPhase] = useState<ExercisePhase>('rest');
  const [timeRemaining, setTimeRemaining] = useState(10);
  const [aiEnabled, setAiEnabled] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [simulatedStrength, setSimulatedStrength] = useState(0);

  const exerciseName = 'Contracciones Rápidas';
  const targetStrength = 70;

  // Simulador de contracción con teclas
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        setSimulatedStrength(75);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setSimulatedStrength(0);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Timer de ejercicio
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          // Cambiar fase
          if (currentPhase === 'rest') {
            setCurrentPhase('contract');
            return 5; // 5 segundos de contracción
          } else if (currentPhase === 'contract') {
            setCurrentPhase('release');
            return 3; // 3 segundos de liberación
          } else {
            setCurrentPhase('rest');
            return 10;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, currentPhase]);

  const handleToggleAI = () => {
    setAiEnabled((prev) => !prev);
  };

  const handlePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentPhase('rest');
    setTimeRemaining(10);
    setSimulatedStrength(0);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 bg-white shadow hover:shadow-lg text-gray-700 px-4 py-2 rounded-lg transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Volver</span>
          </button>

          <h1 className="text-3xl font-bold text-gray-900">
            Entrenamiento Guiado
          </h1>

          <div className="flex space-x-2">
            <button
              onClick={handleReset}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 p-2 rounded-lg transition-colors"
              title="Reiniciar"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
            <button
              onClick={handlePlayPause}
              className={`${
                isPlaying
                  ? 'bg-yellow-500 hover:bg-yellow-600'
                  : 'bg-green-500 hover:bg-green-600'
              } text-white p-2 rounded-lg transition-colors`}
              title={isPlaying ? 'Pausar' : 'Iniciar'}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5" />
              )}
            </button>
          </div>
        </header>

        {/* Exercise Player */}
        <ExercisePlayer
          exerciseName={exerciseName}
          currentPhase={currentPhase}
          timeRemaining={timeRemaining}
          aiEnabled={aiEnabled}
          onToggleAI={handleToggleAI}
          contractionStrength={simulatedStrength}
          targetStrength={targetStrength}
        />

        {/* Control Info */}
        <div className="mt-6 bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600 text-center">
            💡 <strong>Simulación:</strong> Presiona y mantén{' '}
            <kbd className="px-2 py-1 bg-gray-100 rounded border">ESPACIO</kbd>{' '}
            para simular una contracción
          </p>
        </div>
      </div>
    </div>
  );
};

export default Training;

