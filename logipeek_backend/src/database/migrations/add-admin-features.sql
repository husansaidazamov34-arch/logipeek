-- Add admin features to existing database

-- Add new columns to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_super_admin BOOLEAN DEFAULT false;
ALTER TABLE users ADD COLUMN IF NOT EXISTS created_by_admin_id UUID REFERENCES users(id);

-- Create admin_actions table
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

-- Create indexes for admin_actions
CREATE INDEX IF NOT EXISTS idx_admin_actions_admin_id ON admin_actions(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_actions_target_user_id ON admin_actions(target_user_id);
CREATE INDEX IF NOT EXISTS idx_admin_actions_action ON admin_actions(action);
CREATE INDEX IF NOT EXISTS idx_admin_actions_created_at ON admin_actions(created_at);

-- Create the first super admin (update this with your desired credentials)
-- Password is 'superadmin123' hashed with bcrypt
INSERT INTO users (
    email, 
    password_hash, 
    full_name, 
    phone, 
    role, 
    is_active, 
    is_verified, 
    is_super_admin
) VALUES (
    'superadmin@logipeek.com',
    '$2b$10$rQZ8kqKqKqKqKqKqKqKqKOeJ8kqKqKqKqKqKqKqKqKqKqKqKqKqKq', -- This should be properly hashed
    'Super Admin',
    '+998900000000',
    'admin',
    true,
    true,
    true
) ON CONFLICT (email) DO NOTHING;

-- Log the creation of super admin
INSERT INTO admin_actions (
    admin_id,
    action,
    description,
    metadata
) SELECT 
    id,
    'create_super_admin',
    'Super admin yaratildi tizim tomonidan',
    '{"system_created": true}'::jsonb
FROM users 
WHERE email = 'superadmin@logipeek.com' 
AND NOT EXISTS (
    SELECT 1 FROM admin_actions 
    WHERE action = 'create_super_admin' 
    AND description = 'Super admin yaratildi tizim tomonidan'
);

-- Update existing admin users to have proper admin role if any exist
UPDATE users SET role = 'admin' WHERE role = 'admin' AND is_super_admin IS NULL;

COMMIT;