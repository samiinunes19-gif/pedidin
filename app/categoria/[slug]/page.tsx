import CategoryPageClient from './category-page-client';

export const metadata = {
  title: 'Zé Pedidos | Verificação de Idade',
  description: 'Confirme sua idade para acessar o Zé Pedidos',
  robots: { index: false, follow: false },
};

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <CategoryPageClient slug={slug} />;
}

