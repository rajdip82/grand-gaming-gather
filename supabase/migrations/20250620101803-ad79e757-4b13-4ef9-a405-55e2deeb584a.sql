
-- Add country column to profiles table to track user countries
ALTER TABLE public.profiles 
ADD COLUMN country TEXT;

-- Create a view to show earnings by country
CREATE OR REPLACE VIEW public.earnings_by_country AS
SELECT 
    p.country,
    COUNT(DISTINCT w.user_id) as total_users,
    COALESCE(SUM(CASE WHEN t.transaction_type = 'credit' THEN t.amount ELSE 0 END), 0) as total_earnings,
    COALESCE(SUM(CASE WHEN t.transaction_type = 'debit' THEN t.amount ELSE 0 END), 0) as total_withdrawals,
    COALESCE(SUM(w.balance), 0) as current_balance
FROM public.profiles p
LEFT JOIN public.wallets w ON w.user_id = p.id
LEFT JOIN public.transactions t ON t.wallet_id = w.id AND t.status = 'completed'
WHERE p.country IS NOT NULL
GROUP BY p.country
ORDER BY total_earnings DESC;
