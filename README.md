# Zap Calendar

Integration between WhatsApp Web and Google Calendar built with Node.js and Selenium.

## How it works

When the integration is executed for the first time, login to WhatsApp Web and Google Calendar
will be required. After login, an instance of Google Chrome will be opened in headful (with interface)
or headless (without interface) mode. With the Chrome instance running, today's events will be fetched
from Google Calendar and sent to the desired contact on WhatsApp Web.

## Used technologies

 - Node.js;
 - Selenium.

## Running the intregration

Before scheduling the integration with a cron job, you need to run the command below manually to log in
to both WhatsApp Web and Google Calendar:

```bash
npm start [phone_number_here]
```

## Author

João Victor Soares Faust
