import React, { useState, useEffect, useRef } from 'react';
import { sendMessage, getChatHistory } from '../apiService';
import ChatMessage from './ChatMessage';
import { BiSolidBot } from "react-icons/bi";

const SESSION_ID = 'test';

const ChatBox = ({ darkMode, setDarkMode }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const history = await getChatHistory(SESSION_ID);
        setMessages(history);
      } catch (err) {
        console.error('[Frontend] Error fetching history:', err);
      }
    };
    fetchHistory();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg = { role: 'user', content: input, createdAt: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(async () => {
      try {
        const data = await sendMessage(SESSION_ID, input);
        const aiMsg = { role: 'ai', content: data.reply, createdAt: new Date() };
        setMessages(prev => [...prev, aiMsg]);
      } catch (err) {
        console.error('[Frontend] POST request failed:', err);
        const errorMsg = { role: 'ai', content: 'Failed to get response', createdAt: new Date() };
        setMessages(prev => [...prev, errorMsg]);
      } finally {
        setIsTyping(false);
      }
    }, 0);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className={`chat-container ${darkMode ? 'dark' : 'light'}`}>
      <div className="chat-header">
        <BiSolidBot style={{ marginRight: '6px' }} />
        AI Chat
        <button
          className="mode-toggle"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? '☀️ Light' : '🌙 Dark'}
        </button>
      </div>

      <div className="chat-messages">
        {messages.map((msg, idx) => (
          <ChatMessage key={idx} message={msg} darkMode={darkMode} />
        ))}

        {isTyping && (
          <div className="chat-message ai">
            <div className="message-content typing-indicator">
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className={`chat-input-container ${darkMode ? 'input-container-dark' : 'input-container-light'}`}>
        <input
          className={darkMode ? 'input-dark' : 'input-light'}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
        />
        <button
          className={darkMode ? 'btn-dark' : 'btn-light'}
          onClick={handleSend}
          disabled={isTyping}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
