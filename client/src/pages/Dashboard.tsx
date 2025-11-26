import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Gamepad2, TrendingUp, Calendar } from 'lucide-react';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 via-purple-600 to-secondary-500 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="text-center py-8">
          <h1 className="text-5xl font-bold text-white mb-2">UROLF</h1>
          <p className="text-white/90 text-lg">
            Rehabilitación Avanzada del Suelo Pélvico
          </p>
        </header>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          {/* Entrenamiento Estándar */}
          <button
            onClick={() => navigate('/training')}
            className="bg-white rounded-2xl shadow-2xl p-8 hover:scale-105 transition-transform duration-300 text-left group"
          >
            <div className="flex items-center justify-between mb-4">
              <Activity className="w-12 h-12 text-primary-600 group-hover:animate-pulse" />
              <span className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-semibold">
                Recomendado
              </span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Entrenamiento Guiado
            </h2>
            <p className="text-gray-600">
              Ejercicios personalizados con biofeedback en tiempo real y
              corrección de postura mediante IA.
            </p>
          </button>

          {/* Modo Juego */}
          <button
            onClick={() => navigate('/game')}
            className="bg-gradient-to-br from-secondary-500 to-pink-600 rounded-2xl shadow-2xl p-8 hover:scale-105 transition-transform duration-300 text-left group"
          >
            <div className="flex items-center justify-between mb-4">
              <Gamepad2 className="w-12 h-12 text-white group-hover:animate-bounce" />
              <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-semibold">
                Gamificación
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              PelvicBird Game
            </h2>
            <p className="text-white/90">
              Entrena de forma divertida. Controla el juego con tus
              contracciones del suelo pélvico.
            </p>
          </button>

          {/* Progreso */}
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="flex items-center mb-4">
              <TrendingUp className="w-10 h-10 text-green-600 mr-3" />
              <h3 className="text-xl font-bold text-gray-900">Tu Progreso</h3>
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Sesiones completadas</span>
                  <span className="font-bold text-gray-900">12/30</span>
                </div>
                <div className="bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: '40%' }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Racha actual</span>
                  <span className="font-bold text-gray-900">5 días 🔥</span>
                </div>
              </div>
            </div>
          </div>

          {/* Próxima Sesión */}
          <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl shadow-2xl p-8 text-white">
            <div className="flex items-center mb-4">
              <Calendar className="w-10 h-10 mr-3" />
              <h3 className="text-xl font-bold">Próxima Sesión</h3>
            </div>
            <p className="text-lg mb-2">Contracciones Rápidas</p>
            <p className="text-white/80 text-sm">
              Recomendado: Hoy a las 18:00
            </p>
            <button className="mt-4 bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
              Iniciar Ahora
            </button>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center mt-12 text-white/70 text-sm">
          <p>
            💡 <strong>Consejo:</strong> Practica 3 veces al día para mejores
            resultados
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Dashboard;

