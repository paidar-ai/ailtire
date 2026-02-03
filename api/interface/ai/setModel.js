module.exports = {
    friendlyName: 'list',
    description: 'List the ai models that are available',
    static: true, // True is for Class methods. False is for object based.
    inputs: {
        id: {
            type: 'string',
            required: true,
            description: 'The id of the model'
        }
    },
    exits: {
        json: (obj) => {
            return obj;
        }
    },

    fn: async function (inputs, env) {
        let aiModels = global.ailtire.config.aiModels;
        let [ adaptor, name ] = inputs.id.split(':');

        global.ailtire.config.ai = {
            adaptor: aiModels[adaptor].adaptor,
            model: name
        };
        return;
    }
};
