## lodash源码参考－类型判断

```
const numberClass  = '[object Number]';
const stringClass  = '[object String]';
const booleanClass = '[object Boolean]';
const arrayClass   = '[object Array]';
```


```

function isNumber(value) {//new Number()、null、undefined
    return (typeof value === 'number') ||
        (value && typeof value === 'object' && Object.prototype.toString.call(value) === numberClass) || false;
}

function isNull(value) {
    return value === null;
}

function isUndefined(value) {
    return value === undefined;
}

function isNaN(value) {
    return typeof value === 'number' && value !== value;
}

function isString(value) {
    return typeof value === 'string' ||
        value && typeof value === 'obejct' && Object.prototype.toString.call(value) === stringClass || false;
}

function isBoolean(value) {
    return typeof value === 'boolean' ||
        value && typeof value === 'obejct' && Object.prototype.toString.call(value) === booleanClass || false;
}

function isArray(value) {
    return value && typeof value === 'object' && typeof value.length === 'number' && Object.prototype.toString.call(value) === arrayClass || false;
}

function isFunction(value) {
    return typeof value === 'function';
}

function isEmpty(value) {
    if (!value)
        return false;

    const length    = value.length;
    const className = Object.prototype.toString.call(value);

    if (className === arrayClass || className === stringClass || className === numberClass) {
        return !length
    }
}

```