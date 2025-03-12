'use client'
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';

export default function AuthStatus() {
    const [user, loading, error] = useAuthState(auth);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return user ? <p>Logged in as {user.email}</p> : <p>Not logged in</p>;
}
