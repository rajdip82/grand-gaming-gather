
import WalletStatsCards from "./components/WalletStatsCards";
import WithdrawalRequestsTable from "./components/WithdrawalRequestsTable";
import { useWithdrawalRequests } from "./hooks/useWithdrawalRequests";

const AdminWallets = () => {
  const { withdrawalRequests, loading, handleUpdateStatus } = useWithdrawalRequests();

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
      <WalletStatsCards withdrawalRequests={withdrawalRequests} />

      {/* Withdrawal Requests Table */}
      <WithdrawalRequestsTable 
        withdrawalRequests={withdrawalRequests} 
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  );
};

export default AdminWallets;
