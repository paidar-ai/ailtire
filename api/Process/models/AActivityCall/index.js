
class AActivityCall {
    static definition = {
        name: 'AActivityCall',
        extends: 'AExecutable',
        description: 'This is how an activity is called in a workflow in the steps.',
        attributes: {
        },
        associations: {
            activity: {
                description: 'The activity to invoke. This is a reference to the activity and i bound at runtime not at design time.',
                type: 'AActivity',
                cardinality: 1,
                composition: false,
                owner: false,
            },
        },
    }
}

module.exports = AActivityCall;

