const StorageProvider = require('./providers/StorageProvider');
const GitHubStorageProvider = require('./providers/GitHubStorageProvider');
const ExternalStorageProvider = require('./providers/ExternalStorageProvider');
const AzureBlobStorageProvider = require('./providers/AzureBlobStorageProvider');
const S3StorageProvider = require('./providers/S3StorageProvider');
const MultiStorageProvider = require('./providers/MultiStorageProvider');

module.exports = { 
    StorageProvider,
    GitHubStorageProvider, 
    ExternalStorageProvider, 
    AzureBlobStorageProvider, 
    S3StorageProvider,
    MultiStorageProvider
};
