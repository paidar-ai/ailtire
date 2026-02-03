// client-axios.js
const axios = require("axios");

const MCP_URL = process.env.MCP_URL || "http://localhost/mcp";
const SESSION_ID = process.env.MCP_SESSION_ID || "my-session-2";

const headers = {
    "content-type": "application/json",
    "accept": "application/json, text/event-stream",
    "mcp-session-id": SESSION_ID,
};

async function rpc(method, params = {}, id = 1) {
    try {
        const { data } = await axios.post(
            MCP_URL,
            { jsonrpc: "2.0", id, method, params },
            { headers }
        );
        return data;
    } catch (err) {
        if (err.response) {
            console.error("HTTP error:", err.response.status, err.response.data);
        } else {
            console.error(err.message);
        }
        process.exit(1);
    }
}

async function notify(method, params = {}) {
    try {
        // Notifications have no "id"
        await axios.post(MCP_URL, { jsonrpc: "2.0", method, params }, { headers });
    } catch (err) {
        if (err.response) {
            console.error("HTTP error:", err.response.status, err.response.data);
        } else {
            console.error(err.message);
        }
        process.exit(1);
    }
}

(async () => {
    // 1) initialize
    const init = await rpc(
        "initialize",
        {
            protocolVersion: "2025-03-26",
            capabilities: { roots: { listChanged: true }, sampling: {} },
            clientInfo: { name: "AxiosClient", version: "1.0.0" },
        },
        1
    );
    console.log("initialize ->", JSON.stringify(init, null, 2));

    // 2) notifications/initialized
    await notify("notifications/initialized");

    // 3) tools/list
    const tools = await rpc("tools/list", {}, 2);
    console.log("tools/list ->", JSON.stringify(tools, null, 2));
})();
