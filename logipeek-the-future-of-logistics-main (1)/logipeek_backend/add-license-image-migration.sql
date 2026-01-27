-- Add license image URL field to driver_profiles table
ALTER TABLE driver_profiles 
ADD COLUMN license_image_url VARCHAR(500);

-- Add comment for the new column
COMMENT ON COLUMN driver_profiles.license_image_url IS 'URL to the uploaded driver license image';