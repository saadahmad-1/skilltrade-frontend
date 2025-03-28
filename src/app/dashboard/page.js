"use client";

import { useSelector } from 'react-redux';
import { selectUser, selectLoading } from '@/redux/features/authSlice';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Spin } from 'antd';
import { HandshakeIcon, PlusCircleIcon, BookOpenIcon } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Dashboard() {
  const user = useSelector(selectUser);
  const loading = useSelector(selectLoading);
  const router = useRouter();
  const [trade, setTrade] = useState(null);
  const [matches, setMatches] = useState([]);
  const [wantSkill, setWantSkill] = useState(null);
  const [haveSkill, setHaveSkill] = useState(null);
  const [userName, setUserName] = useState(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/sign-in');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetch(`${API_URL}/api/trade/user/${user.uid}`)
        .then(res => res.json())
        .then(setTrade)
        .catch(err => console.error("Error fetching trade for user:", err));
    }
  }, [user]);

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

  const handleAcceptMatch = () => {
    fetch(`${API_URL}/api/trade/accept`, {
      method: 'POST',
      body: JSON.stringify({
        tradeId: matches[0]._id,
        userId: user.uid,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(res => res.json())
    .then(router.push('/'))
    .catch(err => console.error("Error accepting match:", err));
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <Spin size="large" />
    </div>
  );
  
  console.log("TRADE", trade);
  console.log("MATCHES", matches);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex flex-col justify-center items-center px-4">
      <main className="w-full max-w-2xl">
        <div className="bg-gray-900 rounded-2xl p-8 w-full shadow-2xl border border-gray-800 transition-transform transform hover:scale-105">
          {trade ? (
            <div className="text-center">
              <div className="mb-6 flex justify-center">
                <HandshakeIcon className="w-16 h-16 text-blue-500" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Your Current Trade</h2>
              
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-gray-800 p-4 rounded-xl shadow-md">
                  <h3 className="text-xl font-semibold text-gray-300 mb-2">Have Skill</h3>
                  <p className="text-white text-lg">{trade[0].haveSkill.name}</p>
                </div>
                <div className="bg-gray-800 p-4 rounded-xl shadow-md">
                  <h3 className="text-xl font-semibold text-gray-300 mb-2">Want Skill</h3>
                  <p className="text-white text-lg">{trade[0].wantSkill.name}</p>
                </div>
              </div>

              <h1 className="text-4xl font-bold text-center mt-8 mb-6">Trade Matches</h1>
              {matches.length ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {matches.map(match => (
                    <div key={match._id} className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
                      <h2 className="text-2xl font-semibold mb-3 text-blue-400">{userName}</h2>
                      <p className="text-gray-300">Has: <span className="text-white">{haveSkill?.name}</span></p>
                      <p className="text-gray-300">Wants: <span className="text-white">{wantSkill?.name}</span></p>
                      {matches[0]?.acceptedBy && trade && trade[0]?.acceptedBy ? (
                        <p className="text-gray-300 mt-6">
                          <span className="text-green-500 font-bold">Continue to Chat</span>
                        </p>
                      ) : matches[0]?.acceptedBy ? (
                        <p className="text-gray-300 mt-6">
                          <span className="text-green-500 font-bold">Trade Already Accepted</span>
                        </p>
                      ) : (
                        <button
                          onClick={handleAcceptMatch}
                          className="bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-full flex items-center space-x-2 mb-4"
                        >
                          <span>Accept Match</span>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-400">No matching trades found.</p>
              )}
            </div>
          ) : (
            <div className="text-center">
              <div className="mb-6 flex justify-center">
                <BookOpenIcon className="w-16 h-16 text-green-500" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Start Your Skill Exchange</h2>
              <p className="text-gray-400 mb-6">
                Connect with others, share your expertise, and learn something new. Every skill exchange is an opportunity for growth.
              </p>
              <button
                onClick={() => router.push('/dashboard/new-trade')}
                className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-full text-lg font-semibold flex items-center space-x-2 mx-auto transition-transform transform hover:scale-105 shadow-lg"
              >
                <PlusCircleIcon className="w-6 h-6" />
                <span>Create Your First Trade</span>
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
