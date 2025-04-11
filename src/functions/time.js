/**
 * Delays execution for a given number of milliseconds.
 * @param {number} milliseconds - The number of milliseconds to wait.
 * @returns {Promise<void>} A Promise that resolves after the specified delay.
 */
module.exports.wait = async (milliseconds) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, milliseconds);
  });
};
