"use client";

import { useSelector } from 'react-redux';
import { selectUser, selectLoading } from '@/redux/features/authSlice';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Spin } from 'antd';
import { HandshakeIcon, PlusCircleIcon, BookOpenIcon, MessageCircleIcon } from 'lucide-react';
import ChatComponent from '@/components/chat/ChatComponent';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Dashboard() {
  const user = useSelector(selectUser);
  const loading = useSelector(selectLoading);
  const router = useRouter();

  const [trade, setTrade] = useState(null);
  const [matches, setMatches] = useState([]);
  const [showChat, setShowChat] = useState(false);
  const [chatUserId, setChatUserId] = useState(null);
  const [chatUserName, setChatUserName] = useState(null);
  const [tradeId, setTradeId] = useState(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/sign-in');
    }
  }, [user, loading, router]);

  // Get user's current trade
  useEffect(() => {
    if (user) {
      fetch(`${API_URL}/api/trade/user/${user.uid}`)
        .then(res => res.json())
        .then(setTrade)
        .catch(err => console.error("Error fetching trade for user:", err));
    }
  }, [user]);

  // Get unaccepted matches and enrich them
  useEffect(() => {
    if (user) {
      fetch(`${API_URL}/api/trade/matches/${user.uid}`)
        .then(res => res.json())
        .then(async (data) => {
          const enriched = await Promise.all(data.map(async (match) => {
            const [haveSkill, wantSkill, userInfo] = await Promise.all([
              fetch(`${API_URL}/api/skill/${match?.haveSkill}`).then(res => res.json()),
              fetch(`${API_URL}/api/skill/${match?.wantSkill}`).then(res => res.json()),
              fetch(`${API_URL}/api/user/${match?.user}`).then(res => res.json())
            ]);
            return {
              ...match,
              haveSkill,
              wantSkill,
              userName: userInfo?.fullName
            };
          }));
          setMatches(enriched);
          setTradeId(enriched[0]?._id);
        })
        .catch(err => console.error("Error fetching matches:", err));
    }
  }, [user]);

  const handleAcceptMatch = (matchId) => {
    fetch(`${API_URL}/api/trade/accept`, {
      method: 'POST',
      body: JSON.stringify({
        tradeId: matchId,
        userId: user?.uid,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(() => {
        alert("Trade accepted successfully! You can start chatting with your match once they accept.");
        // Refresh trade and matches after accepting
        fetch(`${API_URL}/api/trade/user/${user.uid}`)
          .then(res => res.json())
          .then(setTrade);

        fetch(`${API_URL}/api/trade/matches/${user.uid}`)
          .then(res => res.json())
          .then(setMatches);
      })
      .catch(err => console.error("Error accepting match:", err));
  };

  const handleStartChat = (match) => {
    setChatUserId(match?.user);
    setChatUserName(match?.userName);
    setShowChat(true);
  };

  const handleCompleteTrade = () => {
    fetch(`${API_URL}/api/trade/complete`, {
      method: 'POST',
      body: JSON.stringify({
        tradeId: tradeId,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(() => {
        alert("Trade completed successfully!");
        router.push('/dashboard');
      })
      .catch(err => console.error("Error completing trade:", err));
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <Spin size="large" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex flex-col justify-center items-center px-4">
      <main className="w-full max-w-2xl">
        {showChat && chatUserId ? (
          <ChatComponent
            matchUserId={chatUserId}
            matchUserName={chatUserName || "Trading Partner"}
            onBack={() => setShowChat(false)}
          />
        ) : (
          <div className="bg-gray-900 rounded-2xl p-8 w-full shadow-2xl border border-gray-800 transition-transform transform hover:scale-105">
            {trade==[] && !trade[0]?.isCompleted && !matches[0]?.isCompleted ? (
              <div className="text-center">
                <div className="mb-6 flex justify-center">
                  <HandshakeIcon className="w-16 h-16 text-blue-500" />
                </div>
                <h2 className="text-3xl font-bold mb-4">Your Current Trade</h2>

                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="bg-gray-800 p-4 rounded-xl shadow-md">
                    <h3 className="text-xl font-semibold text-gray-300 mb-2">Have Skill</h3>
                    <p className="text-white text-lg">{trade[0]?.haveSkill?.name}</p>
                  </div>
                  <div className="bg-gray-800 p-4 rounded-xl shadow-md">
                    <h3 className="text-xl font-semibold text-gray-300 mb-2">Want Skill</h3>
                    <p className="text-white text-lg">{trade[0]?.wantSkill?.name}</p>
                  </div>
                </div>

                <h1 className="text-4xl font-bold text-center mt-8 mb-6">Trade Matches</h1>

                {matches.length ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {matches.map(match => (
                      <div key={match?._id} className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
                        <>
                          <h2 className="text-2xl font-semibold mb-3 text-blue-400">{match?.userName}</h2>
                          <p className="text-gray-300">Has: <span className="text-white">{match?.haveSkill?.name}</span></p>
                          <p className="text-gray-300">Wants: <span className="text-white">{match?.wantSkill?.name}</span></p>
                          {trade[0]?.acceptedBy && match?.acceptedBy ? (
                            <button
                              onClick={() => handleStartChat(match)}
                              className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-full flex items-center justify-center space-x-2 mt-4 w-full"
                            >
                              <MessageCircleIcon className="w-5 h-5" />
                              <span>Continue to Chat</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => handleAcceptMatch(match?._id)}
                              className="bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-full flex items-center justify-center space-x-2 mt-4 w-full"
                            >
                              <PlusCircleIcon className="w-5 h-5" />
                              <span>Accept Trade</span>
                            </button>
                          )}
                        </>
                      </div>
                    ))}
                    <div className="flex flex-col gap-4">
                    <div className="">
                      <button className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-full flex items-center justify-center space-x-2 mt-4 w-full" onClick={() => router.push('/dashboard/chat')}>
                        Chat History
                      </button>
                    </div>
                    <div className="">
                      <button className="bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-full flex items-center justify-center space-x-2 mt-4 w-full" onClick={handleCompleteTrade}>
                        Complete Trade
                      </button>
                    </div>
                    </div>
                  </div>
                ) : (
                  <></>
                )}
              </div>
            ) : (
              <>
                <p className="text-center text-gray-400">No matching trades found.</p>
                <div className="text-center">
                  <div className="mb-6 flex justify-center">
                    <BookOpenIcon className="w-16 h-16 text-green-500" />
                  </div>
                  <h2 className="text-3xl font-bold mb-4">Start A Skill Exchange</h2>
                  <p className="text-gray-400 mb-6">
                    Connect with others, share your expertise, and learn something new. Every skill exchange is an opportunity for growth.
                  </p>
                  <button
                    onClick={() => router.push('/dashboard/new-trade')}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-full text-lg font-semibold flex items-center space-x-2 mx-auto transition-transform transform hover:scale-105 shadow-lg"
                  >
                    <PlusCircleIcon className="w-6 h-6" />
                    <span>Create A Trade</span>
                  </button>
                </div>
                <div className="text-center">
                  <button className="bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-full flex items-center justify-center space-x-2 mt-4 w-full" onClick={() => router.push('/dashboard/completed-trades')}>
                    View Completed Trades
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
