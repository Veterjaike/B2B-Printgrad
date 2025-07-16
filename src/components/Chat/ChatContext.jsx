import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [socket, setSocket] = useState(null);

    const token = localStorage.getItem('token'); // или откуда у тебя JWT

    // Инициализация сокета
    useEffect(() => {
        if (!token) return;

        const newSocket = io(`${import.meta.env.VITE_API_URL}/`, {
            auth: { token },
            transports: ['websocket'],
        });

        newSocket.on('connect', () => {
            console.log('✅ Socket connected');
        });

        newSocket.on('message', (message) => {
            const isInCurrentChat =
                selectedChat &&
                ((message.sender_id === selectedChat.userId &&
                    message.receiver_id === parseInt(message.selfId)) ||
                    (message.sender_id === parseInt(message.selfId) &&
                        message.receiver_id === selectedChat.userId)) &&
                message.order_id === selectedChat.orderId;

            if (isInCurrentChat) {
                setMessages((prev) => [...prev, message]);
            }

            // обновить последний месседж в списке чатов
            setChats((prev) =>
                prev.map((chat) =>
                    chat.orderId === message.order_id &&
                        (chat.userId === message.sender_id || chat.userId === message.receiver_id)
                        ? { ...chat, lastMessage: message.message, lastMessageTime: message.sent_at }
                        : chat
                )
            );
        });

        setSocket(newSocket);

        return () => newSocket.disconnect();
    }, [token, selectedChat]);

    // Загрузка чатов
    const loadChats = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/messages`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await res.json();
            setChats(data);
        } catch (err) {
            console.error('Ошибка при загрузке чатов:', err);
        }
    };

    // Загрузка сообщений конкретного чата
    useEffect(() => {
        if (!selectedChat) return;

        const fetchMessages = async () => {
            try {
                const res = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/messages/${selectedChat.orderId}/${selectedChat.userId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                const data = await res.json();
                setMessages(data);
            } catch (err) {
                console.error('Ошибка при загрузке сообщений:', err);
            }
        };

        fetchMessages();
    }, [selectedChat]);

    // Отправка сообщения
    const sendMessage = (chat, text) => {
        if (!socket || !text) return;

        socket.emit('message', {
            orderId: chat.orderId,
            receiverId: chat.userId,
            message: text,
        });
    };

    return (
        <ChatContext.Provider
            value={{
                chats,
                selectedChat,
                setSelectedChat,
                messages,
                sendMessage,
                loadChats,
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};
