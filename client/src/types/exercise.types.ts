// 💪 Tipos para ejercicios y entrenamiento

export type ExerciseType = 'quick' | 'hold' | 'endurance' | 'coordination';
export type ExercisePhase = 'rest' | 'contract' | 'hold' | 'release' | 'completed';

export interface Exercise {
  id: string;
  name: string;
  type: ExerciseType;
  description: string;
  duration: number; // segundos totales
  sets: number;
  repetitions: number;
  holdTime?: number; // Para ejercicios tipo "hold"
  restTime: number;
  targetStrength: number; // 0-100
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  instructions: string[];
}

export interface ExerciseSession {
  id: string;
  exerciseId: string;
  userId: string;
  startTime: number;
  endTime?: number;
  currentSet: number;
  currentRepetition: number;
  currentPhase: ExercisePhase;
  timeRemaining: number;
  aiEnabled: boolean;
  postureWarnings: number;
  completedSuccessfully: boolean;
}

export interface ContractionData {
  timestamp: number;
  strength: number; // 0-100
  duration: number; // ms
  isCorrect: boolean; // Si alcanzó el target
}

export interface SessionMetrics {
  sessionId: string;
  totalDuration: number;
  completedSets: number;
  completedReps: number;
  contractions: ContractionData[];
  averageStrength: number;
  maxStrength: number;
  postureScore: number; // 0-100
  consistency: number; // 0-100 (qué tan consistente fue la fuerza)
}

export interface BiofeedbackState {
  currentStrength: number; // 0-100
  targetStrength: number; // 0-100
  isInTarget: boolean;
  visualFeedback: 'success' | 'warning' | 'neutral';
}

export const SAMPLE_EXERCISES: Exercise[] = [
  {
    id: 'ex-1',
    name: 'Contracciones Rápidas',
    type: 'quick',
    description: 'Contracciones rápidas para mejorar respuesta muscular',
    duration: 180,
    sets: 3,
    repetitions: 10,
    restTime: 60,
    targetStrength: 70,
    difficulty: 'beginner',
    instructions: [
      'Siéntate cómodamente con la espalda recta',
      'Contrae el suelo pélvico rápidamente',
      'Mantén los hombros relajados',
      'Respira normalmente',
    ],
  },
  {
    id: 'ex-2',
    name: 'Sostén Prolongado',
    type: 'hold',
    description: 'Mantén la contracción para mejorar resistencia',
    duration: 300,
    sets: 3,
    repetitions: 5,
    holdTime: 10,
    restTime: 90,
    targetStrength: 80,
    difficulty: 'intermediate',
    instructions: [
      'Siéntate con postura correcta',
      'Contrae gradualmente hasta el 80%',
      'Mantén la contracción sin compensar',
      'Mantén hombros y caderas quietos',
    ],
  },
];

