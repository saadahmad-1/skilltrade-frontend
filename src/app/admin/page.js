"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { selectUser, selectLoading } from "@/redux/features/authSlice";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function AdminRootPage() {
    const user = useSelector(selectUser);
    const loading = useSelector(selectLoading);
    const router = useRouter();
    const [userCount, setUserCount] = useState(0);
    const [skillCount, setSkillCount] = useState(0);
    const [aUser, setAUser] = useState(null);
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        if (!user?.uid || !API_URL) return;

        const fetchStats = async () => {
            try {
                const res = await fetch(`${API_URL}/api/stats/${user.uid}`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });
                const data = await res.json();
                setUserCount(data.users);
                setSkillCount(data.skills);
                setAUser(data.user);
            } catch (error) {
                console.error("Error fetching stats:", error);
            }
        };

        fetchStats();
    }, [user, API_URL]);

    useEffect(() => {
        if (aUser && !aUser.isAdmin) {
            router.push("/");
        }
    }, [aUser]);

    if (loading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center text-white">
                Loading...
            </div>
        );
    }

    const chartOptions = {
        chart: { type: "donut" },
        labels: ["Users", "Skills"],
        colors: ["#4F46E5", "#F59E0B"],
    };

    return (
        <div className="min-h-screen bg-black text-white p-6">
            <h1 className="text-4xl font-bold text-center mb-8">
                Admin Dashboard
            </h1>

            {/* Stats Charts */}
            <div className="flex justify-center gap-10 mb-8">
                <div className="bg-neutral-800 p-6 rounded-lg shadow-lg">
                    <Chart
                        options={chartOptions}
                        series={[userCount, skillCount]}
                        type="donut"
                        width={300}
                    />
                </div>
            </div>

            {/* Navigation Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-lg mx-auto">
                <Link
                    href="/admin/manage-skills"
                    className="bg-neutral-800 hover:bg-neutral-700 text-white text-lg font-semibold py-4 px-6 rounded-lg text-center shadow-lg"
                >
                    Manage Skills
                </Link>
                <Link
                    href="/admin/manage-users"
                    className="bg-neutral-800 hover:bg-neutral-700 text-white text-lg font-semibold py-4 px-6 rounded-lg text-center shadow-lg"
                >
                    Manage Users
                </Link>
            </div>
        </div>
    );
}
