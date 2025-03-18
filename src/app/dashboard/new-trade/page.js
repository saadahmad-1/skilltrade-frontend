"use client";

import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { useSelector } from 'react-redux';
import { selectUser, selectLoading } from '@/redux/features/authSlice';
import { useRouter } from 'next/navigation';
import { Spin } from 'antd';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function NewTrade() {
  const user = useSelector(selectUser);
  const loading = useSelector(selectLoading);
  const router = useRouter();

  const [skills, setSkills] = useState([]);
  const [selectedHaveSkill, setSelectedHaveSkill] = useState(null);
  const [selectedWantSkill, setSelectedWantSkill] = useState(null);
  const [filteredHaveSkills, setFilteredHaveSkills] = useState([]);
  const [filteredWantSkills, setFilteredWantSkills] = useState([]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/sign-in');
    }
  }, [user, loading, router]);

  useEffect(() => {
    fetch(`${API_URL}/api/skill`)
      .then((res) => res.json())
      .then((data) => {
        setSkills(data);
        setFilteredHaveSkills(data);
        setFilteredWantSkills(data);
      })
      .catch((err) => console.error("Error fetching skills:", err));
  }, []);


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <Spin size="large" />
      </div>
    );
  }

  const selectSkill = (skill, type) => {
    if (type === "have") {
      setSelectedHaveSkill(skill);
    } else {
      setSelectedWantSkill(skill);
    }
  };

  const onSubmit = async () => {
    console.log("Submitting Trade with data:", {
      userId: user?.uid,
      haveSkill: selectedHaveSkill?._id,
      wantSkill: selectedWantSkill?._id
    });

    try {
      const res = await fetch(`${API_URL}/api/trade`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user?.uid,
          haveSkill: selectedHaveSkill?._id,
          wantSkill: selectedWantSkill?._id,
        }),
      });

      const data = await res.json();
      console.log("Server Response:", data);

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      router.push('/dashboard/trade-options');
    } catch (error) {
      console.error("Error submitting trade:", error);
      alert("Failed to submit trade: " + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-4xl bg-black mx-auto">
        <h1 className="text-white text-4xl font-bold text-center mb-10">Trade a New Skill</h1>

        <div className="flex flex-col gap-8">
          <div className="p-8 bg-neutral-900/90 rounded-3xl border border-gray-800 shadow-lg">
            <h2 className="text-white text-3xl font-semibold text-center mb-8">What skill do you have?</h2>
            <div className="flex flex-wrap gap-3">
              {filteredHaveSkills.map((skill) => (
                <button
                  key={skill._id}
                  onClick={() => selectSkill(skill, "have")}
                  className={`px-5 py-3 rounded-full text-white transition-colors ${selectedHaveSkill?._id === skill._id ? "bg-indigo-500" : "bg-neutral-800 hover:bg-neutral-700"}`}
                >
                  {skill.name}
                </button>
              ))}
            </div>
          </div>

          <div className="p-8 bg-neutral-900/90 rounded-3xl border border-gray-800 shadow-lg">
            <h2 className="text-white text-3xl font-semibold text-center mb-8">What skill do you want to learn?</h2>
            <div className="flex flex-wrap gap-3">
              {filteredWantSkills.map((skill) => (
                <button
                  key={skill._id}
                  onClick={() => selectSkill(skill, "want")}
                  className={`px-5 py-3 rounded-full text-white transition-colors ${selectedWantSkill?._id === skill._id ? "bg-indigo-500" : "bg-neutral-800 hover:bg-neutral-700"}`}
                >
                  {skill.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 flex justify-center">
          <button
            onClick={onSubmit}
            disabled={!selectedHaveSkill || !selectedWantSkill}
            className={`px-10 py-5 bg-indigo-500 hover:bg-indigo-600 text-white text-xl font-medium rounded-full transition-colors shadow-lg ${!selectedHaveSkill || !selectedWantSkill
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:shadow-xl transform hover:-translate-y-1'
              }`}
          >
            Submit Trade
          </button>
        </div>
      </div>
    </div>
  );
}