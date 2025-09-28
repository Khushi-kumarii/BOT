import React from 'react';
import { FaUserTie } from "react-icons/fa";
import { RiRobot2Fill } from "react-icons/ri";

const ChatMessage = ({ message, darkMode }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`chat-message ${isUser ? 'user' : 'ai'}`}>
      <div className={`message-content ${darkMode ? 'dark-msg' : 'light-msg'}`}>
        <span className="message-icon">
          {isUser ? <FaUserTie /> : <RiRobot2Fill />}
        </span>
        <span className="message-text">{message.content}</span>
      </div>
      <div className="message-time">
        {new Date(message.createdAt).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </div>
    </div>
  );
};

export default ChatMessage;
