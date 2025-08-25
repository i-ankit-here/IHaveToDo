import React, { useState, useEffect, useContext, useRef } from 'react';
import ThemeContext from '../themeContext';
import getEnvironment from '../../getEnvironment';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Loader2, MessageCircle } from "lucide-react";

// Helper to get initials from a name for the Avatar Fallback
const getInitials = (name = '') =>
    name.split(' ').map(n => n[0]).join('').toUpperCase();

const ChatWindow = ({ socket, conversationId, currentUserId, users }) => {
    console.log(users);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [viewMsg, setViewMsg] = useState(null);
    const { theme } = useContext(ThemeContext);
    const apiURL = getEnvironment();

    // Ref for the end of the messages list to enable auto-scrolling
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Effect for fetching messages and setting up socket listeners
    useEffect(() => {
        if (!conversationId) {
            setIsLoading(false);
            setMessages([]);
            return;
        };

        // Reset state for new conversation
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

    // Effect for auto-scrolling when new messages are added
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

    // Theme-based styling
    const getThemeClasses = () => ({
        container: theme === "light"
            ? "bg-gradient-to-br from-slate-50 to-gray-100"
            : "bg-gradient-to-br from-gray-900 to-black",

        emptyState: theme === "light"
            ? "bg-white/50 backdrop-blur-sm border border-gray-200/50 text-gray-600"
            : "bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 text-gray-400",

        loadingState: theme === "light"
            ? "bg-white/30 backdrop-blur-sm"
            : "bg-gray-900/30 backdrop-blur-sm",

        messageArea: theme === "light"
            ? "bg-white/30 backdrop-blur-sm"
            : "bg-gray-900/20 backdrop-blur-sm",

        inputContainer: theme === "light"
            ? "bg-white/70 backdrop-blur-md border-gray-200/50 shadow-lg"
            : "bg-gray-900/70 backdrop-blur-md border-gray-700/50 shadow-xl",

        receivedMessage: theme === "light"
            ? "bg-white shadow-sm border border-gray-100 text-gray-900"
            : "bg-gray-800 shadow-lg border border-gray-700 text-gray-100",

        sentMessage: "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg",

        emptyMessages: theme === "light"
            ? "text-gray-500"
            : "text-gray-400"
    });

    const themeClasses = getThemeClasses();

    // Format timestamp for messages
    const formatTime = (timestamp) => {
        return new Date(timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // --- Render Logic ---

    if (!conversationId) {
        return (
            <div className={`flex flex-col h-full items-center justify-center ${themeClasses.container}`}>
                <div className={`rounded-2xl p-8 max-w-md mx-4 text-center ${themeClasses.emptyState}`}>
                    <MessageCircle className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-semibold mb-2">Start a Conversation</h3>
                    <p className="text-sm opacity-75">Select a conversation from the sidebar to begin chatting</p>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className={`flex flex-col h-full items-center justify-center ${themeClasses.container}`}>
                <div className={`rounded-2xl p-8 ${themeClasses.loadingState}`}>
                    <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                    <p className="mt-4 text-sm opacity-75">Loading messages...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`flex flex-col h-full ${themeClasses.container}`}>
            {/* Message Display Area */}
            <ScrollArea className={`flex-grow ${themeClasses.messageArea}`}>
                <div className="flex flex-col gap-3 p-4 md:p-6">
                    {messages.length > 0 ? (
                        messages.map((msg, index) => {
                            const senderInfo = users.get(msg.sender);
                            const isCurrentUser = msg.sender === currentUserId;
                            const messageKey = msg._id || `${msg.sender}-${msg.createdAt}-${index}`;

                            // Check if we should show the avatar (first message from user or different sender than previous)
                            const showAvatar = index === 0 || messages[index - 1].sender !== msg.sender;
                            const isLastFromSender = index === messages.length - 1 || messages[index + 1].sender !== msg.sender;

                            return (
                                <div key={messageKey} 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if(viewMsg === msg._id) {
                                        setViewMsg(null);
                                    } else {
                                        setViewMsg(msg._id);
                                    }
                                }}
                                className={`flex items-end gap-3 ${isCurrentUser ? "justify-end" : "justify-start"}`}>
                                    {/* Avatar for the other user */}
                                    {!isCurrentUser && (
                                        <div className="h-8 w-8 flex items-end">
                                            {showAvatar ? (
                                                <Avatar className="h-8 w-8 border-2 border-white shadow-sm">
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

                                    {/* Message Bubble */}
                                    <div className={`max-w-xs md:max-w-md lg:max-w-2xl rounded-2xl px-4 py-3 text-sm flex flex-col transition-all duration-200 hover:scale-[1.02] ${isCurrentUser
                                            ? `${themeClasses.sentMessage} ${isLastFromSender ? 'rounded-br-md' : ''}`
                                            : `${themeClasses.receivedMessage} ${isLastFromSender ? 'rounded-bl-md' : ''}`
                                        }`}>
                                        {!isCurrentUser && showAvatar && (
                                            <p className="text-xs font-semibold mb-1 opacity-80">
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

                                    {/* Spacing for current user messages */}
                                    {isCurrentUser && <div className="h-8 w-8" />}
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-center mt-16">
                            <MessageCircle className={`h-12 w-12 mx-auto mb-4 opacity-30 ${themeClasses.emptyMessages}`} />
                            <p className={`text-sm ${themeClasses.emptyMessages}`}>
                                No messages yet. Be the first to say hello! 👋
                            </p>
                        </div>
                    )}
                    {/* Empty div to mark the end of messages for auto-scrolling */}
                    <div ref={messagesEndRef} />
                </div>
            </ScrollArea>

            {/* Message Input Form */}
            <div className={`p-4 border-t backdrop-blur-md ${themeClasses.inputContainer}`}>
                <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
                    <div className="flex-grow relative">
                        <Input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type your message..."
                            className={`pr-4 rounded-xl border-0 shadow-sm transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 ${theme === "light"
                                    ? "bg-white/70 placeholder-gray-500"
                                    : "bg-gray-800/70 placeholder-gray-400"
                                }`}
                            autoComplete="off"
                        />
                    </div>
                    <Button
                        type="submit"
                        size="icon"
                        disabled={!newMessage.trim()}
                        className={`rounded-xl h-10 w-10 shadow-lg transition-all duration-200 hover:scale-105 disabled:scale-100 ${!newMessage.trim()
                                ? 'opacity-50 cursor-not-allowed'
                                : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
                            }`}
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
