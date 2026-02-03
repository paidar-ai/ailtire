
class ARole {
    static definition = {
        name: 'ARole',
        description: 'The Role of a an identity in the system.',
        attributes: {
            name: { type:'string', required:true, description:'Unique role name' },
            description: { type:'string', description:'Description of the role' },
            permissions: { type:'array', description:`List of permissions granted to this role. The list should follow the format: [ "/actor/list', '/actor/*', '*/list', '*' ] where the asterisk means all. And the list is a list of interfaces.` },
            actorNames: { type:'array', description:'List of actors that have this role' }
        },
        associations: {
            actors: { type:'AActor', cardinality:'n', through:'ActorRole' }
        }
    };
}
module.exports = ARole;