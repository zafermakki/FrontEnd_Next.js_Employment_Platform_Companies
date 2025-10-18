"use client";

import { useEffect, useState } from "react";

interface SentMessage {
  id: number;
  receiver_username: string;
  subject: string;
  content: string;
  status: string;
  created_at: string;
}

export default function RecruitmentLetters() {
    const [messages, setMessages] = useState<SentMessage[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSentMessages = async () => {
          try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("No token found");
    
            const res = await fetch("http://127.0.0.1:8000/api/profile/messages/sent/", {
              headers: {
                Authorization: `Token ${token}`,
              },
            });
    
            if (!res.ok) throw new Error("Failed to fetch sent messages");
    
            const data = await res.json();
            setMessages(data);
            console.log(data)
          } catch (error) {
            console.error(error);
          } finally {
            setLoading(false);
          }
        };
    
        fetchSentMessages();
      }, []);

    return(
        <div className="p-8 min-h-screen bg-gray-50">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          Sent Messages
        </h1>
  
        {loading ? (
          <p className="text-gray-500">Loading sent messages...</p>
        ) : messages.length === 0 ? (
          <p className="text-gray-500">You haven’t sent any messages yet.</p>
        ) : (
          <div className="overflow-x-auto bg-white rounded-xl shadow-md">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                <tr>
                  <th className="p-3">To</th>
                  <th className="p-3">Subject</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Message</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {messages.map((msg) => (
                  <tr
                    key={msg.id}
                    className="border-b hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-3 font-medium text-gray-800">
                      {msg.receiver_username }
                    </td>
                    <td className="p-3 text-gray-700">{msg.subject}</td>
                    <td className="p-3 text-gray-500">
                      {new Date(msg.created_at).toLocaleString()}
                    </td>
                    <td className="p-3 text-gray-600">{msg.content}</td>
                    <td className="p-3 text-gray-600">{msg.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    )

}