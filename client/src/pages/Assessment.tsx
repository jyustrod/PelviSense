import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const Assessment: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 to-secondary-500 p-4 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Evaluación Inicial
        </h1>
        <p className="text-gray-600 mb-8">
          Esta funcionalidad será implementada en futuras iteraciones.
          Por ahora, puedes acceder directamente al entrenamiento.
        </p>
        <button
          onClick={() => navigate('/')}
          className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 rounded-lg flex items-center justify-center space-x-2 transition-colors"
        >
          <span>Ir al Dashboard</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default Assessment;

