
-- Create a public storage bucket for order images
INSERT INTO storage.buckets (id, name, public) VALUES ('order-images', 'order-images', true);

-- Allow anyone to read from the bucket (public)
CREATE POLICY "Public read access for order images"
ON storage.objects FOR SELECT
USING (bucket_id = 'order-images');

-- Allow edge functions (service role) to upload - anon can also upload
CREATE POLICY "Allow uploads to order images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'order-images');
