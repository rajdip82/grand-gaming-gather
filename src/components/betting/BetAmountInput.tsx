
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface Wallet {
  balance: number;
}

interface BetAmountInputProps {
  betAmount: string;
  setBetAmount: (amount: string) => void;
  wallet?: Wallet;
}

const BetAmountInput = ({ betAmount, setBetAmount, wallet }: BetAmountInputProps) => {
  return (
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
      {wallet && (
        <div className="text-sm text-gray-400">
          Available Balance: <span className="text-green-400">${wallet.balance}</span>
        </div>
      )}
    </div>
  );
};

export default BetAmountInput;
