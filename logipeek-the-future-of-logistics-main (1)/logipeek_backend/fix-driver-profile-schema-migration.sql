-- Migration: Fix driver_profiles schema to match entity
-- Date: 2026-01-20

-- Add missing columns if they don't exist
ALTER TABLE driver_profiles 
ADD COLUMN IF NOT EXISTS license_image_url VARCHAR(500),
ADD COLUMN IF NOT EXISTS is_license_approved BOOLEAN,
ADD COLUMN IF NOT EXISTS license_approved_by UUID,
ADD COLUMN IF NOT EXISTS license_approved_at TIMESTAMP;

-- Add foreign key constraint for license_approved_by if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_driver_profiles_license_approved_by'
    ) THEN
        ALTER TABLE driver_profiles 
        ADD CONSTRAINT fk_driver_profiles_license_approved_by 
        FOREIGN KEY (license_approved_by) REFERENCES users(id);
    END IF;
END $$;

-- Add comment to track migration
COMMENT ON TABLE driver_profiles IS 'Updated: Fixed schema to match entity - 2026-01-20';