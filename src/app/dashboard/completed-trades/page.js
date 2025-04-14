"use client";

import { useSelector } from 'react-redux';
import { selectUser, selectLoading } from '@/redux/features/authSlice';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Spin } from 'antd';
import { CheckCircleIcon, ArrowLeftIcon } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function CompletedTrades() {
  const user = useSelector(selectUser);
  const loading = useSelector(selectLoading);
  const router = useRouter();
  const [completedTrades, setCompletedTrades] = useState([]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/sign-in');
    }
  }, [user, loading, router]);

  // Fetch completed trades
  useEffect(() => {
    if (user) {
      fetch(`${API_URL}/api/trade/completed/${user.uid}`)
        .then(res => res.json())
        .then(async (data) => {
          console.log("Raw trades data:", data);
          
          // Create a Map to store unique trades using a composite key of skills
          const uniqueTradesMap = new Map();
          
          for (const trade of data) {
            // Create a unique key based on the skills being exchanged
            const skillKey = [trade.haveSkill._id, trade.wantSkill._id].sort().join('-');
            
            if (!uniqueTradesMap.has(skillKey)) {
              console.log("Processing trade:", trade._id);
              const userInfo = await fetch(`${API_URL}/api/user/${trade?.user === user.uid ? trade?.acceptedBy : trade?.user}`).then(res => res.json());
              uniqueTradesMap.set(skillKey, {
                ...trade,
                tradingPartner: userInfo?.fullName
              });
            } else {
              console.log("Skipping duplicate trade:", trade._id);
            }
          }
          
          const uniqueTrades = Array.from(uniqueTradesMap.values());
          console.log("Final unique trades:", uniqueTrades);
          setCompletedTrades(uniqueTrades);
        })
        .catch(err => console.error("Error fetching completed trades:", err));
    }
  }, [user]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <Spin size="large" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex flex-col justify-center items-center px-4">
      <main className="w-full max-w-2xl">
        <div className="bg-gray-900 rounded-2xl p-8 w-full shadow-2xl border border-gray-800">
          <div className="flex items-center mb-6">
            <button
              onClick={() => router.push('/dashboard')}
              className="flex items-center text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5 mr-2" />
              Back to Dashboard
            </button>
          </div>

          <div className="text-center mb-8">
            <div className="mb-6 flex justify-center">
              <CheckCircleIcon className="w-16 h-16 text-green-500" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Completed Trades</h1>
            <p className="text-gray-400">
              View your history of successful skill exchanges
            </p>
          </div>

          {completedTrades.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {completedTrades.map((trade) => (
                <div
                  key={trade._id}
                  className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700"
                >
                  <h2 className="text-2xl font-semibold mb-3 text-green-400">
                    Trade with {trade.tradingPartner}
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-700 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold text-gray-300 mb-2">
                        {trade.user === user.uid ? "You Taught" : "You Learned"}
                      </h3>
                      <p className="text-white">{trade.haveSkill.name}</p>
                    </div>
                    <div className="bg-gray-700 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold text-gray-300 mb-2">
                        {trade.user === user.uid ? "You Learned" : "You Taught"}
                      </h3>
                      <p className="text-white">{trade.wantSkill.name}</p>
                    </div>
                  </div>
                  <div className="mt-4 text-sm text-gray-400">
                    Completed on: {new Date(trade.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400">No completed trades yet.</p>
              <button
                onClick={() => router.push('/dashboard')}
                className="mt-4 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-full text-lg font-semibold"
              >
                Start Trading
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
