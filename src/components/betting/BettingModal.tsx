
import { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
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
  selectedBet: { team: string; odds: number };
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
    mutationFn: async ({ amount, betOn, odds }: { amount: number; betOn: string; odds: number }) => {
      if (!wallet) throw new Error('Wallet not found');
      
      // Check if user has sufficient balance
      if (amount > wallet.balance) {
        throw new Error('Insufficient balance');
      }

      // Create the bet
      const { data: betData, error: betError } = await supabase
        .from('bets')
        .insert({
          user_id: user!.id,
          match_id: match.id,
          wallet_id: wallet.id,
          bet_on: betOn,
          amount: amount,
          odds: odds
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
          description: `Bet placed on ${match.team_a} vs ${match.team_b}`
        });

      if (transactionError) throw transactionError;

      return betData;
    },
    onSuccess: () => {
      toast({
        title: "Bet Placed Successfully!",
        description: `Your bet of $${betAmount} has been placed.`,
      });
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
      queryClient.invalidateQueries({ queryKey: ['user-bets'] });
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
      odds: selectedBet.odds
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
            <div className="flex justify-between items-center">
              <span>Betting on: <span className="text-purple-400 font-bold">{getTeamName(selectedBet.team)}</span></span>
              <span>Odds: <span className="text-green-400 font-bold">{selectedBet.odds}x</span></span>
            </div>
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
