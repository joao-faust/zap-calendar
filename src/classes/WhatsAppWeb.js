const qrcodeTerminal = require("qrcode-terminal");
const { WebDriver, By, Key, until } = require("selenium-webdriver");
const { calendar_v3 } = require("googleapis");

module.exports = class WhatsApp {
  /**
   * Creates an instance of WhatsApp Web automation.
   * @param {WebDriver} webDriver The Selenium WebDriver instance.
   * @param {string} phone The phone number to send messages.
   * to.
   */
  constructor(webDriver, phone) {
    this._webDriver = webDriver;
    this._phone = phone;
  }

  /**
   * Opens WhatsApp Web and navigates to the conversation with the given phone
   * number.
   * @returns {Promise<void>} Resolves when the page is loaded.
   */
  async start() {
    await this._webDriver.get(
      `https://web.whatsapp.com/send?phone=${this._phone}`
    );
  }

  /**
   * Displays the QR code for logging in to WhatsApp Web, if required.
   * @returns {Promise<boolean>} Resolves to true if the QR code was found and
   * displayed, or false if the user is already logged in.
   */
  async logIn() {
    const qrCodexPath =
      '//*[@id="app"]/div/div[2]/div[2]/div[1]/div/div/div[2]/div[2]/div[2]/div';
    const elements = await this._webDriver.findElements(By.xpath(qrCodexPath));
    if (elements.length === 0) {
      return false;
    }
    const qrCode = elements[0];
    const qrCodeBase64 = await qrCode.getAttribute("data-ref");
    qrcodeTerminal.generate(qrCodeBase64, { small: true });
    return true;
  }

  /**
   * Sends events to the selected WhatsApp contact.
   * @param {calendar_v3.Schema$Event[] | undefined} events The list of events
   * to send.
   * @returns {Promise<void>} Resolves when the message is sent.
   */
  async sendEvents(events) {
    const inputXpath =
      '//*[@id="main"]/footer/div[1]/div/span/div/div[2]/div[1]/div[2]/div[1]/p';
    const inputReference = until.elementLocated(By.xpath(inputXpath));
    const input = await this._webDriver.wait(inputReference, 10000);
    if (!events || events.length === 0) {
      await input.sendKeys("*No events scheduled for today*");
    } else {
      await input.sendKeys("*Today's events*" + Key.SHIFT + Key.ENTER);
      for (const event of events) {
        const title = event.summary;
        const startHour = new Date(event.start.dateTime).getHours();
        const endHour = new Date(event.end.dateTime).getHours();
        const row = `${title} (${startHour}h-${endHour}h)`;
        await input.sendKeys(row + Key.SHIFT + Key.ENTER);
      }
    }
    const refreshedInput = await this._webDriver.wait(inputReference, 10000);
    await refreshedInput.sendKeys(Key.ENTER);
  }
};
