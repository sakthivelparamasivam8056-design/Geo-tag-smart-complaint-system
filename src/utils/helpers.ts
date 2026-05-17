import { formatDistanceToNow, format } from 'date-fns';
import { Complaint, ComplaintPriority, ComplaintStatus } from '../types';

export const timeAgo = (iso: string): string => {
  try {
    return formatDistanceToNow(new Date(iso), { addSuffix: true });
  } catch {
    return iso;
  }
};

export const formatDate = (iso: string): string => {
  try {
    return format(new Date(iso), 'MMM d, yyyy · h:mm a');
  } catch {
    return iso;
  }
};

export const priorityWeight: Record<ComplaintPriority, number> = {
  Critical: 4,
  High: 3,
  Medium: 2,
  Low: 1,
};

export const statusWeight: Record<ComplaintStatus, number> = {
  Pending: 4,
  'In Progress': 3,
  Resolved: 2,
  Rejected: 1,
};

export const getDistance = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number => {
  const R = 6371; // km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

export const sortComplaintsByRelevance = (complaints: Complaint[]): Complaint[] =>
  [...complaints].sort((a, b) => {
    const wA = priorityWeight[a.priority] + (a.status === 'Pending' ? 2 : 0);
    const wB = priorityWeight[b.priority] + (b.status === 'Pending' ? 2 : 0);
    return wB - wA;
  });
