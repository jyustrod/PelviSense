# 🏥 UROLF - Pelvic Floor Rehabilitation PWA

![UROLF Banner](https://img.shields.io/badge/UROLF-Pelvic%20Rehab-6B46C1?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue?style=flat-square&logo=typescript)
![React](https://img.shields.io/badge/React-18.2-61DAFB?style=flat-square&logo=react)
![TensorFlow](https://img.shields.io/badge/TensorFlow.js-4.15-FF6F00?style=flat-square&logo=tensorflow)

> **🔄 Transformación Completa**: Este proyecto ha sido transformado de un simple `index.js` a una arquitectura completa de PWA con React, TypeScript, TensorFlow.js y Node.js. Ver `EXECUTIVE_SUMMARY.md` para detalles de la migración.

## 📋 Descripción

**UROLF** es una Progressive Web App (PWA) Mobile-First para la rehabilitación avanzada del suelo pélvico. Combina ejercicios guiados con biofeedback en tiempo real, gamificación mediante un juego estilo "Flappy Bird" y un agente de Computer Vision basado en IA para corregir la postura durante los ejercicios.

## ✨ Características Principales

### 🎯 Entrenamiento Guiado
- Ejercicios personalizados con instrucciones paso a paso
- Biofeedback visual en tiempo real mediante círculo de progreso
- Fases automáticas: Descanso → Contracción → Sostenimiento → Liberación

### 🤖 Corrección de Postura con IA
- **Tecnología**: TensorFlow.js + MoveNet (Pose Detection)
- **Análisis**: Detección de keypoints (hombros, caderas)
- **Alertas en Tiempo Real**:
  - "Relaja tus hombros" (si detecta elevación)
  - "Mantén caderas quietas" (si detecta desplazamiento)
  - "Mantén caderas niveladas" (si detecta inclinación)
- **Privacidad**: Todo el procesamiento ocurre localmente en el navegador

### 🎮 PelvicBird Game
- Juego estilo Flappy Bird controlado por contracciones
- **Mecánica**:
  - Contracción alta (>70%) = El pájaro vuela hacia arriba
  - Relajación (<20%) = El pájaro cae
- Sistema de puntuación y high scores
- Estadísticas de entrenamiento gamificado

### 📱 Progressive Web App (PWA)
- Instalable en cualquier dispositivo
- Funciona offline (Service Worker)
- Diseño Mobile-First responsive
- Optimizada para rendimiento

## 🛠️ Stack Tecnológico

### Frontend
- **React 18** con **TypeScript**
- **Vite** (Build tool ultra-rápido)
- **Tailwind CSS** (Styling utility-first)
- **Zustand** (State management ligero)
- **React Router** (Navegación)

### Computer Vision / IA
- **TensorFlow.js** - Framework de ML en el navegador
- **@tensorflow-models/pose-detection** - Detección de pose corporal
- **MoveNet** - Modelo ligero y rápido para pose estimation
- **react-webcam** - Captura de video

### Game Engine
- **HTML5 Canvas** - Renderizado del juego
- **requestAnimationFrame** - Loop de juego optimizado
- Física personalizada (gravedad, colisiones)

### Backend
- **Node.js** + **Express**
- **Prisma ORM** - Type-safe database access
- **SQLite** - Base de datos ligera

## 📦 Instalación

### Requisitos Previos
- Node.js >= 18.x
- npm >= 9.x

### Pasos de Instalación

```bash
# 1. Clonar o navegar al repositorio
cd C:\Users\javie_ecnbd8s\Proyectos\PelviSense

# 2. Instalar dependencias raíz
npm install

# 3. Instalar dependencias del cliente
cd client
npm install

# 4. Instalar dependencias del servidor
cd ../server
npm install

# 5. Generar Prisma Client
npx prisma generate

# 6. Ejecutar migraciones
npx prisma migrate dev
```

## 🚀 Uso

### Desarrollo (Todo)
```bash
# Desde la raíz del proyecto
npm run dev
```
Esto iniciará:
- Frontend en `http://localhost:5173`
- Backend en `http://localhost:3000`

### Solo Frontend
```bash
npm run dev:client
```

### Solo Backend
```bash
npm run dev:server
```

## 📂 Estructura del Proyecto

```
PelviSense/
├── client/                    # Frontend React
│   ├── src/
│   │   ├── components/
│   │   │   ├── game/
│   │   │   │   └── PelvicBird.tsx       ⭐ Juego principal
│   │   │   └── exercise/
│   │   │       └── ExercisePlayer.tsx    ⭐ Reproductor con AI
│   │   ├── hooks/
│   │   │   └── usePoseEstimation.ts      ⭐ Hook AI Vision
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Training.tsx
│   │   │   └── GameMode.tsx
│   │   ├── types/
│   │   │   ├── game.types.ts
│   │   │   ├── pose.types.ts
│   │   │   └── exercise.types.ts
│   │   └── App.tsx
│   └── package.json
├── server/                    # Backend Node.js
│   ├── src/
│   │   └── index.ts
│   ├── prisma/
│   │   └── schema.prisma
│   └── package.json
├── CODEBASE_GUIDE.md         📖 Guía completa del código
├── INSTALLATION_COMMANDS.md   📦 Comandos de instalación
└── README.md                  📄 Este archivo
```

## 🎮 Cómo Usar la Aplicación

### 1. Dashboard
- Vista principal con acceso a todas las funciones
- Visualiza tu progreso y racha de días
- Accede al entrenamiento guiado o al modo juego

### 2. Entrenamiento Guiado
- Selecciona un ejercicio
- **[Opcional]** Activa la cámara para corrección de postura AI
- Presiona ESPACIO para simular contracciones
- Sigue las instrucciones en pantalla

### 3. Modo Juego (PelvicBird)
- Click para iniciar el juego
- Presiona y mantén ESPACIO (o toca la pantalla) para hacer volar al pájaro
- Esquiva las tuberías para ganar puntos
- Entrena mientras te diviertes

## 🤖 Funciones de IA

### Pose Estimation (usePoseEstimation.ts)
```typescript
const {
  isModelLoaded,        // true cuando MoveNet está cargado
  isPostureCorrect,     // true si la postura es correcta
  postureMetrics,       // Métricas detalladas (estabilidad, etc.)
  currentWarnings,      // Array de advertencias activas
  fps,                  // FPS del análisis
} = usePoseEstimation({
  videoRef,             // Referencia al video de la webcam
  enabled: true,        // Activar/desactivar análisis
});
```

### Métricas Analizadas
- **Estabilidad de Hombros**: 0-100 (100 = perfecto)
- **Estabilidad de Caderas**: 0-100
- **Altura de Hombros**: Detecta elevación compensatoria
- **Alineación de Caderas**: Detecta inclinación o desplazamiento

## 🔐 Privacidad y Seguridad

✅ **Processing Local**: Todo el análisis de video ocurre en el navegador  
✅ **Sin Uploads**: Ningún frame de video se envía a servidores  
✅ **HTTPS**: Requerido en producción para acceso a webcam  
✅ **Permisos**: Solicita explícitamente permiso para usar la cámara  

## 📊 Modelo de Datos (Prisma)

### Usuario
```prisma
model User {
  id        String
  email     String
  name      String
  sessions  Session[]
  progress  Progress[]
}
```

### Sesión de Ejercicio
```prisma
model Session {
  id               String
  userId           String
  type             String   // "standard" | "game"
  duration         Int
  contractions     Int
  score            Int?
  aiEnabled        Boolean
  postureWarnings  Int
}
```

## 🧪 Testing

```bash
# Unit tests (por implementar)
npm run test

# E2E tests (por implementar)
npm run test:e2e
```

## 📈 Roadmap

- [x] Estructura base del proyecto
- [x] Componente PelvicBird (Juego)
- [x] Hook usePoseEstimation (AI)
- [x] Componente ExercisePlayer
- [x] Dashboard y navegación
- [ ] Integración con sensor hardware real
- [ ] Sistema de usuarios y autenticación
- [ ] Analytics avanzados
- [ ] Notificaciones push
- [ ] Exportar informes PDF
- [ ] Modo multijugador (competitivo)

## 🤝 Contribución

Este es un proyecto educativo/demostrativo. Si deseas contribuir:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver archivo `LICENSE` para más detalles.

## 👨‍💻 Autor

**Senior Full Stack Software Architect**  
Fecha de Creación: 26 de noviembre de 2025

## 🙏 Agradecimientos

- [TensorFlow.js Team](https://www.tensorflow.org/js) - Por el increíble framework
- [Google MoveNet](https://www.tensorflow.org/hub/tutorials/movenet) - Por el modelo de pose detection
- [React Team](https://react.dev/) - Por la mejor librería de UI
- [Vite Team](https://vitejs.dev/) - Por la herramienta de build ultrarrápida

---

**⚕️ Nota Médica**: Esta aplicación es una herramienta educativa y de asistencia. No reemplaza el consejo médico profesional. Siempre consulta con un especialista en suelo pélvico antes de comenzar cualquier programa de rehabilitación.

---

Made with ❤️ and 💪 for pelvic health

