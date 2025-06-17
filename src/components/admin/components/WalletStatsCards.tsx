
import { Clock, DollarSign, CheckCircle } from "lucide-react";
import { WithdrawalRequest } from "../types/withdrawal";

interface WalletStatsCardsProps {
  withdrawalRequests: WithdrawalRequest[];
}

const WalletStatsCards = ({ withdrawalRequests }: WalletStatsCardsProps) => {
  const pendingRequests = withdrawalRequests.filter(req => req.status === 'pending');
  const totalPendingAmount = pendingRequests.reduce((sum, req) => sum + Number(req.amount), 0);
  const approvedRequests = withdrawalRequests.filter(req => req.status === 'approved');

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-6 backdrop-blur-sm border border-purple-500/20">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 rounded-lg bg-gradient-to-r from-yellow-600 to-orange-600">
            <Clock className="w-6 h-6 text-white" />
          </div>
        </div>
        <h3 className="text-2xl font-bold text-white mb-1">{pendingRequests.length}</h3>
        <p className="text-gray-400 text-sm">Pending Requests</p>
      </div>

      <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-6 backdrop-blur-sm border border-purple-500/20">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 rounded-lg bg-gradient-to-r from-red-600 to-pink-600">
            <DollarSign className="w-6 h-6 text-white" />
          </div>
        </div>
        <h3 className="text-2xl font-bold text-white mb-1">${totalPendingAmount.toFixed(2)}</h3>
        <p className="text-gray-400 text-sm">Pending Amount</p>
      </div>

      <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-6 backdrop-blur-sm border border-purple-500/20">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600">
            <CheckCircle className="w-6 h-6 text-white" />
          </div>
        </div>
        <h3 className="text-2xl font-bold text-white mb-1">{approvedRequests.length}</h3>
        <p className="text-gray-400 text-sm">Approved This Month</p>
      </div>
    </div>
  );
};

export default WalletStatsCards;
