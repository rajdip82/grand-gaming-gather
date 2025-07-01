
import { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Match {
  id: string;
  team_a: string;
  team_b: string;
  match_time: string;
}

interface BettingModalProps {
  match: Match;
  selectedBet: { team: string; odds: number; betType?: string };
  onClose: () => void;
}

const BettingModal = ({ match, selectedBet, onClose }: BettingModalProps) => {
  const { user } = useUser();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [betAmount, setBetAmount] = useState("");

  // Fetch user's wallet
  const { data: wallet } = useQuery({
    queryKey: ['wallet', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('wallets')
        .select('*')
        .eq('user_id', user?.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const placeBetMutation = useMutation({
    mutationFn: async ({ amount, betOn, odds, betType }: { amount: number; betOn: string; odds: number; betType?: string }) => {
      if (!wallet) throw new Error('Wallet not found');
      
      // Check if user has sufficient balance
      if (amount > wallet.balance) {
        throw new Error('Insufficient balance');
      }

      // Calculate potential payout for TypeScript compliance
      const potentialPayout = amount * odds;

      // Create the bet with bet type information
      const betDescription = getBetDescription(betType, betOn);
      
      const { data: betData, error: betError } = await supabase
        .from('bets')
        .insert({
          user_id: user!.id,
          match_id: match.id,
          wallet_id: wallet.id,
          bet_on: betOn,
          amount: amount,
          odds: odds,
          potential_payout: potentialPayout
        })
        .select()
        .single();

      if (betError) throw betError;

      // Create a debit transaction to deduct the bet amount
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert({
          user_id: user!.id,
          wallet_id: wallet.id,
          transaction_type: 'debit',
          amount: amount,
          category: 'betting',
          status: 'completed',
          description: `${betDescription} - ${match.team_a} vs ${match.team_b}`
        });

      if (transactionError) throw transactionError;

      return betData;
    },
    onSuccess: () => {
      const betTypeLabel = getBetTypeLabel(selectedBet.betType);
      toast({
        title: "Bet Placed Successfully!",
        description: `Your ${betTypeLabel} bet of $${betAmount} has been placed.`,
      });
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
      queryClient.invalidateQueries({ queryKey: ['user-bets'] });
      queryClient.invalidateQueries({ queryKey: ['live-matches'] });
      onClose();
    },
    onError: (error: Error) => {
      toast({
        title: "Error Placing Bet",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const getBetDescription = (betType?: string, betOn?: string) => {
    if (!betType) return 'Bet placed';
    
    switch (betType) {
      case 'match_winner': return 'Match winner bet';
      case 'first_kill': return 'First kill bet';
      case 'first_tower': return 'First tower bet';
      case 'most_kills': return 'Most kills bet';
      case 'mvp_player': return 'MVP player bet';
      default: return 'Bet placed';
    }
  };

  const getBetTypeLabel = (betType?: string) => {
    if (!betType) return 'match';
    
    switch (betType) {
      case 'match_winner': return 'match winner';
      case 'first_kill': return 'first kill';
      case 'first_tower': return 'first tower';
      case 'most_kills': return 'most kills';
      case 'mvp_player': return 'MVP player';
      default: return 'match';
    }
  };

  const handlePlaceBet = () => {
    const amount = parseFloat(betAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid bet amount.",
        variant: "destructive",
      });
      return;
    }

    placeBetMutation.mutate({
      amount,
      betOn: selectedBet.team,
      odds: selectedBet.odds,
      betType: selectedBet.betType
    });
  };

  const potentialWin = parseFloat(betAmount) * selectedBet.odds || 0;

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
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="bg-slate-800 border-purple-500/20 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">
            Place Your Bet
          </DialogTitle>
        </DialogHeader>

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

          <div className="space-y-2">
            <Label htmlFor="betAmount">Bet Amount ($)</Label>
            <Input
              id="betAmount"
              type="number"
              placeholder="Enter amount"
              value={betAmount}
              onChange={(e) => setBetAmount(e.target.value)}
              className="bg-slate-700 border-slate-600 text-white"
              min="1"
              step="0.01"
            />
          </div>

          {wallet && (
            <div className="text-sm text-gray-400">
              Available Balance: <span className="text-green-400">${wallet.balance}</span>
            </div>
          )}

          {betAmount && (
            <div className="bg-purple-600/20 p-3 rounded-lg">
              <div className="flex justify-between">
                <span>Potential Win:</span>
                <span className="text-green-400 font-bold">${potentialWin.toFixed(2)}</span>
              </div>
            </div>
          )}

          <div className="flex space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 border-slate-600 text-white hover:bg-slate-700"
            >
              Cancel
            </Button>
            <Button
              onClick={handlePlaceBet}
              disabled={placeBetMutation.isPending || !betAmount}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {placeBetMutation.isPending ? "Placing Bet..." : "Place Bet"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BettingModal;
