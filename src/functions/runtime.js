/**
 * Check if runtime environment is on development
 * @returns {boolean}
 */
module.exports.isDev = () => {
  return process.env.NODE_ENV === "development";
}
