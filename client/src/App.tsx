import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';

// Lazy loading para code splitting
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Training = lazy(() => import('./pages/Training'));
const GameMode = lazy(() => import('./pages/GameMode'));
const Assessment = lazy(() => import('./pages/Assessment'));

// Componente de carga
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-500 to-secondary-500">
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
      <p className="text-white mt-4 text-lg font-semibold">Cargando UROLF...</p>
    </div>
  </div>
);

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/assessment" element={<Assessment />} />
          <Route path="/training" element={<Training />} />
          <Route path="/game" element={<GameMode />} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;

