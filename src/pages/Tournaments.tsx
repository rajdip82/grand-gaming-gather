
import { useState } from "react";
import { Search } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import TournamentCard from "../components/TournamentCard";

const Tournaments = () => {
  const [selectedGame, setSelectedGame] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const tournaments = [
    {
      id: 1,
      name: "PUBG Mobile Championship",
      game: "PUBG Mobile",
      date: "2025-06-15",
      time: "18:00",
      entryFee: 50,
      prizePool: 10000,
      participants: 45,
      maxParticipants: 100,
      status: "upcoming"
    },
    {
      id: 2,
      name: "Free Fire World Cup",
      game: "Free Fire",
      date: "2025-06-20",
      time: "20:00",
      entryFee: 30,
      prizePool: 5000,
      participants: 78,
      maxParticipants: 80,
      status: "filling"
    },
    {
      id: 3,
      name: "Clash of Clans War League",
      game: "Clash of Clans",
      date: "2025-06-18",
      time: "16:00",
      entryFee: 25,
      prizePool: 3000,
      participants: 32,
      maxParticipants: 50,
      status: "upcoming"
    },
    {
      id: 4,
      name: "Ludo King Masters",
      game: "Ludo King",
      date: "2025-06-12",
      time: "19:00",
      entryFee: 15,
      prizePool: 1500,
      participants: 24,
      maxParticipants: 30,
      status: "live"
    },
    {
      id: 5,
      name: "Call of Duty Elite",
      game: "Call of Duty",
      date: "2025-06-25",
      time: "21:00",
      entryFee: 75,
      prizePool: 15000,
      participants: 12,
      maxParticipants: 64,
      status: "upcoming"
    }
  ];

  const games = ["All", "PUBG Mobile", "Free Fire", "Clash of Clans", "Ludo King", "Call of Duty"];

  const filteredTournaments = tournaments.filter(tournament => {
    const matchesGame = selectedGame === "All" || tournament.game === selectedGame;
    const matchesSearch = tournament.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tournament.game.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesGame && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header />
      
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                All Tournaments
              </span>
            </h1>
            <p className="text-gray-400 text-lg">Find and join tournaments for your favorite games</p>
          </div>

          {/* Filters */}
          <div className="mb-8 space-y-4">
            {/* Search */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search tournaments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-purple-500/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-colors"
              />
            </div>

            {/* Game Filter */}
            <div className="flex flex-wrap justify-center gap-3">
              {games.map((game) => (
                <button
                  key={game}
                  onClick={() => setSelectedGame(game)}
                  className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 ${
                    selectedGame === game
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                      : "bg-slate-800/50 text-gray-300 hover:text-white hover:bg-slate-700"
                  }`}
                >
                  {game}
                </button>
              ))}
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-gray-400">
              Showing {filteredTournaments.length} tournament{filteredTournaments.length !== 1 ? 's' : ''}
              {selectedGame !== "All" && ` for ${selectedGame}`}
            </p>
          </div>

          {/* Tournament Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTournaments.map((tournament) => (
              <TournamentCard key={tournament.id} tournament={tournament} />
            ))}
          </div>

          {/* No Results */}
          {filteredTournaments.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎮</div>
              <h3 className="text-2xl font-bold text-white mb-2">No tournaments found</h3>
              <p className="text-gray-400">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Tournaments;
