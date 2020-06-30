export function isString(value) 
{
    return typeof value === 'string' || value instanceof String;
}

export function isInt(value) 
{
    return typeof value === 'number' && isFinite(value) && value % 1 === 0;
}

export function isFloat(value) 
{
    return typeof value === 'number' && isFinite(value) && value % 1 !== 0;
}

export function isBoolean(value) 
{
    return typeof value === 'boolean';
}

export function isDate(value) 
{
    return value instanceof Date;
}

export function isInstanceOf(object, objectClass)
{
    return object instanceof objectClass;
}

export function isFunction (value) 
{
    return typeof value === 'function';
}