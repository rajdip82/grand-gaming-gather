
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
    <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-lg p-6 text-center backdrop-blur-sm border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 transform hover:scale-105 cursor-pointer">
      <div className="text-4xl mb-3">{game.icon}</div>
      <h3 className="text-white font-semibold mb-1">{game.name}</h3>
      <p className="text-gray-400 text-sm">{game.players} players</p>
    </div>
  );
};

export default GameCard;
