/**
 * Logs a message to the console in red color.
 * @param {string} text The message to be displayed in red.
 * @returns {void}
 */
module.exports.logInRed = (text) => {
  console.log(`\x1b[31m${text}\x1b[0m`);
};

/**
 * Logs a message to the console in green color.
 * @param {string} text The message to be displayed in green.
 * @returns {void}
 */
module.exports.logInGreen = (text) => {
  console.log(`\x1b[32m${text}\x1b[0m`);
};
