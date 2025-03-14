"use client";

import { useSelector } from 'react-redux';
import { selectUser, selectLoading } from '@/redux/features/authSlice';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Spin } from 'antd';

export default function Dashboard() {
  const user = useSelector(selectUser);
  const loading = useSelector(selectLoading);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/sign-in');
    }
  }, [user, loading]);

  if (loading) return <div className="text-white text-center mt-20 text-2xl"><div className="flex items-center justify-center min-h-screen"><Spin /></div></div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white text-center px-6">
      <h1 className="text-6xl font-bold mb-6">Barter A Skill</h1>
      <p className="text-xl max-w-2xl mb-8">
        Exchange your skills with others and grow together. Offer your expertise and get something valuable in return.
      </p>
      <button
        className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white text-xl font-semibold rounded-full transition-colors shadow-lg"
        onClick={() => router.push('/dashboard/new-trade')}
      >
        Get Started
      </button>
    </div>
  );
}