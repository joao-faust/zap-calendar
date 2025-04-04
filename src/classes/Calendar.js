const { Common, calendar_v3, google } = require("googleapis");

module.exports = class Calendar {
  /**
   * @param {Common.OAuth2Client} auth
   */
  constructor(auth) {
    this._calendar = google.calendar({ version: "v3", auth });
  }

  /**
   * @param {Date} startDate
   * @param {Date} endDate
   * @return {Promise<calendar_v3.Schema$Event[] | undefined>}
   */
  async getEvents(startDate, endDate) {
    const res = await this._calendar.events.list({
      calendarId: "primary",
      timeMin: startDate.toISOString(),
      timeMax: endDate.toISOString(),
      singleEvents: true,
      orderBy: "startTime",
    });
    return res.data.items;
  }

  /**
   * @return {Promise<calendar_v3.Schema$Event[] | undefined>}
   */
  async getTodaysEvents() {
    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);
    return await this.getEvents(startDate, endDate);
  }
}
