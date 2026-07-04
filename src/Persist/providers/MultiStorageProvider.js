const StorageProvider = require('./StorageProvider');

class MultiStorageProvider extends StorageProvider {
    constructor(config) {
        super(config);
        this.providers = config.providers || [];
    }

    async save(itemDir, fileName, content, encoding) {
        const results = await Promise.all(this.providers.map(p => p.save(itemDir, fileName, content, encoding)));
        return results[0];
    }

    async load(itemDir, fileName, encoding) {
        for (const provider of this.providers) {
            try {
                const content = await provider.load(itemDir, fileName, encoding);
                if (content !== null) return content;
            } catch (e) {
                console.warn(`Provider ${provider.name} failed to load ${fileName}: ${e.message}`);
                continue;
            }
        }
        return null;
    }

    isHandled(fileName) {
        return this.providers.some(p => p.isHandled(fileName));
    }
}

module.exports = MultiStorageProvider;
