
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { WithdrawalRequest } from "../types/withdrawal";

export const useWithdrawalRequests = () => {
  const [withdrawalRequests, setWithdrawalRequests] = useState<WithdrawalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchWithdrawalRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('withdrawal_requests')
        .select(`
          *,
          profiles(full_name, email)
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
      const transformedData: WithdrawalRequest[] = data?.map(item => ({
        id: item.id,
        amount: item.amount,
        status: item.status,
        requested_at: item.requested_at,
        processed_at: item.processed_at,
        bank_details: item.bank_details,
        admin_notes: item.admin_notes,
        user_id: item.user_id,
        profiles: item.profiles && typeof item.profiles === 'object' && !Array.isArray(item.profiles)
          ? {
              full_name: (item.profiles as any).full_name || 'Unknown User',
              email: (item.profiles as any).email || 'No email'
            }
          : null
      })) || [];

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

  return {
    withdrawalRequests,
    loading,
    handleUpdateStatus,
    refetch: fetchWithdrawalRequests
  };
};
