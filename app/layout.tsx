import type { Metadata } from "next";
import { Inter, Oswald } from 'next/font/google';
import "./globals.css";
import AgeGateWrapper from "./components/age-gate-wrapper";

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

const oswald = Oswald({ 
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-oswald',
});

export const metadata: Metadata = {
  title: "Verificação de Acesso",
  description: "Verificação de segurança da plataforma",
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} ${oswald.variable} font-sans antialiased bg-black`}>
        <AgeGateWrapper>{children}</AgeGateWrapper>
      </body>
    </html>
  );
}
