const { readFile, writeFile } = require("fs/promises");
const { join } = require("path");
const { authenticate } = require("@google-cloud/local-auth");
const { Common, google } = require("googleapis");

const SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"];
const TOKEN_PATH = join(process.cwd(), "token.json");
const CREDENTIALS_PATH = join(process.cwd(), "credentials.json");

/**
 * Read previously authorized credentials from the save file
 * @returns {Promise<Common.OAuth2Client | null>} Google calendar client
 */
const loadSavedCredentialsIfExist = async () => {
  try {
    const content = await readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

/**
 * Serialize credentials to a file compatible with GoogleAuth.fromJSON
 * @param {Common.OAuth2Client} client
 * @returns {Promise<void>}
 */
const saveCredentials = async (client) => {
  const content = await readFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: "authorized_user",
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token
  });
  await writeFile(TOKEN_PATH, payload);
}

/**
 * Load or request or authorization to call APIs
 * @returns {Promise<Common.OAuth2Client | null>} Google calendar client or
 * null
 */
module.exports.getCalendarAuth = async () => {
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  }
  client = await authenticate({ scopes: SCOPES, keyfilePath: CREDENTIALS_PATH });
  if (client.credentials) {
    await saveCredentials(client);
  }
  return client;
}
