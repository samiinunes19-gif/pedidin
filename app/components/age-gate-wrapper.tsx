'use client';

import { useState, useEffect, ReactNode } from 'react';
import { CartProvider } from '../context/cart-context';
import { Toaster } from 'sonner';

interface AgeGateWrapperProps {
  children: ReactNode;
}

import Image from 'next/image';

// Fundo com a imagem desfocada e escurecida para a verificação inicial
function ModalBackground() {
  return (
    <div className="fixed inset-0 z-[9990]">
      <Image
        src="/banner-hero.webp"
        alt="Background"
        fill
        className="object-cover object-center brightness-50 blur-sm"
        priority
        placeholder="blur"
        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkqAcAAIUAgUCsPZQAAAAASUVORK5CYII="
      />
      <div className="absolute inset-0 bg-black/60" />
    </div>
  );
}

// Modal Genérico de Acesso
function AccessModal({ onConfirm, onDeny }: { onConfirm: () => void; onDeny: () => void }) {
  return (
    <>
      <ModalBackground />
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl">
          <div className="mb-6">
            <span className="font-oswald text-3xl font-bold text-[#1a1a1a]">ZÉ</span>
            <span className="font-oswald text-3xl font-bold text-[#F7B731]"> ENTREGAS</span>
          </div>
          <h1 className="text-gray-900 text-lg font-semibold mb-2">
            Verificação de Acesso
          </h1>
          <p className="text-gray-500 text-sm mb-8">
            Confirme que você possui 18 anos ou mais para acessar a plataforma.
          </p>
          <div className="flex gap-3">
            <button
              onClick={onDeny}
              className="flex-1 py-3.5 rounded-xl border-2 border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition-colors"
            >
              Não
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 py-3.5 rounded-xl bg-[#F7B731] text-black font-bold hover:bg-[#e5a623] transition-colors"
            >
              Sim, confirmar
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// Modal de Acesso Negado Genérico
function DeniedModal({ onBack }: { onBack: () => void }) {
  return (
    <>
      <ModalBackground />
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
            <span className="text-3xl">🚫</span>
          </div>
          <h1 className="text-gray-900 text-xl font-bold mb-2">Acesso Restrito</h1>
          <p className="text-gray-500 text-sm mb-6">
            Esta plataforma requer verificação de idade para acesso.
          </p>
          <button
            onClick={onBack}
            className="text-[#F7B731] font-semibold text-sm hover:underline"
          >
            Voltar
          </button>
        </div>
      </div>
    </>
  );
}

export default function AgeGateWrapper({ children }: AgeGateWrapperProps) {
  const [status, setStatus] = useState<'loading' | 'pending' | 'denied' | 'verified'>('loading');

  useEffect(() => {
    const verified = localStorage.getItem('age_verified');
    if (verified === 'true') {
      setStatus('verified');
      injectRealMetadata();
    } else {
      setStatus('pending');
    }
  }, []);

  const injectRealMetadata = () => {
    // Injeta as meta tags reais e remove o noindex apenas quando validado
    document.title = "Zé Entregas Rápidas";
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", "A entrega mais rápida da sua região.");
    }
    
    // Remover noindex se existir
    const robots = document.querySelector('meta[name="robots"]');
    if (robots && robots.getAttribute('content')?.includes('noindex')) {
      robots.setAttribute('content', 'index, follow');
    }

    // Injetar JSON-LD dinamicamente apenas após validação (escondido do Google Ads inicialmente)
    if (!document.getElementById('json-ld-schema')) {
      const script = document.createElement('script');
      script.id = 'json-ld-schema';
      script.type = 'application/ld+json';
      script.text = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "LiquorStore",
        "name": "Zé Entregas Rápidas",
        "image": "https://fazer-pedidosdelivery.shop/banner-hero.webp",
        "url": "https://fazer-pedidosdelivery.shop",
        "telephone": "+5511999999999",
        "priceRange": "$$",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Rua Exemplo, 123",
          "addressLocality": "São Paulo",
          "addressRegion": "SP",
          "postalCode": "01000-000",
          "addressCountry": "BR"
        }
      });
      document.head.appendChild(script);
    }
  };

  const handleConfirm = () => {
    localStorage.setItem('age_verified', 'true');
    setStatus('verified');
    injectRealMetadata();
  };

  const handleDeny = () => {
    setStatus('denied');
  };

  // Renderização condicional estrita
  // NÃO renderizamos children antes da verificação
  if (status === 'loading') {
    return <ModalBackground />;
  }

  if (status === 'pending') {
    return <AccessModal onConfirm={handleConfirm} onDeny={handleDeny} />;
  }

  if (status === 'denied') {
    return <DeniedModal onBack={() => setStatus('pending')} />;
  }

  // Só chega aqui (e monta o DOM real) se estiver 'verified'
  return (
    <div className="bg-gray-50 min-h-screen">
      <CartProvider>
        {children}
        <Toaster position="top-center" richColors />
      </CartProvider>
    </div>
  );
}
