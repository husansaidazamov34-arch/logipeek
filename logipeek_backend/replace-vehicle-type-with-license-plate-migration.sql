-- Migration: Replace vehicle_type with license_plate in driver_profiles
-- Date: 2026-01-20

-- Remove vehicle_type column and add license_plate column
ALTER TABLE driver_profiles 
DROP COLUMN IF EXISTS vehicle_type,
ADD COLUMN license_plate VARCHAR(20) UNIQUE;

-- Add comment to track migration
COMMENT ON TABLE driver_profiles IS 'Updated: Replaced vehicle_type with license_plate - 2026-01-20';