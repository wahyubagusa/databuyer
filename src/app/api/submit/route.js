export const runtime = "nodejs";

import { appendRow } from "@/lib/googleSheets"; // gunakan alias "@/"

const okString = (v) => typeof v === "string" && v.trim().length > 0;

export async function POST(req) {
  try {
    const { nama, antrian, versi, tanggal } = await req.json();

    if (!okString(nama))    return Response.json({ ok:false, error:"Nama wajib diisi." }, { status:400 });
    if (!okString(antrian)) return Response.json({ ok:false, error:"Antrian Nomor wajib diisi." }, { status:400 });
    if (!["Steam", "EA"].includes(versi)) {
      return Response.json({ ok:false, error:"Versi harus Steam atau EA." }, { status:400 });
    }

    let finalTanggal = tanggal;
    if (!okString(finalTanggal)) {
      const now = new Date();
      const wib = new Date(now.getTime() + 7 * 60 * 60 * 1000);
      finalTanggal = wib.toISOString().slice(0, 10);
    }

    await appendRow([nama.trim(), antrian.trim(), versi, finalTanggal]);
    return Response.json({ ok: true });
  } catch (e) {
    console.error(e);
    return Response.json({ ok:false, error: e?.message || "Unexpected error" }, { status:500 });
  }
}
