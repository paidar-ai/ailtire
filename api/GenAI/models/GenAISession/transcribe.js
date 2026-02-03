const path = require('path');

module.exports = {
    friendlyName: 'transcribe',
    description: 'Description of the method',
    static: false, // True is for Class methods. False is for object based.
    inputs: {
        "audio": {
            "type": "Buffer",
            "description": "Buffer containing the audio to be transcribed",
            "required": true
        },
        "language": {
            type: "string",
            description: "Language of the audio, should the the two character code.",
        }
    },
    outputs: {
        "response": {
            "type": "string",
            "description": "Text transcription of the audio"
        }
    },
    exits: {
        json: (obj) => {
            return obj;
        },
    },

    fn: function (obj, inputs, env) {

        // Make sure you store the audio buffer to disk somewhere to transcribe later for better performance.
        let result = obj.provider.transcribe(inputs);
        return {response: result.response};

    }
};
