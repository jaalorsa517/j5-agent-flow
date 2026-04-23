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

// 1. Inicializar el servidor MCP con capacidad de logging
const server = new McpServer({
    name: "j5-agent-flow-mcp",
    version: "1.0.0"
}, {
    capabilities: {
        logging: {}
    }
});

function registerAgents() {
    try {
        if (!fs.existsSync(AGENTS_DIR)) {
            fs.mkdirSync(AGENTS_DIR, { recursive: true });
            return;
        }
        const files = fs.readdirSync(AGENTS_DIR).filter(f => f.endsWith('.md'));
        for (const file of files) {
            const agentName = file.replace('.md', '');
            const filePath = path.join(AGENTS_DIR, file);
            server.registerTool(
                `obtener_agente_${agentName}`,
                {
                    description: `Carga las instrucciones del especialista: ${agentName}`,
                    inputSchema: z.object({})
                },
                async () => {
                    try {
                        const contenido = fs.readFileSync(filePath, "utf-8");
                        return {
                            content: [{ type: "text", text: `Adopta la siguiente metodología:\n\n${contenido}` }]
                        };
                    } catch (error) {
                        return {
                            content: [{ type: "text", text: `Error: No se pudo cargar el agente '${agentName}'.` }],
                            isError: true
                        };
                    }
                }
            );
        }
    } catch (err) {
        server.server.sendLoggingMessage(
            { level: "error", data: `Error registrando agentes ${err}` }
        )
    }
}
registerAgents();

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
                async () => {
                    try {
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
                    } catch (error) {
                        throw error;
                    }
                }
            );
        }
    } catch (err) {
        server.server.sendLoggingMessage(
            { level: "error", data: `Error registrando prompts ${err}` }
        )
    }
}
registerPrompts();

async function run() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    server.server.sendLoggingMessage(
        { level: "info", data: "Servidor MCP iniciado correctamente" }
    )
}

run().catch(error => {
    server.server.sendLoggingMessage(
        { level: "error", data: `Error corriendo el servidor ${error}` }
    )
});
