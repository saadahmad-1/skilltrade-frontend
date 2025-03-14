"use client";

import Link from "next/link";

export default function AdminLayout({ children }) {
    return (
        <div className="flex min-h-screen bg-black text-white">
            <aside className="w-64 bg-neutral-900 p-6 flex flex-col gap-4 shadow-lg min-h-screen">
                <h2 className="text-xl font-bold text-center mb-4">Admin Panel</h2>
                <nav className="flex flex-col gap-2">
                    <Link href="/admin" className="px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700">Dashboard</Link>
                    <Link href="/admin/manage-skills" className="px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700">Manage Skills</Link>
                    <Link href="/admin/manage-users" className="px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700">Manage Users</Link>
                </nav>
            </aside>

            <main className="flex-1 p-6 relative">
                {children}
            </main>
        </div>
    );
}
