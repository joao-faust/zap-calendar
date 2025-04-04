const { join } = require("path");
const { Builder, WebDriver, Browser } = require("selenium-webdriver");
const { Options } = require("selenium-webdriver/chrome");
const { isDev } = require("../functions/runtime");

const getOptions = () => {
  const userDataDir = join(__dirname, "../../chrome-profile");
  const optionsArguments = [`user-data-dir=${userDataDir}`];
  if (!isDev()) {
    optionsArguments.push("--headless");
  }
  return new Options().addArguments(optionsArguments);
}

/**
 * Get web driver
 * @returns {Promise<WebDriver>} Web driver
 */
module.exports.getWebDriver = async () => {
  const options = getOptions();
  return await new Builder()
    .forBrowser(Browser.CHROME)
    .setChromeOptions(options)
    .build();
}
