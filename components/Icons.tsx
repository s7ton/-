import React from 'react';

export const ProfileIcon = () => (
  <div className="w-[60px] h-[60px] rounded-full bg-[#D9D9D9] border-2 border-white"></div>
);

export const RenewIcon = () => (
  <svg width="52" height="44" viewBox="0 0 52 44" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="52" height="44" rx="8" fill="url(#renew-gradient)"/>
    <path d="M26 12L34 20M26 12L18 20M26 12V32" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <defs>
      <linearGradient id="renew-gradient" x1="0" y1="0" x2="52" y2="44" gradientUnits="userSpaceOnUse">
        <stop stopColor="#4DB6AC"/>
        <stop offset="1" stopColor="#00796B"/>
      </linearGradient>
    </defs>
  </svg>
);

export const CarIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 11L2 11L2 17H4M19 11L22 11L22 17H20M4 17H20M4 17V19H6V17M20 17V19H18V17M5 11L6.5 6.5H17.5L19 11M5 11H19" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="7" cy="14" r="1" fill="#9CA3AF"/>
    <circle cx="17" cy="14" r="1" fill="#9CA3AF"/>
  </svg>
);

export const FingerprintIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 3.5C9.5 3.5 7.5 5.5 7.5 8V10M16.5 10V8C16.5 5.5 14.5 3.5 12 3.5Z" stroke="#9CA3AF" strokeWidth="1.5"/>
    <path d="M5.5 14.5C5.5 14.5 5.5 11.5 8 10" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M18.5 14.5C18.5 14.5 18.5 11.5 16 10" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M12 10V20" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M9 13.5C9 13.5 8 16 5.5 18" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M15 13.5C15 13.5 16 16 18.5 18" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M12 16H12.01" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const MapIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 20L3 17V4L9 7M9 20L15 17M9 20V7M15 17L21 20V7L15 4M15 17V4M9 7L15 4" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const BillIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 12H15M9 16H15M17 21H7C5.89543 21 5 20.1046 5 19V5C5 3.89543 5.89543 3 7 3H12.5858C12.851 3 13.1054 3.10536 13.2929 3.29289L18.7071 8.70711C18.8946 8.89464 19 9.149 19 9.41421V19C19 20.1046 18.1046 21 17 21Z" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const BoxIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 3L20 7.5V16.5L12 21L4 16.5V7.5L12 3Z" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 12L20 7.5M12 12L4 7.5M12 12V21" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const GunIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 14H9L10 11H20V6H7L4 9V14Z" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="8.5" r="0.5" fill="#9CA3AF"/>
  </svg>
);

// Navigation Icons
export const HomeIcon = ({ active }: { active: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 9.5L12 3L21 9.5V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9.5Z" stroke={active ? "#4DB6AC" : "#A0A0A0"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const ServicesIcon = ({ active }: { active: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="3" width="7" height="7" rx="1" stroke={active ? "#4DB6AC" : "#A0A0A0"} strokeWidth="2"/>
    <rect x="14" y="3" width="7" height="7" rx="1" stroke={active ? "#4DB6AC" : "#A0A0A0"} strokeWidth="2"/>
    <rect x="14" y="14" width="7" height="7" rx="1" stroke={active ? "#4DB6AC" : "#A0A0A0"} strokeWidth="2"/>
    <rect x="3" y="14" width="7" height="7" rx="1" stroke={active ? "#4DB6AC" : "#A0A0A0"} strokeWidth="2"/>
  </svg>
);

export const MenuIcon = ({ active }: { active: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <line x1="3" y1="12" x2="21" y2="12" stroke={active ? "#4DB6AC" : "#A0A0A0"} strokeWidth="2" strokeLinecap="round"/>
    <line x1="3" y1="6" x2="21" y2="6" stroke={active ? "#4DB6AC" : "#A0A0A0"} strokeWidth="2" strokeLinecap="round"/>
    <line x1="3" y1="18" x2="21" y2="18" stroke={active ? "#4DB6AC" : "#A0A0A0"} strokeWidth="2" strokeLinecap="round"/>
  </svg>
);