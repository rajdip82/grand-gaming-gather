
import { Link } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { Calendar, Users, Trophy, DollarSign } from "lucide-react";

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
  const { user } = useUser();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "live": return "bg-red-500";
      case "filling": return "bg-yellow-500";
      default: return "bg-green-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "live": return "LIVE";
      case "filling": return "FILLING FAST";
      default: return "UPCOMING";
    }
  };

  const handleJoinClick = (e: React.MouseEvent) => {
    if (!user) {
      e.preventDefault();
      alert("Please sign in to join tournaments!");
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-lg p-6 backdrop-blur-sm border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 transform hover:scale-105">
      {/* Status Badge */}
      <div className="flex justify-between items-start mb-4">
        <span className={`${getStatusColor(tournament.status)} text-white text-xs font-bold px-3 py-1 rounded-full`}>
          {getStatusText(tournament.status)}
        </span>
        <div className="text-right">
          <div className="text-green-400 font-bold text-lg">${tournament.prizePool}</div>
          <div className="text-gray-400 text-sm">Prize Pool</div>
        </div>
      </div>

      {/* Tournament Info */}
      <h3 className="text-xl font-bold text-white mb-2">{tournament.name}</h3>
      <p className="text-purple-400 mb-4">{tournament.game}</p>

      {/* Details Grid */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center text-gray-300">
          <Calendar className="w-4 h-4 mr-2 text-purple-400" />
          <span className="text-sm">{tournament.date} at {tournament.time}</span>
        </div>
        
        <div className="flex items-center text-gray-300">
          <Users className="w-4 h-4 mr-2 text-purple-400" />
          <span className="text-sm">{tournament.participants}/{tournament.maxParticipants} players</span>
        </div>

        <div className="flex items-center text-gray-300">
          <DollarSign className="w-4 h-4 mr-2 text-purple-400" />
          <span className="text-sm">Entry Fee: ${tournament.entryFee}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
        <div 
          className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full"
          style={{ width: `${(tournament.participants / tournament.maxParticipants) * 100}%` }}
        ></div>
      </div>

      {/* Action Button */}
      <div className="flex space-x-2">
        {user ? (
          <Link
            to={`/join/${tournament.id}`}
            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-center py-2 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
          >
            Join Tournament
          </Link>
        ) : (
          <button
            onClick={handleJoinClick}
            className="flex-1 bg-gradient-to-r from-gray-600 to-gray-700 text-white text-center py-2 rounded-lg font-medium hover:from-gray-700 hover:to-gray-800 transition-all duration-300 cursor-pointer"
          >
            Sign In to Join
          </button>
        )}
        
        <button className="px-4 py-2 border border-purple-500/50 text-purple-400 rounded-lg hover:bg-purple-500/10 transition-colors">
          <Trophy className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default TournamentCard;
