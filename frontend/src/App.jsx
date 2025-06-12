import React from 'react';
import Chat from './components/Chat';

export default function App() {
  return (
    <div style={{ maxWidth: 600, margin: '40px auto', fontFamily: 'Arial, sans-serif' }}>
      <h1>B2B Printgrad Chat</h1>
      <Chat />
    </div>
  );
}