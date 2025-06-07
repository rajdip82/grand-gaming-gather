
import { Calendar, Users } from "lucide-react";
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
      case "upcoming": return "text-green-400 bg-green-400/20";
      case "filling": return "text-yellow-400 bg-yellow-400/20";
      case "live": return "text-red-400 bg-red-400/20";
      default: return "text-gray-400 bg-gray-400/20";
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-lg p-6 backdrop-blur-sm border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 transform hover:scale-105">
      {/* Status Badge */}
      <div className="flex items-center justify-between mb-4">
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(tournament.status)}`}>
          {tournament.status.charAt(0).toUpperCase() + tournament.status.slice(1)}
        </span>
        <span className="text-gray-400 text-sm">{tournament.game}</span>
      </div>

      {/* Tournament Name */}
      <h3 className="text-xl font-bold text-white mb-3">{tournament.name}</h3>

      {/* Date & Time */}
      <div className="flex items-center space-x-2 text-gray-400 mb-3">
        <Calendar className="w-4 h-4" />
        <span>{tournament.date} at {tournament.time}</span>
      </div>

      {/* Participants */}
      <div className="flex items-center space-x-2 text-gray-400 mb-4">
        <Users className="w-4 h-4" />
        <span>{tournament.participants}/{tournament.maxParticipants} players</span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
        <div 
          className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full"
          style={{ width: `${(tournament.participants / tournament.maxParticipants) * 100}%` }}
        ></div>
      </div>

      {/* Prize Pool & Entry Fee */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <div className="text-sm text-gray-400">Prize Pool</div>
          <div className="text-lg font-bold text-green-400">${tournament.prizePool}</div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-400">Entry Fee</div>
          <div className="text-lg font-bold text-white">${tournament.entryFee}</div>
        </div>
      </div>

      {/* Join Button */}
      <Link
        to={`/join/${tournament.id}`}
        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold text-center block hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
      >
        Join Tournament
      </Link>
    </div>
  );
};

export default TournamentCard;
