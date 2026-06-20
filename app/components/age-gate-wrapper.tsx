'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

// Fundo com a imagem desfocada e escurecida para a verificação inicial
function ModalBackground() {
  return (
    <div className="fixed inset-0 z-[9990]">
      <Image
        src="/banner-hero.webp"
        alt="Bebidas geladas desfocadas"
        fill
        className="object-cover object-center brightness-50 blur-sm"
        priority
        placeholder="blur"
        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkqAcAAIUAgUCsPZQAAAAASUVORK5CYII="
      />
      <div className="absolute inset-0 bg-black/80" />
    </div>
  );
}

function AccessModal({ onConfirm, onDeny }: { onConfirm: () => void; onDeny: () => void }) {
  return (
    <>
      <ModalBackground />
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-[#F7B731]" />
          <div className="w-20 h-20 mx-auto mb-4 bg-yellow-100 rounded-full flex items-center justify-center shadow-inner">
            <span className="text-4xl">🔞</span>
          </div>
          <h1 className="text-gray-900 text-2xl font-black mb-3 font-oswald uppercase tracking-wide">
            Você tem 18 anos ou mais?
          </h1>
          <p className="text-gray-600 text-sm mb-8 leading-relaxed">
            A venda e o consumo de bebidas alcoólicas são rigorosamente proibidos para menores de 18 anos. Por favor, confirme sua idade para entrar.
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={onConfirm}
              className="w-full py-4 rounded-xl bg-[#F7B731] text-black font-bold hover:bg-[#e5a623] hover:scale-[1.02] transition-all text-lg shadow-lg active:scale-95"
            >
              Sim, tenho 18 ou mais
            </button>
            <button
              onClick={onDeny}
              className="w-full py-4 rounded-xl border-2 border-gray-200 text-gray-500 font-semibold hover:bg-gray-50 transition-all active:scale-95"
            >
              Não, sou menor de 18
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function DeniedModal({ onBack }: { onBack: () => void }) {
  return (
    <>
      <ModalBackground />
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-red-500" />
          <div className="w-20 h-20 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center shadow-inner">
            <span className="text-4xl">🚫</span>
          </div>
          <h1 className="text-gray-900 text-2xl font-black mb-3 font-oswald uppercase tracking-wide">
            Acesso Negado
          </h1>
          <p className="text-gray-600 text-sm mb-8 leading-relaxed">
            Lamentamos, mas nossa plataforma é exclusiva para maiores de idade. Volte quando completar 18 anos!
          </p>
          <button
            onClick={onBack}
            className="text-[#F7B731] font-bold text-sm hover:underline"
          >
            Voltar e tentar novamente
          </button>
        </div>
      </div>
    </>
  );
}

export default function AgeGateWrapper() {
  const [status, setStatus] = useState<'pending' | 'denied'>('pending');
  const router = useRouter();

  const handleConfirm = () => {
    // Define cookie válido por 1 ano para liberar acesso no lado do servidor
    document.cookie = "age_verified=true; path=/; max-age=31536000";
    // Força o recarregamento do layout do servidor para buscar o conteúdo real
    router.refresh();
  };

  if (status === 'denied') {
    return <DeniedModal onBack={() => setStatus('pending')} />;
  }

  return <AccessModal onConfirm={handleConfirm} onDeny={() => setStatus('denied')} />;
}
