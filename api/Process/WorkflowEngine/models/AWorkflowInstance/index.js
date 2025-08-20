
class AWorkflowInstance {
    static definition = {
        name: 'AWorkflowInstance',
        description: 'This is the instance of a workflow.',
        extends: 'ARunnable',
        attributes: {
        },
        associations: {
            def: {
                type: 'AWorkflow',
                cardinality: 1,
                composition: false,
                owner: false,
            },
            activities: {
                type: 'AActivityInstance',
                cardinality: 'n',
                composition: true,
                owner: true,
            }
        },
        statenet: {
            Init: {
                description: "Workflow created but not yet started",
                events: {
                    start: {
                        Running: {}
                    }
                },
                actions: {
                    entry: {},
                    exit: {}
                }
            },
            Running: {
                description: "Workflow is currently executing",
                events: {
                    success: {
                        Succeeded: {}
                    },
                    error: {
                        Failed: {}
                    },
                    timeout: {
                        Failed: {}
                    }
                }
            },
            Succeeded: {
                description: "Workflow completed successfully",
            },
            Failed: {
                description: "Workflow failed (all retries exhausted or aborted)",
            }
        }
    }
}

module.exports = AWorkflowInstance;

