/**
 * The Data Type Checker
 * 
 * @author Eric Ritte, Klaudia Leo, Laura Traub, Niklas Schmidt, Philipp Schumacher
 * @version 1.0.0
 */
class TypeChecker {

    /**
     * @static Checks if value is a string
     * 
     * @param {*} value value
     */
    static isString(value) {
        if (typeof value !== 'string') {
            throw new TypeError(value + ' is not a string!')
        }
    }

    /**
     * @static Checks if value is an integer
     * 
     * @param {*} value value
     */
    static isInt(value) {
        if ((typeof value !== 'number') || value % 1 !== 0 || !(isFinite(value))) {
            throw new TypeError(value + ' is not an integer!')
        }
    }

    /**
     * @static Checks if value is a number
     * 
     * @param {*} value value
     */
    static isNumber(value) {
        if ((typeof value !== 'number') || !(isFinite(value))) {
            throw new TypeError(value + ' is not a number!')
        }
    }

    /**
     * @static Checks if value is a boolean
     * 
     * @param {*} value value
     */
    static isBoolean(value) {
        if (typeof value !== 'boolean') {
            throw new TypeError(value + ' is not a boolean!')
        }
    }

    /**
     * @static Checks if value is a date
     * 
     * @param {*} value value
     */
    static isDate(value) {
        if (!(value instanceof Date)) {
            throw new TypeError(value + ' is not a Date!')
        }
    }

    /**
     * @static Checks if an object is instance of a class
     * 
     * @param {*} object object 
     * @param {*} objectClass class
     */
    static isInstanceOf(object, objectClass) {
        if (!(object instanceof objectClass)) {
            throw new TypeError(object + ' is not an instance of ' + objectClass + ' class!')
        }
    }

    /**
     * @static Checks if an object is enum of an Enumeration
     * 
     * @param {*} object object
     * @param {*} Enum Enumeration
     */
    static isEnumOf(object, Enum) {
        if (!Object.values(Enum).includes(object)) {
            throw new TypeError(object + ' is not an enum of ' + Enum + '!')
        }
    }
}

if (typeof module === 'object' && typeof exports === 'object') {
    module.exports = TypeChecker;
}