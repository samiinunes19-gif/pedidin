'use client';

import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';


export default function TrocasDevolucoes() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-[#1a1a1a] py-4 px-4 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <Link href="/" className="text-white hover:text-[#F7B731] transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-white font-bold text-lg">Trocas e Devoluções</h1>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 space-y-6">
          <div className="text-sm text-gray-500">Última atualização: 12 de março de 2026</div>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">Sobre Esta Política</h2>
            <p className="text-gray-700 leading-relaxed">
              O Zé Pedidos é um <strong>marketplace</strong> que conecta consumidores às distribuidoras de bebidas 
              parceiras em cada região. Esta política estabelece as diretrizes para trocas e devoluções, 
              que são processadas em conjunto com a distribuidora parceira responsável pelo seu pedido.
            </p>
          </section>
          
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">1. Direito de Arrependimento</h2>
            <p className="text-gray-700 leading-relaxed">
              Conforme o Código de Defesa do Consumidor (Art. 49), você pode desistir da compra em até 
              <strong> 7 (sete) dias corridos</strong> após o recebimento do produto, desde que:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>O produto esteja lacrado e não tenha sido aberto</li>
              <li>Esteja em perfeitas condições, com embalagem original</li>
              <li>Acompanhado do comprovante de compra</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">2. Cancelamento de Pedido</h2>
            <p className="text-gray-700 leading-relaxed">
              <strong>Antes da saída para entrega:</strong> O pedido pode ser cancelado sem custo, 
              com reembolso integral do valor pago.
            </p>
            <p className="text-gray-700 leading-relaxed">
              <strong>Após a saída para entrega:</strong> Não é possível cancelar o pedido. 
              Caso não receba o pedido, aplica-se a política de devolução.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">3. Produtos com Defeito ou Avaria</h2>
            <p className="text-gray-700 leading-relaxed">
              Se o produto chegar com defeito, avariado ou diferente do pedido:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Recuse o recebimento e comunique imediatamente ao entregador</li>
              <li>Ou entre em contato conosco em até 24 horas após o recebimento</li>
              <li>Envie fotos do produto para comprovação</li>
              <li>A distribuidora parceira fará a substituição ou reembolso integral</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">4. Produtos Não Aceitos para Troca</h2>
            <p className="text-gray-700 leading-relaxed">Não são aceitas trocas ou devoluções de:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Bebidas que foram abertas ou violadas</li>
              <li>Produtos perecíveis (gelo, por exemplo)</li>
              <li>Produtos sem embalagem original</li>
              <li>Produtos danificados por mau uso do consumidor</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">5. Como Solicitar Troca ou Devolução</h2>
            <p className="text-gray-700 leading-relaxed">Para solicitar troca ou devolução:</p>
            <ol className="list-decimal pl-6 text-gray-700 space-y-2">
              <li>Entre em contato pelo telefone <strong>(34) 94235-2345</strong></li>
              <li>Informe o número do pedido e o motivo da solicitação</li>
              <li>Envie fotos do produto (se aplicável)</li>
              <li>Aguarde a análise e retorno em até 48 horas</li>
              <li>A distribuidora parceira da sua região processará a troca ou devolução</li>
            </ol>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">6. Reembolso</h2>
            <p className="text-gray-700 leading-relaxed">
              <strong>Pagamento via PIX:</strong> O reembolso será realizado na mesma chave PIX 
              utilizada para pagamento, em até 7 dias úteis.
            </p>
            <p className="text-gray-700 leading-relaxed">
              <strong>Pagamento em dinheiro:</strong> O reembolso será realizado via PIX para 
              uma chave informada pelo cliente, em até 7 dias úteis.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">7. Responsabilidades</h2>
            <p className="text-gray-700 leading-relaxed">
              Como marketplace, o Zé Pedidos atua como mediador entre o cliente e a distribuidora parceira. 
              A distribuidora é responsável pela qualidade dos produtos e pelo processamento de trocas e devoluções. 
              O Zé Pedidos se compromete a facilitar a comunicação e garantir que seus direitos sejam respeitados.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">8. Contato</h2>
            <div className="bg-gray-50 rounded-lg p-4 text-gray-700">
              <p><strong>Zé Pedidos Tecnologia e Marketplace LTDA</strong></p>
              <p>Rua Silvio Calegari, 176 - Presidente Roosevelt</p>
              <p>CEP: 38401-176 - Uberlândia/MG</p>
              <p>Telefone: (34) 94235-2345</p>
              <p>CNPJ: 64.629.305/0001-40</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
