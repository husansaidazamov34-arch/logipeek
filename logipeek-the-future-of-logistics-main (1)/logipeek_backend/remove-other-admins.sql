-- Remove all admins except Laziz Shakarov (shakarovlaziz243@gmail.com)

-- First, delete admin actions related to other admins
DELETE FROM admin_actions 
WHERE admin_id IN (
    SELECT id FROM users 
    WHERE role = 'admin' 
    AND email != 'shakarovlaziz243@gmail.com'
);

-- Delete admin actions where other admins are target users
DELETE FROM admin_actions 
WHERE target_user_id IN (
    SELECT id FROM users 
    WHERE role = 'admin' 
    AND email != 'shakarovlaziz243@gmail.com'
);

-- Delete other admin users
DELETE FROM users 
WHERE role = 'admin' 
AND email != 'shakarovlaziz243@gmail.com';

-- Verify: Show remaining admins
SELECT id, email, full_name, role, is_super_admin, is_active 
FROM users 
WHERE role = 'admin';
