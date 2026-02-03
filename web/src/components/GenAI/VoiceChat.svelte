<script lang="ts">
    import { onDestroy, onMount } from 'svelte';
    import { emitEvent, fetchEvents, watchEvents } from '../../stores/eventsStore.js';

    export let labelIdle: string = '🎤 Start';
    export let labelRecording: string = '■ Stop';
    export let showPartial: boolean = true;
    export let partialCallback = null;
    export let finalCallback = null;

    let voiceSessionId: string = crypto.randomUUID();

    let recording = false;
    let mediaRecorder: MediaRecorder | null = null;
    let stream: MediaStream | null = null;
    let recordSeconds = 0;
    let recordTimer: number | null = null;
    let partialTranscript = '';
    let counter = 0;
    let keepLooping = false;    // controls the "always listen" loop

    function logError(err: unknown) {
        console.error('VoiceRecorder:', err);
    }

    onMount(() => {
        fetchEvents();
        watchEvents('ai.voice.partial', handlePartial);
        watchEvents('ai.voice.final', handleFinal);
        watchEvents('ai.voice.error', handleError);
    });

    function handlePartial(event: any) {
        if(partialCallback) {
            partialCallback(event.data.text);
        }
    }
    function handleFinal(event: any) {
        if(finalCallback) {
            finalCallback(event.data.text);
        }
    }
    function handleError(event: any) {
        console.error('voice error', event);

    }

    async function ensureStream(): Promise<MediaStream> {
        if (stream && stream.active) {
            return stream;
        }
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        return stream;
    }

    async function startRecordingLoop() {
        try {
            counter = 0;
            keepLooping = true;
            recording = true;
            recordSeconds = 0;

            emitEvent('ai.voice.start', { sessionId: voiceSessionId });

            // Show elapsed time (total listening time)
            if (recordTimer !== null) {
                clearInterval(recordTimer);
            }
            recordTimer = window.setInterval(() => {
                recordSeconds += 1;
            }, 1000);

            // Kick off the first 5-second chunk
            await recordOneChunk();

        } catch (err) {
            logError(err);
            recording = false;
            keepLooping = false;
        }
    }

    async function recordOneChunk() {
        if (!keepLooping) return;

        const s = await ensureStream();

        // Create a new recorder *per chunk*
        mediaRecorder = new MediaRecorder(s, { mimeType: 'audio/webm' });

        mediaRecorder.ondataavailable = (event: BlobEvent) => {
            if (event.data && event.data.size > 0) {
                event.data.arrayBuffer().then((buf) => {
                    const base64 = btoa(
                        String.fromCharCode(...new Uint8Array(buf))
                    );
                    const msg = {
                        sessionId: voiceSessionId,
                        audioBase64: base64,
                        counter: counter++,
                        mimeType: event.data.type || 'audio/webm'
                    };
                    emitEvent('ai.voice.chunk', msg);
                }).catch(logError);
            }
        };

        mediaRecorder.onerror = (e) => {
            console.error('MediaRecorder error', e);
        };

        mediaRecorder.onstop = () => {
            mediaRecorder = null;

            // If we’re still supposed to be "always listening", start next 5s chunk
            if (keepLooping) {
                recordOneChunk().catch(logError);
            }
        };

        // Start recording this 5s window
        mediaRecorder.start();          // no timeslice → one full blob on stop

        // Schedule stop after 2s
        setTimeout(() => {
            if (mediaRecorder && mediaRecorder.state === 'recording') {
                mediaRecorder.stop();
            }
        }, 2000);
    }

    function stopRecording() {
        keepLooping = false;
        recording = false;

        if (recordTimer !== null) {
            clearInterval(recordTimer);
            recordTimer = null;
        }
        recordSeconds = 0;

        if (mediaRecorder && mediaRecorder.state !== 'inactive') {
            mediaRecorder.stop();
        }
        mediaRecorder = null;

        emitEvent('ai.voice.end', { sessionId: voiceSessionId });

        if (stream) {
            stream.getTracks().forEach((t) => t.stop());
            stream = null;
        }
    }

    function toggleRecording() {
        if (recording) {
            stopRecording();
        } else {
            startRecordingLoop();
        }
    }

    onDestroy(() => {
        if (recordTimer !== null) {
            clearInterval(recordTimer);
        }
        if (mediaRecorder && mediaRecorder.state !== 'inactive') {
            mediaRecorder.stop();
        }
        if (stream) {
            stream.getTracks().forEach((t) => t.stop());
        }
    });
</script>

<div class="voice-recorder">
    <button type="button" on:click={toggleRecording}>
        {recording ? labelRecording : labelIdle}
    </button>

    {#if recording}
        <span class="status">
            Recording… {recordSeconds.toFixed(1)} s
        </span>
    {/if}

    {#if showPartial && partialTranscript}
        <div class="partial">
            {partialTranscript}
        </div>
    {/if}
</div>

<style>
    .voice-recorder {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.8rem;
    }

    .voice-recorder button {
        background: none;
        border: none;
        cursor: pointer;
        font-size: 0.9rem;
        padding: 4px 8px;
        border-radius: 4px;
        background-color: #eee;
    }

    .voice-recorder button:hover {
        background-color: #ddd;
    }

    .voice-recorder .status {
        color: #555;
    }

    .voice-recorder .partial {
        margin-left: 0.5rem;
        padding: 2px 6px;
        border-radius: 4px;
        background-color: #f3f3f3;
        color: #444;
        max-width: 200px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
</style>