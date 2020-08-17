const { BlobServiceClient } = require("@azure/storage-blob");
const TypeChecker = require('../game/app/client/shared/TypeChecker.js');
const FileSystem = require('./FileSystem');
const { getVideoDurationInSeconds } = require('get-video-duration');

module.exports = class blob {

    #blobServiceClient;

    constructor() {
        if (!!blob.instance) {
            return blob.instance;
        }

        blob.instance = this;
    }

    connectBlob() {
        const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
        this.#blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
        console.log("connected to blob storage");
    }

    async uploadFile(containerName, fileName, dir) {
        TypeChecker.isString(containerName);
        TypeChecker.isString(fileName);
        TypeChecker.isString(dir);

        const containerClient = this.#blobServiceClient.getContainerClient(containerName);
        await containerClient.createIfNotExists();

        const fileNameWithUnderscore = fileName.replace(/ /g, "_");
        const uploadFileName = fileNameWithUnderscore.slice(0, -4) + "_" + new Date().getTime() + ".mp4";
        const blockBlobClient = containerClient.getBlockBlobClient(uploadFileName);
        console.log('\nUploading to Azure storage as blob:\n\t', uploadFileName);

        return getVideoDurationInSeconds(FileSystem.createReadStream(dir + fileName)).then(duration => {
            if (duration < 1) {
                return false;
            } else {
                let bufferSize = 1024 * 1024;
                return blockBlobClient.uploadStream(FileSystem.createReadStream(dir + fileName, { highWaterMark: bufferSize, allowVolatile: true }), bufferSize).then(res => {
                    console.log(fileName + ' with id ' + ' and duration ' + duration + ' uploaded');
                    return {uploadFileName, duration};
                }).catch(err => {
                    console.error(err);
                })
            }
        })
    }
}