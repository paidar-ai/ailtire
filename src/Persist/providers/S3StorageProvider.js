const StorageProvider = require('./StorageProvider');

class S3StorageProvider extends StorageProvider {
    constructor(config) {
        super(config);
        this.s3 = null;
    }

    async _init() {
        if (!this.s3) {
            try {
                const AWS = require('aws-sdk');
                this.s3 = new AWS.S3({
                    endpoint: this.config.endpoint,
                    accessKeyId: this.config.accessKeyId,
                    secretAccessKey: this.config.secretAccessKey,
                    region: this.config.region,
                    s3ForcePathStyle: this.config.s3ForcePathStyle !== undefined ? this.config.s3ForcePathStyle : true,
                    signatureVersion: 'v4'
                });
            } catch (e) {
                console.error(`${this.name} Storage not configured or aws-sdk not installed.`);
                throw e;
            }
        }
    }

    async save(itemDir, fileName, content, encoding) {
        await this._init();
        const actualFileName = this.toFileName(fileName);
        const buffer = encoding === 'base64' ? Buffer.from(content, 'base64') : content;
        await this.s3.putObject({
            Bucket: this.config.bucket,
            Key: actualFileName,
            Body: buffer
        }).promise();
        return `s3://${actualFileName}`;
    }

    async load(itemDir, fileName, encoding) {
        if (!this.isHandled(fileName)) return null;
        await this._init();
        const actualFileName = this.toFileName(fileName);
        const data = await this.s3.getObject({
            Bucket: this.config.bucket,
            Key: actualFileName
        }).promise();
        const buffer = data.Body;
        return encoding === 'base64' ? buffer.toString('base64') : buffer.toString(encoding || 'utf-8');
    }

    isHandled(fileName) {
        return fileName && fileName.startsWith('s3://');
    }

    toFileName(fileName) {
        return fileName && fileName.startsWith('s3://') ? fileName.substring(5) : fileName;
    }
}

module.exports = S3StorageProvider;
