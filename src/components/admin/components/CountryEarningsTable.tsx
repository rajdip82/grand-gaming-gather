
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface CountryEarning {
  country: string;
  total_users: number;
  total_earnings: number;
  total_withdrawals: number;
  current_balance: number;
}

const CountryEarningsTable = () => {
  const [earnings, setEarnings] = useState<CountryEarning[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCountryEarnings();
  }, []);

  const fetchCountryEarnings = async () => {
    try {
      const { data, error } = await supabase
        .from('earnings_by_country')
        .select('*');

      if (error) {
        console.error('Error fetching country earnings:', error);
        return;
      }

      setEarnings(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-slate-800/50 rounded-lg p-6 backdrop-blur-sm border border-purple-500/20">
        <div className="text-white">Loading country earnings...</div>
      </div>
    );
  }

  if (earnings.length === 0) {
    return (
      <div className="bg-slate-800/50 rounded-lg p-6 backdrop-blur-sm border border-purple-500/20">
        <h3 className="text-xl font-semibold text-white mb-4">Country-wise Earnings</h3>
        <div className="text-gray-300">No country data available yet.</div>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="bg-slate-800/50 rounded-lg p-6 backdrop-blur-sm border border-purple-500/20">
      <h3 className="text-xl font-semibold text-white mb-6">Country-wise Earnings</h3>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-purple-500/20">
              <TableHead className="text-gray-300">Country</TableHead>
              <TableHead className="text-gray-300">Total Users</TableHead>
              <TableHead className="text-gray-300">Total Earnings</TableHead>
              <TableHead className="text-gray-300">Total Withdrawals</TableHead>
              <TableHead className="text-gray-300">Current Balance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {earnings.map((earning) => (
              <TableRow key={earning.country} className="border-purple-500/20 hover:bg-slate-700/30">
                <TableCell className="text-white font-medium">
                  {earning.country}
                </TableCell>
                <TableCell className="text-gray-300">
                  {earning.total_users}
                </TableCell>
                <TableCell className="text-green-400 font-medium">
                  {formatCurrency(earning.total_earnings)}
                </TableCell>
                <TableCell className="text-red-400 font-medium">
                  {formatCurrency(earning.total_withdrawals)}
                </TableCell>
                <TableCell className="text-blue-400 font-medium">
                  {formatCurrency(earning.current_balance)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CountryEarningsTable;
