
import React from 'react';
import { Users, Gamepad } from 'lucide-react';
import SectionBadge from '../SectionBadge';
import AnimatedCounter from '../AnimatedCounter';

const GamingDetailsSection: React.FC = () => {
  return (
    <section className="py-20 px-4 relative">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <SectionBadge
            icon="🌐"
            text="Esport Community"
            gradientColors="from-yellow-400/20 to-pink-400/20"
            borderColor="border-yellow-300/30"
            textColor="text-yellow-300"
          />
          <h2 className="text-5xl font-black text-white mb-6 bg-gradient-to-r from-white via-yellow-200 to-white bg-clip-text text-transparent">
            GAMING DETAILS & COMMUNITY
          </h2>
          <p className="text-gray-400 text-xl max-w-2xl mx-auto">
            Join a vibrant <span className="text-yellow-400">esports community</span> – from rookies to pros, share tips, squad up, and celebrate epic wins. Track your journey, connect with fellow players, and grow your legend!
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/70 p-8 rounded-2xl border border-purple-500/20 shadow-md flex flex-col justify-center mb-10 md:mb-0">
            <h3 className="text-2xl font-bold text-purple-300 mb-4 flex items-center gap-2">
              <Users className="w-7 h-7 text-pink-400" />
              Connected Gamers
            </h3>
            <p className="text-gray-300 mb-6">Find friends, chat in real time, and join group tournaments. Our community forums and Discord integration keep players informed, engaged, and hyped for every event!</p>
            <div className="flex gap-10">
              <div>
                <div className="text-4xl font-black text-pink-400 mb-2"><AnimatedCounter end={56000} suffix="+" /></div>
                <div className="text-gray-400 text-sm">Active Members</div>
              </div>
              <div>
                <div className="text-4xl font-black text-cyan-400 mb-2"><AnimatedCounter end={110} /></div>
                <div className="text-gray-400 text-sm">Community Clans</div>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/70 p-8 rounded-2xl border border-purple-500/20 shadow-md flex flex-col justify-center">
            <h3 className="text-2xl font-bold text-purple-300 mb-4 flex items-center gap-2">
              <Gamepad className="w-7 h-7 text-blue-400" />
              Why Join Proxycorn?
            </h3>
            <ul className="list-disc ml-6 text-gray-300 space-y-3">
              <li>Track your win/loss stats and progress in real time.</li>
              <li>Participate in custom leagues and special esports events.</li>
              <li>Earn badges, ranks, and exclusive community rewards.</li>
              <li>24/7 support and guidance from admins & community leaders.</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-purple-800/10 via-pink-800/10 to-purple-800/10 pointer-events-none"></div>
    </section>
  );
};

export default GamingDetailsSection;
