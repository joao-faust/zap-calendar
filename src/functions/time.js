/**
 * @param {string} milliseconds
 * @returns {Promise<void>}
 */
module.exports.wait = async (milliseconds) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, milliseconds);
  });
}
