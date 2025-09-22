<script>

    import {postJSON} from "../utils/api.js";

    import {marked} from 'marked';

    let prompt = '';
    let isLoading = false;
    let error = null;
    let responses = [];

    function onKeyDown(event) {
        if (event.key === 'Enter') {
            askAI();
        }
    }

    async function askAI() {
        if (!prompt.trim()) {
            error = "Please enter a prompt.";
            return;
        }

        const promptValue = prompt.trim();
        const uid = `gearai-${Math.random().toString(36).substr(2, 9)}`;

        responses = [...responses, {
            type: 'prompt',
            content: promptValue
        }, {
            type: 'response',
            id: uid,
            content: '<small><i>Generating Answer...</i></small>'
        }];

        isLoading = true;
        prompt = 'Waiting...';
        let url = 'ai/chat';

        let body = { prompt: promptValue };

        postJSON(url, body)
            .then((responseText) => {
                responses = responses.map(r =>
                    r.id === uid
                        ? {...r, content: responseText}
                        : r
                );
                prompt = "Ask Ailtire a question..";
                error = null;
                isLoading = false;
            })
            .catch((err) => {
                console.error(err);
            });
    }
</script>

<style>
    .aiprompt {
        display: inline-block;
        padding: 10px;
        margin: 5px 0;
        background-color: #f0f8ff; /* Light blue (can substitute for light gray, e.g., #f7f7f7) */
        border: 1px solid #d3d3d3; /* Light gray border */
        border-radius: 5px; /* Rounded corners */
        font-size: 12px;
        font-family: Arial, sans-serif;
        color: #333; /* Text color */
    }

    .aiSendButton {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        width: 40px;
        height: 40px;
        background-color: #007bff;
        color: #fff;
        border: none;
        border-radius: 50%;
        font-size: 20px;
        line-height: 20px;
        cursor: pointer;
    }

    .aiStopButton {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        width: 40px;
        height: 40px;
        background-color: #aa0000;
        color: #fff;
        border: none;
        border-radius: 0%;
        font-size: 32px;
        line-height: 20px;
        cursor: wait;
    }
</style>
<div id="aiContainer" style="display: flex; flex-direction: column; height: 100%; border: 1px solid #ddd;">
    <!-- Response Area -->
    <div id="aiResponse"
         style="flex: 1; padding: 10px; overflow-y: auto; background-color: #f9f9f9; border-bottom: 1px solid #ddd;">
        {#if responses.length === 0}
            <p><em>The AI's response will appear here...</em></p>
        {/if}
        {#each responses as response}
            <div class={response.type === 'prompt' ? 'aiprompt' : 'airesults'}>
                {@html marked(response.content)}
            </div>
        {/each}
    </div>

    <!-- Form Container: Always stays at the bottom -->
    <div id="form-container"
         style="display: flex; align-items: center; padding: 10px; border-top: 1px solid #ddd; background: #fff;">
        <textarea bind:value={prompt}
                  style="flex: 1; height: 40px; padding: 10px;
                         font-size: 12px; border: 1px solid #ddd;
                         border-radius: 5px; resize: none;"
                  placeholder="Enter your prompt here..."
                  on:keydown={onKeyDown}></textarea>
        <button class={isLoading ? 'aiStopButton' : 'aiSendButton'}
                on:click={askAI}
                disabled={isLoading}>
            {isLoading ? '■' : '▶'}
        </button>
    </div>
</div>