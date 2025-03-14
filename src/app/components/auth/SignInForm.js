"use client";

import { useState } from 'react';
import Link from 'next/link';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import GoogleSignIn from './GoogleSignIn';

const SignInForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const { user } = await signInWithEmailAndPassword(auth, email, password);
            const token = await user.getIdToken();

            const response = await fetch(`${API_URL}/api/user/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ fullName: user.displayName || '', email }),
            });
            if (response.status === 401) { setError('User is NOT ACTIVE'); return; }
            if (response.ok)
                router.push('/dashboard');
        } catch (err) {
            console.error(err);
            setError(err.message);
        }
    };

    return (
        <div className="w-full max-w-md">
            <div className="text-center mb-6">
                <h1 className="text-white text-4xl font-bold mb-2">Welcome</h1>
                <p className="text-gray-400 text-lg">Enter your details to log in</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
                {error && <p className="text-red-500 text-center text-sm">{error}</p>}

                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="w-full py-3 px-4 rounded-full bg-neutral-900 text-white text-base focus:outline-none"
                    required
                />

                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full py-3 px-4 rounded-full bg-neutral-900 text-white text-base focus:outline-none"
                    required
                />

                <div className="text-right">
                    <Link href="/forgot-password" className="text-indigo-400 hover:underline text-sm">
                        Forgot password?
                    </Link>
                </div>

                <button
                    type="submit"
                    className="w-full py-3 px-4 rounded-full bg-indigo-500 hover:bg-indigo-600 text-white text-base font-medium transition-colors"
                >
                    Log in
                </button>

                <div className="text-center mt-4">
                    <p className="text-white text-base">
                        Don&apos;t have an account?{' '}
                        <Link href="/auth/sign-up" className="text-indigo-400 hover:underline">
                            Sign up
                        </Link>
                    </p>
                </div>
            </form>

            <div className="mt-4 flex items-center justify-center">
                <GoogleSignIn className="w-full py-3 px-4 text-base rounded-full" />
            </div>
        </div>
    );
};

export default SignInForm;
