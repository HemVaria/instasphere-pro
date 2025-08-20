-- Fix user_presence table policies to allow proper updates
-- Drop existing policies
DROP POLICY IF EXISTS "User presence is viewable by everyone" ON user_presence;
DROP POLICY IF EXISTS "Users can update their own presence" ON user_presence;
DROP POLICY IF EXISTS "Users can manage presence" ON user_presence;

-- Create more permissive policies that work with both auth users and demo users
CREATE POLICY "User presence is viewable by everyone" ON user_presence
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own presence" ON user_presence
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own presence" ON user_presence
  FOR UPDATE USING (true);

CREATE POLICY "Users can delete their own presence" ON user_presence
  FOR DELETE USING (true);

-- Also ensure the user_presence table allows NULL user_id for demo users
ALTER TABLE user_presence ALTER COLUMN user_id DROP NOT NULL;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS user_presence_user_id_idx ON user_presence(user_id);
