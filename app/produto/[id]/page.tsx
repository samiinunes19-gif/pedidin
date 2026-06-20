import ProductPageClient from './product-page-client';

export const metadata = {
  title: 'Zé Pedidos | Verificação de Idade',
  description: 'Confirme sua idade para acessar o Zé Pedidos',
  robots: { index: false, follow: false },
};

export default function ProductPage({ params }: { params: { id: string } }) {
  return <ProductPageClient productId={params?.id} />;
}
