class AFeedback {
    static definition = {
        name: 'AFeedback',
        description: 'Positive/negative signal about a Moment used to adjust Insights.',
        attributes: {
            id: { type: 'string', description: 'AFeedback identifier.' },
            type: { type: 'string', description: 'Positive | Negative.' },
            strength: { type: 'number', description: 'Normalized intensity in [-1.0..1.0].' },
            reason: { type: 'string', description: 'Optional explanation (e.g., undo, error code).' },
            timestamp: { type: 'string', description: 'ISO-8601 timestamp.' }
        },
        associations: {
            moment: { type: 'AMoment', description: 'Target moment.', cardinality: 1, composition: false, owner: false, via: 'feedback' }
        }
    }
}
module.exports = AFeedback;