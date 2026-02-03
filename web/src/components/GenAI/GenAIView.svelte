<script lang="ts">

    export let askURL = null;

    import {marked} from 'marked';
    import {currentModel, llmModels, fetchLLMModels} from "../../stores/modelStore.js";
    import {watchEvents} from '../../stores/eventsStore.js';
    import VoiceChat from "./VoiceChat.svelte";

    import {onMount} from "svelte";

    import DocumentTray, {type LoadedDocument} from './DocumentTray.svelte';

    let documents: LoadedDocument[] = [];
    let uid;
    let fileInput = null;

    const handleRemove = (id: string) => {
        documents = documents.filter(d => d.id !== id);
    };

    const handleClickDocument = (doc: LoadedDocument) => {
        // e.g., show a side panel with document details
    };

    const handleFileSelected = async (file: File) => {
        const id = crypto.randomUUID();
        let doc: LoadedDocument = {
            id,
            name: file.name,
            sizeBytes: file.size,
            status: 'uploading',
            progress: 0,
            result: null
        };
        documents = [...documents, doc];

    };
    let dlg;

    function openDialog() {
        dlg.showModal();
    }

    function closeDialog() {
        dlg.close();
    }

    let prompt = '';
    let isLoading = false;
    let error = null;
    let responses = [];

    let showDialog = false;
    let selectedFile = null;
    let uploadError = null;
    let uploading = false;

    const addDocument = (doc: LoadedDocument) => {
        // Svelte reactivity likes reassignments (not in-place mutation)
        documents = [...documents, doc];
    };

    const updateDocument = (id: string, update: Partial<LoadedDocument>) => {
        documents = documents.map(doc =>
            doc.id === id ? {...doc, ...update} : doc
        );
    };

    const handleFileChange = async (event: Event) => {
        const input = event.target as HTMLInputElement;
        if (!input.files || input.files.length === 0) return;

        for (const file of Array.from(input.files)) {
            const id = crypto.randomUUID();

            // 1. Immediately show new doc in tray as "uploading"
            addDocument({
                id,
                name: file.name,
                sizeBytes: file.size,
                status: 'uploading',
                progress: 0,
                result: null,
            });

            // 2. Start upload + conversion in the background
            void uploadAndConvertFile(file, id);
        }

        // Clear input so same file can be selected again if needed
        input.value = '';
    };

    const uploadAndConvertFile = async (file: File, id: string) => {
        try {
            // Example: simple upload without real progress events
            // Replace this with your actual API call
            updateDocument(id, {status: 'uploading', progress: 30});
            await uploadFile(file, id);
            updateDocument(id, {status: 'converting', progress: 60});
            await fakeDelay(500);

            // After backend finishes conversion:
            updateDocument(id, {status: 'ready', progress: 100});
        } catch (err) {
            updateDocument(id, {
                status: 'error',
                progress: undefined,
                errorMessage: err instanceof Error ? err.message : 'Upload failed'
            });
        }
    };

    const fakeDelay = (ms: number) => new Promise(res => setTimeout(res, ms));
    const handleAIResult = (event) => {
        console.log(event);
        if(event.event === 'ai.result'){
            responses = responses.map(r =>
                r.id === uid
                    ? {
                        ...r,
                        content: r.hasStreamStarted
                        ? r.content + event.data.text
                            : event.data.text
                        ,
                        hasStreamStarted: true
                    }
                    : r
            );
        }
    }

    onMount(async () => {
        try {
            fetchLLMModels();
            watchEvents('ai', handleAIResult);

        } catch (err) {
            console.error(err);
        }
    })

    function startVoice() {

        console.log("startVoice");
    }

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
        uid = `gearai-${Math.random().toString(36).substr(2, 9)}`;

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
        let url = '/api/ai/ask';
        if(askURL) {
            url = askURL() + '&';
        } else {
           url += '?' ;
        }
        url += `prompt=${promptValue}`;
        if(documents && documents.length > 0) {
            url += '&documents=';
            for (let i in documents) {
                url += `${documents[i].result},`;
            }
            documents = [];
        }

        fetch(url, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        })
            .then(async (response) => {
                if (!response.ok) {
                    const errorMessage = await response.text();
                    error = `Error: ${errorMessage || response.statusText}`;
                    throw new Error(error);
                }
                return response.text();
            })
            .then((responseText) => {
                prompt = "Ask a question..";
                error = null;
                isLoading = false;
            })
            .catch((err) => {
                console.error(err);
            });
    }

    function onFileChange(e) {
        const input = e.currentTarget;
        if (input.files && input.files.length > 0) {
            selectedFile = input.files[0];
        }
        handleFileChange(e);
    }

    async function uploadFile(file, id) {
        uploading = true;
        uploadError = null;
        showDialog = false;
        try {
            const form = new FormData();
            form.append('file', file);

            // adjust URL as needed
            const resp = await fetch('/api/ai/upload', {
                method: 'POST',
                body: form
            });

            if (!resp.ok) {
                const txt = await resp.text();
                throw new Error(txt || resp.statusText);
            }

            // handle your backend response if needed
            const result = await resp.json();
            updateDocument(id, {result: result, status: 'converting', progress: 50});
        } catch (err) {
            console.error(err);
            uploadError = err.message;
            updateDocument(id, {status: 'error', progress: 100});
        } finally {
            updateDocument(id, {status: 'converting', progress: 60});
        }
    }

    function cancelUpload() {
        showDialog = false;
        uploadError = null;
        selectedFile = null;
    }

    let dlgX = 0;
    let dlgY = 0;

    let buttonRef;

    function addContent() {
        // Get the button’s screen‐relative position:
        showDialog = true;
        fileInput?.click();
    }

</script>

<input
    bind:this={fileInput}
    type="file"
    class="hidden"
    multiple
    on:change={onFileChange}
/>


<div id="aiContainer" style="display: flex; flex-direction: column; height: 100%; border: 1px solid #ddd;">
    <!-- Response Area -->
    <h1>The Cartographer</h1>
    <div id="aiResponse"
         style="flex: 1; padding: 10px; overflow-y: auto; background-color: #f9f9f9; border-bottom: 1px solid #ddd;">
        {#if responses.length === 0}
            <p><em>The Cartographer helps you map your organization to the GEAR reference model, identifying alignment,
                gaps, and modernization opportunities.</em></p>
        {/if}
        {#each responses as response}
            <div class={response.type === 'prompt' ? 'aiprompt' : 'airesults'}>
                {@html marked(response.content)}
            </div>
        {/each}
    </div>

    <!-- Form Container: Always stays at the bottom -->
    <div style="display: flex; flex-direction: column; height: 200px;">
        <!-- 1) Text area -->
        <DocumentTray
                {documents}
                onRemove={handleRemove}
                onClickDocument={handleClickDocument}
        />
        <textarea
                bind:value={prompt}
                on:keydown={onKeyDown}
                placeholder="Enter your prompt here…"
                style="flex:1; padding:10px; font-size:14px; border:1px solid #ddd; border-radius:4px; resize:none;"
        ></textarea>

        <!-- 2) Toolbar -->
        <div class="toolbar">
            <!-- + button -->
            <button bind:this={buttonRef} on:click={addContent} title="Add file or content">＋</button>

            <div class="spacer"></div>

            <!-- model chooser -->
            <select bind:value={$currentModel}>
                {#each $llmModels as model (model)}
                    <option value={model}>
                        {String(model).split(':')[1] || model}
                    </option>
                {/each}
            </select>

            <!-- mic button -->
            <VoiceChat
                    partialCallback={(text) => {prompt = prompt + ' ' + text}}
                    finalCallback={(text) => {prompt = text; askAI();}}
            />

            <!-- submit / stop -->
            <button
                    on:click={askAI}
                    disabled={isLoading}
                    title={isLoading ? 'Stop' : 'Send'}
            >
                {isLoading ? '■' : '▶'}
            </button>
        </div>
    </div>
</div>


<style>
    :global(.airesults h1) {
        font-family: 'Arial', sans-serif;
        font-size: 1.5rem;
        font-weight: 600;
        margin-top: 1.2em;
        margin-bottom: 0.25em;
    }
    :global(.airesults h2) {
        font-family: 'Arial', sans-serif;
       font-size: 1.2rem;
        font-weight: 600;
       margin-top: 1.2em;
        margin-bottom: 0.25em;
    }
    :global(.airesults) {
        font-family: 'Arial', sans-serif;
        font-size: 1rem;
        margin-top: 0.5em;
        margin-bottom: 0.25em;
    }
    .popover {
        position: fixed;
        font-family: 'Arial', sans-serif;
        background: white;
        border: 2px solid #89abcd;
        border-radius: 10px;
        padding: 0.75rem;
        box-shadow: 0 4px 8px rgba(23, 45, 67, 0.2);
        z-index: 9999;
        width: 260px;
    }

    .popover h2 {
        margin-top: 0;
        font-family: 'Arial', sans-serif;
        font-size: 1.1rem;
        font-weight: bold;
    }

    .popover p {
        margin: 0.5rem 0;
    }

    .popover input[type="file"] {
        margin-top: 0.5rem;
        width: 100%;
        border: 1px solid #89abcd;
    }

    .popover .actions {
        display: flex;
        justify-content: flex-end;
        gap: 0.5rem;
    }

    .popover .actions button {
        padding: 0.25rem 0.5rem;
    }

    .error {
        color: red;
    }

    #aiContainer {
        background-color: #f5f5f5;
        padding: 5px;
    }

    #aiContainer h1 {
        font-size: 1.3em;
        font-weight: bold;
        font-style: italic;
    }

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

    .toolbar {
        display: flex;
        align-items: center;
        padding: 4px 8px;
        border-top: 1px solid #ddd;
        background: #f5f5f5;
        font-size: 14px;
    }

    .toolbar button {
        background: none;
        border: none;
        cursor: pointer;
        font-size: 16px;
        margin: 0 4px;
    }

    .toolbar .spacer {
        flex: 1;
    }

    .toolbar select {
        border: none;
        background: transparent;
        text-align: right;
        padding: 2px 4px;
    }

    .toolbar select:focus {
        outline: none;
    }

    dialog {
        border: none;
        border-radius: 12px;
        padding: 1rem;
    }

    dialog::backdrop {
        background: rgba(0, 0, 0, .4);
    }
</style>
