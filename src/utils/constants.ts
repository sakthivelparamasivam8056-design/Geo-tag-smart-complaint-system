import { ComplaintCategory, ComplaintStatus, ComplaintPriority } from '../types';

export const CATEGORIES: ComplaintCategory[] = [
  'Road & Infrastructure',
  'Water & Sewage',
  'Electricity',
  'Garbage & Sanitation',
  'Public Safety',
  'Parks & Recreation',
  'Noise Pollution',
  'Other',
];

export const STATUSES: ComplaintStatus[] = ['Pending', 'In Progress', 'Resolved', 'Rejected'];

export const PRIORITIES: ComplaintPriority[] = ['Low', 'Medium', 'High', 'Critical'];

export const CATEGORY_ICONS: Record<ComplaintCategory, string> = {
  'Road & Infrastructure': '🛣️',
  'Water & Sewage': '💧',
  'Electricity': '⚡',
  'Garbage & Sanitation': '🗑️',
  'Public Safety': '🛡️',
  'Parks & Recreation': '🌳',
  'Noise Pollution': '🔊',
  'Other': '📋',
};

export const STATUS_COLORS: Record<ComplaintStatus, string> = {
  Pending: '#f59e0b',
  'In Progress': '#3b82f6',
  Resolved: '#10b981',
  Rejected: '#ef4444',
};

export const PRIORITY_COLORS: Record<ComplaintPriority, string> = {
  Low: '#6b7280',
  Medium: '#f59e0b',
  High: '#f97316',
  Critical: '#ef4444',
};

export const DEFAULT_CENTER: [number, number] = [13.0827, 80.2707]; // Chennai
export const DEFAULT_ZOOM = 12;
