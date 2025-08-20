-- Ensure user_presence table is compatible with both authenticated and demo users
-- Make user_id nullable to support demo users
ALTER TABLE user_presence ALTER COLUMN user_id DROP NOT NULL;

-- Update the table to use TEXT instead of UUID for user_id to support demo users
ALTER TABLE user_presence ALTER COLUMN user_id TYPE TEXT;

-- Drop the foreign key constraint if it exists
ALTER TABLE user_presence DROP CONSTRAINT IF EXISTS user_presence_user_id_fkey;

-- Recreate the policies with more permissive rules
DROP POLICY IF EXISTS "User presence is viewable by everyone" ON user_presence;
DROP POLICY IF EXISTS "Users can insert their own presence" ON user_presence;
DROP POLICY IF EXISTS "Users can update their own presence" ON user_presence;
DROP POLICY IF EXISTS "Users can delete their own presence" ON user_presence;
DROP POLICY IF EXISTS "Users can manage presence" ON user_presence;

-- Create new policies that work for all users
CREATE POLICY "Anyone can view user presence" ON user_presence
  FOR SELECT USING (true);

CREATE POLICY "Anyone can insert user presence" ON user_presence
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update user presence" ON user_presence
  FOR UPDATE USING (true);

CREATE POLICY "Anyone can delete user presence" ON user_presence
  FOR DELETE USING (true);

-- Create a unique index on user_id to prevent duplicates
DROP INDEX IF EXISTS user_presence_user_id_unique;
CREATE UNIQUE INDEX user_presence_user_id_unique ON user_presence(user_id) WHERE user_id IS NOT NULL;
