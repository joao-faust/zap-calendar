# Zap Calendar

Integration between WhatsApp Web and Google Calendar built with Node.js and Selenium.

## How it works

When the integration is executed for the first time, login to WhatsApp Web and Google Calendar
will be required. After login, an instance of Google Chrome will be opened in headful (with interface)
or headless (without interface) mode. With the Chrome instance running, today's events will be fetched
from Google Calendar and sent to the desired contact on WhatsApp Web.

## Setting up the env file

Before running the integration, you need to make a copy of the .env.example file and name it .env,
then set the variable **NODE_ENV** to development or production. In development, a visible Chrome
instance (headful mode) is opened, useful for debugging. In production, a hidden Chrome instance (headless mode)
is opened, ideal for servers without a graphical interface.

## Running the intregration

Before scheduling the integration with a cron job, you need to run the command below manually to log in
to both WhatsApp Web and Google Calendar:

```bash
npm start [phone_number_here]
```

## Author

João Victor Soares Faust
