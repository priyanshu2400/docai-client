import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperclip, faImage } from '@fortawesome/free-solid-svg-icons';

const ChatApp = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  const handleSendMessage = async () => {
    if (message || selectedFile) {
      // Add the user's message to the messages list immediately
      const userMessage = { text: message, fileUrl: selectedFile ? URL.createObjectURL(selectedFile) : null, isUser: true };
      setMessages((prevMessages) => [...prevMessages, userMessage]);

      const formData = new FormData();
      formData.append('message', message);
      if (selectedFile) formData.append('file', selectedFile);

      // Clear the input field and file after the button click
      setMessage('');
      setSelectedFile(null);

      try {
        const response = await fetch('http://127.0.0.1:8000/predict', {
          method: 'POST',
          body: formData,
          headers: {
            "Accept": "application/json",
          }
        });

        if (response.ok) {
          const result = await response.json();
          // Add the bot's reply to the messages list after receiving the backend response
          const botMessage = { text: result.message, isUser: false };

          setMessages((prevMessages) => [...prevMessages, botMessage]);
        } else {
          console.error('Error sending message:', response.statusText);
        }
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  // Handle the Enter key press
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevents the default behavior of the Enter key
      handleSendMessage();
    }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-200">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <h1 className="text-2xl font-bold">Doctor Chat Bot</h1>
        <p className="text-sm">Your virtual health assistant</p>
      </header>

      {/* Chat window */}
      <div className="flex-grow p-4 overflow-y-auto bg-gray-100">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-4 ${msg.isUser ? 'text-right' : 'text-left'}`}
          >
            <div className={`p-4 rounded-lg shadow-md inline-block max-w-xs ${msg.isUser ? 'bg-blue-500 text-white' : 'bg-white text-gray-800'}`}>
              {msg.text && <p>{msg.text}</p>}
              {msg.fileUrl && (
                <div className="mt-2 flex items-center">
                  <img
                    src={msg.fileUrl}
                    alt="File preview"
                    className="w-16 h-16 object-cover rounded-md"
                  />
                  {msg.fileName && (
                    <p className="ml-2 text-sm text-gray-600">File: {msg.fileName}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Input area */}
      <div className="p-4 bg-white shadow-md flex items-center border-t border-gray-300 space-x-2">
        {/* Message input */}
        <input
          type="text"
          className="flex-grow border rounded-lg p-2 mr-2 outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown} 
        />

        {/* File upload */}
        <label className="flex items-center cursor-pointer space-x-2">
          <FontAwesomeIcon icon={faPaperclip} className="text-blue-500 text-2xl" />
          <input
            type="file"
            onChange={handleFileChange}
            className="hidden"
          />
          {selectedFile && (
            <img
              src={URL.createObjectURL(selectedFile)}
              alt="File preview"
              className="w-10 h-10 object-cover rounded-md"
            />
          )}
        </label>

        {/* Send button */}
        <button
          className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition duration-300 flex items-center"
          onClick={handleSendMessage}
        >
          <FontAwesomeIcon icon={faImage} className="text-lg mr-2" />
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatApp;
