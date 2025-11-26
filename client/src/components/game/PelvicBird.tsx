// 🎮 Component: PelvicBird.tsx
// Juego estilo Flappy Bird controlado por contracciones del suelo pélvico

import React, { useEffect, useRef, useState, useCallback } from 'react';
import type { Bird, Pipe, GameState, GamePhysics } from '@/types/game.types';
import { DEFAULT_PHYSICS } from '@/types/game.types';

interface PelvicBirdProps {
  onGameEnd?: (score: number, stats: GameStats) => void;
  className?: string;
}

interface GameStats {
  finalScore: number;
  maxContractionStrength: number;
  averageContractionStrength: number;
  totalContractions: number;
  duration: number;
}

const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 600;
const BIRD_COLOR = '#EC4899'; // Rosa secundario
const PIPE_COLOR = '#6B46C1'; // Púrpura primario
const BACKGROUND_COLOR = '#F0F9FF'; // Azul claro

export const PelvicBird: React.FC<PelvicBirdProps> = ({ onGameEnd, className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameStateRef = useRef<GameState>({
    bird: {
      x: 80,
      y: CANVAS_HEIGHT / 2,
      velocity: 0,
      rotation: 0,
      radius: 20,
    },
    pipes: [],
    score: 0,
    isPlaying: false,
    isGameOver: false,
    highScore: 0,
    contractionStrength: 0,
  });

  const physicsRef = useRef<GamePhysics>(DEFAULT_PHYSICS);
  const animationFrameRef = useRef<number | null>(null);
  const lastPipeTimeRef = useRef<number>(0);
  const gameStatsRef = useRef<GameStats>({
    finalScore: 0,
    maxContractionStrength: 0,
    averageContractionStrength: 0,
    totalContractions: 0,
    duration: 0,
  });
  const startTimeRef = useRef<number>(0);
  const contractionHistoryRef = useRef<number[]>([]);

  const [simulatedContraction, setSimulatedContraction] = useState(0);
  const [displayScore, setDisplayScore] = useState(0);
  const [isGameActive, setIsGameActive] = useState(false);

  // 🏆 Cargar high score al inicio
  useEffect(() => {
    const savedHighScore = localStorage.getItem('pelvicbird_highscore');
    if (savedHighScore) {
      gameStateRef.current.highScore = parseInt(savedHighScore, 10);
    }
  }, []);

  // 🎯 Simular contracción con Spacebar o Touch
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        setSimulatedContraction(85); // Alta contracción
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setSimulatedContraction(0);
      }
    };

    const handleTouchStart = () => {
      setSimulatedContraction(85);
    };

    const handleTouchEnd = () => {
      setSimulatedContraction(0);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  // 🐦 Aplicar física del pájaro basada en contracción
  const updateBird = useCallback((state: GameState, contractionStrength: number) => {
    const bird = state.bird;
    const physics = physicsRef.current;

    // Log solo cuando hay contracción
    if (contractionStrength > 0) {
      console.log('💪 Contracción recibida:', contractionStrength);
    }

    // Alta contracción = volar hacia arriba
    if (contractionStrength > 70) {
      bird.velocity = physics.jumpForce;
      bird.rotation = -25; // Inclinar hacia arriba

      // Registrar contracción
      contractionHistoryRef.current.push(contractionStrength);
      console.log('🚀 Pájaro volando! Velocity:', bird.velocity);
    }
    // Relajación = caer
    else {
      bird.velocity += physics.gravity;
      bird.velocity = Math.min(bird.velocity, physics.maxVelocity);

      // Rotación basada en velocidad de caída
      if (bird.velocity > 0) {
        bird.rotation = Math.min(bird.velocity * 3, 90);
      }
    }

    // Actualizar posición
    bird.y += bird.velocity;

    // Límites del canvas
    if (bird.y < bird.radius) {
      bird.y = bird.radius;
      bird.velocity = 0;
    }

    if (bird.y > CANVAS_HEIGHT - bird.radius) {
      bird.y = CANVAS_HEIGHT - bird.radius;
      state.isGameOver = true;
    }

    state.contractionStrength = contractionStrength;
  }, []);

  // 🚰 Generar tuberías
  const generatePipe = useCallback((timestamp: number): Pipe | null => {
    if (timestamp - lastPipeTimeRef.current < 1500) {
      return null;
    }

    lastPipeTimeRef.current = timestamp;
    const gap = physicsRef.current.pipeGap;
    const minHeight = 50;
    const maxHeight = CANVAS_HEIGHT - gap - 50;
    const topHeight = Math.random() * (maxHeight - minHeight) + minHeight;

    return {
      x: CANVAS_WIDTH,
      topHeight,
      bottomY: topHeight + gap,
      width: 60,
      gap,
      passed: false,
    };
  }, []);

  // 🚰 Actualizar tuberías
  const updatePipes = useCallback((state: GameState, timestamp: number) => {
    const physics = physicsRef.current;

    // Mover tuberías existentes
    state.pipes.forEach((pipe) => {
      pipe.x -= physics.pipeSpeed;

      // Detectar si el pájaro pasó la tubería
      if (!pipe.passed && pipe.x + pipe.width < state.bird.x) {
        pipe.passed = true;
        state.score++;
        setDisplayScore(state.score);
      }
    });

    // Eliminar tuberías fuera de pantalla
    state.pipes = state.pipes.filter((pipe) => pipe.x > -pipe.width);

    // Generar nueva tubería
    const newPipe = generatePipe(timestamp);
    if (newPipe) {
      state.pipes.push(newPipe);
    }
  }, [generatePipe]);

  // 💥 Detectar colisiones
  const checkCollisions = useCallback((state: GameState): boolean => {
    const bird = state.bird;

    for (const pipe of state.pipes) {
      // Colisión con tubería superior
      if (
        bird.x + bird.radius > pipe.x &&
        bird.x - bird.radius < pipe.x + pipe.width &&
        bird.y - bird.radius < pipe.topHeight
      ) {
        return true;
      }

      // Colisión con tubería inferior
      if (
        bird.x + bird.radius > pipe.x &&
        bird.x - bird.radius < pipe.x + pipe.width &&
        bird.y + bird.radius > pipe.bottomY
      ) {
        return true;
      }
    }

    return false;
  }, []);

  // 🎨 Renderizar juego
  const render = useCallback((ctx: CanvasRenderingContext2D, state: GameState) => {
    // Limpiar canvas
    ctx.fillStyle = BACKGROUND_COLOR;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Dibujar tuberías
    ctx.fillStyle = PIPE_COLOR;
    state.pipes.forEach((pipe) => {
      // Tubería superior
      ctx.fillRect(pipe.x, 0, pipe.width, pipe.topHeight);
      // Tubería inferior
      ctx.fillRect(pipe.x, pipe.bottomY, pipe.width, CANVAS_HEIGHT - pipe.bottomY);
    });

    // Dibujar pájaro
    ctx.save();
    ctx.translate(state.bird.x, state.bird.y);
    ctx.rotate((state.bird.rotation * Math.PI) / 180);

    // Cuerpo del pájaro (círculo)
    ctx.fillStyle = BIRD_COLOR;
    ctx.beginPath();
    ctx.arc(0, 0, state.bird.radius, 0, Math.PI * 2);
    ctx.fill();

    // Ala
    ctx.fillStyle = '#DB2777';
    ctx.beginPath();
    ctx.ellipse(-5, 5, 8, 12, -0.3, 0, Math.PI * 2);
    ctx.fill();

    // Ojo
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(8, -5, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(10, -5, 2, 0, Math.PI * 2);
    ctx.fill();

    // Pico
    ctx.fillStyle = '#F59E0B';
    ctx.beginPath();
    ctx.moveTo(15, 0);
    ctx.lineTo(25, -3);
    ctx.lineTo(25, 3);
    ctx.closePath();
    ctx.fill();

    ctx.restore();

    // Indicador de contracción
    if (state.contractionStrength > 70) {
      ctx.fillStyle = '#10B981';
      ctx.globalAlpha = 0.3;
      ctx.fillRect(0, 0, CANVAS_WIDTH, 40);
      ctx.globalAlpha = 1;
      ctx.fillStyle = 'white';
      ctx.font = 'bold 16px Inter';
      ctx.textAlign = 'center';
      ctx.fillText('¡CONTRACCIÓN ACTIVA!', CANVAS_WIDTH / 2, 25);
    }

    // Puntuación
    ctx.fillStyle = '#1F2937';
    ctx.font = 'bold 48px Inter';
    ctx.textAlign = 'center';
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 5;
    ctx.strokeText(state.score.toString(), CANVAS_WIDTH / 2, 80);
    ctx.fillText(state.score.toString(), CANVAS_WIDTH / 2, 80);
  }, []);

  // 🎮 Game Loop
  const gameLoop = useCallback((timestamp: number) => {
    const state = gameStateRef.current;

    if (!state.isPlaying || state.isGameOver) {
      return;
    }

    updateBird(state, simulatedContraction);
    updatePipes(state, timestamp);

    const hasCollision = checkCollisions(state);
    if (hasCollision) {
      state.isGameOver = true;
    }

    // Renderizar
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx) {
      render(ctx, state);
    }

    if (state.isGameOver) {
      handleGameOver();
    } else {
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    }
  }, [simulatedContraction, updateBird, updatePipes, checkCollisions, render]);

  // 🏁 Fin del juego
  const handleGameOver = useCallback(() => {
    const state = gameStateRef.current;
    const endTime = Date.now();
    const duration = (endTime - startTimeRef.current) / 1000;

    const contractions = contractionHistoryRef.current;
    const stats: GameStats = {
      finalScore: state.score,
      maxContractionStrength: contractions.length > 0 ? Math.max(...contractions) : 0,
      averageContractionStrength:
        contractions.length > 0
          ? contractions.reduce((a, b) => a + b, 0) / contractions.length
          : 0,
      totalContractions: contractions.length,
      duration,
    };

    gameStatsRef.current = stats;
    setIsGameActive(false);

    // Actualizar high score
    if (state.score > state.highScore) {
      state.highScore = state.score;
      localStorage.setItem('pelvicbird_highscore', state.score.toString());
    }

    if (onGameEnd) {
      onGameEnd(state.score, stats);
    }

    // Mostrar pantalla de Game Over
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      ctx.fillStyle = 'white';
      ctx.font = 'bold 48px Inter';
      ctx.textAlign = 'center';
      ctx.fillText('GAME OVER', CANVAS_WIDTH / 2, 200);

      ctx.font = '24px Inter';
      ctx.fillText(`Puntuación: ${state.score}`, CANVAS_WIDTH / 2, 260);
      ctx.fillText(`Record: ${state.highScore}`, CANVAS_WIDTH / 2, 300);

      ctx.font = '16px Inter';
      ctx.fillText('Toca para reiniciar', CANVAS_WIDTH / 2, 450);
    }
  }, [onGameEnd]);

  // ▶️ Iniciar juego
  const startGame = useCallback(() => {
    const state = gameStateRef.current;

    // Reset estado
    state.bird = {
      x: 80,
      y: CANVAS_HEIGHT / 2,
      velocity: -3, // Pequeño impulso inicial hacia arriba
      rotation: 0,
      radius: 20,
    };
    state.pipes = [];
    state.score = 0;
    state.isPlaying = true;
    state.isGameOver = false;
    state.contractionStrength = 0;

    setDisplayScore(0);
    setIsGameActive(true);
    setSimulatedContraction(0); // Reset contracción
    startTimeRef.current = Date.now();
    lastPipeTimeRef.current = Date.now() + 2000; // Delay de 2 segundos para primera tubería
    contractionHistoryRef.current = [];

    // Cargar high score
    const savedHighScore = localStorage.getItem('pelvicbird_highscore');
    if (savedHighScore) {
      state.highScore = parseInt(savedHighScore, 10);
    }

    // Iniciar loop
    animationFrameRef.current = requestAnimationFrame(gameLoop);
  }, [gameLoop]);

  // 🖱️ Click para iniciar/reiniciar
  const handleCanvasClick = useCallback(() => {
    if (!isGameActive) {
      startGame();
    }
  }, [isGameActive, startGame]);

  // 🧹 Cleanup
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div className={`flex flex-col items-center space-y-4 ${className}`}>
      <div className="bg-white rounded-lg shadow-2xl p-4">
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          onClick={handleCanvasClick}
          className="cursor-pointer border-4 border-primary-600 rounded-lg"
        />
      </div>

      {/* Instrucciones */}
      <div className="bg-primary-50 border-2 border-primary-300 rounded-lg p-4 max-w-md">
        <h3 className="font-bold text-lg text-primary-900 mb-2">
          🎮 Cómo Jugar
        </h3>
        <ul className="text-sm text-primary-800 space-y-1">
          <li>
            <strong>Contrae:</strong> Presiona <kbd className="px-2 py-1 bg-white rounded border">ESPACIO</kbd> o toca la pantalla
          </li>
          <li><strong>Objetivo:</strong> Esquiva las tuberías</li>
          <li><strong>Puntos:</strong> Pasa entre las tuberías</li>
          <li><strong>Simulación:</strong> Cada presión = contracción del suelo pélvico</li>
        </ul>
      </div>

      {/* Estadísticas */}
      {isGameActive && (
        <div className="grid grid-cols-2 gap-4 max-w-md w-full">
          <div className="bg-secondary-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-secondary-600">{displayScore}</div>
            <div className="text-xs text-secondary-800">Puntuación</div>
          </div>
          <div className="bg-green-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-green-600">
              {contractionHistoryRef.current.length}
            </div>
            <div className="text-xs text-green-800">Contracciones</div>
          </div>
        </div>
      )}
    </div>
  );
};

