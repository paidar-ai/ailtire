module.exports = {
    friendlyName: 'load',
    description: 'Load the Scenario from the file.',
    static: true, // True is for Class methods. False is for object based.
    inputs: {
        "usecase": {
            "type": "AUseCase", "description": "UseCase to attach the loaded scenario.", "required": true
        },
        "file": {
            "type": "file", "description": "A file that contains the definition of the scenario", "required": true
        }
    },
    outputs: {
            "type": "AScenario", "description": "The Scenario based on the file definition",
    },
    exits: {
        json: (obj) => {
            return obj;
        },
    },

    fn: function (inputs, env) {
        // inputs contains the obj for the this method.
        let {usecase, file} = inputs;
        // obj has the obj for the method.
        if (typeof usecase === 'string') {
            usecase = AUseCase.find({name: usecase});
            if (!usecase) {
                throw new Error("Usecase not found!");
            }
        }
        let scenarioDef = require(file);
        if(scenarioDef.steps) {
            scenarioDef.steps = scenarioDef.steps.map(step => {
                let stepObj = new AStep(step);
                return stepObj;
            });
        }
        let retval = new AScenario(scenarioDef);
        retval.owner = usecase;
        usecase.addToScenarios(retval);
        return retval;
    }
};
