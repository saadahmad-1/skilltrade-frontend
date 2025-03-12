"use client";

import { useState } from 'react';
import Link from 'next/link';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import GoogleSignIn from './GoogleSignIn';

const SignInForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.push('/');
        } catch (err) {
            alert(err);
            console.error(err);
        }
    };

    const handleGoogleSignIn = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            // await fetch('/api/users', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({
            //         uid: user.uid,
            //         email: user.email,
            //         fullName: user.displayName,
            //     }),
            // });

            router.push('/');
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="w-full max-w-md">
            <div className="text-center mb-8">
                <h1 className="text-white text-6xl font-bold mb-4">Welcome</h1>
                <p className="text-gray-400 text-2xl">Enter your details to log in</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        className="w-full py-5 px-4 rounded-full bg-neutral-900 text-white text-xl focus:outline-none"
                    />
                </div>

                <div>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        className="w-full py-5 px-4 rounded-full bg-neutral-900 text-white text-xl focus:outline-none"
                    />
                </div>

                <div className="text-right">
                    <Link href="/forgot-password" className="text-white hover:underline">
                        Forgot password?
                    </Link>
                </div>

                <button
                    type="submit"
                    className="w-full py-5 px-4 rounded-full bg-indigo-500 hover:bg-indigo-600 text-white text-xl font-medium transition-colors"
                >
                    Log in
                </button>
                <div className="text-center mt-6">
                    <p className="text-white text-lg">
                        Don&apos;t have an account?{' '}
                        <Link href="/auth/sign-up" className="text-white hover:underline">
                            Sign up
                        </Link>
                    </p>
                </div>
            </form>
            <div className="mt-6 flex items-center justify-center text-center w-full">
                <GoogleSignIn />
            </div>
        </div>
    );
};

export default SignInForm;
