-- Ensure storage object access for admin-managed image uploads
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Public can view bucket assets'
  ) THEN
    CREATE POLICY "Public can view bucket assets"
    ON storage.objects
    FOR SELECT
    TO public
    USING (bucket_id = 'bucket');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Admins can upload bucket assets'
  ) THEN
    CREATE POLICY "Admins can upload bucket assets"
    ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (
      bucket_id = 'bucket'
      AND public.has_role(auth.uid(), 'admin'::public.app_role)
    );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Admins can update bucket assets'
  ) THEN
    CREATE POLICY "Admins can update bucket assets"
    ON storage.objects
    FOR UPDATE
    TO authenticated
    USING (
      bucket_id = 'bucket'
      AND public.has_role(auth.uid(), 'admin'::public.app_role)
    )
    WITH CHECK (
      bucket_id = 'bucket'
      AND public.has_role(auth.uid(), 'admin'::public.app_role)
    );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Admins can delete bucket assets'
  ) THEN
    CREATE POLICY "Admins can delete bucket assets"
    ON storage.objects
    FOR DELETE
    TO authenticated
    USING (
      bucket_id = 'bucket'
      AND public.has_role(auth.uid(), 'admin'::public.app_role)
    );
  END IF;
END $$;