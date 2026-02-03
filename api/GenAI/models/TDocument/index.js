class TDocument {
    static definition = {
        name: 'TDocument',
        description: 'The "TDocument" class in the "t" package provides methods for creating, updating, destroying, adding to, and removing from TDocuments',
        attributes: {
            id: {
                type: 'string',
                description: 'Unique identifier for the document.'
            },
            filename: {
                type: 'string',
                description: 'Original name of the uploaded file.'
            },
            mimeType: {
                type: 'string',
                description: 'MIME type of the uploaded file (e.g. "application/pdf").'
            },
            size: {
                type: 'number',
                description: 'Size of the file in bytes.'
            },
            uploadedAt: {
                type: 'string',
                description: 'ISO timestamp when the file was uploaded.'
            },
            text: {
                type: 'string',
                description: 'Optional extracted or parsed text content from the file.'
            },
            metadata: {
                type: 'object',
                description: 'Arbitrary key/value metadata associated with the document.'
            },
            "url": {
                type: "string",
                description: "Location of the file",
            },
            "numberOfChunks": {
                type: 'number',
                description: "Length of the document",
            },
        },
        associations: {
            nodes: {
                type: "TDocumentNode",
                cardinality: "n",
                composition: false,
                owner: true,
                name:  "nodes",
                via: "owner"
            },
        },
        statenet: {
            Init: {
                description: "Initial State",
                events: {
                    create: {
                        Created: { }
                    }
                }
            },
            Created: {
                description: "The TDocument has been created, but is not yet normalized, cannot be used by the system for analysis.",
                events: {
                    convert: {
                        Converting: {
                        }
                    },
                },
            },
            Converting: {
                description: "The TDocument is being normalized. This might take a while.",
                events: {
                    complete: {
                        Ready: {}
                    },
                    failed: {
                        Failed: { }
                    }
                }
            },
            Ready: {
                description: "The TDocument has been normalized and is ready for analysis.",
            },
            Failed: {
                description: "The TDocument has failed to normalize. Cannot be used by the system for analysis.",
            },
        }
    }
}

module.exports = TDocument;
