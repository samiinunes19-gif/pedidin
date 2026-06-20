'use client';

import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';


export default function TermosDeUso() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-[#1a1a1a] py-4 px-4 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <Link href="/" className="text-white hover:text-[#F7B731] transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-white font-bold text-lg">Termos de Uso</h1>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 space-y-6">
          <div className="text-sm text-gray-500">Última atualização: 12 de março de 2026</div>
          
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">1. Aceitação dos Termos</h2>
            <p className="text-gray-700 leading-relaxed">
              Ao acessar e utilizar a plataforma <strong>Zé Pedidos</strong> 
              (CNPJ: 64.629.305/0001-40), você concorda em cumprir e estar vinculado a estes Termos de Uso. 
              Se você não concordar com qualquer parte destes termos, não deverá utilizar nossos serviços.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">2. Definição do Serviço</h2>
            <p className="text-gray-700 leading-relaxed">
              O Zé Pedidos é uma <strong>plataforma de marketplace</strong> que conecta consumidores 
              às distribuidoras de bebidas parceiras em diferentes regiões do Brasil. 
              A plataforma atua exclusivamente como <strong>intermediadora</strong>, facilitando a 
              comunicação e o processamento de pedidos entre clientes e distribuidoras locais.
            </p>
            <p className="text-gray-700 leading-relaxed">
              <strong>O Zé Pedidos NÃO é uma distribuidora de bebidas.</strong> As distribuidoras parceiras 
              são empresas independentes, responsáveis pela venda, estoque, qualidade dos produtos e entrega.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">3. Restrição de Idade</h2>
            <p className="text-gray-700 leading-relaxed">
              <strong>A VENDA DE BEBIDAS ALCOÓLICAS É PROIBIDA PARA MENORES DE 18 ANOS.</strong> 
              Ao realizar uma compra de bebidas alcoólicas através da nossa plataforma, você declara ser maior de 18 anos. 
              A distribuidora parceira pode solicitar documento de identificação no momento da entrega.
            </p>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 font-semibold">⚠️ SE BEBER, NÃO DIRIJA. BEBA COM MODERAÇÃO.</p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">4. Funcionamento do Marketplace</h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>O Zé Pedidos identifica sua localização para conectá-lo à distribuidora parceira mais próxima</li>
              <li>Os produtos exibidos são fornecidos pelas distribuidoras parceiras de cada região</li>
              <li>Preços, disponibilidade e condições de entrega podem variar conforme a distribuidora local</li>
              <li>A qualidade dos produtos e a entrega são de responsabilidade da distribuidora parceira</li>
              <li>Imagens dos produtos são meramente ilustrativas</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">5. Preços e Pagamento</h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Os preços são definidos pelas distribuidoras parceiras e podem variar por região</li>
              <li>Os valores estão expressos em Reais (R$) e incluem impostos aplicáveis</li>
              <li>Aceitamos pagamentos via PIX e dinheiro (formas de pagamento podem variar por região)</li>
              <li>O pagamento é processado de forma segura através de gateways homologados</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">6. Entrega</h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>A entrega é realizada pela distribuidora parceira da sua região</li>
              <li>O prazo de entrega é estimado e pode variar conforme demanda e localização</li>
              <li>A taxa de entrega, quando aplicável, será informada antes da confirmação do pedido</li>
              <li>O cliente deve fornecer endereço completo e correto</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">7. Cancelamento e Reembolso</h2>
            <p className="text-gray-700 leading-relaxed">
              Para informações sobre cancelamento de pedidos e política de reembolso, 
              consulte nossa <Link href="/trocas-e-devolucoes" className="text-[#F7B731] hover:underline">Política de Trocas e Devoluções</Link>.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">8. Responsabilidades</h2>
            <p className="text-gray-700 leading-relaxed"><strong>Responsabilidade do Zé Pedidos:</strong></p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Manter a plataforma disponível e segura</li>
              <li>Processar pedidos e transmiti-los às distribuidoras parceiras</li>
              <li>Proteger os dados dos usuários conforme a LGPD</li>
              <li>Mediar conflitos entre clientes e distribuidoras quando necessário</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4"><strong>Responsabilidade das Distribuidoras Parceiras:</strong></p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Qualidade e autenticidade dos produtos</li>
              <li>Gestão de estoque e disponibilidade</li>
              <li>Realização da entrega no prazo informado</li>
              <li>Cumprimento das normas sanitárias e fiscais</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">9. Uso da Plataforma</h2>
            <p className="text-gray-700 leading-relaxed">Você concorda em não:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Usar a plataforma para fins ilegais ou não autorizados</li>
              <li>Fornecer informações falsas, especialmente sobre idade</li>
              <li>Tentar acessar áreas restritas da plataforma</li>
              <li>Interferir na segurança ou funcionamento do site</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">10. Propriedade Intelectual</h2>
            <p className="text-gray-700 leading-relaxed">
              Todo o conteúdo da plataforma, incluindo textos, imagens, logotipos e design, 
              são de propriedade do Zé Pedidos ou de seus licenciadores e estão protegidos 
              por leis de propriedade intelectual.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">11. Lei Aplicável</h2>
            <p className="text-gray-700 leading-relaxed">
              Estes termos são regidos pelas leis da República Federativa do Brasil. 
              Fica eleito o foro da comarca de Uberlândia/MG para dirimir quaisquer questões.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">12. Contato</h2>
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
