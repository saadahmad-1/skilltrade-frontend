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

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);

            await updateProfile(userCredential.user, {
                displayName: fullName
            });

            // // Send user info to your backend/MongoDB here
            // await fetch('/api/users', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({
            //         uid: user.uid,
            //         email: user.email,
            //         fullName,
            //     }),
            // });

            router.push('/');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="w-full max-w-md">
            <div className="text-center mb-8">
                <h1 className="text-white text-6xl font-bold mb-4">Welcome</h1>
                <p className="text-gray-400 text-2xl">Enter your details to sign up</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {error && <p className="text-red-500 text-center">{error}</p>}
                <div>
                    <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Full name"
                        className="w-full py-5 px-4 rounded-full bg-neutral-900 text-white text-xl focus:outline-none"
                        required
                    />
                </div>

                <div>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email address"
                        className="w-full py-5 px-4 rounded-full bg-neutral-900 text-white text-xl focus:outline-none"
                        required
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

                <div>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm password"
                        className="w-full py-5 px-4 rounded-full bg-neutral-900 text-white text-xl focus:outline-none"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full py-5 px-4 rounded-full bg-indigo-500 hover:bg-indigo-600 text-white text-xl font-medium transition-colors"
                >
                    Sign up
                </button>

                <div className="text-center mt-6">
                    <p className="text-white text-lg">
                        Already have an account?{' '}
                        <Link href="/auth/sign-in" className="text-white hover:underline">
                            Log in
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

export default SignUpForm;
