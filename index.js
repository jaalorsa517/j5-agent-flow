import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const AGENTS_DIR = path.join(__dirname, "agentes");

// 1. Inicializar el servidor MCP
const server = new Server(
    { name: "mis-agentes-personalizados", version: "1.0.0" },
    { capabilities: { tools: {} } }
);

// 2. Definir qué herramientas existen
server.setRequestHandler(ListToolsRequestSchema, async () => {
    // Leemos dinámicamente qué archivos .md existen en la carpeta
    const files = fs.readdirSync(AGENTS_DIR).filter(f => f.endsWith('.md'));
    const agentNames = files.map(f => f.replace('.md', ''));

    return {
        tools: [
            {
                name: "obtener_agente",
                description: `Carga las instrucciones de un especialista. Agentes disponibles: ${agentNames.join(', ')}`,
                inputSchema: {
                    type: "object",
                    properties: {
                        nombre: { type: "string", description: "El nombre del agente (ej. abogado, programador)" }
                    },
                    required: ["nombre"]
                }
            }
        ]
    };
});

// 3. Ejecutar la herramienta cuando la IA la llama
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    if (request.params.name === "obtener_agente") {
        const agentName = request.params.arguments.nombre;
        const filePath = path.join(AGENTS_DIR, `${agentName}.md`);

        try {
            const contenido = fs.readFileSync(filePath, "utf-8");
            return {
                content: [{ type: "text", text: `Adopta la siguiente metodología:\n\n${contenido}` }]
            };
        } catch (error) {
            return {
                content: [{ type: "text", text: `Error: No se encontró al agente '${agentName}'.` }]
            };
        }
    }
    throw new Error("Herramienta no encontrada");
});

// 4. Iniciar la comunicación por terminal (stdio)
const transport = new StdioServerTransport();
await server.connect(transport);
console.error("Servidor MCP de Agentes iniciado.");