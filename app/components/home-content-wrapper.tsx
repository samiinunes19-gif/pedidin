'use client';

import dynamic from 'next/dynamic';

const HomeContent = dynamic(() => import('./home-content'), {
  ssr: false,
  loading: () => null,
});

export default function HomeContentWrapper() {
  return <HomeContent />;
}
