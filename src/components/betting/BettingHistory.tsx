
import { useQuery } from "@tanstack/react-query";
import { useUser } from "@clerk/clerk-react";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { supabase } from "@/integrations/supabase/client";

interface Bet {
  id: string;
  bet_on: string;
  amount: number;
  odds: number;
  potential_payout: number;
  payout_amount: number;
  status: string;
  created_at: string;
  matches: {
    team_a: string;
    team_b: string;
    status: string;
    winner?: string;
  };
}

const BettingHistory = () => {
  const { user } = useUser();

  const { data: bets, isLoading } = useQuery({
    queryKey: ['user-bets', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bets')
        .select(`
          *,
          matches (
            team_a,
            team_b,
            status,
            winner
          )
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Bet[];
    },
    enabled: !!user?.id,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "won": return "bg-green-500";
      case "lost": return "bg-red-500";
      case "pending": return "bg-yellow-500";
      case "cancelled": return "bg-gray-500";
      default: return "bg-gray-500";
    }
  };

  const getBetOnDisplay = (betOn: string, match: any) => {
    switch (betOn) {
      case 'team_a': return match.matches.team_a;
      case 'team_b': return match.matches.team_b;
      case 'draw': return 'Draw';
      default: return betOn;
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-purple-500/20">
        <CardContent className="p-8">
          <div className="text-center text-white">Loading betting history...</div>
        </CardContent>
      </Card>
    );
  }

  if (!bets || bets.length === 0) {
    return (
      <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white">Betting History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-400 py-8">
            <p>No bets placed yet</p>
            <p className="text-sm mt-2">Start betting on upcoming matches to see your history here!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-purple-500/20">
      <CardHeader>
        <CardTitle className="text-white">Betting History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-700">
                <TableHead className="text-gray-300">Match</TableHead>
                <TableHead className="text-gray-300">Bet On</TableHead>
                <TableHead className="text-gray-300">Amount</TableHead>
                <TableHead className="text-gray-300">Odds</TableHead>
                <TableHead className="text-gray-300">Potential Win</TableHead>
                <TableHead className="text-gray-300">Status</TableHead>
                <TableHead className="text-gray-300">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bets.map((bet) => (
                <TableRow key={bet.id} className="border-slate-700">
                  <TableCell className="text-white">
                    {bet.matches.team_a} vs {bet.matches.team_b}
                  </TableCell>
                  <TableCell className="text-purple-400 font-medium">
                    {getBetOnDisplay(bet.bet_on, bet)}
                  </TableCell>
                  <TableCell className="text-white">${bet.amount}</TableCell>
                  <TableCell className="text-green-400">{bet.odds}x</TableCell>
                  <TableCell className="text-white">${bet.potential_payout}</TableCell>
                  <TableCell>
                    <Badge className={`${getStatusColor(bet.status)} text-white`}>
                      {bet.status.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-400">
                    {new Date(bet.created_at).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default BettingHistory;
