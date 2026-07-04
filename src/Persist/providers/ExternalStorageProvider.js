const fs = require('fs');
const path = require('path');
const StorageProvider = require('./StorageProvider');

class ExternalStorageProvider extends StorageProvider {
    constructor(config) {
        super(config);
        this.basePath = config.basePath;
        if (this.basePath && !fs.existsSync(this.basePath)) {
             fs.mkdirSync(this.basePath, { recursive: true });
        }
    }
    async save(itemDir, fileName, content, encoding) {
        const actualFileName = this.toFileName(fileName);
        const externalPath = path.join(this.basePath, actualFileName);
        const buffer = encoding === 'base64' ? Buffer.from(content, 'base64') : content;
        const externalDir = path.dirname(externalPath);
        if (!fs.existsSync(externalDir)) {
            fs.mkdirSync(externalDir, { recursive: true });
        }
        fs.writeFileSync(externalPath, buffer);
        return `ext://${actualFileName}`;
    }
    async load(itemDir, fileName, encoding) {
        if (this.isHandled(fileName)) {
            const actualFileName = this.toFileName(fileName);
            const externalPath = path.join(this.basePath, actualFileName);
            if (fs.existsSync(externalPath)) {
                 if (encoding === 'base64') {
                     return fs.readFileSync(externalPath).toString('base64');
                 }
                 return fs.readFileSync(externalPath, encoding);
            }
        }
        return null;
    }
    isHandled(fileName) {
        return fileName && fileName.startsWith('ext://');
    }
    toFileName(fileName) {
        return fileName && fileName.startsWith('ext://') ? fileName.substring(6) : fileName;
    }
}

module.exports = ExternalStorageProvider;
