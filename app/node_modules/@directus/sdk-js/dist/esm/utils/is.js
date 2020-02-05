/**
 * @module utils
 */
/**
 * @internal
 */
var isType = function (t, v) { return Object.prototype.toString.call(v) === "[object " + t + "]"; };
/**
 * @internal
 */
export var isNotNull = function (v) { return v !== null && v !== undefined; };
/**
 * @internal
 */
export var isString = function (v) { return v && typeof v === "string" && /\S/.test(v); };
/**
 * @internal
 */
export var isNumber = function (v) { return isType("Number", v) && isFinite(v) && !isNaN(parseFloat(v)); };
/**
 * @internal
 */
export var isFunction = function (v) { return v instanceof Function; };
/**
 * @internal
 */
export var isObjectOrEmpty = function (v) { return isType("Object", v); };
/**
 * @internal
 */
export var isArrayOrEmpty = function (v) { return isType("Array", v); };
/**
 * @internal
 */
export var isArray = function (v) { return (!isArrayOrEmpty(v) ? false : v.length > 0); };
/**
 * @internal
 */
export var isObject = function (v) {
    if (!isObjectOrEmpty(v)) {
        return false;
    }
    for (var key in v) {
        if (Object.prototype.hasOwnProperty.call(v, key)) {
            return true;
        }
    }
    return false;
};
//# sourceMappingURL=is.js.map