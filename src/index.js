const WhatsAppWeb = require("./classes/WhatsAppWeb");
const Calendar = require("./classes/Calendar");
const { getWebDriver } = require("./config/webDriver");
const { getCalendarAuth } = require("./config/calendar");
const { logInRed, logInGreen } = require("./functions/terminal");
const { isDev } = require("./functions/runtime");
const { wait } = require("./functions/time");

(async () => {
  // Data
  const params = process.argv.slice(2);
  const [phone] = params;

  // Phone validation
  const phonePattern = /^\d{12,13}$/;
  if (!phonePattern.test(phone)) {
    logInRed("The phone is invalid. The format must be: ddi + ddd + number");
    return;
  }

  // Login
  const webDriver = await getWebDriver();
  const whatsAppWeb = new WhatsAppWeb(webDriver, phone);
  await whatsAppWeb.start();
  try {
    console.log("Checking the session...");
    const loginResult = await whatsAppWeb.logIn();
    await wait(10000);
    if (loginResult) {
      console.log("Waiting for QR code scan. Expires in 50 seconds.");
      console.log("If the QR code isn't scanned in time, the events won't be sent.");
      await wait(50000);
    }

    // Events
    const calendarAuth = await getCalendarAuth();
    const calendar = new Calendar(calendarAuth);
    const events = await calendar.getTodaysEvents();
    await whatsAppWeb.sendTodaysEvents(events);
    logInGreen("The events have been sent.");

    // Close web driver
    await wait(5000);
    await whatsAppWeb.stop();
  }
  catch (error) {
    logInRed("Couldn't send the events to WhatsApp.");
    if (isDev()) {
      console.log(error);
    }
  }
})();
