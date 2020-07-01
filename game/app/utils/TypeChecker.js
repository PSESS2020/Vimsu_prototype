module.exports = class TypeChecker {


    static isValidString(value) 
    {
        if ((typeof value !== 'string') || !value) 
        {   
            throw new TypeError(value + ' is not a string or is an empty string!')
        }
    }

    static isString(value) 
    {
        if (typeof value !== 'string') 
        {
            throw new TypeError(value + ' is not a string!')
        }
    }

    static isInt(value) 
    {
        if ((typeof value !== 'number') || value % 1 !== 0 || !(isFinite(value))) 
        {
            throw new TypeError(value + ' is not an integer!')
        }
    }

    static isFloat(value) 
    {
        if ((typeof value !== 'number') || value % 1 === 0 || !(isFinite(value))) 
        {
            throw new TypeError(value + ' is not a float!')
        }
    }

    static isBoolean(value) 
    {
        if (typeof value !== 'boolean') 
        {
            throw new TypeError(value + ' is not a boolean!')
        }
    }

    static isDate(value) 
    {
        if (!(value instanceof Date)) 
        {
            throw new TypeError(value + ' is not a Date!')
        }
    }

    static isInstanceOf(object, objectClass)
    {
        if (!(object instanceof objectClass))
        {
            throw new TypeError(object + ' is not an instance of ' + objectClass + ' class!')
        }
    }

    static isFunction(value) 
    {
        if(typeof value !== 'function') {
            throw new TypeError(value + ' is not a function!')
        }
    }

    static isEnumOf(object, Enum)
    {
        if (!Object.values(Enum).includes(object)) 
        {
            throw new TypeError(object + ' is not an enum of ' + Enum + '!')
        }
    }
}