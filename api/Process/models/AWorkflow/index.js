class AWorkflow {
  static definition = {
    name: 'AWorkflow',
    description: 'Represents a reusable, composable business process',
    attributes: {
      name: {
        type: 'string',
        description: 'The name of the workflow',
      },
      description: {
        type: 'string',
        description: 'Detailed description of what the workflow does',
      },
      precondition: {
        type: 'string',
        description: 'Global precondition under which this workflow may start',
      },
      postcondition: {
        type: 'string',
        description: 'Global postcondition guaranteed when workflow completes',
      },
      category: {
        type: 'string',
        description: 'Hierarchical category (level1/level2/…) for grouping',
      },
      inputs: {
        type: 'json',
        description: 'Definition of input parameters when this workflow is invoked by another workflow',
      },
      outputs: {
        type: 'json',
        description: 'Definition of output parameters produced by this workflow for its caller',
      },
    },
    associations: {
        category: {
            type: 'ACategory',
            cardinality: 1,
            composition: false,
            owner: true,
        },
      activities: {
          unique: (obj) => { return obj.name;},
        type: 'AActivity',
        cardinality: 'n',
        composition: true,
        owner: true,
      },
    },
  }
}

module.exports = AWorkflow;