const AEvent = require('../../../../src/Server/AEvent.js');

module.exports = {
    friendlyName: 'end',
    description: 'End the sttSession and return the text.',
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

        console.log("End SttSession");
        console.log(obj._text);
        AEvent.emit('ai.voice.final', {sessionId: obj.id, text: obj._text});
        /*
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

         */
    }
}