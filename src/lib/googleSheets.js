import { google } from "googleapis";

function getAuth() {
  const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);
  return new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
}

export async function appendRow({ spreadsheetId, sheetName, values }) {
  const auth = getAuth();
  const sheets = google.sheets({ version: "v4", auth });
  const range = `${sheetName}!A:D`;

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range,
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [values] },
  });
}

export async function getLastRowNumber({ spreadsheetId, sheetName }) {
  const auth = getAuth();
  const sheets = google.sheets({ version: "v4", auth });
  const range = `${sheetName}!B:B`;

  const res = await sheets.spreadsheets.values.get({ spreadsheetId, range });
  const rows = res.data.values || [];
  if (rows.length <= 1) return 1;
  const last = rows[rows.length - 1][0];
  const lastNum = parseInt(last, 10);
  return Number.isFinite(lastNum) ? lastNum + 1 : 1;
}

// 🔥 ambil semua data untuk History
export async function getAllRows({ spreadsheetId, sheetName }) {
  const auth = getAuth();
  const sheets = google.sheets({ version: "v4", auth });
  const range = `${sheetName}!A:D`;

  const res = await sheets.spreadsheets.values.get({ spreadsheetId, range });
  return res.data.values || [];
}
