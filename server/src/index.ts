import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;
const prisma = new PrismaClient();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // límite de 100 requests por ventana
});
app.use('/api/', limiter);

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes

// Obtener usuario
app.get('/api/users/:id', async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      include: {
        sessions: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        progress: {
          orderBy: { date: 'desc' },
          take: 30,
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuario' });
  }
});

// Crear sesión
app.post('/api/sessions', async (req: Request, res: Response) => {
  try {
    const {
      userId,
      type,
      exerciseName,
      duration,
      contractions,
      score,
      aiEnabled,
      postureWarnings,
      averageStability,
      maxStrength,
      avgStrength,
      consistency,
    } = req.body;

    const session = await prisma.session.create({
      data: {
        userId,
        type,
        exerciseName,
        duration,
        contractions,
        score,
        aiEnabled,
        postureWarnings,
        averageStability,
        maxStrength,
        avgStrength,
        consistency,
      },
    });

    // Actualizar progreso
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await prisma.progress.upsert({
      where: {
        userId_date: {
          userId,
          date: today,
        },
      },
      update: {
        totalSessions: { increment: 1 },
        totalDuration: { increment: Math.floor(duration / 60) },
        highScore: score ? { set: score } : undefined,
      },
      create: {
        userId,
        date: today,
        totalSessions: 1,
        totalDuration: Math.floor(duration / 60),
        highScore: score,
      },
    });

    res.status(201).json(session);
  } catch (error) {
    console.error('Error creando sesión:', error);
    res.status(500).json({ error: 'Error al crear sesión' });
  }
});

// Obtener estadísticas
app.get('/api/stats/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const totalSessions = await prisma.session.count({
      where: { userId },
    });

    const recentSessions = await prisma.session.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 30,
    });

    const avgDuration =
      recentSessions.reduce((sum, s) => sum + s.duration, 0) /
      recentSessions.length;

    const totalContractions = recentSessions.reduce(
      (sum, s) => sum + s.contractions,
      0
    );

    const highScore = await prisma.session.findFirst({
      where: { userId, type: 'game' },
      orderBy: { score: 'desc' },
      select: { score: true },
    });

    res.json({
      totalSessions,
      avgDuration: Math.round(avgDuration),
      totalContractions,
      highScore: highScore?.score || 0,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener estadísticas' });
  }
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`🚀 Servidor UROLF corriendo en http://localhost:${port}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

