class AIdentity {
    static definition = {
        name: 'AIdentity',
        description: 'A principal (human, service, or device) that can authenticate.',
        attributes: {
            identifier: {type: 'string', required: true, description: 'Login name or device ID'},
            secretHash: {type: 'string', required: true, description: 'Hashed password or key'},
            kind: {
                type: 'enum',
                values: ['user', 'service', 'device'],
                description: 'Type of identity {user, service, device}'
            },
            displayName: {type: 'string', description: 'Friendly name for UI'},
            email: {type: 'string', description: 'Contact address'},
            createdAt: {type: 'string', description: 'ISO timestamp when created'},
            lastLogin: {type: 'string', description: 'ISO timestamp of last login'},
            isActive: {type: 'boolean', default: true, description: 'True if account is enabled'},
            actorNames: {type: 'array', description: 'List of actors this identity has'},
            metadata: {type: 'json', description: 'Custom properties for this identity'},
            calculatedPassword: {type: 'string', description: 'Hashed password or key'},
            permissions: {type: 'array', description: 'List of permissions granted to this identity'},
        },
        associations: {
            actors: {type: 'AActor', cardinality: 'n', description: 'List of actors this identity has'},
            moments: {
                type: 'AMoment',
                cardinality: 'n',
                description: 'List of moments this identity has logged in',
                owner: true,
                composition: true,
                via: 'identity'
            }
        }
    }
}

module.exports = AIdentity;