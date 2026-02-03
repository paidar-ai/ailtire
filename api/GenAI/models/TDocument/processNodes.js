module.exports = {
    friendlyName: 'processNodes',
    description: 'Processs the nodes in the document with the function defined in the inputs based on the query',
    static: false,
    inputs: {
        query: {
            type: 'string',
            description: "Query for the Nodes to process.",
        },
        fn: {
            type: 'string',
            description: "Name of the Node",
        }
    },
    outputs: {
        type: 'array',
        description: 'Outputs from processing the Nodes',
        properties: {
            type: 'json',
            description: 'Outputs from the processing of each Node'
        }
    },

    exits: {
        json: (obj) => {
            return obj;
        },
    },


    fn: async function (obj, inputs, env) {
        let results = [];
        for(let i in obj.nodes) {
            if(inputs.query) {
                let regex = new RegExp(inputs.query, 'i');
                if (regex.match(obj.nodes[i].name)) {
                    results.push(await inputs.fn(obj.nodes[i]));
                }
            } else {
                results.push(await inputs.fn(obj.nodes[i]));
            }
        }
        return results;
    }
};