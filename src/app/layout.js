import "./globals.css";
export const metadata = { title: "Databuyer", description: "Input Data Order" };

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        {/* Google Font: Montserrat */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="app-body">{children}</body>
    </html>
  );
}
