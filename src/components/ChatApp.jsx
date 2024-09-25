import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperclip, faPaperPlane, faMoon, faSun } from '@fortawesome/free-solid-svg-icons';

const ShimmerMessage = () => (
  <div className="flex justify-start mb-4 animate-pulse">
    <div className="bg-gray-300 dark:bg-gray-700 rounded-lg p-4 w-3/4 max-w-sm">
      <div className="h-4 bg-gray-400 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-400 dark:bg-gray-600 rounded w-1/2"></div>
    </div>
  </div>
);

const ChatApp = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true' ||
        (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  const handleSendMessage = async () => {
    if (message.trim() || selectedFile) {
      const userMessage = {
        text: message,
        fileUrl: selectedFile ? URL.createObjectURL(selectedFile) : null,
        isUser: true
      };
      setMessages((prevMessages) => [...prevMessages, userMessage]);

      const formData = new FormData();
      formData.append('message', message);
      if (selectedFile) formData.append('file', selectedFile);

      setMessage('');
      setSelectedFile(null);
      setIsLoading(true);

      try {
        const response = await fetch('https://docai-server.onrender.com/predict', {
          method: 'POST',
          body: formData,
          headers: {
            "Accept": "application/json",
          }
        });

        if (response.ok) {
          const result = await response.json();
          const botMessage = { text: result.message, isUser: false };
          setMessages((prevMessages) => [...prevMessages, botMessage]);
        } else {
          console.error('Error sending message:', response.statusText);
        }
      } catch (error) {
        console.error('Error sending message:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 600;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob((blob) => {
            const resizedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now()
            });
            setSelectedFile(resizedFile);
          }, 'image/jpeg', 0.7);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-800 dark:to-purple-800 text-white p-4 md:p-6 shadow-lg flex justify-between items-center">
        <div>
          <h1 className="text-xl md:text-3xl font-bold">Doctor Chat Bot</h1>
          <p className="text-xs md:text-base mt-1">Your virtual health assistant</p>
        </div>
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition duration-300"
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          <FontAwesomeIcon icon={darkMode ? faSun : faMoon} className="text-lg" />
        </button>
      </header>

      <div className="flex-grow p-4 md:p-6 overflow-y-auto">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-4 flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`p-3 md:p-4 rounded-lg shadow-md max-w-xs md:max-w-sm lg:max-w-md xl:max-w-lg 
                ${msg.isUser
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white dark:from-blue-700 dark:to-blue-800'
                  : 'bg-white text-gray-800 dark:bg-gray-800 dark:text-white'
                }
                transition-all duration-300 ease-in-out transform hover:scale-105`}
            >
              {msg.text && <p className="break-words text-sm md:text-base">{msg.text}</p>}
              {msg.fileUrl && (
                <div className="mt-2">
                  <img
                    src={msg.fileUrl}
                    alt="Attachment"
                    className="w-full h-auto object-cover rounded-md max-w-xs max-h-60"
                  />
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && <ShimmerMessage />}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 md:p-4 bg-white dark:bg-gray-800 shadow-lg border-t border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <div className="flex items-center space-x-2">
          <label className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 bg-gray-200 dark:bg-gray-700 rounded-full cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600 transition duration-300">
            <FontAwesomeIcon icon={faPaperclip} className="text-gray-600 dark:text-gray-300 text-lg" />
            <input
              type="file"
              onChange={handleFileChange}
              className="hidden"
              accept="image/*"
              ref={fileInputRef}
            />
          </label>
          {selectedFile && (
            <div className="flex items-center bg-blue-100 dark:bg-blue-900 rounded-full px-2 py-1 text-xs md:text-sm">
              <span className="text-blue-800 dark:text-blue-200 truncate max-w-[100px] md:max-w-xs">
                {selectedFile.name}
              </span>
            </div>
          )}
          <input
            type="text"
            className="flex-grow border dark:border-gray-600 rounded-full py-2 px-3 md:px-4 text-sm md:text-base outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition duration-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            className="bg-blue-500 dark:bg-blue-600 text-white p-2 rounded-full hover:bg-blue-600 dark:hover:bg-blue-700 transition duration-300 flex items-center justify-center w-8 h-8 md:w-10 md:h-10"
            onClick={handleSendMessage}
          >
            <FontAwesomeIcon icon={faPaperPlane} className="text-lg" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatApp;
