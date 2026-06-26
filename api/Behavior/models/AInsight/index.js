class AInsight {
    static definition = {
        name: 'AInsight',
        description: 'Adaptive, feedback-weighted learning for a User-as-Actor “over time”.',
        attributes: {
            id: { type: 'string', description: 'AInsight identifier.' },
            key: { type: 'string', description: 'Dimension of learning (e.g., export.format=xlsx).' },
            value: { type: 'json', description: 'Optional payload for the key (default params, etc.).' },
            confidence: { type: 'number', description: '0..1 confidence that this insight currently holds.' },
            status: { type: 'string', description: 'Proposed | Active | Contested | Dormant | Retired.' },
            lastUpdated: { type: 'string', description: 'ISO-8601 timestamp of last update.' }
        },
        associations: {
            user: { type: 'AIdentity', description: 'Owner user.', cardinality: 1, composition: false, owner: false, via: 'insights' },
            actor: { type: 'AActor', description: 'Role context for this learning.', cardinality: 1, composition: false, owner: false }
        },
        // State machine implements unlearning/decay and counter-signal handling
        statenet: {
            Proposed: {
                description: 'New or weakly evidenced insight.',
                events: {
                    reinforce: {
                        Active: {
                            condition: (obj) => obj.confidence >= 0.60
                        }
                    },
                    decay: { Proposed: { action: (obj) => {/* adjust confidence down */} } }
                }
            },
            Active: {
                description: 'Supported by recent evidence; applied unless vetoed.',
                events: {
                    contest: { Contested: { condition: (obj) => obj.negativeBurst === true } },
                    decay:   { Dormant:   { condition: (obj) => obj.confidence < 0.45 } }
                }
            },
            Contested: {
                description: 'Recent strong counter-evidence; do not auto-apply.',
                events: {
                    reinforce: { Active: { condition: (obj) => obj.reinforced === true } },
                    decay:     { Dormant: { condition: (obj) => obj.confidence < 0.45 } }
                }
            },
            Dormant: {
                description: 'Low confidence; ignored unless strengthened.',
                events: {
                    decay:   { Retired: { condition: (obj) => obj.confidence < 0.15 } },
                    refresh: { Proposed: { condition: (obj) => obj.newEvidence === true } }
                }
            },
            Retired: {
                description: 'Superseded or explicitly forgotten.',
                events: {
                    refresh: { Proposed: { condition: (obj) => obj.newEvidence === true } }
                }
            }
        }
    }
}
module.exports = AInsight;
