import { Driver, Order, Payment, AppDocument, Shipment, Transaction } from "@/contexts/types"

export const mockOrders: Order[] = [
    {
        id: "ORD-001",
        orderNumber: "ORD-2024-001",
        customer: "Aziz Rahimov",
        company: "Artel Electronics",
        phone: "+998 90 123 45 67",
        from: "Toshkent, Chilonzor",
        to: "Samarkand, Registan",
        vehicles: 2,
        weight: "5 tonna",
        date: "12.03.2024",
        price: 1200000,
        status: "pending",
        priority: "medium",
        createdAt: "2024-03-12T10:00:00Z"
    },
    {
        id: "ORD-002",
        orderNumber: "ORD-2024-002",
        customer: "Bekzod Aliyev",
        phone: "+998 90 987 65 43",
        from: "Bukhara, Old City",
        to: "Tashkent, Sergeli",
        vehicles: 1,
        weight: "2 tonna",
        date: "13.03.2024",
        price: 850000,
        status: "in-transit",
        priority: "high",
        createdAt: "2024-03-13T09:00:00Z"
    },
    {
        id: "ORD-003",
        orderNumber: "ORD-2024-003",
        customer: "Jamshid Tursunov",
        company: "Akfa Group",
        phone: "+998 91 234 56 78",
        from: "Fergana, City Center",
        to: "Andijan, Market",
        vehicles: 3,
        weight: "10 tonna",
        date: "14.03.2024",
        price: 2500000,
        status: "confirmed",
        priority: "urgent",
        createdAt: "2024-03-14T11:00:00Z"
    }
]

export const mockShipments: Shipment[] = [
    {
        id: "SHP-001",
        driver: "Aziz Rahimov",
        phone: "+998 90 123 45 67",
        origin: "Toshkent",
        destination: "Samarkand",
        status: "in-transit",
        capacity: "10",
        notes: "Fragile cargo",
        location: { lat: 41.2995, lng: 69.2401 }
    },
    {
        id: "SHP-002",
        driver: "Bekzod Aliyev",
        phone: "+998 90 987 65 43",
        origin: "Bukhara",
        destination: "Tashkent",
        status: "pending",
        capacity: "5",
        notes: "Urgent delivery",
        location: { lat: 39.7681, lng: 64.4556 }
    }
]

export const mockDashboardStats = [
    {
        title: "totalRevenue",
        value: "24.5M",
        change: "+12.5%",
        trend: "up" as const,
        iconName: "DollarSign",
        color: "icon-container-green",
        bgColor: "from-green-400 to-emerald-500"
    },
    {
        title: "totalOrders",
        value: "156",
        change: "+8.2%",
        trend: "up" as const,
        iconName: "Package",
        color: "icon-container-blue",
        bgColor: "from-blue-400 to-indigo-500"
    },
    {
        title: "activeDrivers",
        value: "89",
        change: "-2.1%",
        trend: "down" as const,
        iconName: "Users",
        color: "icon-container-purple",
        bgColor: "from-purple-400 to-pink-500"
    },
    {
        title: "completedTrips",
        value: "1,247",
        change: "+15.3%",
        trend: "up" as const,
        iconName: "Activity",
        color: "icon-container-orange",
        bgColor: "from-orange-400 to-red-500"
    }
]

export const mockRecentActivities = [
    {
        id: 1,
        type: "order",
        title: "newOrderReceived",
        description: "ORD-2024-001 - Toshkent → Almaty",
        timeKey: "minutesAgo",
        timeValue: "2",
        iconName: "Package",
        color: "icon-container-blue"
    },
    {
        id: 2,
        type: "driver",
        title: "driverRegistered",
        description: "Aziz Rahimov - Fura 25t",
        timeKey: "minutesAgo",
        timeValue: "15",
        iconName: "Users",
        color: "icon-container-green"
    },
    {
        id: 3,
        type: "payment",
        title: "paymentReceived",
        description: "2,500,000",
        descriptionSuffixKey: "som",
        descriptionSuffixExtra: " - ORD-2024-001",
        timeKey: "hoursAgo",
        timeValue: "1",
        iconName: "DollarSign",
        color: "icon-container-purple"
    },
    {
        id: 4,
        type: "delivery",
        title: "cargoDelivered",
        description: "ORD-2023-998 - Samarqand → Bishkek",
        timeKey: "hoursAgo",
        timeValue: "2",
        iconName: "MapPin",
        color: "icon-container-orange"
    }
]

export const mockDrivers: Driver[] = [
    {
        id: '1',
        name: 'Aziz Rahimov',
        phone: '+998 90 123 45 67',
        rating: 4.9,
        status: 'available',
        vehicle: {
            type: "Fura",
            model: "Mercedes Actros",
            plateNumber: "01 123 AA",
            capacity: 25
        },
        location: {
            city: "Toshkent",
            coordinates: { lat: 41.2995, lng: 69.2401 }
        }
    },
    {
        id: '2',
        name: 'Bekzod Aliyev',
        phone: '+998 91 234 56 78',
        rating: 4.7,
        status: 'busy',
        vehicle: {
            type: "Fura",
            model: "Volvo FH",
            plateNumber: "02 456 BB",
            capacity: 22
        },
        location: {
            city: "Samarqand",
            coordinates: { lat: 39.627, lng: 66.9749 }
        }
    }
]
export const mockPayments: Transaction[] = [
    {
        id: 'TXN-001',
        type: 'income',
        from: 'Artel Electronics',
        to: 'Logipeek Wallet',
        amount: 2500000,
        status: 'completed',
        method: 'Bank Transfer',
        date: '2024-03-12',
        time: '14:30',
        description: 'Services'
    },
    {
        id: 'TXN-002',
        type: 'expense',
        from: 'Logipeek Wallet',
        to: 'Shell Fuel Station',
        amount: 450000,
        status: 'completed',
        method: 'Fuel Card',
        date: '2024-03-12',
        time: '15:45',
        description: 'Fuel'
    }
]

export const mockAppDocuments: AppDocument[] = [
    {
        id: 'DOC-001',
        name: 'Shartnoma #2024-001',
        type: 'pdf',
        customer: 'Artel Electronics',
        status: 'verified',
        uploadDate: '2024-03-10',
        size: '2.4 MB',
        tags: ['Contract', '2024']
    },
    {
        id: 'DOC-002',
        name: 'Haydovchi Guvohnomasi',
        type: 'image',
        customer: 'Aziz Rahimov',
        status: 'verified',
        uploadDate: '2024-03-11',
        size: '1.1 MB',
        tags: ['License', 'Driver']
    }
]
