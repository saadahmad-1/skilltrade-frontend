"use client";

import Link from 'next/link';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { auth } from '../../lib/firebase';
import { clearUser, selectUser } from '../../redux/features/authSlice';
import { signOut } from 'firebase/auth';
import { useRouter, usePathname } from 'next/navigation';
import { UserCircle2, LogOut, ChevronDown, ChevronUp, PlusCircle } from 'lucide-react';

const Navbar = () => {
    const user = useSelector(selectUser);
    const dispatch = useDispatch();
    const router = useRouter();
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const isAuthPage = pathname?.includes('/auth/');

    if (isAuthPage) {
        return null;
    }

    const handleLogout = async () => {
        await signOut(auth);
        dispatch(clearUser());
        router.push('/auth/sign-in');
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <div className="w-full px-4 py-2">
            <nav className="w-full bg-neutral-900/90 backdrop-blur-sm px-8 py-4 flex items-center justify-between rounded-full shadow-lg mx-auto max-w-7xl border border-neutral-800">
                <div className="text-white font-bold text-3xl">
                    <Link href="/">
                        Skill<span className="text-indigo-500">Trade</span>
                    </Link>
                </div>
                <div className="relative">
                    <button
                        onClick={toggleMenu}
                        className="flex items-center text-white text-xl focus:outline-none hover:text-indigo-300 transition-colors"
                    >
                        <UserCircle2 size={28} className="mr-2" />
                        <span className="hidden md:block">Account</span>
                        {isMenuOpen ? (
                            <ChevronUp className="ml-2 hidden md:block" />
                        ) : (
                            <ChevronDown className="ml-2 hidden md:block" />
                        )}
                    </button>

                    {isMenuOpen && (
                        <div className="absolute right-0 top-14 w-48 bg-neutral-800/95 backdrop-blur-sm shadow-lg rounded-xl overflow-hidden border border-neutral-700 transform transition-all duration-200 z-50">
                            <button
                                onClick={() => {
                                    handleLogout();
                                    setIsMenuOpen(false);
                                }}
                                className="flex items-center w-full px-4 py-3 hover:bg-red-500/20 text-white transition-colors"
                            >
                                <LogOut className="mr-2" />
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </nav>
        </div>
    );
};

export default Navbar;