
-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  is_first_user BOOLEAN;
  v_company_name TEXT;
BEGIN
  -- Check if this is the first user to make them Admin
  SELECT NOT EXISTS (SELECT 1 FROM public.profiles) INTO is_first_user;

  -- Extract company_name from metadata safely
  v_company_name := new.raw_user_meta_data ->> 'company_name';

  INSERT INTO public.profiles (id, role, plan, status, company_name)
  VALUES (
    new.id, 
    CASE WHEN is_first_user THEN 'admin'::public.app_role ELSE 'user'::public.app_role END,
    NULL, -- No plan yet
    NULL, -- No status yet
    v_company_name
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger the function on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();