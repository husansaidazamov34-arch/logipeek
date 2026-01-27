-- Manual migration for admin features

-- Add new columns to users table if they don't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'is_super_admin') THEN
        ALTER TABLE users ADD COLUMN is_super_admin BOOLEAN DEFAULT false;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'created_by_admin_id') THEN
        ALTER TABLE users ADD COLUMN created_by_admin_id UUID REFERENCES users(id);
    END IF;
END $$;

-- Create admin_actions table if it doesn't exist
CREATE TABLE IF NOT EXISTS admin_actions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    target_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    description TEXT,
    metadata JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for admin_actions if they don't exist
CREATE INDEX IF NOT EXISTS idx_admin_actions_admin_id ON admin_actions(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_actions_target_user_id ON admin_actions(target_user_id);
CREATE INDEX IF NOT EXISTS idx_admin_actions_action ON admin_actions(action);
CREATE INDEX IF NOT EXISTS idx_admin_actions_created_at ON admin_actions(created_at);

-- Update existing user to be super admin
UPDATE users 
SET 
    role = 'admin',
    is_super_admin = true,
    is_active = true,
    is_verified = true
WHERE email = 'driver@test.com';

-- If no admin exists, create one
INSERT INTO users (
    email, 
    password_hash, 
    full_name, 
    phone, 
    role, 
    is_active, 
    is_verified, 
    is_super_admin
) 
SELECT 
    'superadmin@logipeek.com',
    '$2a$10$rQZ8kqKqKqKqKqKqKqKqKOeJ8kqKqKqKqKqKqKqKqKqKqKqKqKqKq', -- This will be updated
    'Super Admin',
    '+998900000000',
    'admin',
    true,
    true,
    true
WHERE NOT EXISTS (
    SELECT 1 FROM users WHERE email = 'superadmin@logipeek.com'
);

COMMIT;