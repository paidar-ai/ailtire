class AActor {
    static definition = {
        name: 'AActor',
        description: 'This represents an actor of the system.',
        attributes: {
            name: {
                type: 'string',
                description: 'Name of the actor',
            },
            shortname: {
                type: 'string',
                description: 'Shortname of the actor',
            },
            description: {
                type: 'string',
                description: 'Description of the actor',
            },
            doc: {
                type: 'json',
                description: 'Documentation files (read from doc/ folder)'
            },
            uiFeatures: {
                type: 'array',
                description: 'Optional list of UI feature keys exposed only to this actor',
                items: {type: 'string'}
            },
            roleNames: {
                type: 'array',
                description: 'List of roles that this actor can assume. Primarily used for mapping and authorization.',
                items: {type: 'string'}
            }
        },
        associations: {
            workflows: {
                type: 'AWorkflow', cardinality: 'n',
                composition: false, owner: false,
                description: 'Workflows that this actor can initiate or participate in'
            },
            usecases: {
                type: 'AUseCase', cardinality: 'n',
                composition: false, owner: false,
                description: 'Use cases that this actor can perform or is involved with'
            },
            activities: {
                type: 'AActivity', cardinality: 'n',
                composition: false, owner: false,
                description: 'Activities that this actor can perform within workflows'
            },
            scenarios: {
                type: 'AScenario', cardinality: 'n',
                composition: false, owner: false,
                description: 'Specific scenarios or paths through use cases that this actor can execute'
            },
            identities: {
                type: 'AIdentity', cardinality: 'n',
                composition: false, owner: false,
                description: 'Which authenticated principals may assume this actor'
            },
            roles: {
                type: "ARole", cardinality: "n",
                composition: false, owner: false,
                description: "Which roles may be assumed by this actor"
            }
        }
    }
}

module.exports = AActor;

