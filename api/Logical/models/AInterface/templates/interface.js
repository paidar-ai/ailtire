const path = require('path');

module.exports = {
    friendlyName: '<%= name %>',
    description: 'Description of the interface',
    static: true, // True is for Class methods. False is for object based.
    inputs: <%- JSON.stringify(inputs, null, 4) %>,
    outputs: <%- JSON.stringify(outputs, null, 4) %>,
    exits: {
        json: (obj) => {
            return obj;
        },
    },

    fn: function (obj, inputs, env) {
        // inputs contains the obj for the this method.
        let { <%- Object.keys(inputs).join(',') %> } = inputs;
        // obj has the obj for the method.
        return {
        <%- Object.keys(outputs).map(key => `${key}: ""`).join(',\n\t') %>
        };
    }
};
