"use client";
import { useState } from "react";

function todayWIB() {
  const now = new Date();
  const wib = new Date(now.getTime() + 7 * 60 * 60 * 1000);
  return wib.toISOString().slice(0, 10);
}

export default function Page() {
  const [nama, setNama] = useState("");
  const [antrian, setAntrian] = useState("");
  const [versi, setVersi] = useState("Steam");
  const [tanggal, setTanggal] = useState(todayWIB());
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true); setMsg(null);
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nama, antrian, versi, tanggal }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "Gagal submit");

      setMsg({ type: "success", text: "Berhasil disimpan ke Google Sheet." });
      setAntrian(""); setVersi("Steam"); setTanggal(todayWIB());
    } catch (err) {
      setMsg({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="shell">
      <div className="card">
        <h1>Input Data Order</h1>

        <form className="form" onSubmit={onSubmit}>
          <div>
            <div className="label">Nama</div>
            <input className="input" placeholder="Nama"
                   value={nama} onChange={(e)=>setNama(e.target.value)} required />
          </div>

          <div>
            <div className="label">Antrian Nomor</div>
            <input className="input" placeholder="Nomor antrian" inputMode="numeric"
                   value={antrian} onChange={(e)=>setAntrian(e.target.value)} required />
          </div>

          <div>
            <div className="label">Versi Steam/EA</div>
            <select className="select" value={versi} onChange={(e)=>setVersi(e.target.value)}>
              <option value="Steam">Steam</option>
              <option value="EA">EA</option>
            </select>
          </div>

          <div>
            <div className="label">Tanggal Orderan</div>
            <input type="date" className="date"
                   value={tanggal} onChange={(e)=>setTanggal(e.target.value)} />
          </div>

          <button className="btn" type="submit" disabled={loading}>
            {loading ? "Memproses..." : "Submit / Proses"}
          </button>

          {msg && (
            <div className={`alert ${msg.type === "success" ? "success" : "error"}`}>
              {msg.text}
            </div>
          )}
        </form>

        <div className="note">
          Header Sheet: <b>Nama</b> | <b>Antrian Nomor</b> | <b>Versi Steam/EA</b> | <b>Tanggal Orderan</b>
        </div>
      </div>
    </main>
  );
}
