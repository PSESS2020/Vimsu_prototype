const mongodb = require('mongodb');
const TypeChecker = require('../game/app/client/shared/TypeChecker.js');

/**
 * The Database
 * @module db
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
module.exports = class db {
    #vimsudb;

    /**
     * Creates an instance of db
     * @constructor module:db
     */
    constructor() {
        if (!!db.instance) {
            return db.instance;
        }

        db.instance = this;
    }

    /**
     * Connects to the database
     * @method module:db#connectDB
     */
    connectDB() {
        const connectionString = process.env.MONGODB_CONNECTION_STRING;
        if(!connectionString) {
            console.log("Cannot connect to database. Did you define a connection string to your database in the .env file?");
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
     * @method module:db#getCollectionDocCount
     * 
     * @param {String} collectionName collection name
     * 
     * @return {number} document count
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
     * @method module:db#insertOneToCollection
     * 
     * @param {String} collectionName collection name
     * @param {Object} object document to be stored
     */
    insertOneToCollection(collectionName, object) {
        TypeChecker.isString(collectionName);
        var collection = this.#vimsudb.collection(collectionName);

        return collection.insertOne(object)
            .then(res => {
                return res;
            })
            .catch(err => {
                return err;
            })
    }

    /**
     * Gets all documents in a collection
     * @method module:db#findAllInCollection
     * 
     * @param {String} collectionName collection name
     * @param {?Object} sortedBy sorted by
     * 
     * @return {Object[]} documents
     */
    findAllInCollection(collectionName, sortedBy) {
        TypeChecker.isString(collectionName);
        var collection = this.#vimsudb.collection(collectionName);

        return collection.find().sort(sortedBy).toArray()
            .then(results => {
                return results;
            })
            .catch(err => {
                console.error(err)
            })
    }

    /**
     * Gets multiple documents in a collection
     * @method module:db#findInCollection
     * 
     * @param {String} collectionName collection name
     * @param {Object} query query
     * @param {?Object} projection projection
     * @param {?Object} sortedBy sorted by
     * 
     * @return {Object[]} documents
     */
    findInCollection(collectionName, query, projection, sortedBy) {
        TypeChecker.isString(collectionName);
        var collection = this.#vimsudb.collection(collectionName);

        return collection.find(query, { projection: projection }).sort(sortedBy).toArray()
            .then(results => {
                return results;
            })
            .catch(err => {
                console.error(err)
            })
    }

    /**
     * Gets a document in a collection
     * @method module:db#findOneInCollection
     * 
     * @param {String} collectionName collection name
     * @param {Object} query query
     * @param {Object} projection projection
     * 
     * @return {Object} document
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
     * @method module:db#joinCollection
     * 
     * @param {String} localCollName local collection name
     * @param {String} foreignCollName foreign collection name
     * @param {String} localField local field
     * @param {String} foreignField foreign field
     * 
     * @return {Object} joined documents
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
     * @method module:db#updateOneToCollection
     * 
     * @param {String} collectionName collection name
     * @param {Object} query query
     * @param {(String|number)} [newValue] new value
     */
    updateOneToCollection(collectionName, query, newValue) {
        TypeChecker.isString(collectionName);
        var collection = this.#vimsudb.collection(collectionName);

        return collection.updateOne(query, { '$set': newValue }).then(res => {
            return res;
        }).catch(err => {
            return err;
        })
    }

    /**
     * Updates multiple documents in a collection
     * @method module:db#updateManyToCollection
     * 
     * @param {String} collectionName collection name
     * @param {Object} query query
     * @param {(String|number)} [newValue] new value
     */
    updateManyToCollection(collectionName, query, newValue) {
        TypeChecker.isString(collectionName);
        var collection = this.#vimsudb.collection(collectionName);

        return collection.updateMany(query, { '$set': newValue }).then(res => {
            return res;
        }).catch(err => {
            return err;
        })
    }

    /**
     * Inserts a query to an array in a collection
     * @method module:db#insertToArrayInCollection
     * 
     * @param {String} collectionName collection name
     * @param {Object} query query
     * @param {Objcet} queryToPush query to be inserted
     * 
     * @return {boolean} true if inserted successfully, otherwise false
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
     * Creates unique index in a collection
     * 
     * @param {String} collectionName collection name
     * @param {Object} query key that should be unique in format { key: 1 }
     * @returns 
     */
    createUniqueIndexInCollection(collectionName, query) {
        TypeChecker.isString(collectionName);
        var collection = this.#vimsudb.collection(collectionName);

        return collection.createIndex(query, { unique: true })
            .then(results => {
                console.log(results);
            })
            .catch(err => {
                console.error(err)
            })
    }

    /**
     * Deletes a query from an array in a collection
     * @method module:db#deleteFromArrayInCollection
     * 
     * @param {String} collectionName collection name
     * @param {Object} query query
     * @param {Object} queryToPull query to be deleted
     * 
     * @return {boolean} true if deleted successfully, otherwise false
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
     * @method module:db#deleteOneFromCollection
     * 
     * @param {String} collectionName collection name
     * @param {Object} query query
     * 
     * @return {boolean} true if deleted successfully, otherwise false
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
     * @method module:db#deleteAllFromCollection
     * 
     * @param {String} collectionName collection name
     * 
     * @return {boolean} true if deleted successfully, otherwise false
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
