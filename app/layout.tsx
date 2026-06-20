import type { Metadata } from "next";
import { Inter, Oswald } from 'next/font/google';
import "./globals.css";
import AgeGateWrapper from "./components/age-gate-wrapper";
import { cookies } from 'next/headers';
import { CartProvider } from './context/cart-context';
import { Toaster } from 'sonner';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

const oswald = Oswald({ 
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-oswald',
});

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const verified = cookieStore.get('age_verified')?.value === 'true';

  if (!verified) {
    return {
      title: "Verificação de Idade | Acesso Restrito",
      description: "Confirme que você tem 18 anos ou mais para acessar o conteúdo.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return {
    title: "Zé Entregas Rápidas",
    description: "A entrega mais rápida da sua região. Bebidas geladas e muito mais.",
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const verified = cookieStore.get('age_verified')?.value === 'true';

  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} ${oswald.variable} font-sans antialiased bg-black`}>
        {verified ? (
          <div className="bg-gray-50 min-h-screen">
            <CartProvider>
              {children}
              <Toaster position="top-center" richColors />
            </CartProvider>
          </div>
        ) : (
          <AgeGateWrapper />
        )}
      </body>
    </html>
  );
}
