const mongodb = require('mongodb');
const TypeChecker = require('../game/app/client/shared/TypeChecker.js');

module.exports = class db {
    #vimsudb;

    /**
     * @constructor Creates an instance of db
     */
    constructor() {
        if (!!db.instance) {
            return db.instance;
        }

        db.instance = this;
    }

    /**
     * Connects to the database
     */
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
     * Get document count in the collection
     * 
     * @param {String} collectionName collection name
     * 
     * @return document count
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
     * Stores a document into a collection
     * 
     * @param {String} collectionName collection name
     * @param {Object} object document to be stored
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
     * Gets all documents in a collection
     * 
     * @param {String} collectionName collection name
     * 
     * @return documents
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
     * Gets multiple documents in a collection
     * 
     * @param {String} collectionName collection name
     * @param {Object} query query
     * @param {Object} projection projection
     * 
     * @return documents
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
     * Gets a document in a collection
     * 
     * @param {String} collectionName collection name
     * @param {Object} query query
     * @param {Object} projection projection
     * 
     * @return document
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
     * Joins to collection and returns the results
     * 
     * @param {String} localCollName local collection name
     * @param {String} foreignCollName foreign collection name
     * @param {String} localField local field
     * @param {String} foreignField foreign field
     * 
     * @return joined documents
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
     * Updates a document in a collection
     * 
     * @param {String} collectionName collection name
     * @param {Object} query query
     * @param {(String|number)} newValue new value
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
     * Inserts a query to an array in a collection
     * 
     * @param {String} collectionName collection name
     * @param {Object} query query
     * @param {Objcet} queryToPush query to be inserted
     * 
     * @return true if inserted successfully, otherwise false
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
     * Deletes a query from an array in a collection
     * 
     * @param {String} collectionName collection name
     * @param {Object} query query
     * @param {Object} queryToPull query to be deleted
     * 
     * @return true if deleted successfully, otherwise false
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
     * Deletes a document from a collection
     * 
     * @param {String} collectionName collection name
     * @param {Object} query query
     * 
     * @return true if deleted successfully, otherwise false
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
     * Deletes all documents from a collection
     * 
     * @param {String} collectionName collection name
     * 
     * @return true if deleted successfully, otherwise false
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