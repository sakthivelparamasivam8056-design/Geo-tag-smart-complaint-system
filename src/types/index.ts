// ─── Data Model Schema ───────────────────────────────────────────────────────

export type ComplaintCategory =
  | 'Road & Infrastructure'
  | 'Water & Sewage'
  | 'Electricity'
  | 'Garbage & Sanitation'
  | 'Public Safety'
  | 'Parks & Recreation'
  | 'Noise Pollution'
  | 'Other';

export type ComplaintStatus = 'Pending' | 'In Progress' | 'Resolved' | 'Rejected';

export type ComplaintPriority = 'Low' | 'Medium' | 'High' | 'Critical';

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Complaint {
  id: string;
  title: string;
  description: string;
  category: ComplaintCategory;
  status: ComplaintStatus;
  priority: ComplaintPriority;
  coordinates: Coordinates;
  address?: string;
  timestamp: string; // ISO 8601
  updatedAt: string; // ISO 8601
  userId: string;
  userName: string;
  upvotes: number;
  imageUrl?: string;
}

// ─── Filter State ─────────────────────────────────────────────────────────────

export interface FilterState {
  category: ComplaintCategory | 'All';
  status: ComplaintStatus | 'All';
  priority: ComplaintPriority | 'All';
  searchQuery: string;
  sortBy: 'newest' | 'oldest' | 'priority' | 'upvotes';
}

// ─── Form State ───────────────────────────────────────────────────────────────

export interface ComplaintFormData {
  title: string;
  description: string;
  category: ComplaintCategory;
  priority: ComplaintPriority;
  coordinates: Coordinates | null;
  address: string;
}

// ─── App View ─────────────────────────────────────────────────────────────────

export type AppView = 'map' | 'list';

export type Theme = 'dark' | 'light';
