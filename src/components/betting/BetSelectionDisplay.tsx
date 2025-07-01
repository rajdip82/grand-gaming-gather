
import { Badge } from "../ui/badge";

interface Match {
  id: string;
  team_a: string;
  team_b: string;
  match_time: string;
}

interface BetSelectionDisplayProps {
  match: Match;
  selectedBet: { team: string; odds: number; betType?: string };
}

const BetSelectionDisplay = ({ match, selectedBet }: BetSelectionDisplayProps) => {
  const getTeamName = (team: string) => {
    switch (team) {
      case 'team_a': return match.team_a;
      case 'team_b': return match.team_b;
      case 'draw': return 'Draw';
      default: return team;
    }
  };

  const getBetDisplayName = () => {
    const betType = selectedBet.betType;
    const team = getTeamName(selectedBet.team);
    
    if (!betType || betType === 'match_winner') {
      return team;
    }
    
    switch (betType) {
      case 'first_kill': return `${team} First Kill`;
      case 'first_tower': return `${team} First Tower`;
      case 'most_kills': return `Most Kills ${team}`;
      case 'mvp_player': return `MVP ${team}`;
      default: return team;
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-slate-700/50 p-4 rounded-lg">
        <h3 className="font-semibold mb-2">Match Details</h3>
        <p className="text-gray-300">{match.team_a} vs {match.team_b}</p>
        <p className="text-sm text-gray-400">{new Date(match.match_time).toLocaleString()}</p>
      </div>

      <div className="bg-slate-700/50 p-4 rounded-lg">
        <h3 className="font-semibold mb-2">Bet Selection</h3>
        <div className="flex justify-between items-center flex-wrap gap-2">
          <div className="flex items-center space-x-2">
            <span>Betting on:</span>
            <Badge variant="outline" className="text-purple-400 border-purple-400">
              {getBetDisplayName()}
            </Badge>
          </div>
          <span>Odds: <span className="text-green-400 font-bold">{selectedBet.odds}x</span></span>
        </div>
        {selectedBet.betType && selectedBet.betType !== 'match_winner' && (
          <div className="mt-2">
            <Badge className="bg-red-500/20 text-red-400 border-red-400">
              Live Betting
            </Badge>
          </div>
        )}
      </div>
    </div>
  );
};

export default BetSelectionDisplay;
