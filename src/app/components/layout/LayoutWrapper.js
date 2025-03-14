"use client";

import { usePathname } from "next/navigation";
import Navbar from "../layout/Navbar";

export default function LayoutWrapper({ children }) {
    const pathname = usePathname();
    const isAdminPage = pathname.startsWith("/admin");

    return (
        <>
            {!isAdminPage && <Navbar />}
            {children}
        </>
    );
}
