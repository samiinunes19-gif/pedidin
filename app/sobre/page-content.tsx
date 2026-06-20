'use client';

import Link from 'next/link';
import { ChevronLeft, MapPin, Truck, Shield, Clock } from 'lucide-react';


export default function Sobre() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-[#1a1a1a] py-4 px-4 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <Link href="/" className="text-white hover:text-[#F7B731] transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-white font-bold text-lg">Sobre Nós</h1>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 space-y-8">
          
          <section className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-gray-900">Zé Pedidos</h2>
            <p className="text-xl text-[#F7B731] font-semibold">Marketplace de Bebidas</p>
            <p className="text-gray-600">Conectando você às melhores distribuidoras do Brasil</p>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900">Quem Somos</h3>
            <p className="text-gray-700 leading-relaxed">
              O <strong>Zé Pedidos</strong> é uma plataforma de marketplace que conecta consumidores 
              às melhores distribuidoras de bebidas de cada região do Brasil. Nosso papel é facilitar 
              a conexão entre você e a distribuidora mais próxima da sua localização, garantindo 
              agilidade e praticidade na entrega.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Não somos uma distribuidora. Somos uma <strong>plataforma tecnológica</strong> que 
              intermedia pedidos, conectando clientes a parceiros comerciais locais que realizam 
              a venda e entrega dos produtos.
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900">Como Funciona</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-[#F7B731] rounded-full flex items-center justify-center mx-auto">
                  <MapPin className="w-6 h-6 text-black" />
                </div>
                <h4 className="font-bold text-gray-900">1. Localização</h4>
                <p className="text-gray-600 text-sm">Identificamos sua região e encontramos a distribuidora parceira mais próxima</p>
              </div>
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-[#F7B731] rounded-full flex items-center justify-center mx-auto">
                  <Shield className="w-6 h-6 text-black" />
                </div>
                <h4 className="font-bold text-gray-900">2. Pedido Seguro</h4>
                <p className="text-gray-600 text-sm">Você faz seu pedido com segurança através da nossa plataforma</p>
              </div>
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-[#F7B731] rounded-full flex items-center justify-center mx-auto">
                  <Truck className="w-6 h-6 text-black" />
                </div>
                <h4 className="font-bold text-gray-900">3. Entrega Rápida</h4>
                <p className="text-gray-600 text-sm">A distribuidora parceira prepara e entrega seu pedido</p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900">Nossos Diferenciais</h3>
            <ul className="grid md:grid-cols-2 gap-4">
              <li className="flex items-start gap-3">
                <span className="text-2xl">🌐</span>
                <div>
                  <strong className="text-gray-900">Cobertura Nacional</strong>
                  <p className="text-gray-600 text-sm">Parceiros distribuidores em diversas regiões do Brasil</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl">🚀</span>
                <div>
                  <strong className="text-gray-900">Entrega Rápida</strong>
                  <p className="text-gray-600 text-sm">Distribuidoras locais garantem agilidade na entrega</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl">🔒</span>
                <div>
                  <strong className="text-gray-900">Pagamento Seguro</strong>
                  <p className="text-gray-600 text-sm">Transações protegidas com criptografia</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl">📱</span>
                <div>
                  <strong className="text-gray-900">Pedido Fácil</strong>
                  <p className="text-gray-600 text-sm">Plataforma intuitiva para compras rápidas</p>
                </div>
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900">Informações Legais</h3>
            <div className="bg-gray-50 rounded-lg p-4 text-gray-700 text-sm space-y-2">
              <p><strong>Razão Social:</strong> Zé Pedidos Tecnologia e Marketplace LTDA</p>
              <p><strong>CNPJ:</strong> 64.629.305/0001-40</p>
              <p><strong>Endereço da Sede:</strong> Rua Silvio Calegari, 176 - Presidente Roosevelt, CEP 38401-176, Uberlândia/MG</p>
              <p><strong>Contato:</strong> (34) 94235-2345</p>
            </div>
            <p className="text-gray-600 text-sm">
              <strong>Nota:</strong> O Zé Pedidos atua como intermediador entre consumidores e distribuidoras parceiras. 
              Cada distribuidora é responsável pela venda, estoque e entrega dos produtos em sua região de atuação.
            </p>
          </section>

          <section className="bg-red-50 border border-red-200 rounded-xl p-6 text-center space-y-2">
            <p className="text-red-800 font-bold text-lg">⚠️ VENDA PROIBIDA PARA MENORES DE 18 ANOS</p>
            <p className="text-red-700">SE BEBER, NÃO DIRIJA. BEBA COM MODERAÇÃO.</p>
          </section>

        </div>
      </div>
    </div>
  );
}
