-- Drop table if exists
DROP TABLE IF EXISTS verification_codes CASCADE;

-- Create verification_codes table
CREATE TABLE verification_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL,
  code VARCHAR(6) NOT NULL,
  is_used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP NOT NULL
);

-- Create indexes for faster lookups
CREATE INDEX idx_verification_codes_email ON verification_codes(email);
CREATE INDEX idx_verification_codes_code ON verification_codes(code);
CREATE INDEX idx_verification_codes_expires_at ON verification_codes(expires_at);
