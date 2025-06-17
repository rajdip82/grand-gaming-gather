
import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Wallet as WalletIcon, Plus, Minus, History, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface WalletData {
  id: string;
  balance: number;
  created_at: string;
}

interface Transaction {
  id: string;
  transaction_type: string;
  amount: number;
  category: string;
  status: string;
  description: string;
  created_at: string;
}

const Wallet = () => {
  const { user } = useUser();
  const { toast } = useToast();
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (user) {
      fetchWalletData();
      fetchTransactions();
    }
  }, [user]);

  const fetchWalletData = async () => {
    try {
      const { data, error } = await supabase
        .from('wallets')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error) throw error;
      setWallet(data);
    } catch (error) {
      console.error('Error fetching wallet:', error);
      toast({
        title: "Error",
        description: "Failed to load wallet data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const handleDeposit = async () => {
    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid deposit amount",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      const { error } = await supabase
        .from('transactions')
        .insert({
          user_id: user?.id,
          wallet_id: wallet?.id,
          transaction_type: 'credit',
          amount: parseFloat(depositAmount),
          category: 'deposit',
          status: 'completed',
          description: `Deposit of $${depositAmount}`,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Deposit successful!",
      });

      setDepositAmount("");
      fetchWalletData();
      fetchTransactions();
    } catch (error) {
      console.error('Error processing deposit:', error);
      toast({
        title: "Error",
        description: "Failed to process deposit",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid withdrawal amount",
        variant: "destructive",
      });
      return;
    }

    if (parseFloat(withdrawAmount) > (wallet?.balance || 0)) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough balance for this withdrawal",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      const { error } = await supabase
        .from('withdrawal_requests')
        .insert({
          user_id: user?.id,
          wallet_id: wallet?.id,
          amount: parseFloat(withdrawAmount),
          status: 'pending',
          bank_details: { note: 'Manual withdrawal request' }
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Withdrawal request submitted for admin approval",
      });

      setWithdrawAmount("");
    } catch (error) {
      console.error('Error processing withdrawal:', error);
      toast({
        title: "Error",
        description: "Failed to process withdrawal request",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Header />
        <div className="pt-24 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl font-bold text-white mb-4">Access Denied</h1>
            <p className="text-gray-300">Please sign in to access your wallet.</p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Header />
        <div className="pt-24 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-400 mx-auto"></div>
            <p className="text-white mt-4">Loading wallet...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header />
      
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center">
              <WalletIcon className="w-8 h-8 mr-3 text-purple-400" />
              My Wallet
            </h1>
            <p className="text-gray-300">Manage your tournament funds and transactions</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Wallet Balance */}
            <div className="lg:col-span-2">
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-8 backdrop-blur-sm border border-purple-500/20 mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">Wallet Balance</h2>
                <div className="text-5xl font-bold text-green-400 mb-4">
                  ${wallet?.balance?.toFixed(2) || '0.00'}
                </div>
                <p className="text-gray-400">Available for tournaments and withdrawals</p>
              </div>

              {/* Transaction History */}
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-8 backdrop-blur-sm border border-purple-500/20">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                  <History className="w-5 h-5 mr-2 text-purple-400" />
                  Recent Transactions
                </h3>
                
                <div className="space-y-4">
                  {transactions.length > 0 ? (
                    transactions.map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between p-4 rounded-lg bg-slate-700/30 border border-slate-600/30"
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${
                            transaction.transaction_type === 'credit' 
                              ? 'bg-green-500/20 text-green-400' 
                              : 'bg-red-500/20 text-red-400'
                          }`}>
                            {transaction.transaction_type === 'credit' ? <Plus className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
                          </div>
                          <div>
                            <p className="text-white font-medium">{transaction.description}</p>
                            <p className="text-gray-400 text-sm">
                              {new Date(transaction.created_at).toLocaleDateString()} • {transaction.status}
                            </p>
                          </div>
                        </div>
                        <div className={`font-bold ${
                          transaction.transaction_type === 'credit' ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {transaction.transaction_type === 'credit' ? '+' : '-'}${transaction.amount.toFixed(2)}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 text-center py-8">No transactions yet</p>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-6">
              {/* Deposit */}
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-6 backdrop-blur-sm border border-purple-500/20">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <Plus className="w-5 h-5 mr-2 text-green-400" />
                  Add Funds
                </h3>
                <div className="space-y-4">
                  <input
                    type="number"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full px-4 py-3 bg-slate-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-colors"
                  />
                  <button
                    onClick={handleDeposit}
                    disabled={isProcessing}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isProcessing ? "Processing..." : "Add Funds"}
                  </button>
                </div>
              </div>

              {/* Withdraw */}
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-6 backdrop-blur-sm border border-purple-500/20">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <Minus className="w-5 h-5 mr-2 text-red-400" />
                  Withdraw Funds
                </h3>
                <div className="space-y-4">
                  <input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder="Enter amount"
                    max={wallet?.balance || 0}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-colors"
                  />
                  <p className="text-gray-400 text-sm">
                    Max: ${wallet?.balance?.toFixed(2) || '0.00'}
                  </p>
                  <button
                    onClick={handleWithdraw}
                    disabled={isProcessing}
                    className="w-full bg-gradient-to-r from-red-600 to-orange-600 text-white py-3 rounded-lg font-semibold hover:from-red-700 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isProcessing ? "Processing..." : "Request Withdrawal"}
                  </button>
                  <p className="text-gray-400 text-xs">
                    Withdrawals require admin approval and may take 1-3 business days.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Wallet;
