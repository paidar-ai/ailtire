const path = require('path');
const AGuidance = require("../../../../src/Server/Action");

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
        },
        noContext: {type: "boolean", description: "Whether to use the context from the previous conversation."}
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
        // inputs contains the obj for the this method.
        // Get the Context including Momments, Insights, and Practice.
        let messages = [];
        if(!inputs.noContext) {
            let context = _getContext(obj);
            messages = [...context];
        }
        messages = [...messages, ...inputs.messages];

        let result = await obj.provider.chat({messages: messages});

        if(!inputs.noContext) {
            // TODO: Store the response in the session to build up the context.
            let moment = new AMoment({timestamp: new Date(), context: inputs.messages, outcome: result.response});
            obj.identity.addToMoments(moment);
            obj.addToMoments(moment);

            moment.save();
        }

        return result;
    }
};

function _getContext(obj) {
    let retval = [];
    // let guidance = AGuidance.find({session: session.id});
    // let hints = guidance.hints;

    // Get the Practice context

    // Get the Insight context

    // Get  the Moment Context last moment and inject the moment text into it.
    // Get the last 10 moments
    let momentLength = obj.moments.length;
    let startIndex = Math.max(0, momentLength - 10);
    let last10Moments = obj.moments.slice(startIndex, momentLength);

    for (let moment of last10Moments) {
        retval.push({
            role: 'system',
            content: `Previous interaction context: ${JSON.stringify(moment.context)}; Response: ${JSON.stringify(moment.outcome)}`
        });
    }
    return retval;

}
