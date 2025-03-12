'use client';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const provider = new GoogleAuthProvider();

export default function GoogleSignIn() {

    const router = useRouter();

    const handleGoogleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            console.log('Google User:', user);
            router.push('/');
        } catch (error) {
            console.error('Google Sign-in Error:', error);
        }
    };

    return (
        <button
            onClick={handleGoogleLogin}
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