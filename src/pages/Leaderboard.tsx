
import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Leaderboard = () => {
  const [selectedGame, setSelectedGame] = useState("All");

  const games = ["All", "PUBG Mobile", "Free Fire", "Clash of Clans", "Ludo King", "Call of Duty"];

  const leaderboardData = [
    {
      rank: 1,
      username: "ProGamer99",
      game: "PUBG Mobile",
      wins: 45,
      tournaments: 52,
      earnings: 15420,
      winRate: 86.5
    },
    {
      rank: 2,
      username: "FireQueen",
      game: "Free Fire",
      wins: 38,
      tournaments: 45,
      earnings: 12800,
      winRate: 84.4
    },
    {
      rank: 3,
      username: "ClashMaster",
      game: "Clash of Clans",
      wins: 32,
      tournaments: 40,
      earnings: 9500,
      winRate: 80.0
    },
    {
      rank: 4,
      username: "LudoKing23",
      game: "Ludo King",
      wins: 28,
      tournaments: 35,
      earnings: 7200,
      winRate: 80.0
    },
    {
      rank: 5,
      username: "CoDLegend",
      game: "Call of Duty",
      wins: 25,
      tournaments: 32,
      earnings: 8900,
      winRate: 78.1
    },
    {
      rank: 6,
      username: "MobileWarrior",
      game: "PUBG Mobile",
      wins: 22,
      tournaments: 30,
      earnings: 6800,
      winRate: 73.3
    },
    {
      rank: 7,
      username: "FFChampion",
      game: "Free Fire",
      wins: 20,
      tournaments: 28,
      earnings: 5500,
      winRate: 71.4
    },
    {
      rank: 8,
      username: "StrategyGuru",
      game: "Clash of Clans",
      wins: 18,
      tournaments: 25,
      earnings: 4900,
      winRate: 72.0
    }
  ];

  const filteredData = selectedGame === "All" 
    ? leaderboardData 
    : leaderboardData.filter(player => player.game === selectedGame);

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return "🥇";
      case 2: return "🥈";
      case 3: return "🥉";
      default: return `#${rank}`;
    }
  };

  const getRankColor = (rank) => {
    switch (rank) {
      case 1: return "text-yellow-400";
      case 2: return "text-gray-300";
      case 3: return "text-amber-600";
      default: return "text-gray-400";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header />
      
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Leaderboard
              </span>
            </h1>
            <p className="text-gray-400 text-lg">Top performers across all tournaments</p>
          </div>

          {/* Game Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
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

          {/* Top 3 Podium */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {filteredData.slice(0, 3).map((player, index) => {
              const positions = [1, 0, 2]; // Second, First, Third for visual arrangement
              const actualPlayer = filteredData[positions[index]];
              const heights = ["h-32", "h-40", "h-28"];
              
              return (
                <div key={actualPlayer.username} className={`order-${index + 1} md:order-${positions[index] + 1}`}>
                  <div className={`bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-lg p-6 text-center backdrop-blur-sm border border-purple-500/20 ${heights[index]}`}>
                    <div className={`text-4xl mb-2 ${getRankColor(actualPlayer.rank)}`}>
                      {getRankIcon(actualPlayer.rank)}
                    </div>
                    <h3 className="text-white font-bold text-xl mb-1">{actualPlayer.username}</h3>
                    <p className="text-purple-400 text-sm mb-2">{actualPlayer.game}</p>
                    <p className="text-green-400 font-semibold">${actualPlayer.earnings}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Full Leaderboard Table */}
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-lg backdrop-blur-sm border border-purple-500/20 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-700/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-white font-semibold">Rank</th>
                    <th className="px-6 py-4 text-left text-white font-semibold">Player</th>
                    <th className="px-6 py-4 text-left text-white font-semibold">Game</th>
                    <th className="px-6 py-4 text-center text-white font-semibold">Wins</th>
                    <th className="px-6 py-4 text-center text-white font-semibold">Tournaments</th>
                    <th className="px-6 py-4 text-center text-white font-semibold">Win Rate</th>
                    <th className="px-6 py-4 text-right text-white font-semibold">Earnings</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((player, index) => (
                    <tr key={player.username} className="border-t border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                      <td className="px-6 py-4">
                        <span className={`text-2xl font-bold ${getRankColor(player.rank)}`}>
                          {getRankIcon(player.rank)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-white font-semibold">{player.username}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-purple-400">{player.game}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-white font-medium">{player.wins}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-gray-300">{player.tournaments}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-green-400 font-medium">{player.winRate}%</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-green-400 font-bold">${player.earnings.toLocaleString()}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* No Results */}
          {filteredData.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🏆</div>
              <h3 className="text-2xl font-bold text-white mb-2">No players found</h3>
              <p className="text-gray-400">No leaderboard data available for the selected game</p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Leaderboard;
