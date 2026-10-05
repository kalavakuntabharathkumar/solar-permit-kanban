export interface SolarPermit {
  id: string;
  jobNumber: string;
  status: PermitStatus;
  submittedDate: string;
  approvedDate?: string;
  scheduledDate?: string;
  installedDate?: string;
  closedDate?: string;
  contractor: string;
  address: string;
  borough: string;
  zipCode: string;
  systemSizeKw: number;
  lastSynced: number;
  pendingSync: boolean;
}

export type PermitStatus = 'submitted' | 'approved' | 'scheduled' | 'installed' | 'closed';

export const STATUS_ORDER: PermitStatus[] = [
  'submitted',
  'approved',
  'scheduled',
  'installed',
  'closed',
];

export interface PermitFilters {
  status?: PermitStatus[];
  borough?: string[];
  contractor?: string;
  dateRange?: { start: string; end: string };
}

export interface SyncResult {
  success: number;
  failed: number;
  conflicts: number;
}