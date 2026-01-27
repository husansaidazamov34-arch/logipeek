-- LogiPeek Database Schema
-- PostgreSQL Database

CREATE DATABASE logipeek_db;


-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (both drivers and shippers)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('driver', 'shipper', 'admin')),
    avatar_url VARCHAR(500),
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Driver profiles
CREATE TABLE driver_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    license_plate VARCHAR(20) UNIQUE NOT NULL,
    license_number VARCHAR(50) NOT NULL,
    rating DECIMAL(3,2) DEFAULT 5.00,
    total_trips INTEGER DEFAULT 0,
    total_earnings DECIMAL(12,2) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'offline' CHECK (status IN ('online', 'busy', 'offline')),
    current_latitude DECIMAL(10,8),
    current_longitude DECIMAL(11,8),
    last_location_update TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Shipper profiles
CREATE TABLE shipper_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    company_name VARCHAR(255),
    company_address TEXT,
    total_shipments INTEGER DEFAULT 0,
    total_spent DECIMAL(12,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Shipments/Orders
CREATE TABLE shipments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    shipper_id UUID NOT NULL REFERENCES users(id),
    driver_id UUID REFERENCES users(id),
    
    -- Pickup details
    pickup_address TEXT NOT NULL,
    pickup_latitude DECIMAL(10,8) NOT NULL,
    pickup_longitude DECIMAL(11,8) NOT NULL,
    pickup_contact_name VARCHAR(255),
    pickup_contact_phone VARCHAR(20),
    
    -- Dropoff details
    dropoff_address TEXT NOT NULL,
    dropoff_latitude DECIMAL(10,8) NOT NULL,
    dropoff_longitude DECIMAL(11,8) NOT NULL,
    dropoff_contact_name VARCHAR(255),
    dropoff_contact_phone VARCHAR(20),
    
    -- Shipment details
    weight DECIMAL(10,2) NOT NULL,
    vehicle_type_required VARCHAR(50) NOT NULL,
    description TEXT,
    special_instructions TEXT,
    
    -- Pricing
    estimated_price DECIMAL(10,2) NOT NULL,
    final_price DECIMAL(10,2),
    distance_km DECIMAL(10,2),
    
    -- Status tracking
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'pickup', 'transit', 'arrived', 'completed', 'cancelled')),
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    accepted_at TIMESTAMP,
    pickup_at TIMESTAMP,
    transit_at TIMESTAMP,
    completed_at TIMESTAMP,
    cancelled_at TIMESTAMP,
    
    -- ETA
    estimated_delivery_time TIMESTAMP,
    
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Shipment status history
CREATE TABLE shipment_status_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shipment_id UUID NOT NULL REFERENCES shipments(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL,
    notes TEXT,
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ratings and reviews
CREATE TABLE ratings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shipment_id UUID UNIQUE NOT NULL REFERENCES shipments(id),
    rated_by UUID NOT NULL REFERENCES users(id),
    rated_user UUID NOT NULL REFERENCES users(id),
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    is_read BOOLEAN DEFAULT false,
    related_shipment_id UUID REFERENCES shipments(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Driver earnings
CREATE TABLE earnings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    driver_id UUID NOT NULL REFERENCES users(id),
    shipment_id UUID NOT NULL REFERENCES shipments(id),
    amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'cancelled')),
    paid_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payment transactions
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    shipment_id UUID REFERENCES shipments(id),
    amount DECIMAL(10,2) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('payment', 'refund', 'earning')),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    payment_method VARCHAR(50),
    transaction_reference VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_role ON users(role);

CREATE INDEX idx_driver_profiles_user_id ON driver_profiles(user_id);
CREATE INDEX idx_driver_profiles_status ON driver_profiles(status);

CREATE INDEX idx_shipper_profiles_user_id ON shipper_profiles(user_id);

CREATE INDEX idx_shipments_shipper_id ON shipments(shipper_id);
CREATE INDEX idx_shipments_driver_id ON shipments(driver_id);
CREATE INDEX idx_shipments_status ON shipments(status);
CREATE INDEX idx_shipments_created_at ON shipments(created_at);

CREATE INDEX idx_shipment_status_history_shipment_id ON shipment_status_history(shipment_id);

CREATE INDEX idx_ratings_shipment_id ON ratings(shipment_id);
CREATE INDEX idx_ratings_rated_user ON ratings(rated_user);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);

CREATE INDEX idx_earnings_driver_id ON earnings(driver_id);
CREATE INDEX idx_earnings_status ON earnings(status);

CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_shipment_id ON transactions(shipment_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at trigger to tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_driver_profiles_updated_at BEFORE UPDATE ON driver_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_shipper_profiles_updated_at BEFORE UPDATE ON shipper_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_shipments_updated_at BEFORE UPDATE ON shipments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
