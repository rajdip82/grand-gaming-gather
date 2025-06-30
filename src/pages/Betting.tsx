
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "../components/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import BettingCard from "../components/betting/BettingCard";
import BettingHistory from "../components/betting/BettingHistory";
import { supabase } from "@/integrations/supabase/client";

interface Match {
  id: string;
  team_a: string;
  team_b: string;
  team_a_logo?: string;
  team_b_logo?: string;
  match_time: string;
  status: string;
  winner?: string;
  betting_odds?: {
    id: string;
    team_a_odds: number;
    team_b_odds: number;
    draw_odds?: number;
    is_active: boolean;
  };
}

const Betting = () => {
  const [activeTab, setActiveTab] = useState("matches");

  const { data: matches, isLoading } = useQuery({
    queryKey: ['betting-matches'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('matches')
        .select(`
          *,
          betting_odds (*)
        `)
        .order('match_time', { ascending: true });
      
      if (error) throw error;
      
      // Transform the data to match our interface
      return data.map(match => ({
        ...match,
        betting_odds: match.betting_odds?.[0] || undefined
      })) as Match[];
    },
  });

  const upcomingMatches = matches?.filter(match => match.status === 'upcoming') || [];
  const liveMatches = matches?.filter(match => match.status === 'live') || [];
  const completedMatches = matches?.filter(match => match.status === 'completed') || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header />
      <div className="pt-24 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Sports Betting</h1>
            <p className="text-gray-300">Place bets on your favorite matches and win big!</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-slate-800/50 border border-purple-500/20">
              <TabsTrigger value="matches" className="text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600">
                Upcoming
              </TabsTrigger>
              <TabsTrigger value="live" className="text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600">
                Live
              </TabsTrigger>
              <TabsTrigger value="completed" className="text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600">
                Completed
              </TabsTrigger>
              <TabsTrigger value="history" className="text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600">
                My Bets
              </TabsTrigger>
            </TabsList>

            <TabsContent value="matches" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                  <div className="col-span-full text-center text-white py-12">
                    Loading matches...
                  </div>
                ) : upcomingMatches.length === 0 ? (
                  <div className="col-span-full text-center text-gray-400 py-12">
                    <h3 className="text-xl font-semibold mb-2">No Upcoming Matches</h3>
                    <p>Check back later for new betting opportunities!</p>
                  </div>
                ) : (
                  upcomingMatches.map((match) => (
                    <BettingCard key={match.id} match={match} />
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="live" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {liveMatches.length === 0 ? (
                  <div className="col-span-full text-center text-gray-400 py-12">
                    <h3 className="text-xl font-semibold mb-2">No Live Matches</h3>
                    <p>No matches are currently live</p>
                  </div>
                ) : (
                  liveMatches.map((match) => (
                    <BettingCard key={match.id} match={match} />
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="completed" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {completedMatches.length === 0 ? (
                  <div className="col-span-full text-center text-gray-400 py-12">
                    <h3 className="text-xl font-semibold mb-2">No Completed Matches</h3>
                    <p>No matches have been completed yet</p>
                  </div>
                ) : (
                  completedMatches.map((match) => (
                    <BettingCard key={match.id} match={match} />
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="history" className="mt-6">
              <BettingHistory />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Betting;
