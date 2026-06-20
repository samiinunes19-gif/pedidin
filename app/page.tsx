import HomeContentWrapper from './components/home-content-wrapper';

export const metadata = {
  title: 'Verificação de Acesso',
  description: 'Verificação de acesso à plataforma.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function HomePage() {
  return <HomeContentWrapper />;
}
