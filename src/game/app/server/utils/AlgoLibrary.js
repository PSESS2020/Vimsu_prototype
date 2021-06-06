const TypeChecker = require("../../client/shared/TypeChecker")

class AlgoLibrary {
    static convertToHashCode (string) {
        TypeChecker.isString(string)
        var hash = 0
        for (i in  [...Array(string.length)]) {
            hash = ((hash << 5) - hash) + string.charCodeAt(i)
            hash = hash & hash
        }
        return parseInt(hash, 10).toString(36)
    }
    
    static dataObjectToHashCode (obj) {
        // TO implement
    }
}

if (typeof module === 'object' && typeof exports === 'object') {
    module.exports = AlgoLibrary;
}