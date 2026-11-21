import React from "react";
import "../globals.css";

export default function RedirectRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className="overflow-x-clip">
      <body className="overflow-x-clip">{children}</body>
    </html>
  );
}
