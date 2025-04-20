const WhatsAppWeb = require("./services/classes/WhatsAppWeb");
const Calendar = require("./services/classes/Calendar");
const { getChromeWebDriver } = require("./config/webDriver");
const { getCalendarAuth } = require("./config/calendar");
const { logInRed, logInGreen } = require("./services/terminal");
const { isDev } = require("./services/runtime");
const { wait } = require("./services/time");

/**
 * Validates a phone number.
 * @param {string} phone The phone number.
 * @returns {boolean} If the phone number is valid or not.
 */
const validatePhone = (phone) => {
  const phonePattern = /^\d{12,13}$/;
  return phonePattern.test(phone);
};

/**
 * Logs in to WhatsApp Web.
 * @param {WhatsAppWeb} whatsAppWeb The WhatsApp Web Instance.
 * @returns {Promise<void>} Resolves when the login process is complete.
 */
const loginToWhatsAppWeb = async (whatsAppWeb) => {
  console.log("Checking the session...");
  await wait(10000);
  const loginResult = await whatsAppWeb.logIn();
  if (loginResult) {
    console.log("Waiting for QR code scan. Expires in 50 seconds.");
    console.log(
      "If the QR code isn't scanned in time, the events won't be sent."
    );
    await wait(50000);
  }
};

/**
 * Sends calendar today's events to the selected WhatsApp contact.
 * @param {WhatsAppWeb} whatsAppWeb The WhatsApp Web Instance.
 * @returns {Promise<void>} Resolves when the events have been sent.
 */
const sendCalendarTodaysEvents = async (whatsAppWeb) => {
  const calendarAuth = await getCalendarAuth();
  const calendar = new Calendar(calendarAuth);
  const events = await calendar.getTodaysEvents();
  await whatsAppWeb.sendEvents(events);
  logInGreen("The events have been sent.");
};

(async () => {
  const params = process.argv.slice(2);
  const [phone] = params;
  if (!validatePhone(phone)) {
    logInRed("The phone is invalid. The format must be: ddi + ddd + number");
    return;
  }
  const webDriver = await getChromeWebDriver();
  const whatsAppWeb = new WhatsAppWeb(webDriver, phone);
  try {
    await whatsAppWeb.start();
    await loginToWhatsAppWeb(whatsAppWeb);
    await sendCalendarTodaysEvents(whatsAppWeb);
  } catch (error) {
    logInRed("Couldn't send the events to WhatsApp.");
    if (isDev()) {
      console.log(error);
    }
  }
  await wait(5000);
  await webDriver.quit();
})();
