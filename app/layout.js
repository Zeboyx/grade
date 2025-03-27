import "../styles/globals.css"; // ou "../styles/globals.css"
export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head />
      <body>{children}</body>
    </html>
  );
}