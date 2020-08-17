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
        const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
        if(!connectionString) {
            console.log("Cannot connect to blob storage. Please ask the owner of this project for the connection string.");
            return;
        }

        this.#blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
        console.log("Connected to blob storage");
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
                    console.log(fileName + ' with id ' + uploadFileName + ' and duration ' + duration + ' uploaded');
                    return {
                        fileId: uploadFileName,
                        duration: duration
                    };
                }).catch(err => {
                    console.error(err);
                })
            }
        })
    }
}