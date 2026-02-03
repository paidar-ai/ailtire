module.exports = {
    name: "ai.voice.chunk", handlers: [
        {
            description: 'Handle the starting of an audio conversation and converstion',
            fn: async (data) => {
                let session = SttSession.find({id: data.sessionId})
                if(session) {
                    let text = await session.process(data);
                    console.log("Text:", text);
                }
            }
        },
    ]
};