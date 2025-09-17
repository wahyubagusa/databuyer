// src/app/layout.js
import "./globals.css";

export const metadata = {
  title: "Databuyer",
  description: "Input Data Order",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className="app-body">{children}</body>
    </html>
  );
}
