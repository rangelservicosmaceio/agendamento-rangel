import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://rangelmaridodealuguel.vercel.app"),
  title: "Marido de Aluguel - Agendamentos",
  description: "Agende seus servicos de consertos e manutencao",
  openGraph: {
    title: "Marido de Aluguel - Rangel",
    description: "Rapido, limpo e sem dor de cabeca. Agende seu servico agora.",
    images: ["/images/og-logo.png"],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Marido de Aluguel - Rangel",
    description: "Rapido, limpo e sem dor de cabeca. Agende seu servico agora.",
    images: ["/images/og-logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@600;700;800&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
