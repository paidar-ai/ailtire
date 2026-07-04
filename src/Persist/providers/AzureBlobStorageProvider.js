const StorageProvider = require('./StorageProvider');

class AzureBlobStorageProvider extends StorageProvider {
    constructor(config) {
        super(config);
        this.connectionString = config.connectionString;
        this.containerName = config.containerName;
        this.containerClient = null;
    }

    async _init() {
        if (!this.containerClient) {
            try {
                const { BlobServiceClient } = require('@azure/storage-blob');
                const blobServiceClient = BlobServiceClient.fromConnectionString(this.connectionString);
                this.containerClient = blobServiceClient.getContainerClient(this.containerName);
                await this.containerClient.createIfNotExists();
            } catch (e) {
                console.error("Azure Storage not configured or @azure/storage-blob not installed.");
                throw e;
            }
        }
    }

    async save(itemDir, fileName, content, encoding) {
        await this._init();
        const actualFileName = this.toFileName(fileName);
        const blockBlobClient = this.containerClient.getBlockBlobClient(actualFileName);
        const buffer = encoding === 'base64' ? Buffer.from(content, 'base64') : content;
        await blockBlobClient.uploadData(buffer);
        return `azure://${actualFileName}`;
    }

    async load(itemDir, fileName, encoding) {
        if (!this.isHandled(fileName)) return null;
        await this._init();
        const actualFileName = this.toFileName(fileName);
        const blockBlobClient = this.containerClient.getBlockBlobClient(actualFileName);
        const downloadResponse = await blockBlobClient.download();
        const buffer = await this._streamToBuffer(downloadResponse.readableStreamBody);
        return encoding === 'base64' ? buffer.toString('base64') : buffer.toString(encoding || 'utf-8');
    }

    isHandled(fileName) {
        return fileName && fileName.startsWith('azure://');
    }

    toFileName(fileName) {
        return fileName && fileName.startsWith('azure://') ? fileName.substring(8) : fileName;
    }

    _streamToBuffer(readableStream) {
        return new Promise((resolve, reject) => {
            const chunks = [];
            readableStream.on("data", (data) => chunks.push(data instanceof Buffer ? data : Buffer.from(data)));
            readableStream.on("end", () => resolve(Buffer.concat(chunks)));
            readableStream.on("error", reject);
        });
    }
}

module.exports = AzureBlobStorageProvider;
