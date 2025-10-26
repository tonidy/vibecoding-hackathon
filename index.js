// index.js
import { google } from 'googleapis';

const credentialsBase64 = process.env.GOOGLE_CREDENTIALS;
if (!credentialsBase64) {
  throw new Error('Missing GOOGLE_CREDENTIALS environment variable');
}
const credentialsJsonString = Buffer.from(credentialsBase64, 'base64').toString('utf8');
const creds = JSON.parse(credentialsJsonString);
const auth = new google.auth.GoogleAuth({
  credentials: creds,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

(async () => {
  const client = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: client });
  await sheets.spreadsheets.values.update({
    spreadsheetId: process.env.SPREADSHEET_ID,
    range: 'Sheet1!A1',
    valueInputOption: 'RAW',
    requestBody: {
      values: [['Hackathon run at', new Date().toISOString()]]
    }
  });
  console.log('Sheet updated');
})();
