#!/bin/bash

# Configuración de rutas
WORKSPACE_DIR=$(pwd)
DEST_DIR="$HOME/.gemini/mcp/j5-agent-flow"

echo "🚀 Iniciando despliegue de j5-agent-flow..."

# 1. Ir al workspace y construir
cd "$WORKSPACE_DIR" || { echo "❌ Error: No se encontró el workspace"; exit 1; }
echo "📦 Construyendo proyecto en $WORKSPACE_DIR..."
pnpm run build || { echo "❌ Error: Falló pnpm run build"; exit 1; }

# 2. Mover transpilado a destino
echo "🚚 Moviendo transpilado a $DEST_DIR..."
# Crear directorio base si no existe (usamos $HOME para expansión correcta)
mkdir -p "$HOME/.gemini/mcp"
# Eliminar versión anterior si existe
rm -rf "$DEST_DIR"
# Mover la carpeta generada por el build
mv "$WORKSPACE_DIR/j5-agent-flow" "$DEST_DIR"

# 3. Instalar dependencias en destino (Aislado)
cd "$DEST_DIR" || { echo "❌ Error: No se pudo acceder a $DEST_DIR"; exit 1; }
echo "📥 Instalando dependencias de producción en $DEST_DIR..."
# --prod: solo dependencias
# --no-frozen-lockfile: generar nuevo lockfile si es necesario para el entorno destino
pnpm install --prod --no-frozen-lockfile || { echo "❌ Error: Falló pnpm install"; exit 1; }

echo "✅ Despliegue completado con éxito."
