// src/app/api/history/route.js
export const runtime = "nodejs";

import { getRowsWithIndex, deleteRowByIndex } from "../../../lib/googleSheets";

const spreadsheetId = process.env.SPREADSHEET_ID;
const sheetName = process.env.SHEET_NAME;
const headerRows = Number(process.env.HEADER_ROWS || 1);

export async function GET() {
  try {
    const rows = await getRowsWithIndex({ spreadsheetId, sheetName, headerRows });
    return Response.json({ ok: true, rows });
  } catch (err) {
    return Response.json({ ok: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const body = await req.json().catch(() => ({}));
    let indexes = [];

    if (Array.isArray(body.rowIndexes)) {
      indexes = body.rowIndexes;
    } else if (typeof body.rowIndex === "number") {
      indexes = [body.rowIndex];
    } else {
      return Response.json({ ok: false, error: "rowIndex/rowIndexes tidak valid" }, { status: 400 });
    }

    // validasi dan hapus dari terbesar → terkecil agar index tidak geser
    indexes = indexes
      .filter((n) => Number.isFinite(n) && n >= headerRows)
      .sort((a, b) => b - a);

    if (indexes.length === 0) {
      return Response.json({ ok: false, error: "Tidak ada baris valid untuk dihapus" }, { status: 400 });
    }

    for (const rowIndex of indexes) {
      await deleteRowByIndex({ spreadsheetId, sheetName, rowIndex });
    }

    return Response.json({ ok: true });
  } catch (err) {
    return Response.json({ ok: false, error: err.message }, { status: 500 });
  }
}
