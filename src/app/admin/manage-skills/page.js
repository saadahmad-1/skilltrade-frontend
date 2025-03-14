"use client";

import { useState, useEffect } from "react";
import { Trash2, PlusCircle } from "lucide-react";


export default function AdminManageSkills() {
    const [skills, setSkills] = useState([]);
    const [newSkill, setNewSkill] = useState("");
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        fetch(`${API_URL}/api/skill`)
            .then((res) => res.json())
            .then((data) => setSkills(data))
            .catch((err) => console.error("Error fetching skills:", err));
    }, []);

    const addSkill = async () => {
        if (!newSkill.trim()) return;
        const response = await fetch(`${API_URL}/api/skill`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: newSkill }),
        });
        if (response.ok) {
            const addedSkill = await response.json();
            setSkills([...skills, addedSkill]);
            setNewSkill("");
        }
    };

    const deleteSkill = async (id) => {
        const response = await fetch(`${API_URL}/api/skill/${id}`, { method: "DELETE" });
        if (response.ok) {
            setSkills(skills.filter((skill) => skill._id !== id));
        }
    };

    return (
        <div className="max-w-lg mx-auto p-6 bg-neutral-900 rounded-2xl shadow-lg text-white">
            <h2 className="text-2xl font-semibold text-center mb-4">Manage Tradable Skills</h2>

            {/* Add Skill Input */}
            <div className="flex gap-2 mb-4">
                <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="New Skill"
                    className="flex-1 py-3 px-4 bg-neutral-800 rounded-lg text-white focus:outline-none"
                />
                <button onClick={addSkill} className="bg-indigo-500 hover:bg-indigo-600 px-4 py-3 rounded-lg">
                    <PlusCircle className="w-6 h-6" />
                </button>
            </div>

            {/* Skills List */}
            <ul className="space-y-2">
                {skills.map((skill) => (
                    <li key={skill._id} className="flex justify-between items-center bg-neutral-800 px-4 py-3 rounded-lg">
                        <span>{skill.name}</span>
                        <button onClick={() => deleteSkill(skill._id)} className="text-red-500 hover:text-red-600">
                            <Trash2 className="w-5 h-5" />
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
