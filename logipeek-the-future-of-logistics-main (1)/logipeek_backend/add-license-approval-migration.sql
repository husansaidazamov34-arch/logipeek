-- Add license approval fields to driver_profiles table
ALTER TABLE driver_profiles 
ADD COLUMN is_license_approved BOOLEAN DEFAULT FALSE,
ADD COLUMN license_approved_by UUID REFERENCES users(id),
ADD COLUMN license_approved_at TIMESTAMP;

-- Create index for faster queries
CREATE INDEX idx_driver_profiles_license_approved ON driver_profiles(is_license_approved);

-- Update existing drivers to have license approved if they have license image
UPDATE driver_profiles 
SET is_license_approved = TRUE, 
    license_approved_at = NOW() 
WHERE license_image_url IS NOT NULL AND license_image_url != '';