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
        return Object.entries(obj).reduce( ([key, val]) => {
            // TODO handle different cases
        }, "")
    }

    static arrayToHashCode (arr) {
        return arr.reduce( val => {
            if (typeof val === 'string') {
                return AlgoLibrary.convertToHashCode(val)
            } else if (Array.isArray(val)) {
                return AlgoLibrary.arrayToHashCode(val)
            } 
            // add handling for objects and numbers
        }, "")
    }

    static checkObjectMeetsSpecs (obj, specs) {
        // type-checking needs to be done by caller!!!
        // maybe allow for keys in specs and keys in obj to be
        // slightly different and still match (different capitalozation
        // etc.)
        let objState = obj.getState()
        for (const [key, val] of Object.entries(specs)) {
            if (key.toLowerCase() === 'class') {
                if (obj.constructor.name !== val) {
                    return false
                }
            } else {
                if (objState.hasOwnProperty(key)) {
                    if (objState[key] !== val) { return false }
                } else { return false }
            }
        }
        return true
    }
}

if (typeof module === 'object' && typeof exports === 'object') {
    module.exports = AlgoLibrary;
}