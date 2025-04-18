const { join } = require("path");
const { Builder, WebDriver, Browser } = require("selenium-webdriver");
const { Options } = require("selenium-webdriver/chrome");
const { isDev } = require("../services/runtime");

/**
 * Configures Chrome options for Selenium WebDriver.
 * Uses a persistent user data directory and enables headless mode in production.
 * @returns {Options} Configured Chrome options.
 */
const getChromeOptions = () => {
  const userDataDir = join(__dirname, "../../chrome-profile");
  const optionsArguments = [`user-data-dir=${userDataDir}`];
  if (!isDev()) {
    optionsArguments.push("--headless");
  }
  return new Options().addArguments(optionsArguments);
};

/**
 * Creates and returns a new Selenium WebDriver instance configured for Chrome.
 * @returns {Promise<WebDriver>} A Promise that resolves to a configured WebDriver
 * instance.
 */
module.exports.getChromeWebDriver = async () => {
  const options = getChromeOptions();
  return await new Builder()
    .forBrowser(Browser.CHROME)
    .setChromeOptions(options)
    .build();
};
