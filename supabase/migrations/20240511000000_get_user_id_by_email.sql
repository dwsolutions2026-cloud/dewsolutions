-- Create helper function to lookup auth.users ID by email securely
CREATE OR REPLACE FUNCTION public.get_user_id_by_email(email_search text)
RETURNS uuid AS $$
  SELECT id FROM auth.users WHERE LOWER(email) = LOWER(email_search) LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER;
