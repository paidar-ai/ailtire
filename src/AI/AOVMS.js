const axios = require("axios");
const AIAdaptor = require("./AIAdaptor");
const execSync = require("child_process").execSync;

class AOVMS extends AIAdaptor {
    constructor(config) {
        super();
        if (!config.url) {
            throw new Error("API URL is required to connect to the LLaMA server.");
        }
        this.apiUrl = config.url; // The server URL hosting the LLaMA model
        this.model = config.model || 'model0'
    }

    /**
     * Initialize the LLaMA client connection.
     * Since axios doesn't require real initialization (but a test request could be done),
     * this method can optionally ensure the server is accessible.
     */
    async init() {
        console.log("Initializing LLaMA adaptor...");

        try {
            await _startOVMS(this);
            console.log("LLaMA Pulling model:", this.model);
            let response = await axios.get(`${this.apiUrl}/v1/config`);
            if (response.status === 200) {
                console.log(`LLaMA model ${this.model} is up and ready.`);
            } else {
                throw new Error(`LLaMA server health check failed: ${response.statusText}`);
            }
            response = await axios.post(`${this.apiUrl}/v1/completions`, {
                model: this.model,
                prompt: "Good Morning Hal!"
            });
           console.log(response.data);
            return;
        } catch (error) {
            console.error("Error while connecting to the LLaMA server:", error.message || error);
            throw new Error("Failed to connect to the LLaMA API. Ensure the API URL is correct.");
        }
    }

    async generateText(opts) {
        if (!this.apiUrl) {
            throw new Error("LLaMA server URL is not set. Ensure the adaptor is configured correctly.");
        }
        let model = opts.model || global.ailtire.config.ai.model || this.model;
        try {
            const response = await axios.post(`${this.apiUrl}/v3/completions`, {
                model: model,
                prompt: opts.prompt,
            });

            if (response.status === 200 && response.data && response.data.text) {
                return response.data.text.trim(); // Return the generated text
            } else {
                throw new Error("Unexpected response from LLaMA API.");
            }
        } catch (error) {
            console.error("Error while generating text from LLaMA server:", error.message || error);
            throw new Error("Failed to generate text from the LLaMA server.");
        }
    }

    async chat(opts) {
        if (!this.apiUrl) {
            throw new Error("OVMS server URL is not set. Ensure the adaptor is configured correctly.");
        }

        let model = opts.model || global.ailtire.config.ai.model || this.model;
        try {
            const response = await axios.post(`${this.apiUrl}/v3/chat/completions`, {
                // const response = await Ollama.generate({
                raw: true,
                stream: false,
                model: model,
                messages: opts.messages,
            });

            if (response.status === 200 && response.data) {
                return response.data.message.content.trim();
            } else {
                throw new Error("Unexpected response from LLaMA API.");
            }
        } catch (error) {
            console.error("Error while generating text from LLaMA server:", error.message || error);
            throw new Error("Failed to generate text from the LLaMA server.");
        }
    }
}

const _sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function _startOVMS(obj) {
    let completed = false;
    let timeout = 1000;
    while (!completed) {
        try {
            console.log(`Checking OVMS accessibility at ${obj.apiUrl}/v1/config`);
            let response = await axios.get(`${obj.apiUrl}/v1/config`);
           
            if (response.status !== 200) {
                console.log("Starting OVMS server...");
                const cmd = `docker run --device /dev/dxg -v c:/Users/darre/models:/models -p 9000:9000 -p 8000:8000 openvino/model_server:latest-gpu --model_path /models/model0 --model_name model0 --rest_port 8000 --port 9000 --target_device CPU`;
                let results = await execSync(cmd);
                console.log(results.toString());
                await _sleep(timeout);
                timeout *= 2;
            } else {
                completed = true;
            }
        } catch(error) {
            console.log("Starting OLlamA server...");
            const cmd = `docker run --device /dev/dxg -v c:/Users/darre/models:/models -p 9000:9000 -p 8000:8000 openvino/model_server:latest-gpu --model_path /models/model0 --model_name model0 --rest_port 8000 --port 9000 --target_device CPU`;
            let results = await execSync(cmd);
            console.log(results.toString());
            await _sleep(timeout);
            timeout *= 2;
        }
    }
    return;
}

module.exports = AOVMS;
