
class AWorkflowEngine {
    static definition = {
        name: 'AWorkflowEngine',
        description: 'This is the execution engine for the workflow.',
        attributes: {
        },
        associations: {
            workflow: {
                type: 'AWorkflowInstance',
                cardinality: 1,
                composition: false,
                owner: false,
            },
        },
    }
}

module.exports = AWorkflowEngine;

