import React from 'react';
import { useChat } from './ChatContext';
import styles from './ChatSidebar.module.css';

export default function ChatSidebar() {
  const { chats, selectedChat, setSelectedChat } = useChat();

  return (
    <aside className={styles.sidebar}>
      <h2 className={styles.title}>Чаты</h2>
      <ul className={styles.chatList}>
        {chats.map((chat) => (
          <li
            key={`${chat.orderId}-${chat.userId}`}
            className={`${styles.chatItem} ${
              selectedChat &&
              selectedChat.orderId === chat.orderId &&
              selectedChat.userId === chat.userId
                ? styles.selected
                : ''
            }`}
            onClick={() => setSelectedChat(chat)}
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && setSelectedChat(chat)}
          >
            <div className={styles.avatar}>{chat.userName[0]}</div>
            <div className={styles.info}>
              <div className={styles.username}>{chat.userName}</div>
              <div className={styles.lastMessage}>
                {chat.lastMessage || 'Нет сообщений'}
              </div>
            </div>
            <div className={styles.meta}>
              <div className={styles.time}>
                {chat.lastMessageTime &&
                  new Date(chat.lastMessageTime).toLocaleTimeString()}
              </div>
              {chat.unreadCount > 0 && (
                <span className={styles.unreadCount}>{chat.unreadCount}</span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
}
