/**
 * @module utils
 */
/**
 * @internal
 */
const isType = (t, v) => Object.prototype.toString.call(v) === `[object ${t}]`;
/**
 * @internal
 */
export const isNotNull = (v) => v !== null && v !== undefined;
/**
 * @internal
 */
export const isString = (v) => v && typeof v === "string" && /\S/.test(v);
/**
 * @internal
 */
export const isNumber = (v) => isType("Number", v) && isFinite(v) && !isNaN(parseFloat(v));
/**
 * @internal
 */
export const isFunction = (v) => v instanceof Function;
/**
 * @internal
 */
export const isObjectOrEmpty = (v) => isType("Object", v);
/**
 * @internal
 */
export const isArrayOrEmpty = (v) => isType("Array", v);
/**
 * @internal
 */
export const isArray = (v) => (!isArrayOrEmpty(v) ? false : v.length > 0);
/**
 * @internal
 */
export const isObject = (v) => {
    if (!isObjectOrEmpty(v)) {
        return false;
    }
    for (const key in v) {
        if (Object.prototype.hasOwnProperty.call(v, key)) {
            return true;
        }
    }
    return false;
};
//# sourceMappingURL=is.js.map