"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = void 0;
const crypto_1 = require("crypto");
/**
 * Generates a secure random token (e.g. for email verification).
 * @returns A 64-character hex string token.
 */
const generateToken = () => {
    return (0, crypto_1.randomBytes)(32).toString('hex');
};
exports.generateToken = generateToken;
//# sourceMappingURL=token.js.map