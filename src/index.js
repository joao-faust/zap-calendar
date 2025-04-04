const WhatsAppWeb = require("./classes/WhatsAppWeb");
const Calendar = require("./classes/Calendar");
const { getWebDriver } = require("./config/webDriver");
const { getCalendarAuth } = require("./config/calendar");
const { logInRed, logInGreen } = require("./functions/terminal");
const { isDev } = require("./functions/runtime");
const { wait } = require("./functions/time");

/**
 * @param {string} phone
 * @returns {boolean}
 */
const validatePhone = (phone) => {
  const phonePattern = /^\d{12,13}$/;
  return phonePattern.test(phone);
}

/**
 * @param {WhatsAppWeb} whatsAppWeb
 * @returns {Promise<void>}
*/
const loginToWhatsAppWeb = async (whatsAppWeb) => {
  console.log("Checking the session...");
  await wait(10000);
  const loginResult = await whatsAppWeb.logIn();
  if (loginResult) {
    console.log("Waiting for QR code scan. Expires in 50 seconds.");
    console.log("If the QR code isn't scanned in time, the events won't be sent.");
    await wait(50000);
  }
}

/**
 * @param {WhatsAppWeb} whatsAppWeb
 * @returns {Promise<void>}
*/
const sendTodaysEventsToWhatsAppWeb = async (whatsAppWeb) => {
  const calendarAuth = await getCalendarAuth();
  const calendar = new Calendar(calendarAuth);
  const events = await calendar.getTodaysEvents();
  await whatsAppWeb.sendTodaysEvents(events);
  logInGreen("The events have been sent.");
}

(async () => {
  const params = process.argv.slice(2);
  const [phone] = params;
  if (!validatePhone(phone)) {
    logInRed("The phone is invalid. The format must be: ddi + ddd + number");
    return;
  }
  const webDriver = await getWebDriver();
  const whatsAppWeb = new WhatsAppWeb(webDriver, phone);
  try {
    await whatsAppWeb.start();
    await loginToWhatsAppWeb(whatsAppWeb);
    await sendTodaysEventsToWhatsAppWeb(whatsAppWeb);
  }
  catch (error) {
    logInRed("Couldn't send the events to WhatsApp.");
    if (isDev()) {
      console.log(error);
    }
  }
  await wait(5000);
  await webDriver.quit();
})();
