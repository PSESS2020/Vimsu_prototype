export function isValidString(value) 
{
    if ((typeof value !== 'string') || !(value instanceof String) || !value) 
    {
        throw new TypeError(value + ' is not a string or is an empty string!')
    }
}

export function isString(value) 
{
    if ((typeof value !== 'string') || !(value instanceof String)) 
    {
        throw new TypeError(value + ' is not a string!')
    }
}

export function isInt(value) 
{
    if ((typeof value !== 'number') || value % 1 !== 0 || !(isFinite(value))) 
    {
        throw new TypeError(value + ' is not an integer!')
    }
}

export function isValidFloat(value) 
{
    if ((typeof value !== 'number') || value % 1 === 0 || !(isFinite(value))) 
    {
        throw new TypeError(value + ' is not a float!')
    }
}

export function isBoolean(value) 
{
    if (typeof value !== 'boolean') 
    {
        throw new TypeError(value + ' is not a boolean!')
    }
}

export function isDate(value) 
{
    if (!(value instanceof Date)) 
    {
        throw new TypeError(value + ' is not a Date!')
    }
}

export function isInstanceOf(object, objectClass)
{
    if (!(object instanceof objectClass))
    {
        throw new TypeError(object + ' is not an instance of ' + objectClass + ' class!')
    }
}

export function isFunction(value) 
{
    if(typeof value !== 'function') {
        throw new TypeError(value + ' is not a function!')
    }
}