"use client";

import { Provider } from 'react-redux';
import { store } from '../../../redux/store';
import AuthProvider from "../../components/auth/AuthProvider";

export default function AuthLayout({ children }) {
    return (
        <div>
            <Provider store={store}>
                <AuthProvider>
                    {children}
                </AuthProvider>
            </Provider>
        </div>
    )
}