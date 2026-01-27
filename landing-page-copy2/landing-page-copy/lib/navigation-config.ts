import { 
  Home, 
  LayoutDashboard, 
  Package, 
  Map as MapIcon, 
  Users, 
  Truck, 
  FileText, 
  Wallet,
  Route,
  ClipboardList
} from "lucide-react"
import { UserRole } from "@/contexts/types"

export interface NavItem {
  href: string
  label: string
  icon: any
  badge?: number
  roles: UserRole[]
}

export const NAVIGATION_CONFIG: NavItem[] = [
  // Common pages for both roles
  { 
    href: "/home", 
    label: "home", 
    icon: Home, 
    roles: ["driver", "shipper", "admin"] 
  },

  // Role-specific dashboards
  { 
    href: "/dashboard", 
    label: "dashboard", 
    icon: LayoutDashboard, 
    roles: ["shipper", "admin"] 
  },
  { 
    href: "/driver/dashboard", 
    label: "dashboard", 
    icon: LayoutDashboard, 
    roles: ["driver"] 
  },

  // Maps and Drivers - available for both roles
  { 
    href: "/maps", 
    label: "maps", 
    icon: MapIcon, 
    roles: ["driver", "shipper", "admin"] 
  },
  { 
    href: "/drivers", 
    label: "drivers", 
    icon: Users, 
    roles: ["driver", "shipper", "admin"] 
  },

  // Shipper-specific pages
  { 
    href: "/orders", 
    label: "orders", 
    icon: Package, 
    badge: 3, 
    roles: ["shipper", "admin"] 
  },

  // Driver-specific pages
  { 
    href: "/driver/orders", 
    label: "availableOrders", 
    icon: ClipboardList, 
    roles: ["driver", "admin"] 
  },
  { 
    href: "/driver/routes", 
    label: "myRoutes", 
    icon: Route, 
    roles: ["driver", "admin"] 
  },
  { 
    href: "/transport", 
    label: "transport", 
    icon: Truck, 
    roles: ["driver", "admin"] 
  },

  // Common pages
  { 
    href: "/documents", 
    label: "documentsTab", 
    icon: FileText, 
    roles: ["driver", "shipper", "admin"] 
  },
  { 
    href: "/payments", 
    label: "payments", 
    icon: Wallet, 
    roles: ["driver", "shipper", "admin"] 
  },
]

export function getNavigationForRole(role: UserRole): NavItem[] {
  return NAVIGATION_CONFIG.filter(item => item.roles.includes(role))
}