import SearchPageContent from './_components/search-page-content';

export const metadata = {
  title: 'Zé Pedidos | Verificação de Idade',
  description: 'Confirme sua idade para acessar o Zé Pedidos',
  robots: { index: false, follow: false },
};

export default function SearchPage() {
  return <SearchPageContent />;
}
