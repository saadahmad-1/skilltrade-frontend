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

  // Ensure hooks are always called at the top level
  const [skills, setSkills] = useState([]);
  const [selectedHaveSkills, setSelectedHaveSkills] = useState([]);
  const [selectedWantSkills, setSelectedWantSkills] = useState([]);
  const [searchHave, setSearchHave] = useState("");
  const [searchWant, setSearchWant] = useState("");
  const [filteredHaveSkills, setFilteredHaveSkills] = useState([]);
  const [filteredWantSkills, setFilteredWantSkills] = useState([]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/sign-in');
    }
  }, [user, loading, router]); // Ensure `router` is also included in the dependency array

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

  useEffect(() => {
    setFilteredHaveSkills(
      searchHave
        ? skills.filter(skill =>
          skill.name.toLowerCase().includes(searchHave.toLowerCase())
        )
        : skills
    );
  }, [searchHave, skills]);

  useEffect(() => {
    setFilteredWantSkills(
      searchWant
        ? skills.filter(skill =>
          skill.name.toLowerCase().includes(searchWant.toLowerCase())
        )
        : skills
    );
  }, [searchWant, skills]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <Spin size="large" />
      </div>
    );
  }

  const addSkill = (skill, type) => {
    if (type === "have" && !selectedHaveSkills.some((s) => s._id === skill._id)) {
      setSelectedHaveSkills([...selectedHaveSkills, skill]);
    } else if (type === "want" && !selectedWantSkills.some((s) => s._id === skill._id)) {
      setSelectedWantSkills([...selectedWantSkills, skill]);
    }
  };

  const removeSkill = (id, type) => {
    if (type === "have") {
      setSelectedHaveSkills(selectedHaveSkills.filter((skill) => skill._id !== id));
    } else {
      setSelectedWantSkills(selectedWantSkills.filter((skill) => skill._id !== id));
    }
  };

  const getSkillIcon = (name) => {
    const iconMap = {
      "Graphic Design": "📝",
      "Web development": "<>",
      "Drawing": "🖌️",
      "Digital Marketing": "📣",
      "Photography": "📷",
      "Python": "🐍",
      "HTML/CSS": "</>",
      "Cloud computing": "☁️",
      "Adobe Photoshop": "Ps",
      "Adobe Illustrator": "Ai"
    };

    return iconMap[name] || null;
  };

  const getSkillTagColor = (name) => {
    const colorMap = {
      "Python": "bg-purple-600",
      "HTML/CSS": "bg-emerald-600",
      "Cloud computing": "bg-pink-500",
      "Adobe Photoshop": "bg-purple-600",
      "Adobe Illustrator": "bg-green-600"
    };

    return colorMap[name] || "bg-indigo-500";
  };

  const SkillIcon = ({ name }) => {
    const icon = getSkillIcon(name);

    if (!icon) return null;

    if (name === "Adobe Photoshop") {
      return <span className="inline-flex items-center justify-center w-6 h-6 bg-purple-600 rounded-md text-white text-xs mr-2">{icon}</span>;
    }

    if (name === "Adobe Illustrator") {
      return <span className="inline-flex items-center justify-center w-6 h-6 bg-black border border-green-500 rounded-md text-white text-xs mr-2">{icon}</span>;
    }

    return <span className="inline-flex items-center justify-center mr-2">{icon}</span>;
  };

  const onSubmit = async () => {
    await fetch(`${API_URL}/api/trade`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        haveSkills: selectedHaveSkills,
        wantSkills: selectedWantSkills
      })
    });

    router.push('/dashboard/trades');
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-7xl bg-black mx-auto">
        <h1 className="text-white text-4xl font-bold text-center mb-10">Trade a New Skill</h1>

        <div className="flex flex-col lg:flex-row w-full gap-8">
          <div className="flex-1 p-8 bg-neutral-900/90 rounded-3xl border border-gray-800 shadow-lg">
            <h2 className="text-white text-3xl font-semibold text-center mb-8">What skills do you have?</h2>
            <div className="relative mb-8">
              <input
                type="text"
                placeholder="Search skills"
                value={searchHave}
                onChange={(e) => setSearchHave(e.target.value)}
                className="w-full py-4 px-5 pl-14 bg-neutral-800 rounded-full text-white text-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
              <Search className="absolute top-1/2 left-5 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
            </div>
            <p className="text-gray-400 text-sm mb-3 ml-1">Suggested Skills</p>
            <div className="flex flex-wrap gap-3 mb-8">
              {filteredHaveSkills.slice(0, 5).map((skill) => (
                <button
                  key={skill._id}
                  onClick={() => addSkill(skill, "have")}
                  className="flex items-center px-5 py-3 bg-neutral-800 text-white rounded-full hover:bg-neutral-700 transition-colors"
                >
                  <SkillIcon name={skill.name} />
                  {skill.name}
                </button>
              ))}
            </div>
            <p className="text-gray-400 text-sm mb-3 ml-1">My Skills</p>
            <div className="flex flex-wrap gap-3 min-h-12">
              {selectedHaveSkills.map((skill) => (
                <span
                  key={skill._id}
                  className={`flex items-center gap-2 px-5 py-3 ${getSkillTagColor(skill.name)} text-white rounded-full transition-all`}
                >
                  <SkillIcon name={skill.name} />
                  {skill.name}
                  <X
                    className="w-4 h-4 cursor-pointer hover:text-gray-300"
                    onClick={() => removeSkill(skill._id, "have")}
                  />
                </span>
              ))}
            </div>
          </div>

          <div className="flex-1 p-8 bg-neutral-900/90 rounded-3xl border border-gray-800 shadow-lg">
            <h2 className="text-white text-3xl font-semibold text-center mb-8">What skills do you want to learn?</h2>
            <div className="relative mb-8">
              <input
                type="text"
                placeholder="Search skills"
                value={searchWant}
                onChange={(e) => setSearchWant(e.target.value)}
                className="w-full py-4 px-5 pl-14 bg-neutral-800 rounded-full text-white text-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
              <Search className="absolute top-1/2 left-5 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
            </div>
            <p className="text-gray-400 text-sm mb-3 ml-1">Suggested Skills</p>
            <div className="flex flex-wrap gap-3 mb-8">
              {filteredWantSkills.slice(0, 5).map((skill) => (
                <button
                  key={skill._id}
                  onClick={() => addSkill(skill, "want")}
                  className="flex items-center px-5 py-3 bg-neutral-800 text-white rounded-full hover:bg-neutral-700 transition-colors"
                >
                  <SkillIcon name={skill.name} />
                  {skill.name}
                </button>
              ))}
            </div>
            <p className="text-gray-400 text-sm mb-3 ml-1">Skills I Want to Learn</p>
            <div className="flex flex-wrap gap-3 min-h-12">
              {selectedWantSkills.map((skill) => (
                <span
                  key={skill._id}
                  className={`flex items-center gap-2 px-5 py-3 ${getSkillTagColor(skill.name)} text-white rounded-full transition-all`}
                >
                  <SkillIcon name={skill.name} />
                  {skill.name}
                  <X
                    className="w-4 h-4 cursor-pointer hover:text-gray-300"
                    onClick={() => removeSkill(skill._id, "want")}
                  />
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 flex justify-center">
          <button
            onClick={onSubmit}
            disabled={selectedHaveSkills.length === 0 || selectedWantSkills.length === 0}
            className={`px-10 py-5 bg-indigo-500 hover:bg-indigo-600 text-white text-xl font-medium rounded-full transition-colors shadow-lg ${selectedHaveSkills.length === 0 || selectedWantSkills.length === 0
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
