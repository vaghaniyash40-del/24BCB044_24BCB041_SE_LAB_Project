export type UserRole = 'student' | 'warden' | 'admin';
export type BlockType = 'boys' | 'girls';

export type BranchType = 'BCB' | 'ICT' | 'BCP' | 'IEE';

export interface Student {
  id: string;
  name: string;
  rollNumber: string;
  email: string;
  gender: 'male' | 'female';
  block: 'StayWell Boys Wing' | 'StayWell Girls Wing';
  roomNumber: string;
  bedNumber: string;
  division: string;
  branch: BranchType;
  batch: string;
  contact: string;
  guardianContact: string;
  status: 'active' | 'graduated' | 'suspended';
  feeStatus: {
    total: number;
    paid: number;
    due: number;
    dueDate: string;
  };
}

export interface Warden {
  id: string;
  name: string;
  email: string;
  contact: string;
  assignedBlock: 'StayWell Boys Wing' | 'StayWell Girls Wing';
  shift: 'Morning' | 'Evening' | 'Night';
  status: 'active' | 'on_leave';
}

export interface Room {
  id: string;
  roomNumber: string;
  block: 'StayWell Boys Wing' | 'StayWell Girls Wing';
  floor: number;
  capacity: number;
  occupied: number;
  occupantIds: string[];
}

export type OutPassType = 'day_pass' | 'home_leave' | 'late_curfew_emergency';
export type OutPassStatus = 'submitted' | 'under_review' | 'approved' | 'rejected' | 'checked_out' | 'checked_in';

export interface OutPass {
  id: string;
  studentId: string;
  studentName: string;
  rollNumber: string;
  roomNumber: string;
  block: string;
  type: OutPassType;
  purpose: string;
  departureTime: string;
  expectedReturnTime: string;
  actualReturnTime?: string;
  destination: string;
  isCurfewHours: boolean;
  specialApprovalReason?: string;
  status: OutPassStatus;
  wardenComments?: string;
  appliedAt: string;
  approvedAt?: string;
  parentPhone?: string;
}

export type ComplaintCategory = 'electricity' | 'plumbing' | 'furniture' | 'wifi' | 'cleanliness' | 'other';
export type ComplaintStatus = 'logged' | 'assigned' | 'in_progress' | 'escalated_sla' | 'resolved' | 'closed';

export interface MaintenanceComplaint {
  id: string;
  studentId: string;
  studentName: string;
  roomNumber: string;
  block: string;
  category: ComplaintCategory;
  title: string;
  description: string;
  imageUrl?: string;
  status: ComplaintStatus;
  loggedAt: string;
  slaDeadline: string; // 48h from loggedAt
  isOverdue: boolean;
  technicianAssigned?: string;
  resolutionNotes?: string;
}

export interface MessItem {
  id: string;
  day: string;
  mealType: 'Breakfast' | 'Lunch' | 'Snacks' | 'Dinner';
  items: string[];
  averageRating: number;
  totalRatings: number;
  userRated?: number;
  userComment?: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  rollNumber: string;
  roomNumber: string;
  block: string;
  date: string;
  status: 'present' | 'absent' | 'on_leave';
  markedAt: string;
  verifiedBy: 'warden_portal' | 'id_card_scan';
}

export interface ScrumTask {
  id: string;
  title: string;
  description: string;
  category: 'Backlog' | 'In Progress' | 'Testing' | 'Done';
  assignee: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  tags: string[];
}
