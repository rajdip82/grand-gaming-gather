
import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ParticleBackground from "../components/ParticleBackground";
import HeroSection from "../components/sections/HeroSection";
import GamingDetailsSection from "../components/sections/GamingDetailsSection";
import SupportedGamesSection from "../components/sections/SupportedGamesSection";
import StatsSection from "../components/sections/StatsSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      <ParticleBackground />
      <Header />
      
      <HeroSection />
      <GamingDetailsSection />
      <SupportedGamesSection />
      <StatsSection />

      <Footer />
    </div>
  );
};

export default Index;
