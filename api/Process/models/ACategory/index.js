
class ACategory {
    static definition = {
        name: 'ACategory',
        description: 'A category is a way to group workflows/processes together. Categories can be nested by using a slash in the name.' +
            'They are stored in the workflows directories and the directory structure is reflected in the name of the category. ' +
            'Support/User categories is the workflows/Support/User directory.',
        attributes: {
            name: {
                type: 'string',
                description: 'Name of the category'
            },
            description: {
                type: 'string',
                description: 'Description of the category'
            },
            dir: {
                type: 'string',
                description: 'Directory of the category',
                transient: true,
            }
        },
        associations: {
            workflows: {
                type: 'AWorkflow',
                cardinality: 'n',
                composition: false,
                owner: false,
            },
        },
    }
}

module.exports = ACategory;

