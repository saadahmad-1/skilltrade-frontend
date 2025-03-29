'use client';

import { auth } from '../../../lib/firebase';
import { useDispatch } from 'react-redux';
import { clearUser } from '../../../redux/features/authSlice';
import { useRouter } from 'next/navigation';
const LogoutButton = () => {
    const dispatch = useDispatch();
    const router = useRouter();

    const handleLogout = async () => {
        await auth.signOut();
        dispatch(clearUser());
        router.push('/auth/sign-in');
    };

    return (
        <button onClick={handleLogout}>Logout</button>
    );
};

export default LogoutButton;
