
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Zap, Plus, Target } from 'lucide-react';

const HeroSection: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isTitleAnimated, setIsTitleAnimated] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    const timeout = setTimeout(() => setIsTitleAnimated(true), 200);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <section className="relative pt-32 pb-20 px-4">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/30 via-pink-600/20 to-blue-600/30 animate-pulse"></div>
        <div className="absolute top-20 left-10 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl animate-bounce"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-pink-500/20 rounded-full blur-3xl animate-bounce delay-1000"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto text-center z-10">
        <div className="mb-6 space-y-4">
          <div className={`transform transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <span className="inline-block px-6 py-2 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-full text-purple-300 text-sm font-medium backdrop-blur-sm">
              🏆 Welcome to the Ultimate Gaming Arena
            </span>
          </div>

          <h1
            className={`
              text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400
              transition-all duration-1000 delay-300
              ${isTitleAnimated ? "animate-fade-in scale-100 opacity-100" : "scale-90 opacity-0"}
            `}
            style={{ transitionProperty: "opacity, transform" }}
          >
            <span className="block leading-tight">
              PROXYCORN
            </span>
            <span
              className={`
                block leading-tight
                bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent
                animate-pulse
                transition-all duration-1000
                ${isTitleAnimated ? "animate-fade-in scale-100 opacity-100" : "scale-90 opacity-0"}
              `}
              style={{ transitionProperty: "opacity, transform" }}
            >
              TOURNAMENTS
            </span>
          </h1>
        </div>
        
        <p className={`text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed transform transition-all duration-1000 delay-500 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          Enter the <span className="text-purple-400 font-semibold">ultimate gaming tournaments</span>. 
          Compete with <span className="text-pink-400 font-semibold">elite players worldwide</span> and 
          claim <span className="text-cyan-400 font-semibold">legendary rewards</span>!
        </p>
        
        <div className={`flex flex-col sm:flex-row gap-6 justify-center items-center transform transition-all duration-1000 delay-700 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <Link 
            to="/tournaments"
            className="group relative bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-white px-10 py-5 rounded-xl font-bold text-lg overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-700 via-pink-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
            <span className="relative flex items-center gap-3">
              <Trophy className="w-6 h-6" />
              JOIN TOURNAMENTS
              <Zap className="w-5 h-5 animate-pulse" />
            </span>
          </Link>
          
          <Link 
            to="/create"
            className="group relative bg-transparent border-2 border-purple-500 text-purple-400 px-10 py-5 rounded-xl font-bold text-lg overflow-hidden transition-all duration-300 transform hover:scale-105 hover:bg-purple-500 hover:text-white hover:shadow-xl hover:shadow-purple-500/30"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-purple-600/50 to-purple-600/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500"></div>
            <span className="relative flex items-center gap-3">
              <Plus className="w-6 h-6" />
              CREATE TOURNAMENT
              <Target className="w-5 h-5" />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
