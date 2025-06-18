
import React from 'react';
import SectionBadge from '../SectionBadge';
import AnimatedCounter from '../AnimatedCounter';

const StatsSection: React.FC = () => {
  return (
    <section className="py-20 px-4 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <SectionBadge
            icon="📊"
            text="Live Statistics"
            gradientColors="from-green-600/20 to-emerald-600/20"
            borderColor="border-green-500/30"
            textColor="text-green-300"
          />
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
  );
};

export default StatsSection;
