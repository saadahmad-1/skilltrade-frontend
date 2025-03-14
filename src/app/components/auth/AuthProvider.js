"use client";

import { useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useDispatch } from 'react-redux';
import { setUser, clearUser, setLoading } from '../../../redux/features/authSlice';

const AuthProvider = ({ children }) => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setLoading(true));
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                dispatch(setUser({
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName,
                    isActive: user.isActive,
                }));
            } else {
                dispatch(clearUser());
            }
            dispatch(setLoading(false));
        });

        return () => unsubscribe();
    }, [dispatch]);

    return children;
};

export default AuthProvider;