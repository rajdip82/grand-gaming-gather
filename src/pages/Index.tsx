
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Gamepad, Users, Calendar, Plus, Trophy, Zap, Target } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import TournamentCard from "../components/TournamentCard";
import GameCard from "../components/GameCard";
import ParticleBackground from "../components/ParticleBackground";
import AnimatedCounter from "../components/AnimatedCounter";

const Index = () => {
  const [isLoaded, setIsLoaded] = useState(false);
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

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      <ParticleBackground />
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/30 via-pink-600/20 to-blue-600/30 animate-pulse"></div>
          <div className="absolute top-20 left-10 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl animate-bounce"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-pink-500/20 rounded-full blur-3xl animate-bounce delay-1000"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto text-center">
          <div className="mb-6 space-y-4">
            <div className={`transform transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <span className="inline-block px-6 py-2 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-full text-purple-300 text-sm font-medium backdrop-blur-sm">
                🏆 Welcome to the Ultimate Gaming Arena
              </span>
            </div>
            
            <h1 className={`text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 transform transition-all duration-1000 delay-300 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <span className="block leading-tight">BATTLE</span>
              <span className="block leading-tight bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent animate-pulse">ARENA</span>
            </h1>
          </div>
          
          <p className={`text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed transform transition-all duration-1000 delay-500 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            Enter the <span className="text-purple-400 font-semibold">ultimate gaming tournaments</span>. 
            Compete with <span className="text-pink-400 font-semibold">elite players worldwide</span> and 
            claim <span className="text-cyan-400 font-semibold">legendary rewards</span>!
          </p>
          
          <div className={`flex flex-col sm:flex-row gap-6 justify-center items-center transform transition-all duration-1000 delay-700 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <Link 
              to="/tournaments"
              className="group relative bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-white px-10 py-5 rounded-xl font-bold text-lg overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-700 via-pink-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
              <span className="relative flex items-center gap-3">
                <Trophy className="w-6 h-6" />
                JOIN TOURNAMENTS
                <Zap className="w-5 h-5 animate-pulse" />
              </span>
            </Link>
            
            <Link 
              to="/create"
              className="group relative bg-transparent border-2 border-purple-500 text-purple-400 px-10 py-5 rounded-xl font-bold text-lg overflow-hidden transition-all duration-300 transform hover:scale-105 hover:bg-purple-500 hover:text-white hover:shadow-xl hover:shadow-purple-500/30"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-purple-600/50 to-purple-600/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500"></div>
              <span className="relative flex items-center gap-3">
                <Plus className="w-6 h-6" />
                CREATE TOURNAMENT
                <Target className="w-5 h-5" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Tournaments */}
      <section className="py-20 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-full text-purple-300 text-sm font-medium backdrop-blur-sm mb-6">
              🔥 Live Competitions
            </div>
            <h2 className="text-5xl font-black text-white mb-6 bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
              FEATURED TOURNAMENTS
            </h2>
            <p className="text-gray-400 text-xl max-w-2xl mx-auto">
              Don't miss these <span className="text-purple-400">epic battles</span> happening right now
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredTournaments.map((tournament, index) => (
              <div 
                key={tournament.id}
                className={`transform transition-all duration-700 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <TournamentCard tournament={tournament} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Supported Games */}
      <section className="py-20 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-800/30 via-purple-800/20 to-slate-800/30"></div>
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-blue-500/30 rounded-full text-blue-300 text-sm font-medium backdrop-blur-sm mb-6">
              🎮 Gaming Universe
            </div>
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

      {/* Stats Section */}
      <section className="py-20 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/30 rounded-full text-green-300 text-sm font-medium backdrop-blur-sm mb-6">
              📊 Live Statistics
            </div>
            <h2 className="text-5xl font-black text-white mb-6 bg-gradient-to-r from-white via-green-200 to-white bg-clip-text text-transparent">
              BY THE NUMBERS
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="group bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-2xl p-8 text-center backdrop-blur-sm border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-purple-500/20">
              <div className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-3">
                <AnimatedCounter end={50000} suffix="K+" />
              </div>
              <div className="text-gray-300 font-medium">Active Players</div>
              <div className="w-full h-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div className="group bg-gradient-to-br from-green-600/20 to-emerald-600/20 rounded-2xl p-8 text-center backdrop-blur-sm border border-green-500/20 hover:border-green-400/40 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-green-500/20">
              <div className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400 mb-3">
                <AnimatedCounter end={1.2} suffix="M" decimals={1} />
              </div>
              <div className="text-gray-300 font-medium">Prize Pool</div>
              <div className="w-full h-1 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div className="group bg-gradient-to-br from-blue-600/20 to-cyan-600/20 rounded-2xl p-8 text-center backdrop-blur-sm border border-blue-500/20 hover:border-blue-400/40 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-blue-500/20">
              <div className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mb-3">
                <AnimatedCounter end={500} suffix="+" />
              </div>
              <div className="text-gray-300 font-medium">Tournaments</div>
              <div className="w-full h-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div className="group bg-gradient-to-br from-orange-600/20 to-red-600/20 rounded-2xl p-8 text-center backdrop-blur-sm border border-orange-500/20 hover:border-orange-400/40 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-orange-500/20">
              <div className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400 mb-3">
                <AnimatedCounter end={15} />
              </div>
              <div className="text-gray-300 font-medium">Games</div>
              <div className="w-full h-1 bg-gradient-to-r from-orange-600 to-red-600 rounded-full mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
