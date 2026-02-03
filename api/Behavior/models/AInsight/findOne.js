const path = require('path');

module.exports = {
    friendlyName: 'findOne',
    description: 'Find One Insight that mataches the criteria passed if not found create a new one.',
    static: true, // True is for Class methods. False is for object based.
    inputs: {
        scopeKey: {
            type: 'string',
            required: true,
            description: 'The scope key for the insight (e.g., project:id, workspace:id, user:id)'
        },
        insightType: {
            type: 'string',
            required: true,
            description: 'The type of insight (preference, constraint, decision, project_state, glossary, todo, risk)'
        },
        subjectKey: {
            type: 'string',
            required: true,
            description: 'The subject key in dot notation format'
        },
        status: {
            type: 'string',
            defaultsTo: 'active',
            description: 'The status of the insight to find'
        }
    },
    outputs: {
        retval: {
            type: "AInsight",
            description: "The Insight that matched the criteria or created a new one."
        }
},
    exits: {
        json: (obj) => {
            return obj;
        },
    },

    fn: async function (inputs, env) {
        // iterate through all the insights and find the one that matches the criteria.
        let insights = await AInsight.instances();

        // Filter insights that match all criteria
        let matchingInsights = Object.values(insights).filter(insight => {
            return insight.scopeKey === inputs.scopeKey &&
                insight.insightType === inputs.insightType &&
                insight.subjectKey === inputs.subjectKey &&
                insight.status === inputs.status;
        });

        // If found, return the first matching insight
        if (matchingInsights.length > 0) {
            return matchingInsights[0];
        }

        // If not found, create a new insight
        let newInsight = new AInsight({
            scopeKey: inputs.scopeKey,
            insightType: inputs.insightType,
            subjectKey: inputs.subjectKey,
            status: inputs.status
        });

        return newInsight;
    }
};
