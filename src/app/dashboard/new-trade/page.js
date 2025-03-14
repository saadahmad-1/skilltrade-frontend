"use client";

import { useSelector } from 'react-redux';
import { selectUser, selectLoading } from '@/redux/features/authSlice';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Spin } from 'antd';

export default function NewTrade() {
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

    </div>
  );
}