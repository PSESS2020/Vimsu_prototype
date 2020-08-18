const mongodb = require('mongodb');
const TypeChecker = require('../game/app/client/shared/TypeChecker.js');

module.exports = class db {
    #vimsudb;
    #client;

    constructor() {
        if (!!db.instance) {
            return db.instance;
        }

        db.instance = this;
    }

    connectDB() {
        const connectionString = process.env.MONGODB_CONNECTION_STRING;
        if(!connectionString) {
            console.log("Cannot connect to database. Please ask the owner of this project for the connection string.");
            return;
        }

        return mongodb.MongoClient.connect(connectionString, {
            useUnifiedTopology: true,
            poolSize: 1
        })
            .then(client => {
                this.#client = client;
                this.#vimsudb = client.db('vimsudb');
                console.log('Connected to Database')
            })
            .catch(error =>
                console.error(error)
            )
    }

    getCollectionDocCount(collectionName) {
        var collection = this.#vimsudb.collection(collectionName);

        return collection.countDocuments({}).then(count => {
            return count;
        }).catch(err => {
            console.error(err)
        })
    }

    insertOneToCollection(collectionName, object) {
        TypeChecker.isString(collectionName);
        var collection = this.#vimsudb.collection(collectionName);

        return collection.insertOne(object)
            .catch(err => {
                console.error(err)
            })
    }

    findAllInCollection(collectionName) {
        TypeChecker.isString(collectionName);
        var collection = this.#vimsudb.collection(collectionName);

        return collection.find().toArray()
            .then(results => {
                return results;
            })
            .catch(err => {
                console.error(err)
            })
    }

    findInCollection(collectionName, query, projection) {
        TypeChecker.isString(collectionName);
        var collection = this.#vimsudb.collection(collectionName);

        return collection.find(query, { projection: projection }).toArray()
            .then(results => {
                return results;
            })
            .catch(err => {
                console.error(err)
            })
    }

    findOneInCollection(collectionName, query, projection) {
        TypeChecker.isString(collectionName);
        var collection = this.#vimsudb.collection(collectionName);

        return collection.findOne(query, { projection: projection })
            .then(result => {
                return result;
            })
            .catch(err => {
                console.error(err)
            })
    }

    joinCollection(localCollName, foreignCollName, localField, foreignField, projection) {
        TypeChecker.isString(localCollName);
        TypeChecker.isString(foreignCollName);

        var collection = this.#vimsudb.collection(localCollName);

        return collection.aggregate([
            {
                $lookup: {
                    from: foreignCollName,
                    localField: localField,
                    foreignField: foreignField,
                    as: foreignCollName + 'Data'
                }
            }
        ]).toArray()
            .then(results => {
                return results;
            })
            .catch(err => {
                console.error(err)
            })
    }

    updateOneToCollection(collectionName, query, newValue) {
        TypeChecker.isString(collectionName);
        var collection = this.#vimsudb.collection(collectionName);

        return collection.updateOne(query, { '$set': newValue })
            .catch(err => {
                console.error(err)
            })
    }

    insertToArrayInCollection(collectionName, query, queryToPush) {
        TypeChecker.isString(collectionName);
        var collection = this.#vimsudb.collection(collectionName);

        return collection.updateOne(query, { '$push': queryToPush })
            .then(result => {
                if (result.matchedCount > 0 && result.modifiedCount > 0) {
                    return true;
                } else {
                    return false;
                }
            })
            .catch(err => {
                console.error(err)
            })
    }

    deleteFromArrayInCollection(collectionName, query, queryToPull) {
        TypeChecker.isString(collectionName);
        var collection = this.#vimsudb.collection(collectionName);

        return collection.updateOne(query, { '$pull': queryToPull })
            .then(result => {
                if (result.matchedCount > 0 && result.modifiedCount > 0) {
                    return true;
                } else {
                    return false;
                }
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
                if (result.deletedCount > 0) {
                    return true;
                } else {
                    return false;
                }

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
                if (result.deletedCount > 0) {
                    return true;
                } else {
                    return false;
                }
            })
            .catch(err => {
                console.error(err)
            })
    }
}