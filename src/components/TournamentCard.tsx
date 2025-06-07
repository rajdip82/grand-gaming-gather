
import { Calendar, Users, Trophy, Zap } from "lucide-react";
import { Link } from "react-router-dom";

interface Tournament {
  id: number;
  name: string;
  game: string;
  date: string;
  time: string;
  entryFee: number;
  prizePool: number;
  participants: number;
  maxParticipants: number;
  status: string;
}

interface TournamentCardProps {
  tournament: Tournament;
}

const TournamentCard = ({ tournament }: TournamentCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming": return "text-green-400 bg-green-400/20 border-green-400/30";
      case "filling": return "text-yellow-400 bg-yellow-400/20 border-yellow-400/30";
      case "live": return "text-red-400 bg-red-400/20 border-red-400/30";
      default: return "text-gray-400 bg-gray-400/20 border-gray-400/30";
    }
  };

  const participationPercentage = (tournament.participants / tournament.maxParticipants) * 100;

  return (
    <div className="group relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-6 backdrop-blur-sm border border-purple-500/20 hover:border-purple-400/60 transition-all duration-500 transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/20 overflow-hidden">
      {/* Animated background glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-pink-600/5 to-purple-600/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
      
      {/* Status Badge */}
      <div className="relative flex items-center justify-between mb-4">
        <span className={`px-3 py-1 rounded-full text-sm font-bold border backdrop-blur-sm ${getStatusColor(tournament.status)}`}>
          {tournament.status === "live" && <Zap className="w-3 h-3 inline mr-1 animate-pulse" />}
          {tournament.status.charAt(0).toUpperCase() + tournament.status.slice(1)}
        </span>
        <span className="text-gray-400 text-sm font-medium bg-slate-700/50 px-3 py-1 rounded-full border border-slate-600/50">
          {tournament.game}
        </span>
      </div>

      {/* Tournament Name */}
      <h3 className="text-xl font-black text-white mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 transition-all duration-300">
        {tournament.name}
      </h3>

      {/* Date & Time */}
      <div className="flex items-center space-x-2 text-gray-400 mb-4 group-hover:text-gray-300 transition-colors duration-300">
        <Calendar className="w-4 h-4 text-purple-400" />
        <span className="font-medium">{tournament.date} at {tournament.time}</span>
      </div>

      {/* Participants */}
      <div className="flex items-center space-x-2 text-gray-400 mb-4 group-hover:text-gray-300 transition-colors duration-300">
        <Users className="w-4 h-4 text-pink-400" />
        <span className="font-medium">
          <span className="text-white font-bold">{tournament.participants}</span>
          /{tournament.maxParticipants} players
        </span>
      </div>

      {/* Progress Bar */}
      <div className="relative w-full bg-slate-700/50 rounded-full h-3 mb-6 overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 rounded-full transition-all duration-1000 relative overflow-hidden"
          style={{ width: `${participationPercentage}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      {/* Prize Pool & Entry Fee */}
      <div className="flex justify-between items-center mb-6">
        <div className="text-center">
          <div className="text-sm text-gray-400 mb-1">Prize Pool</div>
          <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400 flex items-center">
            <Trophy className="w-5 h-5 text-green-400 mr-1" />
            ${tournament.prizePool.toLocaleString()}
          </div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-400 mb-1">Entry Fee</div>
          <div className="text-2xl font-black text-white">
            ${tournament.entryFee}
          </div>
        </div>
      </div>

      {/* Join Button */}
      <Link
        to={`/join/${tournament.id}`}
        className="relative w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-bold text-center block hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 overflow-hidden group/button"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover/button:translate-x-[100%] transition-transform duration-700"></div>
        <span className="relative flex items-center justify-center gap-2">
          <Trophy className="w-5 h-5" />
          JOIN BATTLE
          <Zap className="w-4 h-4 animate-pulse" />
        </span>
      </Link>
    </div>
  );
};

export default TournamentCard;
