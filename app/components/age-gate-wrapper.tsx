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
        <div className="bg-white rounded-[1.5rem] p-8 max-w-sm w-full text-center shadow-2xl relative overflow-hidden pb-6">
          <div className="w-16 h-16 mx-auto mb-5 bg-[#F8F9FA] border-2 border-[#F7B731] rounded-2xl flex items-center justify-center shadow-sm">
            <span className="text-3xl font-black text-black tracking-tighter">18+</span>
          </div>
          <h1 className="text-black text-[1.5rem] leading-tight font-black mb-3 font-inter tracking-tight">
            Acesso Restrito
          </h1>
          <p className="text-gray-800 text-[1rem] mb-8 leading-relaxed px-1 font-semibold">
            Em conformidade com a legislação, o acesso a esta plataforma e a compra de bebidas alcoólicas são exclusivos para adultos.
          </p>
          <div className="flex flex-col gap-3 mb-5 mt-5">
            <button
              onClick={onConfirm}
              className="w-full py-3.5 rounded-xl bg-[#F7B731] text-white font-bold hover:bg-[#e5a623] hover:scale-[1.02] transition-all text-base shadow-lg active:scale-95"
            >
              Sim, sou maior de idade
            </button>
            <button
              onClick={onDeny}
              className="w-full py-3.5 rounded-xl border-2 border-[#F7B731] bg-white text-[#F7B731] font-bold hover:bg-gray-50 transition-all active:scale-95 text-base"
            >
              Não tenho 18 anos
            </button>
          </div>
          <p className="text-gray-600 text-[0.8rem] font-bold mt-5 uppercase tracking-wider">
            Beba com responsabilidade.
          </p>
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
        <div className="bg-white rounded-[1.5rem] p-8 max-w-sm w-full text-center shadow-2xl relative overflow-hidden pb-6">
          <div className="w-20 h-20 mx-auto mb-5 bg-red-50 border-[3px] border-red-500 rounded-full flex items-center justify-center">
            <span className="text-3xl font-black text-red-500 tracking-tight">-18</span>
          </div>
          <h1 className="text-gray-900 text-[1.35rem] leading-tight font-extrabold mb-3 font-inter tracking-tight">
            Acesso Negado
          </h1>
          <p className="text-gray-600 text-[0.9rem] mb-8 leading-relaxed px-1">
            Lamentamos, mas nossa plataforma é exclusiva para maiores de idade. Volte quando completar 18 anos!
          </p>
          <button
            onClick={onBack}
            className="w-full py-3.5 rounded-xl bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 transition-all text-base"
          >
            Voltar
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
