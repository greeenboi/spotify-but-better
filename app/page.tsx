'use client';
import Loader from '@/components/ui/loader';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { store } from '@/lib/store/lazy-store';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const checkNavigation = async () => {
      console.log('Checking navigation...');
      const hasVisited = await store.get<{ value: boolean }>('hasVisited');
      console.log('Has visited:', hasVisited);
      if (hasVisited?.value) {
        router.push('/player');
      } else if (!hasVisited) {
        router.push('/welcome');
      }
    };
    checkNavigation();
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <Loader />
    </div>
  );
}
