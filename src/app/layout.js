import "./globals.css";

export const metadata = {
  title: "Join Us",
  description: "Multi-step registration form",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
