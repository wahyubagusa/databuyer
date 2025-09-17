// src/app/api/submit/route.js
export const runtime = "nodejs";

import { appendRow, getLastRowNumber } from "../../../lib/googleSheets";

const okString = (v) => typeof v === "string" && v.trim().length > 0;

export async function GET() {
  try {
    const spreadsheetId = process.env.SPREADSHEET_ID;
    const sheetName = process.env.SHEET_NAME;

    const next = await getLastRowNumber({ spreadsheetId, sheetName });
    return Response.json({ ok: true, next });
  } catch (err) {
    return Response.json({ ok: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { nama, versi, tanggal, noPesanan } = body || {};

    if (!okString(nama)) throw new Error("Nama wajib diisi");
    if (!okString(versi)) throw new Error("Versi wajib diisi");
    if (!okString(tanggal)) throw new Error("Tanggal wajib diisi");

    const spreadsheetId = process.env.SPREADSHEET_ID;
    const sheetName = process.env.SHEET_NAME;

    // Tentukan nomor antrian otomatis (server-side)
    const antrian = await getLastRowNumber({ spreadsheetId, sheetName });

    // Tulis ke Sheet: A=Nama, B=Antrian, C=Versi, D=Tanggal, E=No Pesanan
    await appendRow({
      spreadsheetId,
      sheetName,
      values: [nama, antrian, versi, tanggal, noPesanan || ""],
    });

    return Response.json({ ok: true, antrian });
  } catch (err) {
    return Response.json({ ok: false, error: err.message }, { status: 500 });
  }
}
