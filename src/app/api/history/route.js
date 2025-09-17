export const runtime = "nodejs";

import { getAllRows } from "../../../lib/googleSheets";

export async function GET() {
  try {
    const spreadsheetId = process.env.SPREADSHEET_ID;
    const sheetName = process.env.SHEET_NAME;

    const rows = await getAllRows({ spreadsheetId, sheetName });
    return Response.json({ ok: true, rows });
  } catch (err) {
    return Response.json({ ok: false, error: err.message }, { status: 500 });
  }
}
