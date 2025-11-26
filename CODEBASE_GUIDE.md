# 🏗️ UROLF - Guía Completa del Código Base

## 📦 Proyecto: Aplicación PWA de Rehabilitación del Suelo Pélvico

**Versión:** 1.0.0  
**Fecha:** 26 de noviembre de 2025

---

## 🎯 RESUMEN EJECUTIVO

UROLF es una Progressive Web App (PWA) Mobile-First diseñada para la rehabilitación del suelo pélvico. Integra gamificación mediante un juego estilo "Flappy Bird" controlado por contracciones musculares y un agente de Computer Vision basado en IA para corregir la postura en tiempo real.

---

## 🛠️ STACK TECNOLÓGICO

### Frontend
- **React 18** con **Vite** (Build tool)
- **TypeScript** (Type safety)
- **Tailwind CSS** (Styling)
- **Zustand** (State management)

### Motor de Juego
- **HTML5 Canvas** con `requestAnimationFrame` loop
- Control mediante eventos de teclado/táctiles

### Inteligencia Artificial / Computer Vision
- **TensorFlow.js** (`@tensorflow/tfjs`)
- **Pose Detection** (`@tensorflow-models/pose-detection`)
- **MoveNet Model** (Lightning/Thunder variants)
- **react-webcam** (Webcam stream)

### Backend
- **Node.js** + **Express**
- **Prisma ORM**
- **SQLite** (Database)

---

## 📂 ESTRUCTURA DEL PROYECTO

```
PelviSense/
├── client/                      # Frontend React
│   ├── public/
│   │   ├── manifest.json       # PWA manifest
│   │   ├── sw.js              # Service Worker
│   │   └── icons/             # App icons
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/            # Componentes UI reutilizables
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Card.tsx
│   │   │   │   └── Progress.tsx
│   │   │   ├── game/
│   │   │   │   ├── PelvicBird.tsx        # ⭐ Juego principal
│   │   │   │   ├── GameCanvas.tsx
│   │   │   │   └── ScoreDisplay.tsx
│   │   │   ├── exercise/
│   │   │   │   ├── ExercisePlayer.tsx    # ⭐ Reproductor con AI
│   │   │   │   ├── BiofeedbackCircle.tsx
│   │   │   │   └── PostureIndicator.tsx
│   │   │   └── layout/
│   │   │       ├── Header.tsx
│   │   │       └── Navigation.tsx
│   │   ├── hooks/
│   │   │   ├── usePoseEstimation.ts      # ⭐ Hook AI Vision
│   │   │   ├── useGameLoop.ts
│   │   │   └── useContractionSimulator.ts
│   │   ├── store/
│   │   │   ├── useUserStore.ts
│   │   │   ├── useExerciseStore.ts
│   │   │   └── useGameStore.ts
│   │   ├── pages/
│   │   │   ├── Assessment.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Training.tsx
│   │   │   └── GameMode.tsx
│   │   ├── utils/
│   │   │   ├── poseAnalysis.ts
│   │   │   ├── gamePhysics.ts
│   │   │   └── validation.ts
│   │   ├── types/
│   │   │   ├── game.types.ts
│   │   │   ├── pose.types.ts
│   │   │   └── exercise.types.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── tsconfig.json
├── server/                      # Backend Node.js
│   ├── src/
│   │   ├── routes/
│   │   │   ├── exercises.ts
│   │   │   ├── users.ts
│   │   │   └── progress.ts
│   │   ├── controllers/
│   │   ├── middleware/
│   │   └── index.ts
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   └── tsconfig.json
├── package.json
└── README.md
```

---

## 🚀 CARACTERÍSTICAS AVANZADAS

### A. 🎮 PelvicBird Game (Gamificación)

**Concepto:** Juego de desplazamiento lateral donde la altura del personaje se controla mediante la fuerza de contracción del suelo pélvico.

**Mecánica:**
- **Alta Contracción** (Sensor > 70%) → El pájaro vuela hacia arriba
- **Relajación** (Sensor < 20%) → El pájaro cae
- **Simulación Dev:** Barra espaciadora o toque en pantalla simula la señal de contracción

**Implementación:**
- Canvas HTML5 con loop de `requestAnimationFrame`
- Física simple de gravedad y elevación
- Sistema de colisiones con tuberías
- Contador de puntuación

### B. 🤖 AI Posture Coach (Computer Vision)

**Concepto:** Vista de cámara que analiza la postura durante ejercicios para evitar movimientos compensatorios.

**Tecnología:**
- `react-webcam` para captura de video
- `@tensorflow-models/pose-detection` con MoveNet

**Lógica:**
1. Detectar puntos clave: Hombros, Caderas
2. Calcular estabilidad:
   - Si los hombros suben durante fase "Hold" → Advertencia "Relaja tus hombros"
   - Si las caderas se desplazan significativamente → Advertencia "Mantén caderas quietas"

**Privacidad:** Todo el procesamiento ocurre localmente en el navegador.

---

## 🔄 FLUJO DE LA APLICACIÓN

```
1. Inicio
   ↓
2. Evaluación Inicial (Assessment)
   ↓
3. Dashboard (Estado diario)
   ↓
4. Modo de Entrenamiento (Elección):
   ├─→ A. Guía Estándar (Círculo Biofeedback)
   └─→ B. Juego PelvicBird
   
   [Toggle] Habilitar Corrección AI (Activa Cámara)
```

---

## 📦 INSTALACIÓN Y CONFIGURACIÓN

### 1. Instalación de Dependencias

```bash
# Navegar al proyecto
cd PelviSense

# Instalar dependencias del cliente
cd client
npm install

# Instalar dependencias del servidor
cd ../server
npm install

# Volver a la raíz
cd ..
```

### 2. Variables de Entorno

**client/.env**
```env
VITE_API_URL=http://localhost:3000
VITE_ENABLE_AI=true
```

**server/.env**
```env
DATABASE_URL="file:./dev.db"
PORT=3000
```

---

## 🔧 COMANDOS DE DESARROLLO

```bash
# Iniciar servidor de desarrollo (Frontend)
cd client && npm run dev

# Iniciar servidor backend
cd server && npm run dev

# Build para producción
cd client && npm run build

# Generar Prisma Client
cd server && npx prisma generate

# Ejecutar migraciones
cd server && npx prisma migrate dev
```

---

## 📱 CARACTERÍSTICAS PWA

- **Offline First:** Service Worker cachea assets críticos
- **Instalable:** Manifest.json permite instalación en dispositivos
- **Responsive:** Mobile-First design con Tailwind CSS
- **Performance:** Code splitting y lazy loading

---

## 🎨 SISTEMA DE DISEÑO

### Colores (Tailwind)
```js
primary: '#6B46C1',      // Púrpura (ejercicios)
secondary: '#EC4899',    // Rosa (gamificación)
success: '#10B981',      // Verde (postura correcta)
warning: '#F59E0B',      // Ámbar (advertencias)
danger: '#EF4444',       // Rojo (postura incorrecta)
```

### Tipografía
- **Display:** Inter Bold
- **Body:** Inter Regular
- **Monospace:** JetBrains Mono (métricas)

---

## 🧪 TESTING

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage
npm run test:coverage
```

---

## 📊 MODELO DE DATOS (Prisma)

### Usuario
```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String
  age       Int
  gender    String
  createdAt DateTime @default(now())
  sessions  Session[]
  progress  Progress[]
}
```

### Sesión de Ejercicio
```prisma
model Session {
  id           String   @id @default(uuid())
  userId       String
  user         User     @relation(fields: [userId], references: [id])
  type         String   // "standard" | "game"
  duration     Int      // segundos
  contractions Int
  score        Int?     // Para modo juego
  aiEnabled    Boolean  @default(false)
  postureWarnings Int   @default(0)
  createdAt    DateTime @default(now())
}
```

---

## 🔐 SEGURIDAD Y PRIVACIDAD

1. **Video Stream:** Procesado 100% en el navegador, nunca se envía al servidor
2. **Datos Sensibles:** Encriptados en reposo
3. **HTTPS:** Obligatorio en producción
4. **CORS:** Configurado estrictamente
5. **Rate Limiting:** Implementado en API

---

## 🌐 COMPATIBILIDAD

### Navegadores Soportados
- Chrome/Edge 90+
- Safari 14+
- Firefox 88+

### Dispositivos
- iOS 14+
- Android 8+
- Desktop (Windows, macOS, Linux)

---

## 📈 MÉTRICAS DE RENDIMIENTO

- **First Contentful Paint:** < 1.5s
- **Time to Interactive:** < 3.5s
- **Lighthouse Score:** > 90

---

## 🚀 DESPLIEGUE

### Frontend (Vercel/Netlify)
```bash
cd client
npm run build
# Deploy dist/ folder
```

### Backend (Railway/Heroku)
```bash
cd server
npm run build
# Deploy con Dockerfile
```

---

## 📚 RECURSOS ADICIONALES

- [TensorFlow.js Pose Detection](https://github.com/tensorflow/tfjs-models/tree/master/pose-detection)
- [MoveNet Documentation](https://www.tensorflow.org/hub/tutorials/movenet)
- [React Webcam](https://www.npmjs.com/package/react-webcam)
- [Zustand Guide](https://github.com/pmndrs/zustand)

---

## 👥 EQUIPO Y SOPORTE

**Arquitecto:** Senior Full Stack Developer  
**Stack:** React + TypeScript + TensorFlow.js + Node.js  
**Fecha de Creación:** 26 de noviembre de 2025

---

*Esta guía será actualizada conforme evolucione el proyecto.*

