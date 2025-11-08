-- Add columns for bulk upload tracking and CSV import support
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS bulk_upload_id UUID,
ADD COLUMN IF NOT EXISTS import_status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS error_message TEXT,
ADD COLUMN IF NOT EXISTS sku TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS price DECIMAL(10, 2);

-- Create bulk_uploads tracking table
CREATE TABLE IF NOT EXISTS public.bulk_uploads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  total_count INT NOT NULL DEFAULT 0,
  successful_count INT DEFAULT 0,
  failed_count INT DEFAULT 0,
  status TEXT DEFAULT 'processing', -- 'processing', 'completed', 'failed'
  file_name TEXT,
  error_details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS on bulk_uploads
ALTER TABLE public.bulk_uploads ENABLE ROW LEVEL SECURITY;

-- Bulk uploads policies
CREATE POLICY "Users can view their own bulk uploads" ON public.bulk_uploads
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own bulk uploads" ON public.bulk_uploads
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bulk uploads" ON public.bulk_uploads
  FOR UPDATE USING (auth.uid() = user_id);
