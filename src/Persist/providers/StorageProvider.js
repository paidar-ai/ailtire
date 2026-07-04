class StorageProvider {
    constructor(config) {
        this.config = config || {};
        this.name = this.config.name || this.constructor.name;
    }

    async save(itemDir, fileName, content, encoding) {
        throw new Error("Method 'save' must be implemented");
    }

    async load(itemDir, fileName, encoding) {
        throw new Error("Method 'load' must be implemented");
    }

    // Helper for URI matching
    isHandled(fileName) {
        return false;
    }
}

module.exports = StorageProvider;
