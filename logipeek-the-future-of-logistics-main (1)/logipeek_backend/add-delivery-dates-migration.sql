-- Add delivery date columns to shipments table
ALTER TABLE shipments ADD COLUMN IF NOT EXISTS delivery_date_from TIMESTAMP NULL;
ALTER TABLE shipments ADD COLUMN IF NOT EXISTS delivery_date_to TIMESTAMP NULL;
