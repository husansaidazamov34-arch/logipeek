-- Add payment_method column to shipments table
ALTER TABLE shipments 
ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50);

-- Add comment
COMMENT ON COLUMN shipments.payment_method IS 'Payment method: payme, click, uzcard, humo, cash, etc.';
