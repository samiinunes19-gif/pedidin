'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#1a1a1a] text-white mt-8">
      {/* Aviso de idade */}
      <div className="bg-red-600 py-2 px-4 text-center">
        <p className="text-white text-xs font-semibold">
          ⚠️ VENDA PROIBIDA PARA MENORES DE 18 ANOS • SE BEBER, NÃO DIRIJA
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Links */}
        <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-400 mb-4">
          <Link href="/sobre" className="hover:text-white transition-colors">Sobre</Link>
          <span className="text-gray-600">•</span>
          <Link href="/termos-de-uso" className="hover:text-white transition-colors">Termos</Link>
          <span className="text-gray-600">•</span>
          <Link href="/politica-privacidade" className="hover:text-white transition-colors">Privacidade</Link>
          <span className="text-gray-600">•</span>
          <Link href="/trocas-e-devolucoes" className="hover:text-white transition-colors">Devoluções</Link>
        </div>

        {/* Copyright */}
        <div className="text-center text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Zé Pedidos • Marketplace de Bebidas</p>
          <p className="mt-1">Conectando você às melhores distribuidoras da sua região</p>
        </div>
      </div>
    </footer>
  );
}
