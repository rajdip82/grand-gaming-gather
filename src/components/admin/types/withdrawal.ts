
export interface WithdrawalRequest {
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
