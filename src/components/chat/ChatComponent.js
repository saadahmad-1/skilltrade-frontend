"use client";

import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '@/redux/features/authSlice';
import { db } from '@/lib/firebase';
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  getDocs,
  limitToLast
} from 'firebase/firestore';
import { Send, ArrowLeft } from 'lucide-react';
import { doc, updateDoc } from 'firebase/firestore';

export default function ChatComponent({ matchUserId, matchUserName, onBack }) {
  const user = useSelector(selectUser);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [chatId, setChatId] = useState(null);
  const [chatDocId, setChatDocId] = useState(null); // Store the document ID
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  console.log("ChatComponent rendered with matchUserId:", matchUserId);

  // Create or get existing chat room
  useEffect(() => {
    const setupChat = async () => {
      if (!user || !matchUserId) {
        console.log("Missing user or matchUserId");
        return;
      }

      try {
        console.log("Setting up chat between", user.uid, "and", matchUserId);

        // Sort user IDs to ensure consistent chat ID
        const sortedUserIds = [user.uid, matchUserId].sort();
        const chatRoomId = `chat_${sortedUserIds[0]}_${sortedUserIds[1]}`;

        console.log("Generated chatRoomId:", chatRoomId);

        // Check if chat room exists
        const chatRoomsRef = collection(db, 'chatRooms');
        const chatQuery = query(chatRoomsRef, where('chatId', '==', chatRoomId));
        const querySnapshot = await getDocs(chatQuery);

        if (querySnapshot.empty) {
          console.log("Creating new chat room");
          // Create new chat room
          const docRef = await addDoc(chatRoomsRef, {
            chatId: chatRoomId,
            participants: sortedUserIds,
            createdAt: serverTimestamp(),
            lastMessage: null,
            lastMessageTime: serverTimestamp()
          });
          console.log("Created chat room with ID:", docRef.id);
          setChatDocId(docRef.id);
        } else {
          console.log("Chat room exists with ID:", querySnapshot.docs[0].id);
          setChatDocId(querySnapshot.docs[0].id);
        }

        setChatId(chatRoomId);
        setLoading(false);
      } catch (error) {
        console.error("Error setting up chat:", error);
        setLoading(false);
      }
    };

    setupChat();
  }, [user, matchUserId]);

  // Listen for messages
  useEffect(() => {
    if (!chatId) {
      console.log("No chatId available yet");
      return;
    }

    console.log("Setting up message listener for chatId:", chatId);

    try {
      const messagesRef = collection(db, 'messages');
      const q = query(
        messagesRef,
        where('chatId', '==', chatId),
        orderBy('timestamp', 'asc')
      );

      console.log("Message query created");

      const unsubscribe = onSnapshot(q, (snapshot) => {
        console.log("Message snapshot received, docs:", snapshot.docs.length);
        const messageList = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            timestamp: data.timestamp ? data.timestamp.toDate() : new Date()
          };
        });

        console.log("Processed messages:", messageList);
        setMessages(messageList);
      }, (error) => {
        console.error("Error in message snapshot listener:", error);
      });

      // Return the unsubscribe function to clean up
      return () => {
        console.log("Unsubscribing from message listener");
        unsubscribe();
      };
    } catch (error) {
      console.error("Error setting up message listener:", error);
    }
  }, [chatId]);

  // Auto-scroll to latest message
  useEffect(() => {
    if (messages.length > 0) {
      console.log("Scrolling to latest message");
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || !chatId) {
      console.log("Cannot send empty message or missing chatId");
      return;
    }

    console.log("Sending message:", message);

    try {
      const newMessage = {
        chatId: chatId,
        text: message,
        senderId: user.uid,
        senderName: user.displayName || user.email || 'User',
        timestamp: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'messages'), newMessage);
      console.log("Message sent with ID:", docRef.id);

      // Also update the last message in the chat room
      if (chatDocId) {
        const chatRoomRef = doc(db, 'chatRooms', chatDocId);
        await updateDoc(chatRoomRef, {
          lastMessage: message,
          lastMessageTime: serverTimestamp()
        });
        console.log("Updated chat room with last message");
      }

      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      alert("Couldn't send your message. Please try again.");
    }
  };

  const handleVideoCall = async () => {
    if (!chatId) return;

    const meetingLink = `https://meet.jit.si/${chatId}`;

    try {
      await addDoc(collection(db, 'messages'), {
        chatId,
        text: `Join the video call: ${meetingLink}`,
        senderId: user.uid,
        senderName: user.displayName || user.email || 'User',
        timestamp: serverTimestamp()
      });

      console.log("Video call link sent:", meetingLink);
    } catch (error) {
      console.error("Error sending video call link:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[600px] w-full bg-gray-900 rounded-xl border border-gray-800 shadow-lg">
      {/* Chat Header */}
      <div className="flex items-center p-4 border-b border-gray-800">
        <button
          onClick={onBack}
          className="mr-2 text-gray-400 hover:text-white"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="ml-2">
          <h3 className="text-lg font-semibold text-white">{matchUserName || 'Trading Partner'}</h3>
          <p className="text-xs text-gray-400">Skill Exchange Chat</p>
        </div>
        <div className="ml-auto">
          <button
            onClick={handleVideoCall}
            className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Start Video Call
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <p className="text-gray-500 text-center">
              No messages yet. Start the conversation!
            </p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.senderId === user.uid ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${msg?.senderId === user?.uid
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-gray-800 text-white rounded-bl-none'
                  }`}
              >
                {msg?.text?.startsWith('Join the video call: ') ? (
                  <a href={msg?.text?.replace('Join the video call: ', '')} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">Video Call</a>
                ) : (
                  <p className="text-sm">{msg?.text}</p>
                )}
                <p className="text-xs opacity-70 mt-1">
                  {msg?.timestamp instanceof Date ? msg?.timestamp?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Sending...'}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={sendMessage} className="border-t border-gray-800 p-4">
        <div className="flex">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-gray-800 border border-gray-700 rounded-l-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-r-lg transition-colors"
            disabled={!message.trim()}
          >
            <Send size={18} />
          </button>
        </div>
      </form>
    </div>
  );
}