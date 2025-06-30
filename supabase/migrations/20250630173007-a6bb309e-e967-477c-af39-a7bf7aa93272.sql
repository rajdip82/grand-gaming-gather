
-- Create matches table for betting
CREATE TABLE public.matches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tournament_id UUID,
  team_a VARCHAR(255) NOT NULL,
  team_b VARCHAR(255) NOT NULL,
  team_a_logo TEXT,
  team_b_logo TEXT,
  match_time TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'live', 'completed', 'cancelled')),
  winner TEXT CHECK (winner IN ('team_a', 'team_b', 'draw')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create betting odds table
CREATE TABLE public.betting_odds (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  match_id UUID REFERENCES public.matches(id) ON DELETE CASCADE NOT NULL,
  team_a_odds DECIMAL(4,2) NOT NULL DEFAULT 2.0,
  team_b_odds DECIMAL(4,2) NOT NULL DEFAULT 2.0,
  draw_odds DECIMAL(4,2) DEFAULT 3.0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create bets table
CREATE TABLE public.bets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  match_id UUID REFERENCES public.matches(id) ON DELETE CASCADE NOT NULL,
  wallet_id UUID REFERENCES public.wallets(id) ON DELETE CASCADE NOT NULL,
  bet_on TEXT NOT NULL CHECK (bet_on IN ('team_a', 'team_b', 'draw')),
  amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
  odds DECIMAL(4,2) NOT NULL,
  potential_payout DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'won', 'lost', 'cancelled')),
  payout_amount DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX idx_matches_status ON public.matches(status);
CREATE INDEX idx_matches_match_time ON public.matches(match_time);
CREATE INDEX idx_bets_user_id ON public.bets(user_id);
CREATE INDEX idx_bets_match_id ON public.bets(match_id);
CREATE INDEX idx_bets_status ON public.bets(status);

-- Enable RLS
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.betting_odds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bets ENABLE ROW LEVEL SECURITY;

-- RLS Policies for matches (readable by all authenticated users)
CREATE POLICY "Anyone can view matches" ON public.matches FOR SELECT TO authenticated USING (true);
CREATE POLICY "Only admins can manage matches" ON public.matches FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
);

-- RLS Policies for betting odds (readable by all authenticated users)
CREATE POLICY "Anyone can view odds" ON public.betting_odds FOR SELECT TO authenticated USING (true);
CREATE POLICY "Only admins can manage odds" ON public.betting_odds FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
);

-- RLS Policies for bets (users can only see their own bets)
CREATE POLICY "Users can view their own bets" ON public.bets FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can create their own bets" ON public.bets FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Admins can view all bets" ON public.bets FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
);
CREATE POLICY "Admins can update all bets" ON public.bets FOR UPDATE TO authenticated USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
);

-- Function to automatically calculate potential payout
CREATE OR REPLACE FUNCTION calculate_potential_payout()
RETURNS TRIGGER AS $$
BEGIN
  NEW.potential_payout = NEW.amount * NEW.odds;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to calculate potential payout
CREATE TRIGGER calculate_payout_trigger
  BEFORE INSERT OR UPDATE ON public.bets
  FOR EACH ROW
  EXECUTE FUNCTION calculate_potential_payout();

-- Function to process bet payouts when match is resolved
CREATE OR REPLACE FUNCTION process_bet_payouts()
RETURNS TRIGGER AS $$
BEGIN
  -- Only process when match status changes to 'completed' and winner is set
  IF NEW.status = 'completed' AND NEW.winner IS NOT NULL AND (OLD.status != 'completed' OR OLD.winner IS NULL) THEN
    -- Update winning bets
    UPDATE public.bets 
    SET 
      status = 'won',
      payout_amount = potential_payout,
      updated_at = now()
    WHERE 
      match_id = NEW.id 
      AND bet_on = NEW.winner 
      AND status = 'pending';
    
    -- Update losing bets
    UPDATE public.bets 
    SET 
      status = 'lost',
      payout_amount = 0,
      updated_at = now()
    WHERE 
      match_id = NEW.id 
      AND bet_on != NEW.winner 
      AND status = 'pending';
    
    -- Credit wallet for winning bets
    INSERT INTO public.transactions (user_id, wallet_id, transaction_type, amount, category, status, description)
    SELECT 
      b.user_id,
      b.wallet_id,
      'credit',
      b.payout_amount,
      'betting_win',
      'completed',
      CONCAT('Betting win for match: ', NEW.team_a, ' vs ', NEW.team_b)
    FROM public.bets b
    WHERE b.match_id = NEW.id AND b.status = 'won' AND b.payout_amount > 0;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to process payouts when match is completed
CREATE TRIGGER process_payouts_trigger
  AFTER UPDATE ON public.matches
  FOR EACH ROW
  EXECUTE FUNCTION process_bet_payouts();
