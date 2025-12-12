import React from 'react';

export interface DocumentItem {
  id: string;
  title: string;
  gradient: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  description?: string;
  icon: React.ReactNode;
  isWide?: boolean;
  alert?: boolean;
}