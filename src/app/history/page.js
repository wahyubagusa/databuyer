"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

/* ===== Toast mini ===== */
function useToast() {
  const [toast, setToast] = useState(null); // {type,msg}
  function show(type, msg, ms = 2200) {
    setToast({ type, msg });
    setTimeout(() => setToast(null), ms);
  }
  const el = toast ? (
    <div className={`toast ${toast.type === "error" ? "error" : ""}`}>{toast.msg}</div>
  ) : null;
  return { show, el };
}

/* ===== Modal Konfirmasi ===== */
function ConfirmDialog({ open, title="Hapus Data", desc="Yakin ingin menghapus data ini? Tindakan ini tidak bisa dibatalkan.", onCancel, onConfirm, busy }) {
  if (!open) return null;
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
      <div className="modal">
        <h3 id="confirm-title">{title}</h3>
        <p className="modal-desc">{desc}</p>
        <div className="modal-actions">
          <button className="btn ghost" onClick={onCancel} disabled={busy}>Batal</button>
          <button className="btn danger" onClick={onConfirm} disabled={busy}>{busy ? "Menghapus…" : "Hapus"}</button>
        </div>
      </div>
    </div>
  );
}

export default function HistoryPage() {
  const [rows, setRows] = useState([]); // [{rowIndex, values:[nama,antrian,versi,tanggal,noPesanan]}]
  const [loading, setLoading] = useState(true);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [targetRowIndex, setTargetRowIndex] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const { show, el: Toast } = useToast();

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/history");
      const data = await res.json();
      if (data.ok) setRows(data.rows || []);
      else show("error", data.error || "Gagal memuat data");
    } catch {
      show("error", "Tidak bisa terhubung ke server");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { load(); }, []);
  const data = useMemo(() => rows, [rows]);

  function askDelete(rowIndex) {
    setTargetRowIndex(rowIndex);
    setConfirmOpen(true);
  }
  async function doDelete() {
    if (targetRowIndex == null) return;
    setDeleting(true);
    try {
      const res = await fetch("/api/history", {
        method: "DELETE",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ rowIndex: targetRowIndex }),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok || !j.ok) { show("error", j?.error || res.statusText || "Gagal menghapus"); return; }
      show("success", "Data berhasil dihapus");
      setConfirmOpen(false); setTargetRowIndex(null);
      await load();
    } finally { setDeleting(false); }
  }

  return (
    <main className="shell">
      <div className="card card-wide">
        <Link href="/" className="back-btn">← Kembali ke Menu</Link>
        <h1>History Order</h1>

        <div style={{ marginBottom: 12 }}>
          <button className="btn" onClick={load} disabled={loading} style={{ width: "100%" }}>
            {loading ? "Memuat…" : "Reload"}
          </button>
          {loading && <div className="progress-track"><div className="progress-bar" /></div>}
        </div>

        {/* ===== Desktop: tabel rapi ===== */}
        <div className="table-wrap desktop-only" style={{ maxHeight: 420, overflowY: "auto" }}>
          <table className="table fixed">
            <colgroup>
              <col style={{ width: "20%" }} />
              <col style={{ width: "15%" }} />
              <col style={{ width: "15%" }} />
              <col style={{ width: "20%" }} />
              <col style={{ width: "20%" }} />
              <col style={{ width: "15%" }} />
            </colgroup>
            <thead style={{ position: "sticky", top: 0, zIndex: 1, background: "rgba(255,255,255,.06)" }}>
              <tr>
                <th>Nama</th>
                <th className="nowrap">Antrian Nomor</th>
                <th className="nowrap">Versi</th>
                <th className="nowrap">Tanggal Orderan</th>
                <th>No Pesanan</th>
                <th className="right nowrap">Aksi</th>
              </tr>
            </thead>
            {loading ? (
              <tbody>{Array.from({ length: 6 }).map((_, i) => (<tr key={i}><td colSpan={6}><div className="skel" /></td></tr>))}</tbody>
            ) : data.length === 0 ? (
              <tbody><tr><td colSpan={6} style={{ textAlign: "center", color: "var(--muted)", padding: 16 }}>Tidak ada data.</td></tr></tbody>
            ) : (
              <tbody>
                {data.map((r) => (
                  <tr key={r.rowIndex}>
                    <td className="truncate">{r.values?.[0] || ""}</td>
                    <td className="nowrap">{r.values?.[1] || ""}</td>
                    <td className="nowrap">{r.values?.[2] || ""}</td>
                    <td className="nowrap">{r.values?.[3] || ""}</td>
                    <td className="break">{r.values?.[4] || ""}</td>
                    <td className="cell-action"><button className="btn danger" onClick={() => askDelete(r.rowIndex)}>Hapus</button></td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
        </div>

        {/* ===== Mobile: list ringkas & cepat dipakai ===== */}
        <ul className="m-list mobile-only">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <li key={i} className="m-card"><div className="skel" style={{ height: 80 }} /></li>
            ))
          ) : data.length === 0 ? (
            <li className="m-empty">Tidak ada data.</li>
          ) : (
            data.map((r) => {
              const v = r.values || [];
              const nama = v[0] || "";
              const antrian = v[1] || "";
              const versi = v[2] || "";
              const tanggal = v[3] || "";
              const noPesanan = v[4] || "";
              return (
                <li key={r.rowIndex} className="m-card">
                  <div className="m-top">
                    <div className="m-title">
                      <div className="m-name">{nama}</div>
                      <div className="m-tags">
                        <span className="chip">{versi}</span>
                        <span className="chip">#{antrian}</span>
                      </div>
                    </div>
                    <button className="btn danger sm" onClick={() => askDelete(r.rowIndex)}>Hapus</button>
                  </div>
                  <div className="m-meta">
                    <div className="kv"><span>Tanggal</span><b>{tanggal}</b></div>
                    <div className="kv"><span>No Pesanan</span><b className="mono">{noPesanan}</b></div>
                  </div>
                </li>
              );
            })
          )}
        </ul>

        <ConfirmDialog open={confirmOpen} onCancel={() => { if (!deleting) setConfirmOpen(false); }} onConfirm={doDelete} busy={deleting} />
        {Toast}
      </div>
    </main>
  );
}
