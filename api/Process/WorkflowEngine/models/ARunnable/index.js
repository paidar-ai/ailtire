
class ARunnable {
    static definition = {
        name: 'ARunnable',
        description: 'This is a base class for all runnable objects.',
        attributes: {
            uid: {
                type: 'string',
                description: 'Unique ID of the runnable',
                transient: false,
            },
            stdout: {
                type: 'string',
                description: 'Standard output from the runnable',
                transient: false,
            },
            stderr: {
                type: 'string',
                description: 'Standard error from the runnable',
            },
            createdDate: {
                type: 'date',
                description: 'Date when the runnable was created',
                transient: false,
            },
            lastModifiedDate: {
                type: 'date',
                description: 'Date when the runnable was last modified',
                transient: false,
            },
            completeDate: {
                type: 'date',
                description: 'Date when the runnable was completed',
                transient: false,
            }
        },
        associations: {
        },
    }
}

module.exports = ARunnable;

