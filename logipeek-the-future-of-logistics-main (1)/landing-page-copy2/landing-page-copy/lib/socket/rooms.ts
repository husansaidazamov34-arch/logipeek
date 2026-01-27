// Room management for Socket.io
// Rooms are organized by:
// - order:{orderId} - All users related to an order (shipper, driver, admin)
// - region:{city} - All drivers in a city
// - user:{userId} - Direct messages to a user

export function getOrderRoom(orderId: string): string {
  return `order:${orderId}`
}

export function getRegionRoom(city: string): string {
  return `region:${city}`
}

export function getUserRoom(userId: string): string {
  return `user:${userId}`
}

export function getDriverRoom(): string {
  return 'drivers'
}

export function getShipperRoom(): string {
  return 'shippers'
}

export function getAdminRoom(): string {
  return 'admins'
}

