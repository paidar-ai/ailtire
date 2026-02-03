module.exports = {
    name: "tdocument.created", handlers: [
        {
            description: 'Automatically convert a document when it is created.',
            fn: async (data) => {
                await DocumentReader.convert({document:data.obj, config:{}});
            }
        },
    ]
};