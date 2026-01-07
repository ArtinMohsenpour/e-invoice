-- ==========================================
-- 1. CUSTOM TYPES (Enums)
-- ==========================================
DO $$ BEGIN
    CREATE TYPE public.app_role AS ENUM ('admin', 'user');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.subscription_plan AS ENUM ('free', 'basic', 'pro', 'ultimate');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.subscription_status AS ENUM ('trialing', 'active', 'past_due', 'canceled', 'unpaid');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ==========================================
-- 2. TABLES
-- ==========================================

-- PROFILES (The Identity Mirror)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  company_name TEXT,
  vat_id TEXT,             -- Mandatory for ZUGFeRD: e.g. DE123456789
  tax_number TEXT,         -- Steuernummer
  address_line_1 TEXT,
  city TEXT,
  zip_code TEXT,
  country TEXT DEFAULT 'DE',
  iban TEXT,
  bic TEXT,
  
  -- Logic & Access 
  role public.app_role DEFAULT 'user',
  
  -- Plan can be NULL if they haven't subscribed yet
  plan public.subscription_plan DEFAULT NULL, 
  status public.subscription_status DEFAULT NULL,
  
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- INVOICES (The Header)
CREATE TABLE IF NOT EXISTS public.invoices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  invoice_number TEXT NOT NULL,
  issue_date DATE DEFAULT CURRENT_DATE,
  due_date DATE,
  currency TEXT DEFAULT 'EUR',
  
  -- Totals
  total_net NUMERIC(12, 2) DEFAULT 0.00,
  total_vat NUMERIC(12, 2) DEFAULT 0.00,
  total_gross NUMERIC(12, 2) DEFAULT 0.00,
  
  -- Metadata for ZUGFeRD specific fields
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- INVOICE ITEMS (The Lines)
CREATE TABLE IF NOT EXISTS public.invoice_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_id UUID REFERENCES public.invoices(id) ON DELETE CASCADE NOT NULL,
  description TEXT NOT NULL,
  quantity NUMERIC(12, 3) DEFAULT 1.000,
  unit_price NUMERIC(12, 2) NOT NULL,
  vat_rate NUMERIC(5, 2) DEFAULT 19.00,
  line_total NUMERIC(12, 2) NOT NULL
);

-- ==========================================
-- 3. SECURITY (RLS)
-- ==========================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;

-- HELPER FUNCTIONS
CREATE OR REPLACE FUNCTION public.is_admin() 
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- PROFILE POLICIES
CREATE POLICY "Profiles are viewable by self or admin" 
ON public.profiles FOR SELECT USING (
  auth.uid() = id OR is_admin()
);

CREATE POLICY "Profiles are updatable by self or admin" 
ON public.profiles FOR UPDATE USING (
  auth.uid() = id OR is_admin()
);

-- INVOICE POLICIES
CREATE POLICY "Invoices are viewable by owner or admin" 
ON public.invoices FOR SELECT USING (
  auth.uid() = user_id OR is_admin()
);

CREATE POLICY "Invoices can be created by owner" 
ON public.invoices FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Invoices can be updated by owner or admin" 
ON public.invoices FOR UPDATE USING (
  auth.uid() = user_id OR is_admin()
);

CREATE POLICY "Invoices can be deleted by owner or admin" 
ON public.invoices FOR DELETE USING (
  auth.uid() = user_id OR is_admin()
);

-- ITEM POLICIES
CREATE POLICY "Items are viewable by invoice owner or admin" 
ON public.invoice_items FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.invoices 
    WHERE public.invoices.id = public.invoice_items.invoice_id 
    AND (public.invoices.user_id = auth.uid() OR is_admin())
  )
);

CREATE POLICY "Items can be inserted by invoice owner" 
ON public.invoice_items FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.invoices 
    WHERE public.invoices.id = public.invoice_items.invoice_id 
    AND public.invoices.user_id = auth.uid()
  )
);

CREATE POLICY "Items can be updated by invoice owner or admin" 
ON public.invoice_items FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.invoices 
    WHERE public.invoices.id = public.invoice_items.invoice_id 
    AND (public.invoices.user_id = auth.uid() OR is_admin())
  )
);

CREATE POLICY "Items can be deleted by invoice owner or admin" 
ON public.invoice_items FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM public.invoices 
    WHERE public.invoices.id = public.invoice_items.invoice_id 
    AND (public.invoices.user_id = auth.uid() OR is_admin())
  )
);

-- ==========================================
-- 4. AUTOMATION (Triggers)
-- ==========================================

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  is_first_user BOOLEAN;
BEGIN
  -- Check if this is the first user to make them Admin
  SELECT NOT EXISTS (SELECT 1 FROM public.profiles) INTO is_first_user;

  INSERT INTO public.profiles (id, role, plan, status)
  VALUES (
    new.id, 
    CASE WHEN is_first_user THEN 'admin'::public.app_role ELSE 'user'::public.app_role END,
    NULL, -- No plan yet
    NULL  -- No status yet
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger the function on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();