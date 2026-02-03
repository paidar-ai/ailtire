module.exports = {
    friendlyName: 'addGuidance',
    description: 'Add guidance owned by this team',
    static: false,
    inputs: {
        guidance: {
            type: 'AGuidance',
            description: 'Existing guidance instance',
            required: false
        },
        guidanceDef: {
            type: 'json',
            description: 'Guidance definition to construct and add',
            required: false
        },
        id: {
            type: 'string',
            description: 'Guidance identifier (used if guidanceDef is not provided)',
            required: false
        },
        description: {
            type: 'string',
            description: 'Guidance description (used if guidanceDef is not provided)',
            required: false
        },
        goal: {
            type: 'string',
            description: 'Guidance goal (used if guidanceDef is not provided)',
            required: false
        }
    },
    outputs: {
        type: 'ATeam',
        description: 'The updated team'
    },
    exits: {
        json: (obj) => obj
    },
    fn: function (obj, inputs, env) {
        let guidanceObj = inputs.guidance;
        if (!guidanceObj) {
            let guidanceDef = inputs.guidanceDef;
            if (!guidanceDef) {
                guidanceDef = {
                    id: inputs.id,
                    description: inputs.description,
                    goal: inputs.goal
                };
            }
            if (guidanceDef && (guidanceDef.id || guidanceDef.description || guidanceDef.goal)) {
                guidanceObj = new AGuidance(guidanceDef);
            } else {
                throw new Error('No guidance provided to add.');
            }
        }
        obj.addToGuidance(guidanceObj);
        return obj;
    }
};
