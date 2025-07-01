
import { useQuery } from "@tanstack/react-query";
import { useUser } from "@clerk/clerk-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ParticleBackground from "../components/ParticleBackground";
import BettingCard from "../components/betting/BettingCard";
import BettingHistory from "../components/betting/BettingHistory";
import LiveBettingSection from "../components/betting/LiveBettingSection";
import { supabase } from "@/integrations/supabase/client";

interface BettingOdds {
  id: string;
  team_a_odds: number;
  team_b_odds: number;
  draw_odds?: number;
  is_active: boolean;
}

interface Match {
  id: string;
  team_a: string;
  team_b: string;
  team_a_logo?: string;
  team_b_logo?: string;
  match_time: string;
  status: string;
  winner?: string;
  betting_odds?: BettingOdds;
}

const Betting = () => {
  const { user, isSignedIn } = useUser();

  const { data: upcomingMatches, isLoading } = useQuery({
    queryKey: ['betting-matches'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('matches')
        .select(`
          *,
          betting_odds (*)
        `)
        .in('status', ['upcoming', 'completed'])
        .order('match_time', { ascending: true });
      
      if (error) throw error;
      
      // Transform the data to match our interface
      return data.map(match => ({
        ...match,
        betting_odds: match.betting_odds?.[0] || undefined
      })) as Match[];
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      <ParticleBackground />
      <Header />
      
      <main className="pt-20 pb-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Live Betting Section */}
          <LiveBettingSection />

          {/* Upcoming Matches Section */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">
              Upcoming Matches
            </h2>
            
            {isLoading ? (
              <div className="text-center text-white py-8">
                <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p>Loading matches...</p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {upcomingMatches?.filter(match => match.status === 'upcoming').map((match) => (
                  <BettingCard key={match.id} match={match} />
                ))}
              </div>
            )}
          </div>

          {/* Completed Matches Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              Recent Results
            </h2>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {upcomingMatches?.filter(match => match.status === 'completed').slice(0, 6).map((match) => (
                <BettingCard key={match.id} match={match} />
              ))}
            </div>
          </div>

          {/* Betting History Section */}
          {isSignedIn && (
            <div className="mb-8">
              <BettingHistory />
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Betting;
