const azure = require("azure-storage");
const TypeChecker = require('../game/app/client/shared/TypeChecker.js');
const FileSystem = require('./FileSystem');
const path = require('path');

/**
 * The Blob Storage
 * @module blob
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
module.exports = class blob {

    #blobService;

    /**
     * Creates an instance of blob
     * @constructor module:blob
     */
    constructor() {
        if (!!blob.instance) {
            return blob.instance;
        }

        blob.instance = this;
    }

    /**
     * Connects to blob service
     * @method module:blob#connectBlob
     */
    connectBlob() {
        const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
        if (!connectionString) {
            console.log("Cannot connect to blob storage. Did you define a connection string to your blob storage in the .env file?");
            return;
        }
        this.#blobService = azure.createBlobService(connectionString);

        console.log("Connected to blob storage");
    }

    /**
     * Uploads file to blob storage
     * @method module:blob#uploadFile
     * 
     * @param {String} containerName container name
     * @param {String} fileName file name
     * @param {String} dir file directory where the file is to be read
     * @param {String} fileType file type
     * 
     * @return {String} fileId
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
     * Creates container if not exists
     * @method module:blob#createContainer
     * 
     * @param {String} containerName container name
     */
    createContainer(containerName) {
        TypeChecker.isString(containerName);

        this.#blobService.createContainerIfNotExists(containerName, function (error, result, response) {
            if (!error) {
                if (result.created)
                    console.log(containerName + " container was created");
                else
                    console.log(containerName + " container already existed");
            } else
                console.error(error);
        });
    }

    /**
     * Deletes file from container
     * @method module:blob#deleteFile
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
     * @method module:blob#getSharedAccessPolicy
     * 
     * @param {Date} startDate access start date
     * @param {number} accessTimeInMinutes access duration in minutes
     * 
     * @return {Object} shared access policy
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
     * @method module:blob#getWriteSAS
     * 
     * @param {String} containerName container name
     * @param {String} fileName file name
     * @param {Date} startDate access start date
     * @param {number} accessTimeInMinutes access duration in minutes
     * 
     * @return {String} file URL
     */
    getWriteSAS(containerName, fileName, startDate, accessTimeInMinutes) {
        TypeChecker.isString(containerName);
        TypeChecker.isString(fileName);

        var sasToken = this.#blobService.generateSharedAccessSignature(containerName, fileName, this.#getSharedAccessPolicy(startDate, accessTimeInMinutes));
        const url = this.#blobService.getUrl(containerName, fileName, sasToken);
        return url;
    }
}