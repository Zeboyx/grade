import "../styles/globals.css"; // ou "../styles/globals.css"
export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head />
      <body>{children}</body>
    </html>
  );
}

export const metadata = {
  title: "Attribution des grades",
  icons: {
    icon: "/favicon.png",
  },
};