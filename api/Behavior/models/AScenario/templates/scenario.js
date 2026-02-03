module.exports = {
    name: '<%= name %>',
    description: '<%= description %>',
    given: "<%= given %>",
    when: "<%= when %>",
    then: "<%= then %>",
    actors: <%- JSON.stringify(actors) %>,
    steps: <%- JSON.stringify(steps) %>
};