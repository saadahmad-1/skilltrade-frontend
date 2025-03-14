"use client";

import { useState, useEffect } from "react";

export default function AdminManageSkills() {
    const [users, setUsers] = useState([]);
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        getUsers();
    }, []);

    const getUsers = async () => {
        const response = await fetch(`${API_URL}/api/user`, { method: "GET" });
        if (response.ok) {
            const data = await response.json();
            setUsers(data);
        }
    };

    const activateUser = async (id) => {
        const response = await fetch(`${API_URL}/api/user/activate/${id}`, { method: "POST" });
        if (response.ok) {
            await getUsers();
        }
    };

    const deactivateUser = async (id) => {
        const response = await fetch(`${API_URL}/api/user/deactivate/${id}`, { method: "POST" });
        if (response.ok) {
            await getUsers();
        }
    };

    return (
        <div className="max-w-lg mx-auto p-6 bg-neutral-900 rounded-2xl shadow-lg text-white">
            <h2 className="text-2xl font-semibold text-center mb-4">Manage Users</h2>
            <ul className="space-y-2">
                {users.map((user) => (
                    <li key={user._id} className="flex justify-between items-center bg-neutral-800 p-4 rounded-lg">
                        <div>
                            <p className="font-semibold">{user.fullName}</p>
                            <p className="text-sm">{user.email}</p>
                        </div>
                        <div className="flex gap-2">
                            {user.isActive ? (
                                <button onClick={() => deactivateUser(user._id)} className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg">
                                    Deactivate
                                </button>
                            ) : (
                                <button onClick={() => activateUser(user._id)} className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg">
                                    Activate
                                </button>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
