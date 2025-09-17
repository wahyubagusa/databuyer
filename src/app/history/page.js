"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

/* Toast mini (kalau kamu sudah punya, biarkan saja) */
function useToast() {
  const [toast, setToast] = useState(null);
  function show(type, msg, ms = 2200) {
    setToast({ type, msg });
    setTimeout(() => setToast(null), ms);
  }
  const el = toast ? <div className={`toast ${toast.type === "error" ? "error" : ""}`}>{toast.msg}</div> : null;
  return { show, el };
}

/* ===== Modal Konfirmasi (kustom) ===== */
function ConfirmDialog({ open, title = "Hapus Data", desc = "Yakin ingin menghapus data ini? Tindakan ini tidak bisa dibatalkan.", onCancel, onConfirm, busy }) {
  if (!open) return null;
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
      <div className="modal">
        <h3 id="confirm-title">{title}</h3>
        <p className="modal-desc">{desc}</p>
        <div className="modal-actions">
          <button className="btn ghost" onClick={onCancel} disabled={busy}>Batal</button>
          <button className="btn danger" onClick={onConfirm} disabled={busy}>
            {busy ? "Menghapus…" : "Hapus"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function HistoryPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  // state untuk modal
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
  const filtered = useMemo(() => rows, [rows]);

  // buka modal
  function askDelete(rowIndex) {
    setTargetRowIndex(rowIndex);
    setConfirmOpen(true);
  }

  // eksekusi hapus (dipanggil dari tombol modal)
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
      if (!res.ok || !j.ok) {
        show("error", j?.error || res.statusText || "Gagal menghapus");
        return;
      }
      show("success", "Data berhasil dihapus");
      setConfirmOpen(false);
      setTargetRowIndex(null);
      await load(); // refetch supaya index fresh
    } finally {
      setDeleting(false);
    }
  }

  return (
    <main className="shell">
      <div className="card">
        <Link href="/" className="back-btn">← Kembali ke Menu</Link>
        <h1>History Order</h1>

        <div style={{ marginBottom: 12 }}>
          <button className="btn" onClick={load} disabled={loading} style={{ width: "100%" }}>
            {loading ? "Memuat…" : "Reload"}
          </button>
          {loading && (
            <div className="progress-track">
              <div className="progress-bar" />
            </div>
          )}
        </div>

        {loading ? (
          <div className="table-wrap">
            <table className="table">
              <thead style={{ position: "sticky", top: 0, zIndex: 1 }}>
                <tr>
                  <th>Nama</th><th>Antrian Nomor</th><th>Versi</th><th>Tanggal Orderan</th><th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i}><td colSpan={5}><div className="skel" /></td></tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ border: "1px dashed var(--border)", borderRadius: 12, padding: 16, textAlign: "center", color: "var(--muted)" }}>
            Tidak ada data.
          </div>
        ) : (
          <div className="table-wrap" style={{ maxHeight: 420, overflow: "auto" }}>
            <table className="table">
              <thead style={{ position: "sticky", top: 0, zIndex: 1, background: "rgba(255,255,255,.06)" }}>
                <tr>
                  <th>Nama</th><th>Antrian Nomor</th><th>Versi</th><th>Tanggal Orderan</th><th style={{ width: 120 }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={r.rowIndex}>
                    <td>{r.values?.[0] || ""}</td>
                    <td>{r.values?.[1] || ""}</td>
                    <td>{r.values?.[2] || ""}</td>
                    <td>{r.values?.[3] || ""}</td>
                    <td>
                      <button className="btn danger" onClick={() => askDelete(r.rowIndex)}>
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal Konfirmasi */}
        <ConfirmDialog
          open={confirmOpen}
          onCancel={() => { if (!deleting) setConfirmOpen(false); }}
          onConfirm={doDelete}
          busy={deleting}
        />

        {/* Toast */}
        {Toast}
      </div>
    </main>
  );
}
