import React, { useRef, useEffect, useState } from 'react';
import { useChat } from './ChatContext';
import styles from './ChatWindow.module.css';

export default function ChatWindow() {
  const { selectedChat, messages, sendMessage } = useChat();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef();

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, selectedChat]);

  if (!selectedChat) {
    return (
      <div className={styles.empty}>
        Выберите чат слева
      </div>
    );
  }

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(selectedChat, input);
    setInput('');
  };

  return (
    <div className={styles.window}>
      <div className={styles.header}>
        <h3 className={styles.user}>{selectedChat.userName}</h3>
        <small className={styles.order}>Заказ #{selectedChat.orderId}</small>
      </div>

      <div className={styles.messages}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`${styles.message} ${
              msg.sender_id === selectedChat.userId
                ? styles.received
                : styles.sent
            }`}
          >
            <div className={styles.text}>{msg.message}</div>
            <div className={styles.time}>
              {new Date(msg.sent_at).toLocaleTimeString()}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className={styles.footer}>
        <input
          type="text"
          className={styles.input}
          placeholder="Введите сообщение..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button className={styles.sendButton} onClick={handleSend}>
          ➤
        </button>
      </div>
    </div>
  );
}
