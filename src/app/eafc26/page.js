"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

function todayWIB() {
  const now = new Date();
  const wib = new Date(now.getTime() + 7 * 60 * 60 * 1000);
  return wib.toISOString().slice(0, 10);
}

/* ---------- Toast ringan ---------- */
function useToast() {
  const [toast, setToast] = useState(null); // {type:'success'|'error', text}
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(t);
  }, [toast]);
  const el = toast ? (
    <div className={`toast ${toast.type === "error" ? "error" : ""}`}>
      {toast.text}
    </div>
  ) : null;
  return { show: (type, text) => setToast({ type, text }), el };
}

export default function Page() {
  const [nama, setNama] = useState("");
  const [antrian, setAntrian] = useState(""); // diisi otomatis
  const [versi, setVersi] = useState("Steam");
  const [tanggal, setTanggal] = useState(todayWIB());
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const namaRef = useRef(null);

  const { show, el: Toast } = useToast();

  // Ambil nomor antrian saat buka halaman
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/submit", { method: "GET" });
        const data = await res.json();
        if (data?.ok && data?.next) setAntrian(String(data.next));
      } catch {}
    })();
  }, []);

  function validate() {
    const e = {};
    if (!nama.trim()) e.nama = "Nama wajib diisi.";
    return e;
  }

  async function onSubmit(ev) {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;

    setLoading(true);
    try {
      // kirim TANPA antrian — server yang tetapkan nomor
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nama, versi, tanggal }),
      });
      const data = await res.json();
      if (!res.ok || !data?.ok) throw new Error(data?.error || "Gagal submit");

      show("success", `Berhasil disimpan (Antrian #${data.antrian}).`);

      // reset field input
      setNama("");
      setVersi("Steam");
      setTanggal(todayWIB());
      requestAnimationFrame(() => namaRef.current?.focus());

      // ambil nomor berikutnya
      try {
        const r2 = await fetch("/api/submit", { method: "GET" });
        const d2 = await r2.json();
        if (d2?.ok && d2?.next) setAntrian(String(d2.next));
      } catch {}
    } catch (err) {
      show("error", err.message || "Gagal submit");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="shell">
      <div className="card">
        <Link href="/" className="back-btn">← Kembali ke Menu</Link>

        <h1>Input Data Order</h1>
        <p className="subtle">
          Catat order dengan cepat—optimized buat HP, langsung tersimpan di Google Sheet.
        </p>

        <form className="form" onSubmit={onSubmit} noValidate>
          {/* Nama */}
          <div className="field">
            <input
              ref={namaRef}
              className="input"
              placeholder=" "
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              autoCapitalize="words"
              autoComplete="name"
              required
              disabled={loading}
            />
            <span className="float">Nama</span>
            {errors.nama && <div className="alert error">{errors.nama}</div>}
          </div>

          {/* Antrian Nomor (auto & readonly) */}
          <div className="field">
            <input
              className="input"
              placeholder=" "
              value={antrian}
              readOnly
            />
            <span className="float">Antrian Nomor</span>
          </div>

          {/* Versi (segmented) */}
          <div>
            <div className="label">Versi Steam/EA</div>
            <div className="segment">
              {["Steam","EA"].map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setVersi(v)}
                  className={v === versi ? "active" : ""}
                  disabled={loading}
                >
                  {v}
                </button>
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
              onChange={(e) => setTanggal(e.target.value)}
              disabled={loading}
            />
            <span className="float">Tanggal Orderan</span>
            <span className="cal-ico" aria-hidden="true"></span>
          </div>

          {/* Tombol Submit + progress bar saat submit */}
          <div>
            <button className="btn" type="submit" disabled={loading} style={{ width: "100%" }}>
              {loading ? "Memproses…" : "Submit / Proses"}
            </button>
            {loading && (
              <div className="progress-track">
                <div className="progress-bar" />
              </div>
            )}
          </div>

          <p className="note">
            Header Sheet: <b>Nama</b> | <b>Antrian Nomor</b> | <b>Versi Steam/EA</b> | <b>Tanggal Orderan</b>
          </p>
        </form>
      </div>

      {/* Toast */}
      {Toast}
    </main>
  );
}
