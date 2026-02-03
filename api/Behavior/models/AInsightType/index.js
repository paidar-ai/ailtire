
class AInsightType {
    static definition = {
  "name": "AInsightType",
    description: `This is the class that describes the type of the insight. The user can define new insight types
    in the behavior/insights directory.`,

  "attributes": {
    "attr1": {
      "type": "string",
      "description": "description long description"
    }
  },
  "associations": {
    "assoc1": {
      "type": "ModelName",
      "composition": false,
      "owner": false
    }
  },
  "statenet": {}
}
}
module.exports = AInsightType;