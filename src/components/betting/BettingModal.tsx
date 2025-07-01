
import { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import BetSelectionDisplay from "./BetSelectionDisplay";
import BetAmountInput from "./BetAmountInput";
import BetSummary from "./BetSummary";

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

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="bg-slate-800 border-purple-500/20 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">
            Place Your Bet
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <BetSelectionDisplay match={match} selectedBet={selectedBet} />
          
          <BetAmountInput 
            betAmount={betAmount}
            setBetAmount={setBetAmount}
            wallet={wallet}
          />

          <BetSummary betAmount={betAmount} odds={selectedBet.odds} />

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
