"use client";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "@/redux/features/authSlice";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function TradeOptions() {
    const user = useSelector(selectUser);
    const [matches, setMatches] = useState([]);
    const [wantSkill, setWantSkill] = useState("");
    const [haveSkill, setHaveSkill] = useState("");
    const [userName, setUserName] = useState("");

    useEffect(() => {
        if (user) {
            fetch(`${API_URL}/api/trade/matches/${user.uid}`)
                .then(res => res.json())
                .then(setMatches)
                .catch(err => console.error("Error fetching matches:", err));
        }

    }, [user]);

    useEffect(() => {
        if (matches.length > 0) {
            fetch(`${API_URL}/api/skill/${matches[0].haveSkill}`)
                .then(res => res.json())
                .then(setHaveSkill)
                .catch(err => console.error("Error fetching have skill:", err));
        }
    }, [matches]);

    useEffect(() => {
        if (matches.length > 0) {
            fetch(`${API_URL}/api/skill/${matches[0].wantSkill}`)
                .then(res => res.json())
                .then(setWantSkill)
                .catch(err => console.error("Error fetching want skill:", err));
        }
    }, [matches]);

    useEffect(() => {
        if (matches.length > 0) {
            fetch(`${API_URL}/api/user/${matches[0].user}`)
                .then(res => res.json())
                .then(data => setUserName(data.fullName))
                .catch(err => console.error("Error fetching user:", err));
        }
    }, [matches]);

    return (
        <div className="min-h-screen bg-black text-white p-6">
            <h1 className="text-4xl font-bold text-center mb-8">Trade Matches</h1>
            {matches.length ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {matches.map(match => (
                        <div key={match._id} className="bg-neutral-800 p-6 rounded-lg shadow-lg">
                            <h2 className="text-2xl font-semibold mb-3">{userName}</h2>
                            <p>Has: {haveSkill?.name}</p>
                            <p>Wants: {wantSkill?.name}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center">No matching trades found.</p>
            )}
        </div>
    );
}