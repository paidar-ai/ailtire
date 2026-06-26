module.exports = {
    friendlyName: 'generate',
    description: 'Description of the method',
    static: false, // True is for Class methods. False is for object based.
    inputs: {
    },
    outputs: {
            "type": "AItem",
            "description": "The AItem with the generated item attached and the state in the generated state."
    },
    exits: {
        json: (obj) => {
            return obj;
        },
    },

    fn: async function (obj, inputs, env) {
        // inputs contains the obj for the this method.
        switch (obj.type) {
            case 'AActor':
                let actor = AActor.construct(obj.json);
                obj.objectID = actor.name;
                break;
            case 'AScenario':
                let scenario = AScenario.construct(obj.json.usecase, obj.json);
                obj.objectID = scenario.name;
                break;
            case 'AUseCase':
                let usecase = AUseCase.construct(obj.json);
                obj.objectID = usecase.name;
                break;
            case 'AWorkflow':
                let workflow = AWorkflow.construct(obj.json);
                obj.objectID = workflow.name;
                break;
            case 'AClass':
                let model = AClass.construct(obj.json);
                if (!model) {
                    console.error("Model note created for:", obj.json);
                }
                obj.objectID = model.definition.name;
                break;
            case 'AActionItem':
                let action = new AActionItem(obj.json);
                if (!action) {
                    console.error("Action Item error: ", obj.json);
                }
                obj.objectID = action.name;
                let retval = await action.save();
                console.log(retval);
                break;
        }
        obj.note.save();
    }
};
