
import { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Calendar, Users, Gamepad } from "lucide-react";

const Dashboard = () => {
  const [registrations, setRegistrations] = useState([]);
  const [stats, setStats] = useState({
    totalTournaments: 0,
    upcomingTournaments: 0,
    totalWins: 0,
    totalEarnings: 0
  });

  useEffect(() => {
    // Load registrations from localStorage
    const savedRegistrations = JSON.parse(localStorage.getItem("registrations") || "[]");
    setRegistrations(savedRegistrations);

    // Calculate stats (mock data for demo)
    setStats({
      totalTournaments: savedRegistrations.length,
      upcomingTournaments: savedRegistrations.length,
      totalWins: Math.floor(savedRegistrations.length * 0.3), // 30% win rate for demo
      totalEarnings: savedRegistrations.length * 150 // Average earnings per tournament
    });
  }, []);

  const handleCancelRegistration = (index) => {
    if (confirm("Are you sure you want to cancel this registration?")) {
      const updatedRegistrations = registrations.filter((_, i) => i !== index);
      setRegistrations(updatedRegistrations);
      localStorage.setItem("registrations", JSON.stringify(updatedRegistrations));
      
      // Update stats
      setStats(prev => ({
        ...prev,
        totalTournaments: updatedRegistrations.length,
        upcomingTournaments: updatedRegistrations.length
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header />
      
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Dashboard
              </span>
            </h1>
            <p className="text-gray-400">Manage your tournaments and track your performance</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-lg p-6 backdrop-blur-sm border border-purple-500/20">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{stats.totalTournaments}</div>
                  <div className="text-gray-400 text-sm">Total Tournaments</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-lg p-6 backdrop-blur-sm border border-purple-500/20">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{stats.upcomingTournaments}</div>
                  <div className="text-gray-400 text-sm">Upcoming</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-lg p-6 backdrop-blur-sm border border-purple-500/20">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-green-600/20 rounded-lg flex items-center justify-center">
                  <Gamepad className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{stats.totalWins}</div>
                  <div className="text-gray-400 text-sm">Total Wins</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-lg p-6 backdrop-blur-sm border border-purple-500/20">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-yellow-600/20 rounded-lg flex items-center justify-center">
                  <span className="text-yellow-400 font-bold">$</span>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">${stats.totalEarnings}</div>
                  <div className="text-gray-400 text-sm">Total Earnings</div>
                </div>
              </div>
            </div>
          </div>

          {/* Registered Tournaments */}
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-lg p-8 backdrop-blur-sm border border-purple-500/20">
            <h2 className="text-2xl font-bold text-white mb-6">Your Tournaments</h2>

            {registrations.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🎮</div>
                <h3 className="text-xl font-bold text-white mb-2">No tournaments yet</h3>
                <p className="text-gray-400 mb-6">Join your first tournament to get started!</p>
                <a 
                  href="/tournaments"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
                >
                  Browse Tournaments
                </a>
              </div>
            ) : (
              <div className="space-y-4">
                {registrations.map((registration, index) => (
                  <div key={index} className="bg-slate-700/30 rounded-lg p-6 border border-slate-600/30">
                    <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-2">{registration.tournamentName}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-gray-400">Username: </span>
                            <span className="text-white">{registration.username}</span>
                          </div>
                          <div>
                            <span className="text-gray-400">Game ID: </span>
                            <span className="text-white">{registration.gameId}</span>
                          </div>
                          <div>
                            <span className="text-gray-400">Registered: </span>
                            <span className="text-white">
                              {new Date(registration.registeredAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        {registration.teamName && (
                          <div className="mt-2">
                            <span className="text-gray-400">Team: </span>
                            <span className="text-purple-400">{registration.teamName}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex space-x-3">
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                          View Details
                        </button>
                        <button 
                          onClick={() => handleCancelRegistration(index)}
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;
