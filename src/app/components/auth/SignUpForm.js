"use client";

import { useState } from 'react';
import Link from 'next/link';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import GoogleSignIn from './GoogleSignIn';

const SignUpForm = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            const { user } = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(user, { displayName: fullName });

            const token = await user.getIdToken();

            await fetch(`${API_URL}/api/user/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ fullName, email }),
            });

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
                <p className="text-gray-400 text-lg">Enter your details to sign up</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
                {error && <p className="text-red-500 text-center text-sm">{error}</p>}
                <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Full name"
                    className="w-full py-3 px-4 rounded-full bg-neutral-900 text-white text-base focus:outline-none"
                    required
                />

                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address"
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

                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm password"
                    className="w-full py-3 px-4 rounded-full bg-neutral-900 text-white text-base focus:outline-none"
                    required
                />

                <button
                    type="submit"
                    className="w-full py-3 px-4 rounded-full bg-indigo-500 hover:bg-indigo-600 text-white text-base font-medium transition-colors"
                >
                    Sign up
                </button>

                <div className="text-center mt-4">
                    <p className="text-white text-base">
                        Already have an account?{' '}
                        <Link href="/auth/sign-in" className="text-indigo-400 hover:underline">
                            Log in
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

export default SignUpForm;