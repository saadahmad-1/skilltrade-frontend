'use client';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const provider = new GoogleAuthProvider();

export default function GoogleSignIn() {

    const router = useRouter();
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    const handleGoogleSignIn = async () => {
        const provider = new GoogleAuthProvider();

        try {
            const { user } = await signInWithPopup(auth, provider);
            const token = await user.getIdToken();

            await fetch(`${API_URL}/api/user/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ fullName: user.displayName, email: user.email }),
            });

            router.push('/');
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <button
            onClick={handleGoogleSignIn}
            className="flex items-center gap-3 bg-[#181818] text-white px-6 py-3 rounded-full hover:bg-[#222222] transition duration-200 font-medium"
        >
            <Image
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                width={20}
                height={20}
            />
            <span>Continue with Google</span>
        </button>
    );
}