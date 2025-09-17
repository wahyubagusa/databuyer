"use client";
import { useEffect, useRef, useState } from "react";

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
  const [toast, setToast] = useState(null);
  const [errors, setErrors] = useState({});
  const antrianRef = useRef(null);

  // auto-hide toast
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  function validate() {
    const e = {};
    if (!nama.trim()) e.nama = "Nama wajib diisi.";
    if (!antrian.trim()) e.antrian = "Nomor antrian wajib diisi.";
    else if (!/^\d+$/.test(antrian.trim())) e.antrian = "Hanya angka.";
    return e;
  }

  async function onSubmit(ev) {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;

    setLoading(true);
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nama, antrian, versi, tanggal }),
      });
      const data = await res.json();
      if (!res.ok || !data?.ok) throw new Error(data?.error || "Gagal submit");

      setToast({ type: "success", text: "Berhasil disimpan ke Google Sheet." });
      setAntrian(""); setVersi("Steam"); setTanggal(todayWIB());
      requestAnimationFrame(() => antrianRef.current?.focus());
    } catch (err) {
      setToast({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="shell">
      <div className="card">
        <h1>Input Data Order</h1>
        <p className="subtle">Catat order dengan cepat—optimized buat HP, langsung tersimpan di Google Sheet.</p>

        <form className="form" onSubmit={onSubmit} noValidate>
          {/* Nama */}
          <div className="field">
            <input
              className="input"
              placeholder=" "
              value={nama}
              onChange={(e)=>setNama(e.target.value)}
              autoCapitalize="words"
              autoComplete="name"
              required
            />
            <span className="float">Nama</span>
            {errors.nama && <div className="alert error">{errors.nama}</div>}
          </div>

          {/* Antrian Nomor */}
          <div className="field">
            <input
              ref={antrianRef}
              className="input"
              placeholder=" "
              value={antrian}
              onChange={(e)=>setAntrian(e.target.value)}
              inputMode="numeric"
              pattern="[0-9]*"
              required
            />
            <span className="float">Antrian Nomor</span>
            {errors.antrian && <div className="alert error">{errors.antrian}</div>}
          </div>

          {/* Versi (segmented) */}
          <div>
            <div className="label">Versi Steam/EA</div>
            <div className="segment">
              {["Steam","EA"].map(v => (
                <button
                  key={v}
                  type="button"
                  onClick={()=>setVersi(v)}
                  className={v===versi ? "active" : ""}
                >{v}</button>
              ))}
            </div>
          </div>

          {/* Tanggal */}
          <div className="field date-field">
            <input
              type="date"
              className="date"
              placeholder=" "
              value={tanggal}
              onChange={(e)=>setTanggal(e.target.value)}
            />
            <span className="float">Tanggal Orderan</span>
            <span className="cal-ico" aria-hidden="true"></span>
          </div>

          <button className="btn" type="submit" disabled={loading}>
            {loading && <span className="spin" />} Submit / Proses
          </button>
        </form>

        <div className="note">
          Header Sheet: <b>Nama</b> | <b>Antrian Nomor</b> | <b>Versi Steam/EA</b> | <b>Tanggal Orderan</b>
        </div>
      </div>

      {toast && (
        <div className={`toast ${toast.type === "error" ? "error" : ""}`}>
          {toast.text}
        </div>
      )}
    </main>
  );
}
