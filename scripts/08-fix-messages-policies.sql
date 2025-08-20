-- Fix messages table policies to allow proper message sending
-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Messages are viewable by everyone" ON messages;
DROP POLICY IF EXISTS "Users can insert their own messages" ON messages;
DROP POLICY IF EXISTS "Users can update their own messages" ON messages;
DROP POLICY IF EXISTS "Users can delete their own messages" ON messages;
DROP POLICY IF EXISTS "Users can insert messages" ON messages;
DROP POLICY IF EXISTS "Users can update messages" ON messages;
DROP POLICY IF EXISTS "Users can delete messages" ON messages;

-- Create more permissive policies that work with both auth users and demo users
CREATE POLICY "Anyone can view messages" ON messages
  FOR SELECT USING (true);

CREATE POLICY "Anyone can insert messages" ON messages
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update messages" ON messages
  FOR UPDATE USING (true);

CREATE POLICY "Anyone can delete messages" ON messages
  FOR DELETE USING (true);

-- Also ensure the messages table supports both UUID and TEXT user_id for demo compatibility
ALTER TABLE messages ALTER COLUMN user_id TYPE TEXT;

-- Make sure channel column can handle both UUID and TEXT
ALTER TABLE messages ALTER COLUMN channel TYPE TEXT;
