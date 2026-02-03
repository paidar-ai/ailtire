module.exports = {
    name: "ai.voice.end", handlers: [
        {
            description: 'Handle the starting of an audio conversation and converstion',
            fn: async (data) => {
                console.log("Ending Session:", data.sessionId);
                let session = SttSession.find({id: data.sessionId});
                session.end();
            }
        },
    ]
};