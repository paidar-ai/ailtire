module.exports = {
    friendlyName: 'list',
    description: 'List the Notes',
    inputs: {
        json: (obj) => {
            return obj;
        }
    },

    fn: async function (inputs, env) {
        let retval = _instances.ANote;
        return retval;
    }
};