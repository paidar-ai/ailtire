// server.js (Node 18+, ESM)
const express = require("express");
const {McpServer} = require("@modelcontextprotocol/sdk/server/mcp.js");
const {StreamableHTTPServerTransport} = require("@modelcontextprotocol/sdk/server/streamableHttp.js");
const {z} = require("zod");

const app = express();
app.use(express.json());

// 1) Singleton MCP server
const mcpServer = new McpServer({ name: "express-mcp", version: "1.0.0" });

// Example tool so tools/list has content
mcpServer.registerTool(
    "echo",
    {
        title: "Echo Tool",
        description: "Echoes back the provided text",
        inputSchema: { text: z.string() },
    },
    async ({ text }) => ({
        content: [{ type: "text", text }],
    })
);

// 2) Session → Transport map
const sessions = new Map(); // sessionId -> { transport, close }

// helper: get or create a transport for a session
async function ensureSessionTransport(sessionId) {
    let entry = sessions.get(sessionId);
    if (entry) return entry;

    const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: () => sessionId });

    // Connect once; reuse for all requests with this session
    await mcpServer.connect(transport);

    entry = {
        transport,
        close: () => {
            try { transport.close(); } catch {}
            sessions.delete(sessionId);
        },
    };
    sessions.set(sessionId, entry);
    return entry;
}

// 3) JSON-RPC endpoint
app.post("/mcp", async (req, res) => {
    try {
        const sid = req.header("Mcp-Session-Id") || "default-session";
        const { transport } = await ensureSessionTransport(sid);

        // MCP transport requires client to accept JSON + SSE (even if not streaming)
        if (!req.headers.accept?.includes("application/json") || !req.headers.accept?.includes("text/event-stream")) {
            return res.status(406).json({
                jsonrpc: "2.0",
                id: null,
                error: { code: -32000, message: "Not Acceptable: Client must accept both application/json and text/event-stream" },
            });
        }

        await transport.handleRequest(req, res, req.body);
    } catch (err) {
        console.error("MCP /mcp error:", err);
        if (!res.headersSent) {
            res.status(500).json({ jsonrpc: "2.0", id: null, error: { code: -32603, message: "Internal server error" } });
        }
    }
});

// 4) Notifications (Server-Sent Events)
app.get("/mcp/notifications", async (req, res) => {
    try {
        const sid = req.header("Mcp-Session-Id") || "default-session";
        const { transport } = await ensureSessionTransport(sid);
        await transport.handleSse(req, res);
    } catch (err) {
        console.error("MCP /mcp/notifications error:", err);
        if (!res.headersSent) res.status(500).end();
    }
});

// 5) Session cleanup
app.delete("/mcp/session", (req, res) => {
    const sid = req.header("Mcp-Session-Id") || "default-session";
    const entry = sessions.get(sid);
    if (entry) {
        entry.close();
        return res.status(204).end();
    }
    return res.status(404).json({ error: "Session not found" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`MCP server ready:
  POST http://localhost:${PORT}/mcp
   GET http://localhost:${PORT}/mcp/notifications
DELETE http://localhost:${PORT}/mcp/session`);
});
