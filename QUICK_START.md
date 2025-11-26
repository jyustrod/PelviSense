# 🚀 GUÍA RÁPIDA DE INICIO - UROLF

## ⚡ Instalación Rápida (PowerShell)

### 1️⃣ Instalar Dependencias

```powershell
# Navegar al proyecto
cd C:\Users\javie_ecnbd8s\Proyectos\PelviSense

# Cliente (Frontend)
npm install

# Cliente
# Servidor (Backend)
npm install

# Servidor
cd ..\server
npm install

# Volver a raíz
**Nota**: No es necesario ejecutar `npm install` en la raíz del proyecto.


### 2️⃣ Configurar Base de Datos

```powershell
cd server
npx prisma generate
npx prisma migrate dev --name init
cd ..
```

### 3️⃣ Iniciar Aplicación

**Opción A: Por separado (Recomendado)** - Abrir 2 terminales PowerShell

```powershell
# Terminal 1 - Frontend
cd C:\Users\javie_ecnbd8s\Proyectos\PelviSense\client
npm run dev

# Terminal 2 - Backend
cd C:\Users\javie_ecnbd8s\Proyectos\PelviSense\server
npm run dev
```

**Importante**: Debes tener ambos servidores corriendo simultáneamente.


## 🌐 URLs de Acceso

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **Prisma Studio**: http://localhost:5555 (ejecutar `npx prisma studio` en /server)

## 🎯 Acceso Rápido a Funciones

### Dashboard Principal
```
http://localhost:5173/
```

### Entrenamiento Guiado con IA
```
http://localhost:5173/training
```

### Juego PelvicBird
```
http://localhost:5173/game
```

## 🎮 Controles

### En el Juego PelvicBird
- **ESPACIO** o **TOQUE EN PANTALLA**: Simula contracción (hace volar al pájaro)
- **CLICK**: Iniciar/Reiniciar juego

### En Entrenamiento
- **ESPACIO** (mantener): Simula contracción muscular
- **Botón Cámara**: Activar/desactivar corrección AI

## 🤖 Activar Corrección de Postura AI

1. Ir a http://localhost:5173/training
2. Click en el botón "Activar Cámara"
3. Dar permisos de cámara cuando el navegador lo solicite
4. Esperar a que el modelo MoveNet se cargue (~5 segundos)
5. ¡Listo! Verás advertencias en tiempo real si tu postura no es correcta

## 📦 Dependencias Clave Instaladas

### Frontend (client/)
```json
{
  "react": "^18.2.0",
  "react-router-dom": "^6.20.0",
  "zustand": "^4.4.7",
  "@tensorflow/tfjs": "^4.15.0",
  "@tensorflow-models/pose-detection": "^2.1.3",
  "react-webcam": "^7.2.0",
  "lucide-react": "^0.294.0",
  "tailwindcss": "^3.3.6",
  "vite": "^5.0.8",
  "typescript": "^5.2.2"
}
```

### Backend (server/)
```json
{
  "express": "^4.18.2",
  "@prisma/client": "^5.7.1",
  "cors": "^2.8.5",
  "helmet": "^7.1.0"
}
```

## 🔧 Comandos Útiles

### Limpiar y Reinstalar
```powershell
# Cliente
cd client
rm -rf node_modules
rm package-lock.json
npm install

# Servidor
cd ..\server
rm -rf node_modules
rm package-lock.json
npm install
```

### Ver Base de Datos
```powershell
cd server
npx prisma studio
# Abre en http://localhost:5555
```

### Build para Producción
```powershell
# Cliente
cd client
npm run build

# Servidor
cd ..\server
npm run build
```

## ⚠️ Solución de Problemas Comunes

### Error: "Cannot find module '@tensorflow/tfjs'"
```powershell
cd client
npm install @tensorflow/tfjs @tensorflow-models/pose-detection @tensorflow/tfjs-backend-webgl --save
```

### Error: "Webcam not accessible"
- Verifica que estés en `localhost` (no una IP externa)
- Usa Chrome o Edge (mejor soporte para webcam)
- Revisa permisos de cámara en el navegador
- En Windows: Configuración > Privacidad > Cámara

### Error: "Port 5173 already in use"
```powershell
# Matar proceso en puerto 5173
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

### Error: "Prisma Client not generated"
```powershell
cd server
npx prisma generate
```

### La página carga pero no se ve nada
1. Abre DevTools (F12)
2. Busca errores en Console
3. Verifica que todas las dependencias estén instaladas
4. Intenta limpiar caché: Ctrl + Shift + R

## 📁 Archivos Clave del Proyecto

```
client/src/
├── components/
│   ├── game/PelvicBird.tsx           ⭐ Juego Flappy Bird
│   └── exercise/ExercisePlayer.tsx   ⭐ Reproductor con AI
├── hooks/
│   └── usePoseEstimation.ts          ⭐ Hook de Computer Vision
├── pages/
│   ├── Dashboard.tsx                  📱 Pantalla principal
│   ├── Training.tsx                   💪 Entrenamiento
│   └── GameMode.tsx                   🎮 Modo juego
└── types/
    ├── game.types.ts                  🎯 Tipos del juego
    ├── pose.types.ts                  🤖 Tipos de pose AI
    └── exercise.types.ts              💪 Tipos de ejercicios
```

## 🎓 Primeros Pasos Recomendados

1. **Explorar Dashboard** → http://localhost:5173/
2. **Probar Juego** → Click en "PelvicBird Game"
3. **Activar IA** → Ir a "Entrenamiento Guiado" → Activar Cámara
4. **Revisar Código** → Ver archivos en `client/src/components/`

## 📚 Documentación Adicional

- **Guía Completa**: Ver `CODEBASE_GUIDE.md`
- **Instalación Detallada**: Ver `INSTALLATION_COMMANDS.md`
- **README**: Ver `README.md`

## 💡 Tips de Desarrollo

### Hot Reload
Ambos servidores (Vite y Express) soportan hot reload. Los cambios se reflejan automáticamente.

### TypeScript Strict Mode
Está activado. Usa tipos explícitos para evitar errores:
```typescript
const [value, setValue] = useState<number>(0);
```

### Tailwind Intellisense
Instala la extensión "Tailwind CSS IntelliSense" en VS Code para autocompletado.

### React DevTools
Instala la extensión de navegador para debugging:
- Chrome: React Developer Tools
- Firefox: React Developer Tools

## 🆘 Soporte

Si encuentras algún problema:

1. Revisa la consola del navegador (F12)
2. Revisa los logs del terminal
3. Busca en `CODEBASE_GUIDE.md`
4. Verifica que todas las dependencias estén instaladas

## ✅ Checklist de Instalación

- [ ] Node.js >= 18.x instalado
- [ ] Dependencias raíz instaladas (`npm install`)
- [ ] Dependencias cliente instaladas (`cd client && npm install`)
- [ ] Dependencias servidor instaladas (`cd server && npm install`)
- [ ] Prisma Client generado (`cd server && npx prisma generate`)
- [ ] Frontend corriendo en localhost:5173
- [ ] Backend corriendo en localhost:3000
- [ ] Permisos de cámara otorgados (para AI)

---

**¡Todo listo!** 🎉 Ahora puedes empezar a desarrollar y probar UROLF.

Para cualquier duda, revisa la documentación completa en los archivos markdown del proyecto.

