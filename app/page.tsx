import dynamic from 'next/dynamic';

export const metadata = {
  title: 'Verificação de Acesso',
  description: 'Verificação de acesso à plataforma.',
  robots: {
    index: false,
    follow: false,
  },
};

const HomeContent = dynamic(() => import('./components/home-content'), {
  ssr: false,
  loading: () => null,
});

export default function HomePage() {
  return <HomeContent />;
}
