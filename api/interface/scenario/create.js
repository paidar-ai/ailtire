const path = require('path');
// const api = require('../../src/Documentation/api');
module.exports = {
    friendlyName: 'create',
    description: 'Create an Scenario in a UseCase',
    static: true,
    inputs: {
        name: {
            description: 'The name of the scenario',
            type: 'string',
            required: true
        },
        usecase: {
            description: 'The name of the usecase',
            type: 'string',
            required: true
        },
        package: {
            description: 'The name of the package',
            type: 'string',
            required: false
        },
        description: {
            type: "string",
            description: "Description of the Use Case",
            required: false
        },
        given: {
            type: "string",
            description: "Given steps of the scenario",
            required: false
        },
        when: {
            type: "string",
            description: "When steps of the scenario",
            required: false
        },
        then: {
            type: "string",
            description: "Then steps of the scenario",
            required: false
        },
        actors: {
            type: 'json',
            description: 'List of actors that this scenario uses',
            required: false,
            properties: {
                name: { description: "Name of the actor", type: "string", required: false },
                actions: { description: "List of actions that the actor can perform", type: "string", required: false },
            }
        },
        steps: {
            type: 'Array',
            description: 'List of steps that this scenario uses',
            required: false,
            properties: {
                action: { description: "Name of the action", type: "string", required: false },
                parameters: { description: "List of parameters for the action", type: "json", required: false },
                description: { description: "Description of the action", type: "string", required: false },
            }
        },
    },

    exits: {
        success: {},
        json: {},
        notFound: {
            description: 'No item with the specified ID was found in the database.',
        }
    },

    fn: function (inputs, env) {
        let retval = AScenario.construct(inputs);
        return `Scenario: ${retval.name} was created`;
    }
};

