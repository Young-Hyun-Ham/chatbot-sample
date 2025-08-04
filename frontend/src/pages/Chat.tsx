import React, { useEffect, useState } from 'react';
import { fetchMessages, postMessage, type ChatMessage } from '../api/chatApi';
import { useAuthStore } from '../store/authStore';

const Chat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const username = useAuthStore((state) => state.username);

  const loadMessages = async () => {
    try {
      const data = await fetchMessages();
      setMessages(data);
    } catch (err) {
      console.error('메시지 불러오기 실패:', err);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    try {
      if (!username) return ; // 사용자 이름이 없으면 메시지 전송을 중단합니다.

      const newMsg = await postMessage({ username: username, message: input });
      setMessages((prev) => [newMsg, ...prev]);
      setInput('');
    } catch (err) {
      console.error('메시지 전송 실패:', err);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  return (
    <div className="p-4 max-w-md mx-auto">
      <div className="mb-4">
        <input
          className="border p-2 w-full"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="메시지를 입력하세요..."
        />
        <button className="bg-blue-500 text-white px-4 py-2 mt-2" onClick={handleSend}>
          전송
        </button>
      </div>
      <ul className="space-y-2">
        {messages.map((msg) => (
          <li key={msg.id} className="border p-2 rounded bg-gray-100">
            <strong>{msg.username}</strong>: {msg.message}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Chat;
