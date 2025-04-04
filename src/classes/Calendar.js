const { Common, calendar_v3, google } = require("googleapis");

module.exports = class Calendar {
  /**
   * @param {Common.OAuth2Client} auth
   */
  constructor(auth) {
    this._calendar = google.calendar({ version: "v3", auth });
  }

  /**
   * Get events from Google Calendar based on start and end dates
   * @param {Date} startDate
   * @param {Date} endDate
   * @return {Promise<calendar_v3.Schema$Event[] | undefined>} Events
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
   * Get today's event from Google Calendar
   * @return {Promise<calendar_v3.Schema$Event[] | undefined>} Events
   */
  async getTodaysEvents() {
    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);
    return await this.getEvents(startDate, endDate);
  }
}
