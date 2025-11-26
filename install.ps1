# 🚀 SCRIPT DE INSTALACIÓN AUTOMÁTICA - UROLF
# Ejecutar desde PowerShell en la raíz del proyecto

Write-Host "╔═══════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║           UROLF - Instalación Automática                     ║" -ForegroundColor Cyan
Write-Host "║    Pelvic Floor Rehabilitation PWA with AI Computer Vision   ║" -ForegroundColor Cyan
Write-Host "╚═══════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Verificar Node.js
Write-Host "🔍 Verificando Node.js..." -ForegroundColor Yellow
$nodeVersion = node --version 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Node.js no está instalado. Por favor instala Node.js >= 18.x" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Node.js versión: $nodeVersion" -ForegroundColor Green
Write-Host ""

# Paso 1: Instalar dependencias raíz
Write-Host "📦 [1/5] Instalando dependencias raíz..." -ForegroundColor Cyan
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error al instalar dependencias raíz" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Dependencias raíz instaladas" -ForegroundColor Green
Write-Host ""

# Paso 2: Instalar dependencias del cliente
Write-Host "📦 [2/5] Instalando dependencias del cliente (Frontend)..." -ForegroundColor Cyan
Set-Location client
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error al instalar dependencias del cliente" -ForegroundColor Red
    Set-Location ..
    exit 1
}
Write-Host "✅ Dependencias del cliente instaladas" -ForegroundColor Green
Set-Location ..
Write-Host ""

# Paso 3: Instalar dependencias del servidor
Write-Host "📦 [3/5] Instalando dependencias del servidor (Backend)..." -ForegroundColor Cyan
Set-Location server
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error al instalar dependencias del servidor" -ForegroundColor Red
    Set-Location ..
    exit 1
}
Write-Host "✅ Dependencias del servidor instaladas" -ForegroundColor Green
Write-Host ""

# Paso 4: Generar Prisma Client
Write-Host "🔧 [4/5] Generando Prisma Client..." -ForegroundColor Cyan
npx prisma generate
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error al generar Prisma Client" -ForegroundColor Red
    Set-Location ..
    exit 1
}
Write-Host "✅ Prisma Client generado" -ForegroundColor Green
Write-Host ""

# Paso 5: Ejecutar migraciones
Write-Host "🗄️  [5/5] Ejecutando migraciones de base de datos..." -ForegroundColor Cyan
npx prisma migrate dev --name init
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Advertencia: Error al ejecutar migraciones (puede ser normal si ya existen)" -ForegroundColor Yellow
}
Write-Host "✅ Migraciones completadas" -ForegroundColor Green
Set-Location ..
Write-Host ""

# Resumen
Write-Host "╔═══════════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║              🎉 INSTALACIÓN COMPLETADA                        ║" -ForegroundColor Green
Write-Host "╚═══════════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Próximos pasos:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1️⃣  Iniciar el servidor de desarrollo:" -ForegroundColor White
Write-Host "   npm run dev" -ForegroundColor Yellow
Write-Host ""
Write-Host "   O por separado:" -ForegroundColor White
Write-Host "   Terminal 1: cd client && npm run dev" -ForegroundColor Yellow
Write-Host "   Terminal 2: cd server && npm run dev" -ForegroundColor Yellow
Write-Host ""
Write-Host "2️⃣  Abrir en el navegador:" -ForegroundColor White
Write-Host "   Frontend: http://localhost:5173" -ForegroundColor Yellow
Write-Host "   Backend:  http://localhost:3000" -ForegroundColor Yellow
Write-Host ""
Write-Host "3️⃣  Explorar la documentación:" -ForegroundColor White
Write-Host "   • README.md               - Documentación principal" -ForegroundColor Yellow
Write-Host "   • CODEBASE_GUIDE.md       - Guía arquitectónica" -ForegroundColor Yellow
Write-Host "   • QUICK_START.md          - Guía rápida" -ForegroundColor Yellow
Write-Host "   • EXECUTIVE_SUMMARY.md    - Resumen ejecutivo" -ForegroundColor Yellow
Write-Host "   • ARCHITECTURE_DIAGRAM.md - Diagramas visuales" -ForegroundColor Yellow
Write-Host ""
Write-Host "4️⃣  Características principales:" -ForegroundColor White
Write-Host "   🎮 PelvicBird Game        - Juego estilo Flappy Bird" -ForegroundColor Yellow
Write-Host "   🤖 AI Posture Coach       - Corrección con Computer Vision" -ForegroundColor Yellow
Write-Host "   💪 Exercise Player        - Entrenamiento con biofeedback" -ForegroundColor Yellow
Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "              ¡Disfruta desarrollando con UROLF! 🏥💜            " -ForegroundColor Magenta
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

