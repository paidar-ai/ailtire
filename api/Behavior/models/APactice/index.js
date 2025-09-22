class APractice {
    static definition = {
        name: 'APractice',
        description: 'Aggregated, k-anonymous shared know-how for an Actor (patterns, guardrails, hints).',
        attributes: {
            id: { type: 'string', description: 'Practice identifier.' },
            patterns: { type: 'string', description: 'Human-readable distilled patterns.' },
            guardrails: { type: 'string', description: '“Do/Don’t” norms derived from negative/positive evidence.' },
            hints: { type: 'json', description: 'Array of hints [{key, default, when, score}].' },
            kAnonCount: { type: 'number', description: 'Distinct users represented in this aggregate.' },
            updatedAt: { type: 'string', description: 'ISO-8601 timestamp.' }
        },
        associations: {
            actor: { type: 'AActor', description: 'Actor whose practice this is.', cardinality: 1, composition: false, owner: false, via: 'practice' }
        }
    }
}
module.exports = APractice;
