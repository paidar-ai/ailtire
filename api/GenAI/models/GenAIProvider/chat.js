module.exports = {
    friendlyName: 'chat',
    description: 'Description of the method',
    static: false, // True is for Class methods. False is for object based.
    inputs: {
        "messages": {
            "type": "array",
            "description": "Messages being sent to the GenAI",
            "required": true,
            "properties": {
                role: {type: "string", description: "Role of the message"},
                content: {type: "string", description: "Content of the message"}
            }
        }
    },
    outputs: {
        "response": {
            "type": "json",
            "description": "My Return Value"
        }
    },
    exits: {
        json: (obj) => {
            return obj;
        },
    },

    fn: async function (obj, inputs, env) {

        let adaptor = obj._adaptor;

        let result = await adaptor.chat({messages: inputs.messages});

        return {response: result};
    }
};
