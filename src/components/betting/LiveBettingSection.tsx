
import { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { supabase } from "@/integrations/supabase/client";
import BettingModal from "./BettingModal";

interface LiveMatch {
  id: string;
  team_a: string;
  team_b: string;
  team_a_logo?: string;
  team_b_logo?: string;
  match_time: string;
  status: string;
  betting_odds?: {
    id: string;
    team_a_odds: number;
    team_b_odds: number;
    draw_odds?: number;
    is_active: boolean;
  };
}

const LiveBettingSection = () => {
  const { user } = useUser();
  const [showBettingModal, setShowBettingModal] = useState(false);
  const [selectedBet, setSelectedBet] = useState<{ team: string; odds: number; betType: string } | null>(null);
  const [selectedMatch, setSelectedMatch] = useState<LiveMatch | null>(null);

  const { data: liveMatches, isLoading } = useQuery({
    queryKey: ['live-matches'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('matches')
        .select(`
          *,
          betting_odds (*)
        `)
        .eq('status', 'live')
        .order('match_time', { ascending: true });
      
      if (error) throw error;
      
      return data.map(match => ({
        ...match,
        betting_odds: match.betting_odds?.[0] || undefined
      })) as LiveMatch[];
    },
    refetchInterval: 5000, // Refresh every 5 seconds for live updates
  });

  const handleBetClick = (match: LiveMatch, betType: string, team: string, odds: number) => {
    if (!user) {
      alert("Please sign in to place bets!");
      return;
    }
    setSelectedMatch(match);
    setSelectedBet({ team, odds, betType });
    setShowBettingModal(true);
  };

  const getBettingOptions = (match: LiveMatch) => {
    if (!match.betting_odds?.is_active) return [];

    const baseOdds = match.betting_odds;
    return [
      // Match Outcome Betting
      {
        category: "Match Outcome",
        options: [
          { label: `${match.team_a} Win`, value: 'team_a', odds: baseOdds.team_a_odds, type: 'match_winner' },
          { label: `${match.team_b} Win`, value: 'team_b', odds: baseOdds.team_b_odds, type: 'match_winner' },
          ...(baseOdds.draw_odds ? [{ label: 'Draw', value: 'draw', odds: baseOdds.draw_odds, type: 'match_winner' }] : [])
        ]
      },
      // Team Performance Betting
      {
        category: "Team Performance",
        options: [
          { label: `${match.team_a} First Kill`, value: 'team_a', odds: baseOdds.team_a_odds + 0.5, type: 'first_kill' },
          { label: `${match.team_b} First Kill`, value: 'team_b', odds: baseOdds.team_b_odds + 0.5, type: 'first_kill' },
          { label: `${match.team_a} First Tower`, value: 'team_a', odds: baseOdds.team_a_odds + 0.3, type: 'first_tower' },
          { label: `${match.team_b} First Tower`, value: 'team_b', odds: baseOdds.team_b_odds + 0.3, type: 'first_tower' }
        ]
      },
      // Player Betting
      {
        category: "Player Stats",
        options: [
          { label: 'Most Kills Player A', value: 'team_a', odds: 2.5, type: 'most_kills' },
          { label: 'Most Kills Player B', value: 'team_b', odds: 2.5, type: 'most_kills' },
          { label: 'MVP Player A', value: 'team_a', odds: 2.2, type: 'mvp_player' },
          { label: 'MVP Player B', value: 'team_b', odds: 2.2, type: 'mvp_player' }
        ]
      }
    ];
  };

  if (isLoading) {
    return (
      <div className="text-center text-white py-8">
        <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p>Loading live matches...</p>
      </div>
    );
  }

  if (!liveMatches || liveMatches.length === 0) {
    return (
      <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white text-center">
            🔴 Live Betting Section
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-400 py-8">
            <p>No live matches available for betting</p>
            <p className="text-sm mt-2">Check back when matches are live!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="mb-8">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-white mb-2">
            🔴 Live Betting Section
          </h2>
          <div className="flex items-center justify-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-red-400 font-medium">LIVE NOW</span>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
          {liveMatches.map((match) => (
            <Card key={match.id} className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-red-500/30 hover:border-red-400/50 transition-all duration-300">
              <CardHeader>
                <div className="flex justify-between items-start mb-4">
                  <Badge className="bg-red-500 text-white animate-pulse">
                    🔴 LIVE
                  </Badge>
                </div>
                
                <CardTitle className="text-white text-center">
                  <div className="flex items-center justify-center space-x-4">
                    <div className="text-center">
                      {match.team_a_logo && (
                        <img src={match.team_a_logo} alt={match.team_a} className="w-12 h-12 mx-auto mb-2 rounded" />
                      )}
                      <div className="font-bold text-white">{match.team_a}</div>
                    </div>
                    
                    <div className="text-red-400 font-bold text-2xl">VS</div>
                    
                    <div className="text-center">
                      {match.team_b_logo && (
                        <img src={match.team_b_logo} alt={match.team_b} className="w-12 h-12 mx-auto mb-2 rounded" />
                      )}
                      <div className="font-bold text-white">{match.team_b}</div>
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>

              <CardContent>
                {match.betting_odds?.is_active && (
                  <div className="space-y-4">
                    {getBettingOptions(match).map((category) => (
                      <div key={category.category}>
                        <h4 className="text-purple-400 font-semibold mb-2 text-sm">
                          {category.category}
                        </h4>
                        <div className="grid grid-cols-2 gap-2">
                          {category.options.map((option) => (
                            <Button
                              key={`${option.type}-${option.value}`}
                              onClick={() => handleBetClick(match, option.type, option.value, option.odds)}
                              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-2 text-xs"
                              size="sm"
                            >
                              <div className="text-center">
                                <div className="font-medium truncate">{option.label}</div>
                                <div className="text-sm font-bold">{option.odds}x</div>
                              </div>
                            </Button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {!match.betting_odds?.is_active && (
                  <div className="text-center text-gray-400 py-4">
                    <p>Betting temporarily suspended</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {showBettingModal && selectedBet && selectedMatch && (
        <BettingModal
          match={selectedMatch}
          selectedBet={selectedBet}
          onClose={() => {
            setShowBettingModal(false);
            setSelectedBet(null);
            setSelectedMatch(null);
          }}
        />
      )}
    </>
  );
};

export default LiveBettingSection;
