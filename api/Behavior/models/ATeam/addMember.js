module.exports = {
    friendlyName: 'addMember',
    description: 'Add a member to the team with an optional role',
    static: false,
    inputs: {
        identity: {
            type: 'AIdentity',
            description: 'Identity to add to the team',
            required: true
        },
        role: {
            type: 'ARole',
            description: 'Role for this team member',
            required: false
        },
        title: {
            type: 'string',
            description: 'Title for this team member',
            required: false
        },
        description: {
            type: 'string',
            description: 'Description of responsibilities',
            required: false
        },
        name: {
            type: 'string',
            description: 'Name for the team member record',
            required: false
        }
    },
    outputs: {
        type: 'ATeamMember',
        description: 'The created team member record'
    },
    exits: {
        json: (obj) => obj
    },
    fn: function (obj, inputs, env) {
        let identity = inputs.identity;
        if (typeof identity === 'string') {
            identity = AIdentity.find({ identifier: identity }) || AIdentity.find({ name: identity });
        }
        if (!identity) {
            throw new Error('Identity not found.');
        }

        let role = inputs.role;
        if (role && typeof role === 'string') {
            role = ARole.find({ name: role });
        }
        if (inputs.role && !role) {
            throw new Error('Role not found.');
        }

        const memberName = inputs.name || `${identity.identifier || identity.name}:member`;
        const member = new ATeamMember({
            name: memberName,
            title: inputs.title,
            description: inputs.description
        });
        member.team = obj;
        member.identity = identity;
        if (role) {
            member.role = role;
        }

        obj.addToMembers(member);
        return member;
    }
};
