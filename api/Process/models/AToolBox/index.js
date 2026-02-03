class AToolBox {
    static definition = {
        name: 'AToolBox',
        description: 'A container that groups tools for use by agents or workflows.',
        attributes: {
            name: {
                type: 'string',
                description: 'The name of the toolbox',
            },
            description: {
                type: 'string',
                description: 'Overview of what the toolbox contains',
            },
        },
        associations: {
            tools: {
                type: 'ATool',
                cardinality: 'n',
                description: 'Tools that belong to this toolbox',
            },
            agents: {
                type: 'AAgent',
                cardinality: 'n',
                description: 'Agents associated with this toolbox',
            },
        },
    }
}

module.exports = AToolBox;
