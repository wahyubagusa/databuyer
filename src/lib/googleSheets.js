// src/lib/googleSheets.js
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

// Tetap ada (untuk keperluan lain)
export async function getAllRows({ spreadsheetId, sheetName }) {
  const auth = getAuth();
  const sheets = google.sheets({ version: "v4", auth });
  const range = `${sheetName}!A:D`;
  const res = await sheets.spreadsheets.values.get({ spreadsheetId, range });
  return res.data.values || [];
}

/** ===== Tambahan untuk History + Delete ===== **/

// Kembalikan rows data + rowIndex absolut (0-based) agar bisa dihapus tepat sasaran
export async function getRowsWithIndex({ spreadsheetId, sheetName, headerRows = 1 }) {
  const rows = await getAllRows({ spreadsheetId, sheetName }); // termasuk header
  const data = rows.slice(headerRows);
  return data.map((values, i) => ({
    rowIndex: i + headerRows,
    values,
  }));
}

async function getSheetGid({ spreadsheetId, sheetName }) {
  const auth = getAuth();
  const sheets = google.sheets({ version: "v4", auth });
  const meta = await sheets.spreadsheets.get({ spreadsheetId });
  const sh = meta.data.sheets?.find(s => s.properties?.title === sheetName);
  const id = sh?.properties?.sheetId;
  if (id === undefined) throw new Error("Sheet/tab tidak ditemukan");
  return id;
}

export async function deleteRowByIndex({ spreadsheetId, sheetName, rowIndex }) {
  const auth = getAuth();
  const sheets = google.sheets({ version: "v4", auth });
  const sheetId = await getSheetGid({ spreadsheetId, sheetName });
  await sheets.spreadsheets.batchUpdate({
    spreadsheetId,
    requestBody: {
      requests: [
        {
          deleteDimension: {
            range: {
              sheetId,
              dimension: "ROWS",
              startIndex: rowIndex,
              endIndex: rowIndex + 1,
            },
          },
        },
      ],
    },
  });
}
