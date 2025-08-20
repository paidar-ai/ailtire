
class AWorkflowCall {
    static definition = {
        name: 'AWorkflowCall',
        extends: 'AExecutable',
        description: 'A workflow call is a special kind of executable that invokes a workflow.',
        attributes: {
        },
        associations: {
            workflow: {
                description: 'The workflow to invoke. This is a reference to the workflow and i bound at runtime not at design time.',
                type: 'AWorkflow',
                cardinality: 1,
                composition: false,
                owner: false,
            },
        },
    }
}

module.exports = AWorkflowCall;

