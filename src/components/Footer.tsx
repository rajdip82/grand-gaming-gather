
const Footer = () => {
  return (
    <footer className="bg-slate-900 border-t border-purple-500/20 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white">Battle Arena</h3>
            <p className="text-gray-400">
              The ultimate gaming tournament platform for competitive players worldwide.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="/tournaments" className="text-gray-400 hover:text-purple-400 transition-colors">Tournaments</a></li>
              <li><a href="/leaderboard" className="text-gray-400 hover:text-purple-400 transition-colors">Leaderboard</a></li>
              <li><a href="/create" className="text-gray-400 hover:text-purple-400 transition-colors">Create Tournament</a></li>
              <li><a href="/dashboard" className="text-gray-400 hover:text-purple-400 transition-colors">Dashboard</a></li>
            </ul>
          </div>

          {/* Games */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Supported Games</h4>
            <ul className="space-y-2">
              <li><span className="text-gray-400">PUBG Mobile</span></li>
              <li><span className="text-gray-400">Free Fire</span></li>
              <li><span className="text-gray-400">Clash of Clans</span></li>
              <li><span className="text-gray-400">Ludo King</span></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Contact</h4>
            <ul className="space-y-2">
              <li><span className="text-gray-400">support@battlearena.com</span></li>
              <li><span className="text-gray-400">+1 (555) 123-4567</span></li>
              <li><span className="text-gray-400">Follow @BattleArena</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-purple-500/20 text-center">
          <p className="text-gray-400">
            © 2025 Battle Arena. All rights reserved. Built for gamers, by gamers.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
