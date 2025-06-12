import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://95.31.48.48:3000');

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket.on('chat message', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });
    return () => {
      socket.off('chat message');
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (input.trim()) {
      socket.emit('chat message', input.trim());
      setInput('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div>
      <div style={{
        border: '1px solid #ccc', padding: 10, height: 300, overflowY: 'auto', marginBottom: 10,
        backgroundColor: '#f9f9f9',
      }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ marginBottom: 6 }}>{msg}</div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <input
        type="text"
        placeholder="Введите сообщение..."
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        style={{ width: '80%', padding: 8 }}
      />
      <button onClick={sendMessage} style={{ padding: '8px 12px', marginLeft: 8 }}>Отправить</button>
    </div>
  );
}