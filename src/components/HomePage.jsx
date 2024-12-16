import React from 'react';
import { useNavigate } from 'react-router-dom';
import RollingText from './RollingText';

const titles = [
  "Doctor Chat Bot",
  "Medical AI Assistant",
  "Health Companion",
  "Virtual Physician",
  "Symptom Analyzer"
];

const HomePage = () => {
  const navigate = useNavigate();

  const goToChatApp = (isFreeChat) => {
    navigate('/chat', { state: { isFreeChat } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#3b5bdb] to-[#5c26d4] flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-6 h-[40px] sm:h-[48px] md:h-[56px] overflow-hidden">
        <RollingText texts={titles} />
      </h1>
      <p className="text-lg sm:text-xl text-white mb-8 text-center">Your virtual health assistant</p>

      <div className="space-y-4 w-full max-w-xs sm:max-w-sm">
        <button 
          className="w-full bg-white text-[#3b5bdb] hover:bg-blue-100 transition-colors duration-300 py-3 px-6 rounded-md font-semibold text-lg"
          onClick={() => goToChatApp(true)}  // Free Chat
        >
          Free Chat
        </button>
        <button 
          className="w-full bg-[#5c26d4] text-white hover:bg-purple-600 transition-colors duration-300 py-3 px-6 rounded-md font-semibold text-lg"
          onClick={() => goToChatApp(false)}  // Predict Disease
        >
          Predict Disease
        </button>
      </div>
    </div>
  );
};

export default HomePage;
