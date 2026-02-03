class ANote {
    static definition = {
        name: 'ANote',
        description: 'This is a architecture note about the application. This is used to leverage AI to generate items ' +
            'in the architecture. Or to keep track of notes about the architecture.',
        attributes: {
            text: {
                type: 'string', description: 'Text of the note',
            },
            createdDate: {
                type: 'date', description: "Date the note was created."
            },
            name: {
                type: "string", description: "Name of the note",
            },
            summary: {
                type: 'string', description: "Summary of the note",
            }
        },
        associations: {
            items: {
                unique: (obj) => { return obj.id; },
                type: 'AItem',
                cardinality: 'n',
                composition: true,
                owner: true,
                description: 'Items that are suggested from the note.'
            },
        },
    }
}

module.exports = ANote;

