const mongodb = require('mongodb');
const connectionString = "mongodb+srv://klaudialeo:klaudialeovimsu@vimsu.qwx3k.mongodb.net/vimsudb?retryWrites=true&w=majority"
const TypeChecker = require('../game/app/utils/TypeChecker');
const FileSystem = require('./FileSystem');
const fs = require('fs');

module.exports = class db {
    #vimsudb;

    connectDB() {
        return mongodb.MongoClient.connect(connectionString, { 
            useUnifiedTopology: true
        })
        .then(client => {
            console.log('Connected to Database')
            this.#vimsudb = client.db('vimsudb');
            console.log("connectDB() "  + this.#vimsudb)
        })
        .catch(error => 
            console.error(error)
        )
    }

    insertOneToCollection(collectionName, object) {
        console.log("insertOneToCollection() " + this.#vimsudb);
        TypeChecker.isString(collectionName);
        var collection = this.#vimsudb.collection(collectionName);

        return collection.insertOne(object)
        .then(result => {
            console.log(object + " inserted into " + collectionName);
        })
        .catch(err => {
            console.error(err)
        })
    }

    findAllInCollection(collectionName) {
        TypeChecker.isString(collectionName);
        var collection = this.#vimsudb.collection(collectionName);

        return collection.find().toArray()
        .then(results => {
            console.log(results);
            return results;
        })
        .catch(err => {
            console.error(err)
        })
    }

    findInCollection(collectionName, query, projection) {
        TypeChecker.isString(collectionName);
        var collection = this.#vimsudb.collection(collectionName);

        return collection.find(query, {projection: projection}).toArray()
        .then(results => {
            console.log(results);
            return results;
        })
        .catch(err => {
            console.error(err)
        })
    }

    findOneInCollection(collectionName, query, projection) {
        TypeChecker.isString(collectionName);
        var collection = this.#vimsudb.collection(collectionName);

        return collection.findOne(query, {projection: projection})
        .then(result => {
            console.log(result);
            return result;
        })
        .catch(err => {
            console.error(err)
        })
    }

    updateOneToCollection(collectionName, query, newValue) {
        TypeChecker.isString(collectionName);
        var collection = this.#vimsudb.collection(collectionName);

        return collection.updateOne(query, {'$set': newValue})
        .then(result => {
            console.log("query" + " in " + collectionName + " updated to " + newValue);
        })
        .catch(err => {
            console.error(err)
        })
    }

    deleteOneFromCollection(collectionName, query) {
        TypeChecker.isString(collectionName);
        var collection = this.#vimsudb.collection(collectionName);

        return collection.deleteOne(query)
        .then(result => {
            console.log(query + " deleted from " + collectionName);
        })
        .catch(err => {
            console.error(err)
        })
    }

    deleteAllFromCollection(collectionName) {
        TypeChecker.isString(collectionName);
        var collection = this.#vimsudb.collection(collectionName);

        return collection.deleteMany()
        .then(result => {
            console.log("all documents deleted from " + collectionName);
        })
        .catch(err => {
            console.error(err)
        })
    }

    uploadFile(collectionName, fileName, dir) {
        TypeChecker.isString(collectionName);
        TypeChecker.isString(fileName);

        const bucket = new mongodb.GridFSBucket(this.#vimsudb, {
            chunkSizeBytes: 1024*1024,
            bucketName: collectionName,
        });

        var readStream = fs.createReadStream(dir + fileName);
        var uploadStream = bucket.openUploadStream(fileName);

        var fileId = uploadStream.id.toString();
    
        return new Promise((resolve, reject) => {
            readStream.pipe(uploadStream)
            .on('finish', function() {
                console.log(fileName + ' with id ' + fileId + ' uploaded');
                resolve(fileId);
            })
            .on('error', function(error) {
                console.error(error);
                reject();
            });
        });
    }

    downloadFile(collectionName, fileId) {
        TypeChecker.isString(collectionName);
        TypeChecker.isString(fileId);

        const bucket = new mongodb.GridFSBucket(this.#vimsudb, {
            chunkSizeBytes: 1024*1024,
            bucketName: collectionName
        });

        var dir = './download/' + collectionName + '/';
        FileSystem.createDirectory(dir);

        var id = new mongodb.ObjectID(fileId)
          
        var downloadStream = bucket.openDownloadStream(id);
        
        return this.findOneInCollection(collectionName + '.files', {_id: id}, {filename: 1}).then(file => {
            var writeStream = fs.createWriteStream(dir + file.filename)

            return new Promise((resolve, reject) => {
                downloadStream.pipe(writeStream)
                .on('finish', function() {
                    console.log(file.filename + ' downloaded')
                    resolve(dir + file.filename);
                })
                .on('error', function(error) {
                    console.error(error);
                    reject();
                });
            });
        })
        
    }
}