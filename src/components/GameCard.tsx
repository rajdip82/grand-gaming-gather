
interface Game {
  name: string;
  icon: string;
  players: string;
}

interface GameCardProps {
  game: Game;
}

const GameCard = ({ game }: GameCardProps) => {
  return (
    <div className="group relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-6 text-center backdrop-blur-sm border border-purple-500/20 hover:border-purple-400/60 transition-all duration-500 transform hover:scale-105 cursor-pointer overflow-hidden">
      {/* Animated background effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-pink-600/10 to-purple-600/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
      
      {/* Glowing effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 blur-xl"></div>
      </div>
      
      <div className="relative z-10">
        <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
          {game.icon}
        </div>
        <h3 className="text-white font-bold mb-2 group-hover:text-purple-300 transition-colors duration-300">
          {game.name}
        </h3>
        <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors duration-300">
          <span className="font-semibold text-purple-400">{game.players}</span> players
        </p>
        
        {/* Hover indicator */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 to-pink-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
      </div>
    </div>
  );
};

export default GameCard;
