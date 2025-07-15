import React, { useEffect } from 'react';
import { useChat } from './ChatContext';
import ChatSidebar from './ChatSidebar';
import ChatWindow from './ChatWindow';
import styles from './ChatModal.module.css';

export default function ChatModal({ isOpen, onClose }) {
  const { loadChats } = useChat();

  useEffect(() => {
    if (isOpen) {
      loadChats();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <ChatSidebar />
        <ChatWindow />
        <button
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Закрыть чат"
        >
          ×
        </button>
      </div>
    </div>
  );
}
