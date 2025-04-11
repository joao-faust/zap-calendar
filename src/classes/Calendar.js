const { Common, calendar_v3, google } = require("googleapis");

module.exports = class Calendar {
  /**
   * Creates an instance of the Calendar wrapper.
   * @param {Common.OAuth2Client} auth The authenticated OAuth2 client.
   */
  constructor(auth) {
    this._calendar = google.calendar({ version: "v3", auth });
  }

  /**
   * Retrieves calendar events between two dates.
   * @param {Date} startDate The start date of the range.
   * @param {Date} endDate The end date of the range.
   * @returns {Promise<calendar_v3.Schema$Event[] | undefined>} A list of events
   * within the specified date range.
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
   * Retrieves all events from today (from 00:00 to 23:59).
   * @returns {Promise<calendar_v3.Schema$Event[] | undefined>} A list of
   * today's events.
   */
  async getTodaysEvents() {
    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);
    return await this.getEvents(startDate, endDate);
  }
};
