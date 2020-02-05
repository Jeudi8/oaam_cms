/**
 * @module utils
 */
/**
 * Checks invariant violation against a condition, will throw an error if not fulfilled
 * @internal
 * @param {boolean} condition
 * @param {string} message
 */
export const invariant = (condition, message) => {
    if (!!condition === true) {
        return;
    }
    throw new Error(`Invariant violation: ${message}`);
};
//# sourceMappingURL=invariant.js.map