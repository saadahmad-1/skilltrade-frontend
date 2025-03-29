'use client'
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { Spin } from 'antd';

export default function AuthStatus() {
    const [user, loading, error] = useAuthState(auth);

    if (loading) return <div className="flex items-center justify-center min-h-screen"><Spin /></div>;
    if (error) return <p>Error: {error.message}</p>;

    return user ? <p>Logged in as {user.email}</p> : <p>Not logged in</p>;
}
