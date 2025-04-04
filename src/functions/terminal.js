/**
 * Log the text in red
 * @param {string} text
 * @returns {void}
 */
module.exports.logInRed = (text) => {
  console.log(`\x1b[31m${text}\x1b[0m`);
}

/**
 * Log the text in green
 * @param {string} text
 * @returns {void}
 */
module.exports.logInGreen = (text) => {
  console.log(`\x1b[32m${text}\x1b[0m`);
}
