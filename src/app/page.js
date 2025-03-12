"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  // useEffect(() => {
  //   // Check for authentication in localStorage
  //   const isLoggedIn = Boolean(localStorage.getItem('userToken'));

  //   // If not logged in, redirect to the login page
  //   if (!isLoggedIn) {
  //     router.push('/auth/sign-in');
  //   }
  // }, [router]);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1 className="text-4xl font-bold text-center">Welcome to Skill Trade</h1>
    </div>
  );
}
