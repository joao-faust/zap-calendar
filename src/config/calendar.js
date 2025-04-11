const { readFile, writeFile } = require("fs/promises");
const { join } = require("path");
const { authenticate } = require("@google-cloud/local-auth");
const { Common, google } = require("googleapis");

const SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"];
const TOKEN_PATH = join(process.cwd(), "token.json");
const CREDENTIALS_PATH = join(process.cwd(), "credentials.json");

/**
 * Loads previously saved OAuth2 credentials from disk, if available.
 * @returns {Promise<Common.OAuth2Client | null>} The authenticated OAuth2
 * client, or null if not found.
 */
const loadSavedCredentialsIfExist = async () => {
  try {
    const content = await readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
};

/**
 * Saves the OAuth2 client credentials to disk for future use.
 * @param {Common.OAuth2Client} client The authenticated OAuth2 client.
 * @returns {Promise<void>} Resolves when the credentials have been saved.
 */
const saveCredentials = async (client) => {
  const content = await readFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: "authorized_user",
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await writeFile(TOKEN_PATH, payload);
};

/**
 * Authenticates the user with Google and returns an authorized Calendar client.
 * If a saved token exists, it is used, otherwise, a new login flow is triggered.
 * @returns {Promise<Common.OAuth2Client | null>} The authenticated OAuth2 client,
 * or null if authentication fails.
 */
module.exports.getCalendarAuth = async () => {
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  }
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  if (client.credentials) {
    await saveCredentials(client);
  }
  return client;
};
