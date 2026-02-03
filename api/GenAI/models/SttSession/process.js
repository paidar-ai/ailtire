const AIHelper = require('../../../../src/Server/AIHelper.js');
const AEvent = require('../../../../src/Server/AEvent.js');

module.exports = {
    friendlyName: 'process',
    description: 'Process the Audio Chunk and send the text out on the websocket.',
    static: false,
    inputs: {
        chunk: {
            type: 'string',
            description: "Audio Chunk",
        }
    },
    exits: {
        json: (obj) => {
            return obj;
        },
        success: (obj) => {
            return obj;
        },
        notFound: (obj) => {
            console.error("Object not Found:", obj);
            return null;
        },
    },


    fn: async function (obj, inputs, env) {

        // Initialize per-session state on first call
        if (!obj._processBuffer) {
            obj._processBuffer = [];      // will hold base64 strings
            obj._chunkCounter = 0;
            obj._flushTimer = null;      // for inactivity timeout
            obj._text = '';
        }

        // Push current chunk
        obj._processBuffer.push(inputs.audioBase64);
        obj._chunkCounter++;
        let text =  await _processBuffer(obj);
        AEvent.emit('ai.voice.partial', {sessionId: obj.id, text: text})

        // If we haven't flushed yet, nothing to return now
        return null;
    }
}

async function _processBuffer(obj) {
    if (!obj._processBuffer || obj._processBuffer.length === 0) {
        return '';
    }

    // Convert all base64 chunks into a single Buffer

    const buffers = obj._processBuffer.map((b64) => Buffer.from(b64, 'base64'));
    const fullBuffer = Buffer.concat(buffers);

    // Clear buffer and counter for next batch
    obj._processBuffer = [];
    obj._chunkCounter = 0;

    // Call your transcription helper with the full audio buffer
    const text = await AIHelper.voiceToText(fullBuffer);

    if(text.length > 0) {
        obj._text = (obj._text || '') + ' ' + text;
    }

    return text;
}
