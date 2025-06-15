
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Gamepad, Users, Calendar, User, List } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: "Home", path: "/", icon: <Gamepad className="w-4 h-4" /> },
    { name: "Tournaments", path: "/tournaments", icon: <Calendar className="w-4 h-4" /> },
    { name: "Create", path: "/create", icon: <Users className="w-4 h-4" /> },
    { name: "Leaderboard", path: "/leaderboard", icon: <List className="w-4 h-4" /> },
    { name: "Dashboard", path: "/dashboard", icon: <User className="w-4 h-4" /> },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-purple-500/20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
              <Gamepad className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">proxycorn</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-all duration-300 ${
                  location.pathname === item.path
                    ? "bg-purple-600/20 text-purple-400"
                    : "text-gray-300 hover:text-white hover:bg-slate-800"
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-purple-500/20">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all duration-300 ${
                  location.pathname === item.path
                    ? "bg-purple-600/20 text-purple-400"
                    : "text-gray-300 hover:text-white hover:bg-slate-800"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

