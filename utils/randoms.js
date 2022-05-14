/**
 * All these functions will help to create random strings in a certain range
 */

const crypto = require('crypto');

console.log(crypto.randomBytes(32).toString('hex'))