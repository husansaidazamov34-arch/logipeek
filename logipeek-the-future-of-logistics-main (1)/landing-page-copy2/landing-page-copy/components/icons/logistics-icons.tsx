import React from 'react'

interface IconProps {
  className?: string
  size?: number
}

export const LogisticsHomeIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`logistics-icon ${className}`}
  >
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9,22 9,12 15,12 15,22" />
    <circle cx="7.5" cy="16.5" r="1" fill="currentColor" />
    <circle cx="16.5" cy="16.5" r="1" fill="currentColor" />
    <path d="M12 6v3" strokeWidth="3" />
  </svg>
)

export const LogisticsDashboardIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="5" />
    <rect x="14" y="12" width="7" height="9" />
    <rect x="3" y="14" width="7" height="7" />
    <circle cx="6.5" cy="6.5" r="1" />
    <circle cx="17.5" cy="5.5" r="1" />
    <circle cx="17.5" cy="16.5" r="1" />
    <circle cx="6.5" cy="17.5" r="1" />
  </svg>
)

export const LogisticsOrderIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`logistics-icon ${className}`}
  >
    <path d="M16 16h2a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
    <rect x="8" y="12" width="8" height="8" rx="2" />
    <path d="m9 16 2 2 4-4" />
    <circle cx="8" cy="8" r="2" />
    <path d="m12 8 4-4" />
  </svg>
)

export const LogisticsDriverIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="8" r="3" />
    <path d="M16 14v3a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2v-3" />
    <path d="M8 14h8l1-4H7l1 4z" />
    <circle cx="18" cy="18" r="3" />
    <circle cx="6" cy="18" r="3" />
    <path d="M15 18h-3" />
    <path d="M9 18H6" />
  </svg>
)

export const LogisticsTransportIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`logistics-icon ${className}`}
  >
    <rect x="1" y="3" width="15" height="13" rx="2" />
    <polygon points="16,8 20,8 23,11 23,16 16,16" />
    <circle cx="5.5" cy="18" r="2.5" />
    <circle cx="18.5" cy="18" r="2.5" />
    <rect x="4" y="6" width="8" height="6" rx="1" />
    <path d="M16 11h4" strokeWidth="3" />
    <path d="M8 9h2" strokeWidth="1.5" />
    <circle cx="5.5" cy="18" r="1" fill="currentColor" />
    <circle cx="18.5" cy="18" r="1" fill="currentColor" />
  </svg>
)

export const LogisticsAppDocumentIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`logistics-icon ${className}`}
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14,2 14,8 20,8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10,9 9,9 8,9" />
    <circle cx="12" cy="15" r="1" />
  </svg>
)

export const LogisticsPaymentIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`logistics-icon ${className}`}
  >
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
    <line x1="1" y1="10" x2="23" y2="10" />
    <circle cx="18" cy="15" r="2" />
    <path d="M6 15h4" />
    <path d="M6 7h2" />
  </svg>
)

export const LogisticsMapIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`logistics-icon ${className}`}
  >
    <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
    <line x1="9" y1="3" x2="9" y2="18" />
    <line x1="15" y1="6" x2="15" y2="21" />
    <circle cx="12" cy="10" r="3" />
    <path d="m9 7 3 3 3-3" />
  </svg>
)

export const LogisticsLogoIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M8 12h8" />
    <path d="M12 8v8" />
    <path d="M16 8l-4 4-4-4" />
    <circle cx="12" cy="12" r="2" fill="currentColor" />
  </svg>
)

export const LogisticsTrackingIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="3" />
    <path d="M12 1v6m0 6v6" />
    <path d="m21 12-6-6-6 6" />
    <circle cx="12" cy="12" r="1" fill="currentColor" />
    <path d="M8 8l8 8" strokeWidth="1" opacity="0.5" />
    <path d="M16 8l-8 8" strokeWidth="1" opacity="0.5" />
  </svg>
)

export const LogisticsNotificationIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`logistics-icon ${className}`}
  >
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    <circle cx="18" cy="6" r="3" fill="currentColor" />
  </svg>
)

export const LogisticsSearchIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`logistics-icon ${className}`}
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
    <circle cx="11" cy="11" r="3" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3" />
  </svg>
)

export const LogisticsGPSIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="3" />
    <path d="M12 1v6m0 6v6" />
    <path d="m21 12-6-6-6 6" />
    <circle cx="12" cy="12" r="1" fill="currentColor" />
    <path d="M8 8l8 8" strokeWidth="1" opacity="0.3" />
    <path d="M16 8l-8 8" strokeWidth="1" opacity="0.3" />
  </svg>
)

export const LogisticsLocationIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
    <circle cx="12" cy="10" r="1" fill="currentColor" />
  </svg>
)

export const LogisticsRouteIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M3 12h18" />
    <path d="M8 18l6-6-6-6" />
    <circle cx="3" cy="12" r="2" fill="currentColor" />
    <circle cx="21" cy="12" r="2" fill="currentColor" />
    <path d="M9 12h6" strokeWidth="3" opacity="0.5" />
  </svg>
)

export const LogisticsAnalyticsIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M3 3v18h18" />
    <path d="M18 17V9" />
    <path d="M13 17V5" />
    <path d="M8 17v-3" />
    <circle cx="18" cy="9" r="1" fill="currentColor" />
    <circle cx="13" cy="5" r="1" fill="currentColor" />
    <circle cx="8" cy="14" r="1" fill="currentColor" />
  </svg>
)

export const LogisticsSettingsIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    <circle cx="12" cy="12" r="1" fill="currentColor" />
  </svg>
)

export const LogisticsWebIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`logistics-icon ${className}`}
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
    <path d="M2 12h20" />
    <path d="M12 2a14.5 14.5 0 0 1 0 20" />
    <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3" />
    <path d="M8 8l8 8" strokeWidth="1" opacity="0.2" />
    <path d="M16 8l-8 8" strokeWidth="1" opacity="0.2" />
  </svg>
)

export const LogisticsOnlineIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`logistics-icon ${className}`}
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 4.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32" />
    <circle cx="12" cy="12" r="2" fill="currentColor" />
  </svg>
)