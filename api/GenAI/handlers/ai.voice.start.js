module.exports = {
    name: "ai.voice.start", handlers: [
        {
            description: 'Handle the starting of an audio conversation and converstion',
            fn: async (data) => {
                let session = new SttSession({id: data.sessionId});
                console.log("Starting Session:", session.id);
            }
        },
    ]
};