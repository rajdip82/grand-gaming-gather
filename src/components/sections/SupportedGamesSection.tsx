
import React, { useState, useEffect } from 'react';
import SectionBadge from '../SectionBadge';
import GameCard from '../GameCard';

const SupportedGamesSection: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  const supportedGames = [
    { name: "PUBG Mobile", icon: "🎯", players: "1.2M+" },
    { name: "Free Fire", icon: "🔥", players: "800K+" },
    { name: "Clash of Clans", icon: "⚔️", players: "500K+" },
    { name: "Ludo King", icon: "🎲", players: "300K+" },
    { name: "Call of Duty", icon: "🎮", players: "400K+" },
    { name: "Among Us", icon: "🚀", players: "200K+" }
  ];

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section className="py-20 px-4 relative">
      <div className="absolute inset-0 bg-gradient-to-r from-slate-800/30 via-purple-800/20 to-slate-800/30"></div>
      <div className="max-w-7xl mx-auto relative">
        <div className="text-center mb-16">
          <SectionBadge
            icon="🎮"
            text="Gaming Universe"
            gradientColors="from-blue-600/20 to-cyan-600/20"
            borderColor="border-blue-500/30"
            textColor="text-blue-300"
          />
          <h2 className="text-5xl font-black text-white mb-6 bg-gradient-to-r from-white via-blue-200 to-white bg-clip-text text-transparent">
            CHOOSE YOUR BATTLEFIELD
          </h2>
          <p className="text-gray-400 text-xl max-w-2xl mx-auto">
            Master your favorite games and <span className="text-blue-400">dominate the competition</span>
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {supportedGames.map((game, index) => (
            <div 
              key={index}
              className={`transform transition-all duration-700 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <GameCard game={game} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SupportedGamesSection;
