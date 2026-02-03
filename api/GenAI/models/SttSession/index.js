class SttSession {
    static definition = {
        name: 'SttSession',
        description: 'The "SttSession" handles the voice recognition and transcription of audio files. for the AI voice assistant.',
        attributes: {
            id: {
                type: 'string',
                description: 'Unique identifier for the session.'
            },
            language: {
                type: 'string',
                description: 'The language of the audio file.'
            },
        },
        associations: {
            nodes: {
                type: "TDocumentNode",
                cardinality: "n",
                composition: false,
                owner: true,
                name:  "nodes",
                via: "owner"
            },
        },
        statenet: {
            Init: {
                description: "Initial State",
                events: {
                    create: {
                        Created: { }
                    }
                }
            },
            Created: {
                description: "The SttSession has been created and can start processing audio snippets",
                events: {
                    process: {
                        Processing: {
                        }
                    },
                },
            },
            Processing: {
                description: "Processing audio snippets to text",
                events: {
                    complete: {
                        Completed: {}
                    },
                    process: {
                        Processing: { }
                    }
                }
            },
            Completed: {
                description: "The SttSession has been completed",
            },
            Failed: {
                description: "The SttSession has failed to complete",
            },
        }
    }
}

module.exports = SttSession;
