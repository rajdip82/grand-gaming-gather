
import { useState, useEffect } from "react";
import { Wallet, DollarSign, Clock, CheckCircle, XCircle, Eye } from "lucide-react";
import { Button } from "../ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface WithdrawalRequest {
  id: string;
  amount: number;
  status: string;
  requested_at: string;
  processed_at: string | null;
  bank_details: any;
  admin_notes: string | null;
  user_id: string;
  profiles: {
    full_name: string;
    email: string;
  } | null;
}

const AdminWallets = () => {
  const [withdrawalRequests, setWithdrawalRequests] = useState<WithdrawalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchWithdrawalRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('withdrawal_requests')
        .select(`
          *,
          profiles!inner(full_name, email)
        `)
        .order('requested_at', { ascending: false });

      if (error) {
        console.error('Error fetching withdrawal requests:', error);
        toast({
          title: "Error",
          description: "Failed to fetch withdrawal requests",
          variant: "destructive",
        });
        return;
      }

      // Transform the data to match our interface
      const transformedData = data.map(item => ({
        id: item.id,
        amount: item.amount,
        status: item.status,
        requested_at: item.requested_at,
        processed_at: item.processed_at,
        bank_details: item.bank_details,
        admin_notes: item.admin_notes,
        user_id: item.user_id,
        profiles: Array.isArray(item.profiles) && item.profiles.length > 0 
          ? item.profiles[0] 
          : item.profiles
      }));

      setWithdrawalRequests(transformedData);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to fetch withdrawal requests",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: string, adminNotes?: string) => {
    try {
      const { error } = await supabase
        .from('withdrawal_requests')
        .update({
          status,
          admin_notes: adminNotes,
          processed_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) {
        console.error('Error updating withdrawal request:', error);
        toast({
          title: "Error",
          description: "Failed to update withdrawal request",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: `Withdrawal request ${status}`,
      });

      // Refresh the data
      fetchWithdrawalRequests();
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to update withdrawal request",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchWithdrawalRequests();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "text-yellow-400 bg-yellow-400/20";
      case "approved": return "text-green-400 bg-green-400/20";
      case "rejected": return "text-red-400 bg-red-400/20";
      case "processed": return "text-blue-400 bg-blue-400/20";
      default: return "text-gray-400 bg-gray-400/20";
    }
  };

  const pendingRequests = withdrawalRequests.filter(req => req.status === 'pending');
  const totalPendingAmount = pendingRequests.reduce((sum, req) => sum + Number(req.amount), 0);
  const approvedRequests = withdrawalRequests.filter(req => req.status === 'approved');

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-white">Loading withdrawal requests...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Wallet Management</h2>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-6 backdrop-blur-sm border border-purple-500/20">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-yellow-600 to-orange-600">
              <Clock className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">{pendingRequests.length.toString()}</h3>
          <p className="text-gray-400 text-sm">Pending Requests</p>
        </div>

        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-6 backdrop-blur-sm border border-purple-500/20">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-red-600 to-pink-600">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">${totalPendingAmount.toString()}</h3>
          <p className="text-gray-400 text-sm">Pending Amount</p>
        </div>

        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-6 backdrop-blur-sm border border-purple-500/20">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">{approvedRequests.length.toString()}</h3>
          <p className="text-gray-400 text-sm">Approved This Month</p>
        </div>
      </div>

      {/* Withdrawal Requests Table */}
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl backdrop-blur-sm border border-purple-500/20 overflow-hidden">
        <div className="p-6 border-b border-slate-700/50">
          <h3 className="text-xl font-bold text-white flex items-center">
            <Wallet className="w-5 h-5 mr-2 text-purple-400" />
            Withdrawal Requests
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-700/50">
              <tr>
                <th className="text-left text-white font-semibold p-4">User</th>
                <th className="text-left text-white font-semibold p-4">Amount</th>
                <th className="text-left text-white font-semibold p-4">Status</th>
                <th className="text-left text-white font-semibold p-4">Requested</th>
                <th className="text-left text-white font-semibold p-4">Bank Details</th>
                <th className="text-left text-white font-semibold p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {withdrawalRequests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center text-gray-400 py-8">
                    No withdrawal requests found
                  </td>
                </tr>
              ) : (
                withdrawalRequests.map((request) => (
                  <tr key={request.id} className="border-t border-slate-700/50 hover:bg-slate-700/20 transition-colors">
                    <td className="p-4">
                      <div>
                        <p className="text-white font-medium">
                          {request.profiles?.full_name || 'Unknown User'}
                        </p>
                        <p className="text-gray-400 text-sm">
                          {request.profiles?.email || 'No email'}
                        </p>
                      </div>
                    </td>
                    <td className="p-4 text-green-400 font-semibold">
                      ${Number(request.amount).toFixed(2)}
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
                        {request.status}
                      </span>
                    </td>
                    <td className="p-4 text-gray-300">
                      {new Date(request.requested_at).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-slate-600 text-gray-300 hover:text-white"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        {request.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleUpdateStatus(request.id, 'approved')}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleUpdateStatus(request.id, 'rejected', 'Rejected by admin')}
                              className="bg-red-600 hover:bg-red-700 text-white"
                            >
                              <XCircle className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                        {request.status === 'approved' && (
                          <Button
                            size="sm"
                            onClick={() => handleUpdateStatus(request.id, 'processed')}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            Mark Processed
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminWallets;
