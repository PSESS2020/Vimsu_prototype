const MongoClient = require('mongodb').MongoClient;
const connectionString = "mongodb+srv://klaudialeo:klaudialeovimsu@vimsu.qwx3k.mongodb.net/vimsudb?retryWrites=true&w=majority"
var TypeChecker = require('../game/app/utils/TypeChecker')

module.exports = class db {
    #vimsudb;

    constructor() {
    }

    connectDB() {
        return MongoClient.connect(connectionString, { 
            useUnifiedTopology: true
        })
        .then(client => {
            console.log('Connected to Database')
            this.#vimsudb = client.db('vimsudb');
            console.log("connectDB() "  + this.#vimsudb)
            this.listCollections();

        })
        .catch(error => 
            console.error(error)
        )
    }

    listCollections() {
        this.#vimsudb.listCollections().toArray(function(err, collInfos) {
            if (err) throw err;
            console.log(collInfos);
        });
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

    findAllDocuments(collectionName){
        TypeChecker.isString(collectionName);
        var collection = this.#vimsudb.collection(collectionName);

        return collection.find().toArray()
        .then(results => {
            console.log(results);
        })
        .catch(err => {
            console.error(err)
        })
    }

    findInCollection(collectionName, query) {
        TypeChecker.isString(collectionName);
        var collection = this.#vimsudb.collection(collectionName);

        return collection.find(query).toArray()
        .then(results => {
            return results;
        })
        .catch(err => {
            console.error(err)
        })
    }

    findOneInCollection(collectionName, query) {
        TypeChecker.isString(collectionName);
        var collection = this.#vimsudb.collection(collectionName);

        return collection.findOne(query)
        .then(result => {
            console.log(result);
            return result;
        })
        .catch(err => {
            console.error(err)
        })
    }

    updateOneInCollection(collectionName, query, newValue) {
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
}