import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

const ChatContext = createContext();
export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [socket, setSocket] = useState(null);

    const token = localStorage.getItem('token');

    // Получаем ID пользователя из токена
    const getUserIdFromToken = () => {
        try {
            const base64 = token.split('.')[1];
            return JSON.parse(atob(base64)).id;
        } catch {
            return null;
        }
    };

    const currentUserId = getUserIdFromToken();

    // Инициализация сокета
    useEffect(() => {
        if (!token || !currentUserId) return;

        const newSocket = io(`${import.meta.env.VITE_API_URL}`, {
            auth: { token },
            transports: ['websocket'],
        });

        newSocket.on('connect', () => {
            console.log('✅ Socket connected');
        });

        // Приход нового сообщения
        newSocket.on('newMessage', (message) => {
            const isInCurrentChat =
                selectedChat &&
                ((message.sender_id === selectedChat.userId &&
                    message.receiver_id === currentUserId) ||
                    (message.sender_id === currentUserId &&
                        message.receiver_id === selectedChat.userId)) &&
                message.order_id === selectedChat.orderId;

            if (isInCurrentChat) {
                setMessages((prev) => [...prev, message]);
            }

            // Обновляем последний месседж в списке чатов
            setChats((prev) =>
                prev.map((chat) =>
                    chat.orderId === message.order_id &&
                    (chat.userId === message.sender_id || chat.userId === message.receiver_id)
                        ? {
                            ...chat,
                            lastMessage: message.message,
                            lastMessageTime: message.sent_at,
                        }
                        : chat
                )
            );
        });

        setSocket(newSocket);

        return () => newSocket.disconnect();
    }, [token, currentUserId, selectedChat]);

    // Загрузка чатов
    const loadChats = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/messages`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await res.json();
            setChats(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Ошибка при загрузке чатов:', err);
            setChats([]); // fallback
        }
    };

    // Загрузка сообщений для выбранного чата
    useEffect(() => {
        if (!selectedChat) return;

        const fetchMessages = async () => {
            try {
                const res = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/messages/${selectedChat.orderId}/chat/${selectedChat.userId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                const data = await res.json();
                setMessages(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error('Ошибка при загрузке сообщений:', err);
                setMessages([]);
            }
        };

        fetchMessages();
    }, [selectedChat, token]);

    // Отправка сообщения через сокет
    const sendMessage = (chat, text) => {
        if (!socket || !text || !currentUserId) return;

        socket.emit('sendMessage', {
            orderId: chat.orderId,
            senderId: currentUserId,
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
