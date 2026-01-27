// Mock in-memory storage for users without database
// This allows the app to work without MongoDB connection

interface MockUser {
    id: string
    phone: string
    password: string
    firstName: string
    lastName: string
    role: 'admin' | 'shipper' | 'driver'
    email?: string
    verificationCode?: string
    verificationCodeExpires?: Date
    isVerified: boolean
    isActive: boolean
}

// In-memory user storage
const mockUsers: Map<string, MockUser> = new Map()

// Pre-populate with test users
mockUsers.set('+998991234567', {
    id: 'admin-001',
    phone: '+998991234567',
    password: 'admin123', // Simple password for demo
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    email: 'admin@logipeek.uz',
    isVerified: true,
    isActive: true
})

mockUsers.set('+998901234567', {
    id: 'shipper-001',
    phone: '+998901234567',
    password: 'shipper123',
    firstName: 'Jamshid',
    lastName: 'Khalilov',
    role: 'shipper',
    email: 'shipper@logipeek.uz',
    isVerified: true,
    isActive: true
})

mockUsers.set('+998771234567', {
    id: 'driver-001',
    phone: '+998771234567',
    password: 'driver123',
    firstName: 'Aziz',
    lastName: 'Rahimov',
    role: 'driver',
    email: 'driver1@logipeek.uz',
    isVerified: true,
    isActive: true
})

// Normalize phone number for lookup
function normalizePhone(phone: string): string {
    return phone.replace(/[\s\(\)\-]/g, '')
}

// Generate OTP
function generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString()
}

export const mockAuthService = {
    // Find user by phone
    findUserByPhone(phone: string): MockUser | undefined {
        const normalized = normalizePhone(phone)
        // Check exact match first
        if (mockUsers.has(normalized)) {
            return mockUsers.get(normalized)
        }
        // Check all users for matching phone
        for (const user of mockUsers.values()) {
            if (normalizePhone(user.phone) === normalized) {
                return user
            }
        }
        return undefined
    },

    // Validate login credentials
    validateLogin(phone: string, password: string): MockUser | null {
        const user = this.findUserByPhone(phone)
        if (!user) return null
        if (user.password !== password) return null
        if (!user.isVerified || !user.isActive) return null
        return user
    },

    // Register new user (returns OTP)
    registerUser(data: {
        phone: string
        password: string
        firstName: string
        lastName: string
        role: 'shipper' | 'driver'
    }): { user: MockUser; otp: string } | { error: string } {
        const normalized = normalizePhone(data.phone)

        // Check if user exists
        const existing = this.findUserByPhone(data.phone)
        if (existing && existing.isVerified) {
            return { error: 'User already exists' }
        }

        const otp = generateOTP()
        const newUser: MockUser = {
            id: `user-${Date.now()}`,
            phone: normalized,
            password: data.password,
            firstName: data.firstName,
            lastName: data.lastName,
            role: data.role,
            verificationCode: otp,
            verificationCodeExpires: new Date(Date.now() + 10 * 60 * 1000),
            isVerified: false,
            isActive: true
        }

        mockUsers.set(normalized, newUser)

        return { user: newUser, otp }
    },

    // Verify OTP
    verifyOTP(phone: string, code: string): MockUser | null {
        const user = this.findUserByPhone(phone)
        if (!user) return null
        if (user.verificationCode !== code) return null
        if (user.verificationCodeExpires && user.verificationCodeExpires < new Date()) return null

        // Mark as verified
        user.isVerified = true
        user.verificationCode = undefined
        user.verificationCodeExpires = undefined

        return user
    },

    // Get all mock users (for debugging)
    getAllUsers(): MockUser[] {
        return Array.from(mockUsers.values())
    }
}

// Check if we should use mock auth (no MongoDB)
export function shouldUseMockAuth(): boolean {
    // Always use mock auth in development if no MONGODB_URI is set
    return !process.env.MONGODB_URI || process.env.USE_MOCK_AUTH === 'true'
}
