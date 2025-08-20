
class AStep {
    static definition = {
        name: 'AStep',
        description: 'This represents a step in a scenario.',
        attributes: {
            action: {
                type: 'string',
                description: 'Name of the action to be performed',
            },
            parameters: {
                type: 'json',
                description: 'Name value pair for each parameter being passed to the action',
            },
            description: {
                type: 'string',
                description: 'Description of the step',
            }
        },
        associations: {
        },
    }
}

module.exports = AStep;

