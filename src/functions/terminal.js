/**
 * @param {string} text
 * @returns {void}
 */
module.exports.logInRed = (text) => {
  console.log(`\x1b[31m${text}\x1b[0m`);
}

/**
 * @param {string} text
 * @returns {void}
 */
module.exports.logInGreen = (text) => {
  console.log(`\x1b[32m${text}\x1b[0m`);
}
