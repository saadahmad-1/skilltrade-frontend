"use client";

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectUser, selectLoading } from '@/redux/features/authSlice';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { 
  collection, 
  query, 
  where, 
  orderBy,
  getDocs, 
  onSnapshot 
} from 'firebase/firestore';
import { MessageCircle, ArrowLeft } from 'lucide-react';
import ChatComponent from '@/components/chat/ChatComponent';

export default function ChatHistory() {
  const user = useSelector(selectUser);
  const loading = useSelector(selectLoading);
  const router = useRouter();
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/sign-in');
      return;
    }

    if (user) {
      const chatRoomsRef = collection(db, 'chatRooms');
      const q = query(
        chatRoomsRef, 
        where('participants', 'array-contains', user.uid),
        orderBy('lastMessageTime', 'desc')
      );
      
      const unsubscribe = onSnapshot(q, async (snapshot) => {
        const chatPromises = snapshot.docs.map(async (doc) => {
          const chatData = doc.data();
          
          // Find the other participant
          const otherUserId = chatData.participants.find(id => id !== user.uid);
          
          // Get other user details from your API
          let otherUserName = 'Unknown User';
          try {
            const response = await fetch(`${API_URL}/api/user/${otherUserId}`);
            const userData = await response.json();
            otherUserName = userData.fullName;
          } catch (error) {
            console.error('Error fetching user info:', error);
          }
          
          // Get last message
          let lastMessage = chatData.lastMessage;
          if (!lastMessage) {
            const messagesRef = collection(db, 'messages');
            const msgQuery = query(
              messagesRef,
              where('chatId', '==', chatData.chatId),
              orderBy('timestamp', 'desc'),
              limit(1)
            );
            const msgSnapshot = await getDocs(msgQuery);
            if (!msgSnapshot.empty) {
              lastMessage = msgSnapshot.docs[0].data().text;
            }
          }
          
          return {
            id: doc.id,
            chatId: chatData.chatId,
            otherUserId,
            otherUserName,
            lastMessage: lastMessage || 'No messages yet',
            timestamp: chatData.lastMessageTime?.toDate() || new Date()
          };
        });
        
        const chatList = await Promise.all(chatPromises);
        setChats(chatList);
        setLoading(false);
      });
      
      return () => unsubscribe();
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-gray-900 to-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (selectedChat) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black p-4">
        <div className="max-w-2xl mx-auto">
          <ChatComponent 
            matchUserId={selectedChat.otherUserId} 
            matchUserName={selectedChat.otherUserName} 
            onBack={() => setSelectedChat(null)} 
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center mb-6">
          <button 
            onClick={() => router.push('/dashboard')}
            className="text-gray-400 hover:text-white mr-4"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-3xl font-bold">Your Chats</h1>
        </div>
        
        {chats.length === 0 ? (
          <div className="bg-gray-900 rounded-lg p-8 text-center border border-gray-800">
            <MessageCircle className="w-16 h-16 text-gray-700 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No active chats</h2>
            <p className="text-gray-400">
              Accept a skill trade match to start chatting with other users.
            </p>
            <button
              onClick={() => router.push('/dashboard')}
              className="mt-6 bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-full"
            >
              Back to Dashboard
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {chats.map((chat) => (
              <div 
                key={chat.id} 
                className="bg-gray-900 rounded-lg p-4 border border-gray-800 hover:border-gray-700 cursor-pointer transition-all"
                onClick={() => setSelectedChat(chat)}
              >
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center">
                    <span className="text-xl font-bold text-white">
                      {chat.otherUserName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="ml-4">
                    <h3 className="font-semibold">{chat.otherUserName}</h3>
                    <p className="text-gray-400 text-sm truncate max-w-sm">
                      {chat.lastMessage}
                    </p>
                  </div>
                  <div className="ml-auto text-right">
                    <span className="text-xs text-gray-500">
                      {chat.timestamp.toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}