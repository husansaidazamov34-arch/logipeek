-- Migration: Remove vehicle_model and license_plate from driver_profiles
-- Date: 2026-01-20

-- Remove columns from driver_profiles table
ALTER TABLE driver_profiles 
DROP COLUMN IF EXISTS vehicle_model,
DROP COLUMN IF EXISTS license_plate;

-- Remove unique constraint on license_plate if it exists
-- (This will be automatically removed when the column is dropped)

-- Update any existing data if needed
-- (No data updates needed for this migration)

-- Add comment to track migration
COMMENT ON TABLE driver_profiles IS 'Updated: Removed vehicle_model and license_plate fields - 2026-01-20';