
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Check, X, Eye, DollarSign, Users, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface WithdrawalRequest {
  id: string;
  user_id: string;
  amount: number;
  status: string;
  requested_at: string;
  admin_notes: string;
  profiles: {
    full_name: string;
    email: string;
  };
}

interface WalletStats {
  totalBalance: number;
  totalUsers: number;
  pendingWithdrawals: number;
  totalWithdrawals: number;
}

const AdminWallets = () => {
  const { toast } = useToast();
  const [withdrawalRequests, setWithdrawalRequests] = useState<WithdrawalRequest[]>([]);
  const [stats, setStats] = useState<WalletStats>({
    totalBalance: 0,
    totalUsers: 0,
    pendingWithdrawals: 0,
    totalWithdrawals: 0
  });
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    fetchWithdrawalRequests();
    fetchWalletStats();
  }, []);

  const fetchWithdrawalRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('withdrawal_requests')
        .select(`
          *,
          profiles!withdrawal_requests_user_id_fkey (
            full_name,
            email
          )
        `)
        .order('requested_at', { ascending: false });

      if (error) throw error;
      setWithdrawalRequests(data || []);
    } catch (error) {
      console.error('Error fetching withdrawal requests:', error);
      toast({
        title: "Error",
        description: "Failed to load withdrawal requests",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchWalletStats = async () => {
    try {
      // Get total balance from all wallets
      const { data: wallets, error: walletsError } = await supabase
        .from('wallets')
        .select('balance');

      if (walletsError) throw walletsError;

      // Get total users with wallets
      const { count: userCount, error: userError } = await supabase
        .from('wallets')
        .select('*', { count: 'exact', head: true });

      if (userError) throw userError;

      // Get pending withdrawals
      const { data: pendingData, error: pendingError } = await supabase
        .from('withdrawal_requests')
        .select('amount')
        .eq('status', 'pending');

      if (pendingError) throw pendingError;

      // Get total withdrawals processed
      const { data: processedData, error: processedError } = await supabase
        .from('withdrawal_requests')
        .select('amount')
        .eq('status', 'processed');

      if (processedError) throw processedError;

      const totalBalance = wallets?.reduce((sum, wallet) => sum + parseFloat(wallet.balance), 0) || 0;
      const pendingWithdrawals = pendingData?.reduce((sum, req) => sum + parseFloat(req.amount), 0) || 0;
      const totalWithdrawals = processedData?.reduce((sum, req) => sum + parseFloat(req.amount), 0) || 0;

      setStats({
        totalBalance,
        totalUsers: userCount || 0,
        pendingWithdrawals,
        totalWithdrawals
      });
    } catch (error) {
      console.error('Error fetching wallet stats:', error);
    }
  };

  const handleWithdrawalAction = async (requestId: string, action: 'approve' | 'reject', notes: string = '') => {
    setProcessingId(requestId);
    try {
      const newStatus = action === 'approve' ? 'approved' : 'rejected';
      
      const { error } = await supabase
        .from('withdrawal_requests')
        .update({
          status: newStatus,
          admin_notes: notes,
          processed_at: new Date().toISOString()
        })
        .eq('id', requestId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Withdrawal request ${action}d successfully`,
      });

      fetchWithdrawalRequests();
      fetchWalletStats();
    } catch (error) {
      console.error(`Error ${action}ing withdrawal:`, error);
      toast({
        title: "Error",
        description: `Failed to ${action} withdrawal request`,
        variant: "destructive",
      });
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-400 bg-yellow-400/20';
      case 'approved': return 'text-green-400 bg-green-400/20';
      case 'rejected': return 'text-red-400 bg-red-400/20';
      case 'processed': return 'text-blue-400 bg-blue-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-6 backdrop-blur-sm border border-purple-500/20">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">${stats.totalBalance.toFixed(2)}</h3>
          <p className="text-gray-400 text-sm">Total Wallet Balance</p>
        </div>

        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-6 backdrop-blur-sm border border-purple-500/20">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">{stats.totalUsers}</h3>
          <p className="text-gray-400 text-sm">Active Wallets</p>
        </div>

        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-6 backdrop-blur-sm border border-purple-500/20">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-yellow-600 to-orange-600">
              <Clock className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">${stats.pendingWithdrawals.toFixed(2)}</h3>
          <p className="text-gray-400 text-sm">Pending Withdrawals</p>
        </div>

        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-6 backdrop-blur-sm border border-purple-500/20">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">${stats.totalWithdrawals.toFixed(2)}</h3>
          <p className="text-gray-400 text-sm">Total Processed</p>
        </div>
      </div>

      {/* Withdrawal Requests */}
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-8 backdrop-blur-sm border border-purple-500/20">
        <h3 className="text-xl font-bold text-white mb-6">Withdrawal Requests</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-600/30">
                <th className="text-left py-3 px-4 text-gray-400 font-medium">User</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Amount</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Requested</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {withdrawalRequests.length > 0 ? (
                withdrawalRequests.map((request) => (
                  <tr key={request.id} className="border-b border-slate-700/30">
                    <td className="py-4 px-4">
                      <div>
                        <p className="text-white font-medium">{request.profiles?.full_name || 'Unknown'}</p>
                        <p className="text-gray-400 text-sm">{request.profiles?.email}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-white font-bold">${request.amount.toFixed(2)}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-gray-400">
                        {new Date(request.requested_at).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      {request.status === 'pending' && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleWithdrawalAction(request.id, 'approve')}
                            disabled={processingId === request.id}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors disabled:opacity-50"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleWithdrawalAction(request.id, 'reject')}
                            disabled={processingId === request.id}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors disabled:opacity-50"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 px-4 text-center text-gray-400">
                    No withdrawal requests found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminWallets;
