import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Calculamos __dirname en entorno de módulos ES para que apunte a la carpeta actual (src o dist)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const AGENTS_DIR = path.join(__dirname, "agents");
const PROMPTS_DIR = path.join(__dirname, "prompts");

// 1. Inicializar el servidor MCP
const server = new McpServer({
    name: "j5-agent-flow-mcp",
    version: "1.0.0"
});

// Función para obtener nombres de agentes disponibles
function getAvailableAgents(): string {
    try {
        const files = fs.readdirSync(AGENTS_DIR).filter(f => f.endsWith('.md'));
        return files.map(f => f.replace('.md', '')).join(', ');
    } catch {
        return "No se pudieron cargar los agentes";
    }
}

// Función para obtener nombres de prompts disponibles
function getAvailablePrompts(): string {
    try {
        if (!fs.existsSync(PROMPTS_DIR)) fs.mkdirSync(PROMPTS_DIR, { recursive: true });
        const files = fs.readdirSync(PROMPTS_DIR).filter(f => f.endsWith('.md'));
        return files.map(f => f.replace('.md', '')).join(', ');
    } catch {
        return "No se pudieron cargar los prompts";
    }
}

// 2. Definir herramienta usando el nuevo API (McpServer)
server.registerTool(
    "obtener_agente",
    {
        description: `Carga las instrucciones de un especialista. Agentes disponibles: ${getAvailableAgents()}`,
        inputSchema: {
            nombre: z.string().describe("El nombre del agente (ej. abogado, programador)")
        }
    },
    async ({ nombre }) => {
        const filePath = path.join(AGENTS_DIR, `${nombre}.md`);

        try {
            const contenido = fs.readFileSync(filePath, "utf-8");
            return {
                content: [{ type: "text", text: `Adopta la siguiente metodología:\n\n${contenido}` }]
            };
        } catch (error) {
            return {
                content: [{ type: "text", text: `Error: No se encontró al agente '${nombre}'.` }]
            };
        }
    }
);

// 3. Registrar prompts dinámicamente
function registerPrompts() {
    try {
        if (!fs.existsSync(PROMPTS_DIR)) {
            fs.mkdirSync(PROMPTS_DIR, { recursive: true });
        }
        const files = fs.readdirSync(PROMPTS_DIR).filter(f => f.endsWith('.md'));
        for (const file of files) {
            const promptName = file.replace('.md', '');
            const filePath = path.join(PROMPTS_DIR, file);
            server.registerPrompt(
                promptName,
                {
                    title: promptName,
                    description: `Carga el prompt de sistema: ${promptName}`
                },
                () => {
                    const contenido = fs.readFileSync(filePath, "utf-8");
                    return {
                        messages: [
                            {
                                role: "user",
                                content: {
                                    type: "text",
                                    text: contenido
                                }
                            }
                        ]
                    };
                }
            );
        }
    } catch (err) {
        console.error("Error registrando prompts:", err);
    }
}
registerPrompts();

// 4. Iniciar la comunicación por terminal (stdio)
async function run() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.log(`Servidor MCP de Agentes iniciado.`);
    console.log(`Agentes: ${getAvailableAgents()}`);
    console.log(`Prompts: ${getAvailablePrompts()}`);
}

run().catch(console.error);
