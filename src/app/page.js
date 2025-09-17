// src/app/page.js
import Link from "next/link";

export default function Home() {
  return (
    <main className="shell">
      <div className="card hero">
        <div className="hero-head">
          <div className="hero-kicker">Tow Apps</div>
          <h1>Project Apps Tow</h1>
          <p className="subtle">
            Klik salah satu menu untuk mulai. Semua UI dioptimalkan untuk HP.
          </p>
        </div>

        <div className="menu-grid mt-4">
          {/* App 1 */}
          <Link href="/eafc26" className="menu-card">
            <div className="menu-left">
              <span className="menu-icon">
                {/* icon cart */}
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
                  <path d="M7 4h-2a1 1 0 1 0 0 2h1.28l1.72 8.59A2 2 0 0 0 10.94 16h6.62a2 2 0 0 0 1.97-1.64L21 7H8.21l-.33-1.64A2 2 0 0 0 7 4Zm3 15a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm9 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"/>
                </svg>
              </span>
              <div className="menu-text">
                <span className="menu-title">Data Buyer EAFC 26</span>
                <span className="menu-sub">Form input order → Google Sheet</span>
              </div>
            </div>
            <span className="menu-cta">Buka
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                <path fill="currentColor" d="M13 5l7 7-7 7v-4H4v-6h9V5z"/>
              </svg>
            </span>
          </Link>

          {/* 🔥 History Order */}
          <Link href="/history" className="menu-card">
            <div className="menu-left">
              <span className="menu-icon">
                {/* icon book/history */}
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
                  <path d="M6 2a2 2 0 0 0-2 2v16a1 1 0 0 0 1.447.894L12 18.118l6.553 2.776A1 1 0 0 0 20 20V4a2 2 0 0 0-2-2H6z"/>
                </svg>
              </span>
              <div className="menu-text">
                <span className="menu-title">History Order</span>
                <span className="menu-sub">Lihat semua data order</span>
              </div>
            </div>
            <span className="menu-cta">Buka
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                <path fill="currentColor" d="M13 5l7 7-7 7v-4H4v-6h9V5z"/>
              </svg>
            </span>
          </Link>

          {/* Placeholder next app */}
          <div className="menu-card is-disabled" aria-disabled="true">
            <div className="menu-left">
              <span className="menu-icon dim">
                {/* icon rocket */}
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
                  <path d="M12 2C8 5 7 9 7 9l8 8s4-1 7-5c-1-6-7-12-10-10ZM6 10l-4 4 5-1 3 3-1 5 4-4"/>
                </svg>
              </span>
              <div className="menu-text">
                <span className="menu-title">Coming Soon</span>
                <span className="menu-sub">Fitur berikutnya</span>
              </div>
            </div>
            <span className="menu-cta disabled">Tunggu…</span>
          </div>
        </div>
      </div>
    </main>
  );
}
