import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PelvicBird } from '@/components/game/PelvicBird';
import { ArrowLeft, Trophy } from 'lucide-react';

const GameMode: React.FC = () => {
  const navigate = useNavigate();
  const [lastScore, setLastScore] = useState<number | null>(null);

  const handleGameEnd = (score: number, stats: any) => {
    setLastScore(score);
    console.log('📊 Estadísticas del juego:', stats);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-500 via-pink-600 to-purple-600 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Volver</span>
          </button>

          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-1">
              🎮 PelvicBird
            </h1>
            <p className="text-white/80">Entrena jugando</p>
          </div>

          <div className="bg-white/10 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
            <Trophy className="w-5 h-5" />
            <span className="font-bold">
              {lastScore !== null ? lastScore : '-'}
            </span>
          </div>
        </header>

        {/* Juego */}
        <div className="flex justify-center">
          <PelvicBird onGameEnd={handleGameEnd} />
        </div>

        {/* Info adicional */}
        <div className="mt-8 bg-white/10 backdrop-blur rounded-lg p-6 text-white max-w-2xl mx-auto">
          <h3 className="text-xl font-bold mb-3">
            🎯 Beneficios del Entrenamiento Gamificado
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              ✅ <strong>Motivación:</strong> El formato de juego aumenta la
              adherencia al tratamiento
            </li>
            <li>
              ✅ <strong>Resistencia:</strong> Mejora la capacidad de mantener
              contracciones prolongadas
            </li>
            <li>
              ✅ <strong>Control:</strong> Desarrolla precisión en la
              activación muscular
            </li>
            <li>
              ✅ <strong>Diversión:</strong> Transforma el ejercicio en una
              experiencia positiva
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default GameMode;

