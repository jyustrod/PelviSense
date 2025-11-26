// 🎮 Tipos para el juego PelvicBird

export interface Bird {
  x: number;
  y: number;
  velocity: number;
  rotation: number;
  radius: number;
}

export interface Pipe {
  x: number;
  topHeight: number;
  bottomY: number;
  width: number;
  gap: number;
  passed: boolean;
}

export interface GameState {
  bird: Bird;
  pipes: Pipe[];
  score: number;
  isPlaying: boolean;
  isGameOver: boolean;
  highScore: number;
  contractionStrength: number; // 0-100
}

export interface GamePhysics {
  gravity: number;
  jumpForce: number;
  maxVelocity: number;
  pipeSpeed: number;
  pipeGap: number;
}

export const DEFAULT_PHYSICS: GamePhysics = {
  gravity: 0.6,
  jumpForce: -10,
  maxVelocity: 10,
  pipeSpeed: 3,
  pipeGap: 150,
};

export interface GameStats {
  sessionId: string;
  startTime: number;
  endTime?: number;
  finalScore: number;
  maxContractionStrength: number;
  averageContractionStrength: number;
  totalContractions: number;
}


