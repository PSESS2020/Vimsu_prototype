const azure = require("azure-storage");
const TypeChecker = require('../game/app/client/shared/TypeChecker.js');
const FileSystem = require('./FileSystem');
const path = require('path');

/**
 * The Blob Storage
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
module.exports = class blob {

    #blobService;

    /**
     * @constructor Creates an instance of blob
     */
    constructor() {
        if (!!blob.instance) {
            return blob.instance;
        }

        blob.instance = this;
    }

    /**
     * Connects to blob service
     */
    connectBlob() {
        const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
        if (!connectionString) {
            console.log("Cannot connect to blob storage. Please ask the owner of this project for the connection string.");
            return;
        }
        this.#blobService = azure.createBlobService(connectionString);

        console.log("Connected to blob storage");
    }

    /**
     * Uploads file to blob storage
     * 
     * @param {String} containerName container name
     * @param {String} fileName file name
     * @param {String} dir file directory where the file is to be read
     * @param {String} fileType file type
     * 
     * @return fileId
     */
    async uploadFile(containerName, fileName, dir, fileType) {
        TypeChecker.isString(containerName);
        TypeChecker.isString(fileName);
        TypeChecker.isString(dir);
        TypeChecker.isString(fileType);

        const fileNameWithUnderscore = fileName.replace(/ /g, "_");
        const uploadFileName = path.parse(fileNameWithUnderscore).name + "_" + new Date().getTime() + path.parse(fileNameWithUnderscore).ext;

        console.log('\nUploading to Azure storage as blob:\n\t', uploadFileName);

        let bufferSize = 1024 * 1024;
        let writeStream = this.#blobService.createWriteStreamToBlockBlob(containerName, uploadFileName, { contentSettings: { contentType: fileType } });

        return new Promise((resolve, reject) => {
            FileSystem.createReadStream(dir + fileName, { highWaterMark: bufferSize, allowVolatile: true }).pipe(writeStream)
                .on('finish', function () {
                    console.log(fileName + ' with id ' + uploadFileName + ' uploaded');
                    resolve(uploadFileName);
                })
                .on('error', function (error) {
                    console.error(error);
                    reject();
                });
        });
    }

    /**
     * Deletes file from container
     * 
     * @param {String} containerName container name
     * @param {String} fileName file name
     */
    deleteFile(containerName, fileName) {
        TypeChecker.isString(containerName);
        TypeChecker.isString(fileName);

        this.#blobService.deleteBlobIfExists(containerName, fileName, { deleteSnapshots: 'include' }, function (err, result, response) {
            if (!err) {
                console.log(fileName + " deleted")
            }
        })
    }

    /**
     * @private Gets shared access policy of an URL
     * 
     * @param {Date} startDate access start date
     * @param {number} accessTimeInMinutes access duration in minutes
     * 
     * @return shared access policy
     */
    #getSharedAccessPolicy = function (startDate, accessTimeInMinutes) {
        TypeChecker.isDate(startDate);
        TypeChecker.isNumber(accessTimeInMinutes);

        var expiryDate = new Date(startDate);
        expiryDate.setMinutes(startDate.getMinutes() + accessTimeInMinutes);
        startDate.setMinutes(startDate.getMinutes() - accessTimeInMinutes);

        var sharedAccessPolicy = {
            AccessPolicy: {
                Permissions: azure.BlobUtilities.SharedAccessPermissions.READ,
                Start: startDate,
                Expiry: expiryDate
            },
        };
        return sharedAccessPolicy;
    }

    /**
     * Generates shared access signature
     * 
     * @param {String} containerName container name
     * @param {String} fileName file name
     * @param {Date} startDate access start date
     * @param {number} accessTimeInMinutes access duration in minutes
     * 
     * @return file URL
     */
    getWriteSAS(containerName, fileName, startDate, accessTimeInMinutes) {
        TypeChecker.isString(containerName);
        TypeChecker.isString(fileName);

        var sasToken = this.#blobService.generateSharedAccessSignature(containerName, fileName, this.#getSharedAccessPolicy(startDate, accessTimeInMinutes));
        const url = this.#blobService.getUrl(containerName, fileName, sasToken);
        return url;
    }
}