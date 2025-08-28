import React, { useState, useEffect, useContext, useRef } from 'react';
import ThemeContext from '../themeContext';
import getEnvironment from '../../getEnvironment';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Loader2, MessageCircle } from "lucide-react";

const getInitials = (name = '') =>
    name.split(' ').map(n => n[0]).join('').toUpperCase();

const ChatWindow = ({ socket, conversationId, currentUserId, users }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [viewMsg, setViewMsg] = useState(null);
    const apiURL = getEnvironment();
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (!conversationId) {
            setIsLoading(false);
            setMessages([]);
            return;
        };

        setMessages([]);
        setIsLoading(true);

        socket.emit('join_conversation', conversationId);

        const fetchMessages = async () => {
            try {
                const response = await fetch(`${apiURL}/api/v1/conversations/messages/${conversationId}`, {
                    method: "GET",
                    credentials: "include"
                });
                if (response.ok) {
                    const data = await response.json();
                    const sortedMessages = data.data.messages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                    setMessages(sortedMessages);
                } else {
                    console.error("Failed to fetch messages");
                    setMessages([]);
                }
            } catch (error) {
                console.error("Error fetching messages:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMessages();

        const handleNewMessage = (message) => {
            if (message.conversationId === conversationId) {
                setMessages((prevMessages) => [...prevMessages, message]);
            }
        };

        socket.on('receiveMessage', handleNewMessage);

        return () => {
            socket.off('receiveMessage', handleNewMessage);
        };
    }, [conversationId, socket, apiURL]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (newMessage.trim() === '') return;

        const messageData = {
            conversationId: conversationId,
            sender: currentUserId,
            content: newMessage,
            createdAt: new Date().toISOString(),
        };

        socket.emit('sendMessage', messageData);
        setNewMessage('');
    };

    const formatTime = (timestamp) => {
        return new Date(timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (!conversationId) {
        return (
            <div className="flex flex-col h-full items-center justify-center themed-bg">
                <div className="rounded-2xl p-8 max-w-md mx-4 text-center themed-bg-secondary themed-border">
                    <MessageCircle className="h-16 w-16 mx-auto mb-4 themed-text-secondary opacity-50" />
                    <h3 className="text-lg font-semibold mb-2 themed-text">Start a Conversation</h3>
                    <p className="text-sm themed-text-secondary opacity-75">Select a conversation from the sidebar to begin chatting</p>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="flex flex-col h-full items-center justify-center themed-bg">
                <div className="rounded-2xl p-8 themed-bg-secondary">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto themed-text" />
                    <p className="mt-4 text-sm themed-text-secondary opacity-75">Loading messages...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full themed-bg">
            <ScrollArea className="flex-grow">
                <div className="flex flex-col gap-3 p-4 md:p-6">
                    {messages.length > 0 ? (
                        messages.map((msg, index) => {
                            const senderInfo = users.get(msg.sender);
                            const isCurrentUser = msg.sender === currentUserId;
                            const messageKey = msg._id || `${msg.sender}-${msg.createdAt}-${index}`;
                            const showAvatar = index === 0 || messages[index - 1].sender !== msg.sender;
                            const isLastFromSender = index === messages.length - 1 || messages[index + 1].sender !== msg.sender;

                            return (
                                <div key={messageKey}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (viewMsg === msg._id) {
                                            setViewMsg(null);
                                        } else {
                                            setViewMsg(msg._id);
                                        }
                                    }}
                                    className={`flex items-end gap-3 ${isCurrentUser ? "justify-end" : "justify-start"}`}>
                                    {!isCurrentUser && (
                                        <div className="h-8 w-8 flex items-end">
                                            {showAvatar ? (
                                                <Avatar className="h-8 w-8 border-2 themed-border shadow-sm">
                                                    <AvatarImage src={senderInfo?.avatar || "/userimg.jpg"} />
                                                    <AvatarFallback className="text-xs font-medium">
                                                        {getInitials(senderInfo?.firstname)}
                                                    </AvatarFallback>
                                                </Avatar>
                                            ) : (
                                                <div className="h-8 w-8" />
                                            )}
                                        </div>
                                    )}

                                    <div className={`max-w-xs md:max-w-md lg:max-w-2xl rounded-2xl px-4 py-3 text-sm flex flex-col transition-all duration-200 hover:scale-[1.02] ${isCurrentUser
                                            ? `themed-accent-bg text-white shadow-lg ${isLastFromSender ? 'rounded-br-md' : ''}`
                                            : `themed-bg-secondary themed-text shadow-sm themed-border ${isLastFromSender ? 'rounded-bl-md' : ''}`
                                        }`}>
                                        {!isCurrentUser && showAvatar && (
                                            <p className="text-xs font-semibold mb-1 themed-accent-text opacity-80">
                                                {senderInfo?.firstname || 'Unknown User'}
                                            </p>
                                        )}
                                        <p className="whitespace-pre-wrap break-words leading-relaxed">{msg.content}</p>
                                        {
                                            viewMsg === msg._id ?
                                                <p className={`text-xs mt-1 opacity-60 ${isCurrentUser ? 'text-right' : 'text-left'}`}>
                                                    {formatTime(msg.createdAt)}
                                                </p>
                                                : null
                                        }
                                    </div>

                                    {isCurrentUser && <div className="h-8 w-8" />}
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-center mt-16">
                            <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-30 themed-text-secondary" />
                            <p className="text-sm themed-text-secondary">
                                No messages yet. Be the first to say hello! 👋
                            </p>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </ScrollArea>

            <div className="p-4 border-t themed-border themed-bg-secondary">
                <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
                    <div className="flex-grow relative">
                        <Input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type your message..."
                            className="pr-4 rounded-xl themed-bg themed-border themed-text placeholder:themed-text-secondary shadow-sm transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
                            autoComplete="off"
                        />
                    </div>
                    <Button
                        type="submit"
                        size="icon"
                        disabled={!newMessage.trim()}
                        className="rounded-xl h-10 w-10 shadow-lg transition-all duration-200 hover:scale-105 disabled:scale-100 disabled:opacity-50 disabled:cursor-not-allowed themed-accent-bg"
                    >
                        <Send className="h-4 w-4" />
                        <span className="sr-only">Send</span>
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default ChatWindow;