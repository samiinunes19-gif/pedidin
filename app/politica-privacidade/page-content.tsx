'use client';

import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';


export default function PoliticaPrivacidade() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-[#1a1a1a] py-4 px-4 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <Link href="/" className="text-white hover:text-[#F7B731] transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-white font-bold text-lg">Política de Privacidade</h1>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 space-y-6">
          <div className="text-sm text-gray-500">Última atualização: 12 de março de 2026</div>
          
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">1. Informações da Empresa</h2>
            <p className="text-gray-700 leading-relaxed">
              A <strong>Zé Pedidos Tecnologia e Marketplace LTDA</strong>, inscrita no CNPJ sob o nº <strong>64.629.305/0001-40</strong>, 
              com sede na Rua Silvio Calegari, 176, Bairro Presidente Roosevelt, CEP 38401-176, Uberlândia/MG, 
              é a controladora dos dados pessoais coletados através desta plataforma.
            </p>
            <p className="text-gray-700 leading-relaxed">
              O Zé Pedidos é um <strong>marketplace</strong> que conecta consumidores às distribuidoras de bebidas 
              parceiras em cada região do Brasil. Não somos uma distribuidora, mas sim uma plataforma tecnológica 
              que facilita a intermediação de pedidos.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">2. Dados Coletados</h2>
            <p className="text-gray-700 leading-relaxed">Coletamos os seguintes dados pessoais:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><strong>Dados de identificação:</strong> nome completo, CPF (para verificação de idade)</li>
              <li><strong>Dados de contato:</strong> telefone, endereço de entrega</li>
              <li><strong>Dados de navegação:</strong> cookies, endereço IP, páginas visitadas</li>
              <li><strong>Dados de transação:</strong> histórico de pedidos, forma de pagamento</li>
              <li><strong>Dados de localização:</strong> para identificar a distribuidora parceira mais próxima</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">3. Finalidade do Tratamento</h2>
            <p className="text-gray-700 leading-relaxed">Utilizamos seus dados para:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Conectar você à distribuidora parceira mais próxima da sua região</li>
              <li>Processar e intermediar seus pedidos</li>
              <li>Verificar a maioridade legal (18 anos) para compra de bebidas alcoólicas</li>
              <li>Entrar em contato sobre o status do pedido</li>
              <li>Cumprir obrigações legais e fiscais</li>
              <li>Melhorar nossos serviços e experiência do usuário</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">4. Compartilhamento de Dados</h2>
            <p className="text-gray-700 leading-relaxed">
              Seus dados podem ser compartilhados com:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><strong>Distribuidoras parceiras:</strong> para realizar a entrega dos produtos na sua região</li>
              <li><strong>Processadores de pagamento:</strong> para processar transações financeiras de forma segura</li>
              <li><strong>Autoridades governamentais:</strong> quando exigido por lei</li>
            </ul>
            <p className="text-gray-700 leading-relaxed">
              Não vendemos, alugamos ou compartilhamos seus dados pessoais com terceiros para fins de marketing sem seu consentimento expresso.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">5. Segurança dos Dados</h2>
            <p className="text-gray-700 leading-relaxed">
              Implementamos medidas técnicas e organizacionais adequadas para proteger seus dados pessoais contra acesso não autorizado, 
              alteração, divulgação ou destruição. Utilizamos criptografia SSL/TLS em todas as transmissões de dados sensíveis.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">6. Seus Direitos (LGPD)</h2>
            <p className="text-gray-700 leading-relaxed">Conforme a Lei Geral de Proteção de Dados (Lei nº 13.709/2018), você tem direito a:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Confirmação da existência de tratamento</li>
              <li>Acesso aos seus dados</li>
              <li>Correção de dados incompletos ou desatualizados</li>
              <li>Anonimização, bloqueio ou eliminação de dados desnecessários</li>
              <li>Portabilidade dos dados</li>
              <li>Revogação do consentimento</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">7. Cookies</h2>
            <p className="text-gray-700 leading-relaxed">
              Utilizamos cookies para melhorar sua experiência de navegação, lembrar suas preferências, 
              identificar sua localização aproximada e analisar o tráfego do site. 
              Você pode configurar seu navegador para recusar cookies, mas isso pode afetar algumas funcionalidades.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">8. Retenção de Dados</h2>
            <p className="text-gray-700 leading-relaxed">
              Mantemos seus dados pessoais pelo tempo necessário para cumprir as finalidades descritas nesta política, 
              ou conforme exigido por lei. Dados de transações são mantidos por 5 anos para fins fiscais.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">9. Contato do Encarregado de Dados (DPO)</h2>
            <p className="text-gray-700 leading-relaxed">
              Para exercer seus direitos ou esclarecer dúvidas sobre esta política, entre em contato:
            </p>
            <div className="bg-gray-50 rounded-lg p-4 text-gray-700">
              <p><strong>Zé Pedidos Tecnologia e Marketplace LTDA</strong></p>
              <p>Rua Silvio Calegari, 176 - Presidente Roosevelt</p>
              <p>CEP: 38401-176 - Uberlândia/MG</p>
              <p>Telefone: (34) 94235-2345</p>
              <p>CNPJ: 64.629.305/0001-40</p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">10. Alterações</h2>
            <p className="text-gray-700 leading-relaxed">
              Esta política pode ser atualizada periodicamente. Recomendamos que você a revise regularmente. 
              A data da última atualização está indicada no início deste documento.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
