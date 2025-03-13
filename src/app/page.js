'use client';

import { useSelector } from 'react-redux';
import { selectUser, selectLoading } from '@/redux/features/authSlice';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import LogoutButton from './components/auth/LogoutButton';

export default function Home() {
  const user = useSelector(selectUser);
  const loading = useSelector(selectLoading);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/sign-in');
    }
  }, [user, loading]);

  if (loading) return <div>Loading...</div>;

  return (
    <div>Welcome to Dashboard
      <div>
        <LogoutButton />
      </div>
    </div>
  );
};
