import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cabinet de Psihoterapie AI",
  description:
    "Explorează diverse abordări psihoterapeutice cu agenți AI specializați. Jungian, CBT, Integrativ, Gestalt, Experiențial.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ro">
      <body>{children}</body>
    </html>
  );
}
