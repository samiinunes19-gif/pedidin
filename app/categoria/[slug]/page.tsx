import CategoryPageClient from './category-page-client';

export const metadata = {
  title: 'Zé Pedidos | Verificação de Idade',
  description: 'Confirme sua idade para acessar o Zé Pedidos',
  robots: { index: false, follow: false },
};

export default function CategoryPage({ params }: { params: { slug: string } }) {
  return <CategoryPageClient slug={params?.slug} />;
}
