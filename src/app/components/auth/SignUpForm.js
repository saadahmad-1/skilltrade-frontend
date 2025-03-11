"use client";

import { useState } from 'react';
import Link from 'next/link';

const SignUpForm = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission
    };

    return (
        <div className="w-full max-w-md">
            <div className="text-center mb-8">
                <h1 className="text-white text-6xl font-bold mb-4">Welcome</h1>
                <p className="text-gray-400 text-2xl">Enter your details to sign up</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Full name"
                        className="w-full py-5 px-4 rounded-full bg-neutral-900 text-white text-xl focus:outline-none"
                    />
                </div>

                <div>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email address"
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
                        Already have an account? {' '}
                        <Link href="/signin" className="text-white hover:underline">
                            Log in
                        </Link>
                    </p>
                </div>
            </form>
        </div>
    );
};

export default SignUpForm;