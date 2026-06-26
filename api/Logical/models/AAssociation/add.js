module.exports = {
    friendlyName: 'add',
    description: 'Save and actor to the directory',
    static: false,
    inputs: {
        "item": {
            "type": "ref",
            "description": "The item to add to the association",
            "required": false
        },
        "items": {
            "type": "ref",
            "description": "The items to add to the association",
            "required": false
        },
        parent: {
            type: "ref",
            description: "The parent object",
            required: false,
        }
    },
    outputs: {
        type: "ref",
        description: "The item added to the association is returned",
    },

    exits: {},

    fn: function (obj, inputs, env) {
        // Check that thee item being added is of the correct type.
        let parent = inputs.parent;
        if (obj.cardinality === 'n') {
            // Create a map or an array based on the uniqueness
            if (!parent._associations[obj.name]) {
                if (obj.unique) {
                    parent._associations[obj.name] = {};
                } else {
                    parent._associations[obj.name] = [];
                }
            }

            // Move the inputs into an array if there is just one item added.
            let values = inputs.items;
            if (!values) {
                values = [inputs.item];
            }

            let newAssocObj = null;
            for (let i in values) {
                let value = values[i];
                // Ok now check the type and make sure it is the correct type or at least in the heirarchy of the class
                let associationType = AClass.find({name: obj.type});
                newAssocObj = value;
                let valueTypeFlag = true;
                try { // the User could have passed in a object that is not an instance of a Proxy. This would mean they want to create one.
                    valueTypeFlag = value.isTypeOf({name: associationType.definition.name});
                }
                catch (e) {
                    let cls = global.classes[obj.type];
                    if (obj.type !== 'ref' && cls) { // Ref will handle any object.
                        newAssocObj = new cls(value);
                    }
                }
                if (obj.type === 'ref' || valueTypeFlag) {
                    if (obj.unique) {
                        let key = obj.unique(newAssocObj);
                        parent._associations[obj.name][key] = newAssocObj;
                    } else {
                        parent._associations[obj.name].push(newAssocObj);
                    }
                    parent._persist = {dirty: true};
                } else {
                    console.error("Assignment is the wrong type: ", obj.type, " expected, recieved ", value.definition.name);
                }
                // Add the back link with via
                if (obj.via) {
                    newAssocObj[obj.via] = parent;
                }
            }
            if(values.length === 1) {
                return newAssocObj;
            } else {
                return parent._associations[obj.name];
            }
        } else {
            if (inputs.items) {
                console.error("Cannot add multiple items to a single association");
                return false;
            }
            let associationType = global.classes[obj.type];
            try {
                if (inputs.item.isTypeOf({name: associationType.definition.name})) {
                    parent._associations[obj.name] = inputs.item;
                    parent._persist = {dirty: true};
                    return parent_associations[obj.name];
                } else {
                    console.error("Assignment is the wrong type: ", obj.type, " expected, recieved ", inputs.item.definition.name);
                    return obj.item;
                }
            } catch (e) { // the user could have passed in a object that is not an instance of a Proxy. This would mean they want to create one.
                let cls = global.classes[obj.name];
                if (obj.type !== 'ref' && cls) { // Ref will handle any object.
                    let newAssocObj = new cls(inputs.item);
                    parent._associations[obj.key] = newAssocObj;
                    parent._presist = {dirty: true}
                    return newAssocObj;
                } else {
                    parent._associations[obj.name] = inputs.item;
                    parent._presist = {dirty: true}
                    return inputs.item;
                }
            }
        }


        // Add the composition and owner backlinks for saving in the _presist
        /*
        if (associationDefinition.owner) {
            child._persist.owner = proxy;
        }
        if (associationDefinition.composition) {
            child._persist.composition = obj;
            obj._persist.dirty = true;
        }
         */
    }
};

