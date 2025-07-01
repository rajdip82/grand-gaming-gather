
interface BetSummaryProps {
  betAmount: string;
  odds: number;
}

const BetSummary = ({ betAmount, odds }: BetSummaryProps) => {
  const potentialWin = parseFloat(betAmount) * odds || 0;

  if (!betAmount) return null;

  return (
    <div className="bg-purple-600/20 p-3 rounded-lg">
      <div className="flex justify-between">
        <span>Potential Win:</span>
        <span className="text-green-400 font-bold">${potentialWin.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default BetSummary;
