import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const titles = [
  "Doctor Chat Bot",
  "Medical AI Assistant",
  "Health Companion",
  "Virtual Physician",
  "Symptom Analyzer"
];

const HomePage = () => {
  const [titleIndex, setTitleIndex] = useState(0);
  const [displayedTitle, setDisplayedTitle] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  // Function to navigate to ChatApp
  const goToChatApp = () => {
    navigate('/chat');
  };

  useEffect(() => {
    let timer;
    const currentTitle = titles[titleIndex];

    if (isDeleting) {
      if (displayedTitle === '') {
        setIsDeleting(false);
        setTitleIndex((prevIndex) => (prevIndex + 1) % titles.length);
      } else {
        timer = setTimeout(() => {
          setDisplayedTitle(currentTitle.substring(0, displayedTitle.length - 1));
        }, 50);
      }
    } else {
      if (displayedTitle === currentTitle) {
        timer = setTimeout(() => setIsDeleting(true), 1000);
      } else {
        timer = setTimeout(() => {
          setDisplayedTitle(currentTitle.substring(0, displayedTitle.length + 1));
        }, 100);
      }
    }

    return () => clearTimeout(timer);
  }, [titleIndex, displayedTitle, isDeleting]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#3b5bdb] to-[#5c26d4] flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-white mb-6 h-[40px] overflow-hidden whitespace-nowrap">
        <span className="inline-block animate-typing">{displayedTitle}</span>
        <span className="inline-block w-1 h-8 bg-white ml-1 animate-blink"></span>
      </h1>
      <p className="text-xl text-white mb-8">Your virtual health assistant</p>
      
      <div className="space-y-4">
        <button 
          className="w-64 bg-white text-[#3b5bdb] hover:bg-blue-100 transition-colors duration-300 py-2 px-4 rounded-md font-semibold"
          onClick={goToChatApp}
        >
          Free Chat
        </button>
        <button 
          className="w-64 bg-[#5c26d4] text-white hover:bg-purple-600 transition-colors duration-300 py-2 px-4 rounded-md font-semibold"
          onClick={goToChatApp}
        >
          Predict Disease
        </button>
      </div>
    </div>
  );
};

export default HomePage;