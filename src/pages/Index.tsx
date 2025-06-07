
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Gamepad, Users, Calendar, Plus } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import TournamentCard from "../components/TournamentCard";
import GameCard from "../components/GameCard";

const Index = () => {
  const [featuredTournaments, setFeaturedTournaments] = useState([
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
    }
  ]);

  const supportedGames = [
    { name: "PUBG Mobile", icon: "🎯", players: "1.2M+" },
    { name: "Free Fire", icon: "🔥", players: "800K+" },
    { name: "Clash of Clans", icon: "⚔️", players: "500K+" },
    { name: "Ludo King", icon: "🎲", players: "300K+" },
    { name: "Call of Duty", icon: "🎮", players: "400K+" },
    { name: "Among Us", icon: "🚀", players: "200K+" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 px-4">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20"></div>
        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in">
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Battle Arena
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Join the ultimate gaming tournaments. Compete with the best players worldwide and win amazing prizes!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/tournaments"
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <Users className="w-5 h-5 inline mr-2" />
              Join Tournament
            </Link>
            <Link 
              to="/create"
              className="bg-transparent border-2 border-purple-500 text-purple-400 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-purple-500 hover:text-white transition-all duration-300 transform hover:scale-105"
            >
              <Plus className="w-5 h-5 inline mr-2" />
              Create Tournament
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Tournaments */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Featured Tournaments</h2>
            <p className="text-gray-400 text-lg">Don't miss these exciting competitions</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredTournaments.map((tournament) => (
              <TournamentCard key={tournament.id} tournament={tournament} />
            ))}
          </div>
        </div>
      </section>

      {/* Supported Games */}
      <section className="py-16 px-4 bg-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Supported Games</h2>
            <p className="text-gray-400 text-lg">Choose your battleground</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {supportedGames.map((game, index) => (
              <GameCard key={index} game={game} />
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-lg p-6 backdrop-blur-sm border border-purple-500/20">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">50K+</div>
              <div className="text-gray-400">Active Players</div>
            </div>
            <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-lg p-6 backdrop-blur-sm border border-purple-500/20">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">1.2M</div>
              <div className="text-gray-400">Prize Pool</div>
            </div>
            <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-lg p-6 backdrop-blur-sm border border-purple-500/20">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">500+</div>
              <div className="text-gray-400">Tournaments</div>
            </div>
            <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-lg p-6 backdrop-blur-sm border border-purple-500/20">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">15</div>
              <div className="text-gray-400">Games</div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
