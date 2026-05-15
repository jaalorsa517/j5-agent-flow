# j5-agent-flow

Servidor MCP (Model Context Protocol) escrito en TypeScript para la orquestación de agentes siguiendo un flujo o pipeline topológico estricto (Topologic Agent Pipeline).

## Propósito y Descripción del Proyecto

El propósito de **j5-agent-flow** es, a través de un MCP, crear un flujo de trabajo estructurado para agentes. Actúa como una agencia donde:
- Hay **1 orquestador** (a través del prompt principal de `j5-agent-flow`).
- Hay múltiples **subagentes especialistas** disponibles.

Actualmente, los subagentes disponibles en la agencia son:
- **Coder**: (`coder.md`)
- **Coder-test**: (`coder-test.md`)
- **Planner**: (`planner.md`)
- **QA-tester**: (`qa-tester.md`)
- **Test-designer**: (`test-designer.md`)
- **Validador-planes**: (`validador_planes.md`)

**j5-agent-flow** utiliza el Model Context Protocol para proporcionar estas capacidades (herramientas y prompts) a clientes (como Gemini o Claude) exponiendo las instrucciones de estos agentes de forma modular.

### Prerrequisitos
- **Engram**: Es necesario para guardar y mantener el contexto entre los distintos subagentes durante el flujo de trabajo.

## Funcionamiento

El servidor carga dinámicamente configuraciones basadas en archivos Markdown al arrancar:

- **Agentes (`src/agents/`)**: El código lee los archivos `.md` de este directorio y registra automáticamente herramientas MCP con el formato `obtener_agente_[nombre]`. Al llamar a la herramienta, el servidor devuelve las instrucciones o metodología del agente.
- **Prompts (`src/prompts/`)**: De la misma manera, se leen los archivos `.md` en la carpeta `src/prompts/` y se registran como Prompts de MCP. Aceptan un parámetro opcional llamado `requerimiento`, el cual se concatena a las instrucciones para proporcionar el contexto necesario a la LLM.

El servidor se comunica con el cliente usando el transporte estándar sobre `stdio`.

## Instalación y Uso Local

Para ejecutar y probar el servidor en tu entorno local (útil para el desarrollo de nuevos agentes y pruebas con clientes de MCP):

1. Clona el repositorio.
2. Instala las dependencias:
   ```bash
   pnpm install
   ```
3. Ejecuta el servidor en modo desarrollo (utiliza `tsx` para interpretar TypeScript sobre la marcha):
   ```bash
   pnpm dev
   ```

## Compilación (Release) y Despliegue

Para desplegar la aplicación de manera que pueda ser consumida por clientes como herramientas MCP en un entorno de producción (ej. Gemini o la aplicación Claude de escritorio):

### 1. Generar la build
El proceso de compilación transpilara el código TypeScript, copiará las carpetas estáticas (`src/agents/` y `src/prompts/`) y preparará un `package.json` de producción:
```bash
pnpm build
```
Esto genera la carpeta `j5-agent-flow/` lista para producción.

### 2. Despliegue Automatizado
El repositorio cuenta con un script automatizado `deploy-mcp.sh` que mueve la build a la ubicación requerida para uso externo e instala solo las dependencias de producción. Ejecuta:
```bash
pnpm deploy
```
*Este comando realizará lo siguiente:*
- Construirá el proyecto (`pnpm build`).
- Creará el directorio de despliegue en `~/.gemini/mcp/j5-agent-flow`.
- Moverá la carpeta compilada al destino.
- Instalará dependencias para producción (aislado).

## Configuración del cliente MCP
Una vez desplegado o construido el proyecto, puedes configurar tu cliente para apuntar al archivo final generado. Por ejemplo:
```json
{
  "mcpServers": {
    "j5-agent-flow": {
      "command": "node",
      "args": [
        "RutaAbsolutaA/j5-agent-flow/index.js"
      ]
    }
  }
}
```
Reemplaza `RutaAbsolutaA` con la ubicación donde quedó alojado, o la ruta de despliegue `~/.gemini/mcp/j5-agent-flow/index.js`.
