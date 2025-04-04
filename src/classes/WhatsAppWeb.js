const qrcodeTerminal = require("qrcode-terminal");
const { WebDriver, By, Key, until } = require("selenium-webdriver");
const { calendar_v3 } = require("googleapis");

module.exports = class WhatsApp {
  /**
   * @param {WebDriver} webDriver
   * @param {string} phone
   */
  constructor(webDriver, phone) {
    this._webDriver = webDriver;
    this._phone = phone;
  }

  /**
   * Initialize WhatsApp Web
   */
  async start() {
    await this._webDriver.get(`https://web.whatsapp.com/send?phone=${this._phone}`);
  }

  /**
   * Stop WhatsAppp Web
   */
  async stop() {
    await this._webDriver.quit();
  }

  /**
   * Log in to WhatsApp
   * @param {string} qrCodeElBase64
   * @returns {Promise<boolean>}
   */
  async logIn() {
    const qrCodexPath = '//*[@id="app"]/div/div[2]/div[2]/div[1]/div/div/div[2]/div[2]/div[2]/div';
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
   * Send Google Calendar events to WhatsApp Contact
   * @param {calendar_v3.Schema$Event[] | undefined} events
   * @returns {Promise<void>}
   */
  async sendTodaysEvents(events) {
    const inputXpath = '//*[@id="main"]/footer/div[1]/div/span/div/div[2]/div[1]/div[2]/div[1]/p';
    const inputReference = until.elementLocated(By.xpath(inputXpath));
    const input = await this._webDriver.wait(inputReference, 10000);
    if (!events) {
      await input.sendKeys("*No events scheduled for today*");
      return;
    }
    await input.sendKeys("*Today's events*" + Key.SHIFT + Key.ENTER);
    events.forEach(async event => {
      const title = event.summary;
      const startHour = (new Date(event.start.dateTime)).getHours();
      const endHour = (new Date(event.end.dateTime)).getHours();
      const row = `${title}(${startHour}h-${endHour}h)`;
      await input.sendKeys(row + Key.SHIFT + Key.ENTER);
    });
    const refreshedInput = await this._webDriver.wait(inputReference, 10000);
    await refreshedInput.sendKeys(Key.ENTER);
  }
}
