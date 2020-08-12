
class TypeChecker {

    static isString(value) {
        if (typeof value !== 'string') {
            throw new TypeError(value + ' is not a string!')
        }
    }

    static isInt(value) {
        if ((typeof value !== 'number') || value % 1 !== 0 || !(isFinite(value))) {
            throw new TypeError(value + ' is not an integer!')
        }
    }

    static isNumber(value) {
        if ((typeof value !== 'number') || !(isFinite(value))) {
            throw new TypeError(value + ' is not a number!')
        }
    }

    static isBoolean(value) {
        if (typeof value !== 'boolean') {
            throw new TypeError(value + ' is not a boolean!')
        }
    }

    static isDate(value) {
        if (!(value instanceof Date)) {
            throw new TypeError(value + ' is not a Date!')
        }
    }

    static isInstanceOf(object, objectClass) {
        if (!(object instanceof objectClass)) {
            throw new TypeError(object + ' is not an instance of ' + objectClass + ' class!')
        }
    }

    static isEnumOf(object, Enum) {
        if (!Object.values(Enum).includes(object)) {
            throw new TypeError(object + ' is not an enum of ' + Enum + '!')
        }
    }
}

if (typeof module === 'object' && typeof exports === 'object') {
    module.exports = TypeChecker;
}