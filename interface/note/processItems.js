module.exports = {
    friendlyName: 'processItems',
    description: 'Accept or Reject Items for construction of artifacts in the architecture.',
    inputs: {
        note: {
            description: 'The id of the note',
            type: 'string'
        },
        items: {
            description: "The ids of the items to accept for construction of artifacts.",
            type: 'json',
            properties: {
                item: { type: 'string', description: 'The id of the item', required: true} ,
                state: { type: 'string', description: 'accept|reject', required: true} ,
                reason: { type: 'string', description: 'Reason to reject or accept the individual item', required: false} ,
            }
        }
    },
    outputs: {
        message: {
            description: 'Return it the generated items have finished being created.',
            type: 'string'
        }
    },
    exits: {
        json: (obj) => {
            return obj;
        }
    },

    fn: async function (inputs, env) {
        let note =  ANote.get(inputs.note);
        if(note) {
            let items = inputs.items;
            // Go through the items and accept or reject them. Look up the item through the note.items ids
            for (let item of items) {
                let noteItem = note.items[item.item];
                if (noteItem.state === 'accept') {
                    await noteItem.accept({reason: item.reason});
                } else {
                    await noteItem.reject({reason: item.reason});
                }
            }
            return {message: 'Completed'};
        } else {
            return {message: "Note not Found"};
        }
    }
};
