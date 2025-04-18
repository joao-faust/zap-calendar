/**
 * Checks if the current environment is set to development.
 * @returns {boolean} true if NODE_ENV is development, otherwise false.
 */
module.exports.isDev = () => {
  return process.env.NODE_ENV === "development";
};
