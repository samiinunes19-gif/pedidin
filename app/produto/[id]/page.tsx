import ProductPageClient from './product-page-client';

export const metadata = {
  title: 'Zé Pedidos | Verificação de Idade',
  description: 'Confirme sua idade para acessar o Zé Pedidos',
  robots: { index: false, follow: false },
};

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ProductPageClient productId={id} />;
}

