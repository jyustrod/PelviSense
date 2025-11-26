# 🚀 UROLF - Comandos de Instalación

## Instalación Completa del Proyecto

### 1️⃣ Instalar Dependencias Raíz
cd C:\Users\javie_ecnbd8s\Proyectos\PelviSense
npm install

### 2️⃣ Instalar Dependencias del Cliente (Frontend)
cd client
npm install

# Dependencias principales que se instalarán:
# - react & react-dom (^18.2.0)
# - react-router-dom (^6.20.0)
# - zustand (^4.4.7)
# - @tensorflow/tfjs (^4.15.0)
# - @tensorflow-models/pose-detection (^2.1.3)
# - @tensorflow/tfjs-backend-webgl (^4.15.0)
# - react-webcam (^7.2.0)
# - lucide-react (^0.294.0)
# - clsx (^2.0.0)
# - vite (^5.0.8)
# - typescript (^5.2.2)
# - tailwindcss (^3.3.6)

### 3️⃣ Instalar Dependencias del Servidor (Backend)
cd ../server
npm install

### 4️⃣ Volver a la Raíz
cd ..

## Comandos de Desarrollo

### Iniciar Todo (Frontend + Backend)
npm run dev

### Solo Frontend
npm run dev:client

### Solo Backend
npm run dev:server

## Construcción para Producción

### Build Completo
npm run build

### Solo Frontend
npm run build:client

### Solo Backend
npm run build:server

## Comandos Adicionales

### Linting (Frontend)
cd client && npm run lint

### Preview de Build (Frontend)
cd client && npm run preview

### Generar Prisma Client (Backend)
cd server && npx prisma generate

### Ejecutar Migraciones (Backend)
cd server && npx prisma migrate dev

### Ver Base de Datos (Backend)
cd server && npx prisma studio

## Notas Importantes

⚠️ **TensorFlow.js**: La primera vez que inicies la app con AI habilitado,
   el modelo MoveNet se descargará automáticamente (~7MB). Esto puede tardar
   unos segundos dependiendo de tu conexión.

⚠️ **Webcam**: Necesitarás dar permisos de cámara en el navegador cuando
   habilites la corrección de postura AI.

⚠️ **HTTPS**: Para usar la webcam en producción, necesitas HTTPS. En desarrollo
   localhost funciona sin HTTPS.

## Estructura de Puertos

- Frontend (Vite): http://localhost:5173
- Backend (Express): http://localhost:3000
- Prisma Studio: http://localhost:5555

## Verificar Instalación

Una vez instaladas las dependencias, verifica que todo esté correcto:

```bash
# Verificar versiones de Node y npm
node --version  # Debería ser >= 18.x
npm --version   # Debería ser >= 9.x

# Verificar TypeScript
cd client && npx tsc --version
```

## Solución de Problemas

### Error: "Cannot find module '@tensorflow/tfjs'"
```bash
cd client
npm install @tensorflow/tfjs @tensorflow-models/pose-detection @tensorflow/tfjs-backend-webgl
```

### Error: "Webcam not working"
- Asegúrate de estar en HTTPS o localhost
- Verifica permisos de cámara en tu navegador
- Intenta con otro navegador (Chrome recomendado)

### Error: "Prisma Client not generated"
```bash
cd server
npx prisma generate
```

### Error: "Port already in use"
```bash
# Cambiar puerto en client/vite.config.ts o server/.env
```

## Recursos Útiles

- [Vite Docs](https://vitejs.dev/)
- [React Docs](https://react.dev/)
- [TensorFlow.js](https://www.tensorflow.org/js)
- [Prisma Docs](https://www.prisma.io/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)

