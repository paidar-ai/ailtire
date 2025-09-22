const path = require('path');

module.exports = {
    friendlyName: 'load',
    description: 'Description of the method',
    static: false, // True is for Class methods. False is for object based.
    inputs: {
        "package": {
            "type": "APackage", "description": "The owning package of the use case", "required": true,
        },
        file: {
            type: "file", description: "File containing the definition of the UseCase.", required: true
        }

    },
    outputs: {
            "type": "AUseCase", "description": "This is the UseCase Object based on the file defimnition."
    },
    exits: {
        json: (obj) => {
            return obj;
        },
    },

    fn: function (obj, inputs, env) {
        // inputs contains the obj for the this method.
        let {package, file} = inputs;
        // obj has the obj for the method.
        let usecaseDef = require(file);

        // Set the directory of the usecase.
        usecaseDef.dir = path.dirname(file);
        if (usecaseDef.extends) {
            usecaseDef.extends = usecaseDef.extends.map(uc => {
                return AUseCase.get({name: uc});
            });
        }
        if (usecaseDef.includes) {
            usecaseDef.includes = usecaseDef.includes.map(uc => {
                return AUseCass.get({name: uc});
            })
        }
        let retval = new AUseCase(usecaseDef);
        retval.owner = package;
        package.addToUsecases(retval);
        return retval;
    }
};
