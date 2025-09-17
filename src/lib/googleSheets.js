// src/lib/googleSheets.js
import { google } from "googleapis";

export function getAuth() {
  const raw = process.env.GOOGLE_CREDENTIALS;
  if (!raw) throw new Error("Missing GOOGLE_CREDENTIALS");
  const creds = JSON.parse(raw);

  // Perbaiki newline \n di private_key
  const fixedKey = (creds.private_key || "").replace(/\\n/g, "\n");

  return new google.auth.JWT({
    email: creds.client_email,
    key: fixedKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
}

export async function appendRow(values) {
  // values adalah array 4 kolom: [Nama, Antrian, Versi, Tanggal]
  const auth = getAuth();
  const sheets = google.sheets({ version: "v4", auth });

  const spreadsheetId = process.env.SPREADSHEET_ID;
  const sheetName = process.env.SHEET_NAME || "Sheet1";
  if (!spreadsheetId) throw new Error("Missing SPREADSHEET_ID");

  const range = `${sheetName}!A:D`;
  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range,
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: { values: [values] },
  });
}
