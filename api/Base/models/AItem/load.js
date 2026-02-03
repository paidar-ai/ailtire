module.exports = {
    friendlyName: 'load',
    description: 'Description of the method',
    static: true, // True is for Class methods. False is for object based.
    inputs: {
        "definition": {
            "type": "json",
            "description": "Load the item from the note.",
            "required": true
        }
    },
    outputs: {
        "type": "AItem",
        "description": "The AItem loaded from the file"
    },
    exits: {
        json: (obj) => {
            return obj;
        },
    },

    fn: function (inputs, env) {
        // inputs contains the obj for the this method.
        let {definition} = inputs;
        // obj has the obj for the method.
        let retval = new AItem(definition);
        return retval;
    }
};
