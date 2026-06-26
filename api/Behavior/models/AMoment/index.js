class AMoment {
    static definition = {
        name: 'AMoment',
        description: 'An atomic “now” event during a Scenario (action + context + outcome).',
        attributes: {
            id: { type: 'string', description: 'Moment identifier.' },
            timestamp: { type: 'string', description: 'ISO-8601 timestamp.' },
            action: { type: 'string', description: 'Action name, e.g., set:export.format=xlsx.' },
            outcome: { type: 'string', description: 'Outcome or result (e.g., Success|Error|Undo).' },
            context: { type: 'json', description: 'Task, active objects, UI state, params.' },
            metadata: { type: 'json', description: 'Optional telemetry/diagnostics.' }
        },
        associations: {
            scenario: { type: 'AScenario', description: 'Owning scenario.', cardinality: 1, composition: false, owner: false, via: 'moments' },
            actor: { type: 'AActor', description: 'Actor in which the user is operating.', cardinality: 1, composition: false, owner: false },
            user: { type: 'AIdentity', description: 'User who generated this moment.', cardinality: 1, composition: false, owner: false },
            feedback: { type: 'AFeedback', description: 'Explicit/implicit feedback on this moment.', cardinality: 'n', composition: true, owner: true, via: 'moment' }
        }
    }
}
module.exports = AMoment;