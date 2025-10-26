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

  const spreadsheetId = process.env.SPREADSHEET_ID;
  const range = 'Sheet1!A1:B1';  // contoh range untuk cek

  // 1. Get current values
  const getRes = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range
  });

  const values = getRes.data.values || [];
  console.log('Current values:', values);

  if (values.length === 0 || values[0].every(cell => cell === '')) {
    // 2a. Jika kosong → set baru
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: 'Sheet1!A1:B1',
      valueInputOption: 'RAW',
      requestBody: {
        values: [
          ['Hackathon run at', new Date().toISOString()]
        ]
      }
    });
    console.log('Sheet was empty — set new values');
  } else {
    // 2b. Jika ada isi → bisa append atau overwrite ke baris baru
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Sheet1!A:B',
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: [
          ['Hackathon run at', new Date().toISOString()]
        ]
      }
    });
    console.log('Sheet had content — appended new row');
  }

  console.log('Operation done');
})();