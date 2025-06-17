
import { Wallet, Eye, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WithdrawalRequest } from "../types/withdrawal";

interface WithdrawalRequestsTableProps {
  withdrawalRequests: WithdrawalRequest[];
  onUpdateStatus: (id: string, status: string, adminNotes?: string) => void;
}

const WithdrawalRequestsTable = ({ withdrawalRequests, onUpdateStatus }: WithdrawalRequestsTableProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "text-yellow-400 bg-yellow-400/20";
      case "approved": return "text-green-400 bg-green-400/20";
      case "rejected": return "text-red-400 bg-red-400/20";
      case "processed": return "text-blue-400 bg-blue-400/20";
      default: return "text-gray-400 bg-gray-400/20";
    }
  };

  return (
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
                            onClick={() => onUpdateStatus(request.id, 'approved')}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => onUpdateStatus(request.id, 'rejected', 'Rejected by admin')}
                            className="bg-red-600 hover:bg-red-700 text-white"
                          >
                            <XCircle className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                      {request.status === 'approved' && (
                        <Button
                          size="sm"
                          onClick={() => onUpdateStatus(request.id, 'processed')}
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
  );
};

export default WithdrawalRequestsTable;
