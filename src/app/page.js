"use client";

import { useSelector } from 'react-redux';
import { selectUser, selectLoading } from '@/redux/features/authSlice';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Spin } from 'antd';

export default function BarterASkill() {
  const user = useSelector(selectUser);
  const loading = useSelector(selectLoading);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/sign-in');
    }
    else {
      router.push('/dashboard');
    }
  }, [user, loading]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white text-center px-6">
      <div className="text-white text-center mt-20 text-2xl"><Spin /></div>
    </div>
  );
}