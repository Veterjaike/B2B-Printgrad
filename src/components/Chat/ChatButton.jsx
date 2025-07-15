import React from 'react';
import styles from './ChatButton.module.css';

export default function ChatButton({ onClick }) {
    return (
        <button
            className={styles.chatButton}
            onClick={onClick}
            aria-label="Открыть чат"
        >
            💬
        </button>
    );
}
