const mongo = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017'
var TypeChecker = require('../game/app/utils/TypeChecker')
const ObjectID = require('mongodb').ObjectID;
const passwordHash = require('password-hash')

module.exports = class db {
    #vimsudb;

    constructor() {
        this.connectDB();
    }

    connectDB() {
        mongo.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }, (err, client) => {
            if(err) throw err;
            console.log("Database connected");
            this.#vimsudb = client.db("vimsudb");
            //this.createCollection("accounts");
            //this.createCollection("participants");
            this.listCollections();

            var objectId = new ObjectID();

            var object = {
                accountId: objectId,
                username: "test123", 
                title: "",
                surname: "123",
                forename: "test",
                email: "test123@test.com",
                passwordHash: passwordHash.generate("test123")
            }
            this.findAllDocuments("accounts");
        })
    }

    listCollections() {
        this.#vimsudb.listCollections().toArray(function(err, collInfos) {
            if (err) throw err;
            console.log(collInfos);
        });
    }

    createCollection(collectionName) {
        this.#vimsudb.createCollection(collectionName, function(err, collection) {
            if (err) throw err;
            console.log(collectionName + " collection created!");
            return Promise.resolve(true);
        });
    }

    insertOneToCollection(collectionName, object) {
        TypeChecker.isString(collectionName);
        var collection = this.#vimsudb.collection(collectionName);

        collection.insertOne(object)
        .then(result => {
            console.log(object + " inserted into " + collectionName);
        })
        .catch(err => {
            console.error(err)
        })
    }

    insertManyToCollection(collectionName, objects) {
        TypeChecker.isString(collectionName);
        var collection = this.#vimsudb.collection(collectionName);

        for (object in objects) {
            collection.insertMany(object)
            .then(result => {
                console.log(object + " inserted into " + collectionName);
            })
            .catch(err => {
                console.error(err)
            })
        }
    }

    findAllDocuments(collectionName){
        TypeChecker.isString(collectionName);
        var collection = this.#vimsudb.collection(collectionName);

        collection.find().toArray()
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

        collection.find(query).toArray()
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

        collection.findOne(query)
        .then(result => {
            return result;
        })
        .catch(err => {
            console.error(err)
        })
    }

    updateOneInCollection(collectionName, query, newValue) {
        TypeChecker.isString(collectionName);
        var collection = this.#vimsudb.collection(collectionName);

        collection.updateOne(query, {'$set': newValue})
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

        collection.deleteOne(query)
        .then(result => {
            console.log(query + " deleted from " + collectionName);
        })
        .catch(err => {
            console.error(err)
        })
    }
}