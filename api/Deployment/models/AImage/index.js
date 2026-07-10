class AImage {
    static definition = {
        name: 'AImage',
        description: 'A container image used to run a deployment service or stack.',
        attributes: {
            name: {
                type: 'string',
                required: true,
                description: 'Logical name or image tag'
            },
            context: {
                type: 'string',
                description: 'Build context key for the image'
            },
            package: {
                type: 'string',
                description: 'Owning package short name'
            },
            basedir: {
                type: 'string',
                description: 'Base directory used when resolving the image'
            },
            base: {
                type: 'string',
                description: 'Name of the base image used by this image'
            },
            image: {
                type: 'json',
                description: 'Normalized image build definition'
            },
            children: {
                type: 'json',
                description: 'Child images that inherit from this image'
            }
        },
        associations: {
            baseImage: {
                type: 'AImage',
                cardinality: '1',
                composition: false,
                owner: false,
                description: 'Base image used by this image'
            },
            childImages: {
                type: 'AImage',
                cardinality: 'n',
                composition: false,
                owner: false,
                description: 'Images derived from this image'
            },
            services: {
                type: 'AService',
                cardinality: 'n',
                composition: false,
                owner: false,
                description: 'Services that are deployed from this image'
            }
        }
    }
}

module.exports = AImage;
