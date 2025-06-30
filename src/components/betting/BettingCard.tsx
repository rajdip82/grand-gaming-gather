
import { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { Calendar, Users, Trophy, DollarSign, Timer } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import BettingModal from "./BettingModal";

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

interface BettingCardProps {
  match: Match;
}

const BettingCard = ({ match }: BettingCardProps) => {
  const { user } = useUser();
  const [showBettingModal, setShowBettingModal] = useState(false);
  const [selectedBet, setSelectedBet] = useState<{ team: string; odds: number } | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "live": return "bg-red-500";
      case "upcoming": return "bg-green-500";
      case "completed": return "bg-blue-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "live": return "LIVE";
      case "upcoming": return "UPCOMING";
      case "completed": return "COMPLETED";
      case "cancelled": return "CANCELLED";
      default: return status.toUpperCase();
    }
  };

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString();
  };

  const handleBetClick = (team: string, odds: number) => {
    if (!user) {
      alert("Please sign in to place bets!");
      return;
    }
    if (match.status !== 'upcoming') {
      alert("Betting is only available for upcoming matches!");
      return;
    }
    setSelectedBet({ team, odds });
    setShowBettingModal(true);
  };

  const isWinner = (team: 'team_a' | 'team_b' | 'draw') => {
    return match.winner === team;
  };

  return (
    <>
      <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300">
        <CardHeader>
          <div className="flex justify-between items-start mb-4">
            <Badge className={`${getStatusColor(match.status)} text-white`}>
              {getStatusText(match.status)}
            </Badge>
            {match.status === 'completed' && match.winner && (
              <Badge variant="outline" className="text-green-400 border-green-400">
                Winner: {match.winner === 'team_a' ? match.team_a : match.winner === 'team_b' ? match.team_b : 'Draw'}
              </Badge>
            )}
          </div>
          
          <CardTitle className="text-white text-center">
            <div className="flex items-center justify-center space-x-4">
              <div className="text-center">
                {match.team_a_logo && (
                  <img src={match.team_a_logo} alt={match.team_a} className="w-12 h-12 mx-auto mb-2 rounded" />
                )}
                <div className={`font-bold ${isWinner('team_a') ? 'text-green-400' : 'text-white'}`}>
                  {match.team_a}
                </div>
              </div>
              
              <div className="text-purple-400 font-bold text-2xl">VS</div>
              
              <div className="text-center">
                {match.team_b_logo && (
                  <img src={match.team_b_logo} alt={match.team_b} className="w-12 h-12 mx-auto mb-2 rounded" />
                )}
                <div className={`font-bold ${isWinner('team_b') ? 'text-green-400' : 'text-white'}`}>
                  {match.team_b}
                </div>
              </div>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="flex items-center justify-center text-gray-300 mb-4">
            <Calendar className="w-4 h-4 mr-2 text-purple-400" />
            <span className="text-sm">{formatDateTime(match.match_time)}</span>
          </div>

          {match.betting_odds?.is_active && match.status === 'upcoming' && (
            <div className="space-y-3">
              <h4 className="text-white font-semibold text-center mb-3">Betting Odds</h4>
              
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={() => handleBetClick('team_a', match.betting_odds!.team_a_odds)}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3"
                >
                  <div className="text-center">
                    <div className="font-medium">{match.team_a}</div>
                    <div className="text-lg font-bold">{match.betting_odds.team_a_odds}x</div>
                  </div>
                </Button>
                
                <Button
                  onClick={() => handleBetClick('team_b', match.betting_odds!.team_b_odds)}
                  className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-3"
                >
                  <div className="text-center">
                    <div className="font-medium">{match.team_b}</div>
                    <div className="text-lg font-bold">{match.betting_odds.team_b_odds}x</div>
                  </div>
                </Button>
              </div>

              {match.betting_odds.draw_odds && (
                <Button
                  onClick={() => handleBetClick('draw', match.betting_odds!.draw_odds!)}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-3"
                >
                  <div className="text-center">
                    <div className="font-medium">Draw</div>
                    <div className="text-lg font-bold">{match.betting_odds.draw_odds}x</div>
                  </div>
                </Button>
              )}
            </div>
          )}

          {match.status === 'completed' && (
            <div className="text-center text-gray-400 py-4">
              <Trophy className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
              <p>Match Completed</p>
            </div>
          )}

          {match.status === 'live' && (
            <div className="text-center text-red-400 py-4">
              <Timer className="w-8 h-8 mx-auto mb-2" />
              <p>Match in Progress - Betting Closed</p>
            </div>
          )}
        </CardContent>
      </Card>

      {showBettingModal && selectedBet && (
        <BettingModal
          match={match}
          selectedBet={selectedBet}
          onClose={() => {
            setShowBettingModal(false);
            setSelectedBet(null);
          }}
        />
      )}
    </>
  );
};

export default BettingCard;
