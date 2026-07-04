const fs = require('fs');
const path = require('path');
const StorageProvider = require('./StorageProvider');

class GitHubStorageProvider extends StorageProvider {
    constructor(config) {
        super(config);
        this.basePath = config.basePath;
    }
    async save(itemDir, fileName, content, encoding) {
        if (!fs.existsSync(itemDir)) fs.mkdirSync(itemDir, { recursive: true });
        const filePath = path.join(itemDir, fileName);
        const effectiveEncoding = encoding || (this.isBinaryFile(fileName) && this.looksBase64(content) ? 'base64' : undefined);
        const buffer = effectiveEncoding === 'base64' ? Buffer.from(content, 'base64') : content;
        fs.writeFileSync(filePath, buffer);
        return fileName; 
    }
    async load(itemDir, fileName, encoding) {
        const filePath = path.join(itemDir, fileName);
        if (fs.existsSync(filePath)) {
            if (encoding === 'base64') {
                return fs.readFileSync(filePath).toString('base64');
            }
            return fs.readFileSync(filePath, encoding);
        }
        return null;
    }
    isHandled(fileName) {
        // GitHub provider handles everything that isn't handled by others
        return !fileName.includes('://');
    }

    isBinaryFile(fileName) {
        const ext = path.extname(fileName || '').toLowerCase();
        return new Set([
            '.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg',
            '.mp4', '.mov', '.webm', '.m4v', '.avi',
            '.mp3', '.wav', '.m4a'
        ]).has(ext);
    }

    looksBase64(content) {
        if (typeof content !== 'string') {
            return false;
        }
        const value = content.trim();
        return value.length > 16 && value.length % 4 === 0 && /^[A-Za-z0-9+/=\s]+$/.test(value);
    }
}

module.exports = GitHubStorageProvider;
