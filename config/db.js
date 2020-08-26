const mongodb = require('mongodb');
const TypeChecker = require('../game/app/client/shared/TypeChecker.js');

module.exports = class db {
    #vimsudb;

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
                this.#vimsudb = client.db('vimsudb');
                console.log('Connected to Database')
            })
            .catch(error =>
                console.error(error)
            )
    }

    /**
     * 
     * @param {String} collectionName 
     */
    getCollectionDocCount(collectionName) {
        TypeChecker.isString(collectionName);
        
        var collection = this.#vimsudb.collection(collectionName);

        return collection.countDocuments({}).then(count => {
            return count;
        }).catch(err => {
            console.error(err)
        })
    }

    /**
     * 
     * @param {String} collectionName 
     * @param {Object} object 
     */
    insertOneToCollection(collectionName, object) {
        TypeChecker.isString(collectionName);
        var collection = this.#vimsudb.collection(collectionName);

        return collection.insertOne(object)
            .catch(err => {
                console.error(err)
            })
    }

    /**
     * 
     * @param {String} collectionName 
     */
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

    /**
     * 
     * @param {String} collectionName 
     * @param {Object} query 
     * @param {Object} projection 
     */
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

    /**
     * 
     * @param {String} collectionName 
     * @param {Object} query 
     * @param {Object} projection 
     */
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

    /**
     * 
     * @param {String} localCollName 
     * @param {String} foreignCollName 
     * @param {String} localField 
     * @param {String} foreignField 
     */
    joinCollection(localCollName, foreignCollName, localField, foreignField) {
        TypeChecker.isString(localCollName);
        TypeChecker.isString(foreignCollName);
        TypeChecker.isString(localField);
        TypeChecker.isString(foreignField);

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

    /**
     * 
     * @param {String} collectionName 
     * @param {Object} query 
     * @param {(String|number)} newValue 
     */
    updateOneToCollection(collectionName, query, newValue) {
        TypeChecker.isString(collectionName);
        var collection = this.#vimsudb.collection(collectionName);

        return collection.updateOne(query, { '$set': newValue })
            .catch(err => {
                console.error(err)
            })
    }

    /**
     * 
     * @param {String} collectionName 
     * @param {Object} query 
     * @param {Objcet} queryToPush 
     */
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

    /**
     * 
     * @param {String} collectionName 
     * @param {Object} query 
     * @param {Object} queryToPull 
     */
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

    /**
     * 
     * @param {String} collectionName 
     * @param {Object} query 
     */
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

    /**
     * 
     * @param {String} collectionName 
     */
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