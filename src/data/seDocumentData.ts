import { ScrumTask } from '../types';

export const LAB_STUDENT_INFO = {
  studentName: 'Yash Bhaveshbhai Vaghani',
  rollNumber: '24BCB044',
  division: 'div 1 – (j2)',
  labSession: 'LAB SESSION 01: Project Selection and Team Formation',
  theme: 'Hostel Management System',
  roles: [
    {
      role: 'Product Owner',
      member: 'Harsh Parmar (24BCB041)',
      duties: 'Decides feature priorities, coordinates with hostel staff, and defines rules for leave approvals.'
    },
    {
      role: 'Scrum Master',
      member: 'Yash Vaghani (24BCB044), Harsh Parmar (24BCB041)',
      duties: 'Manages the task board, tracks development progress, and clears work blocks.'
    },
    {
      role: 'Developers',
      member: 'Yash Vaghani (24BCB044)',
      duties: 'Handles database architecture, user authentication, and web interface design.'
    }
  ],
  abstract: `The Hostel Management System is a web platform built to handle everyday hostel tasks without relying on paper registers. Tracking room allocations, approving out-passes, and filing complaints manually often causes delays. The platform provides separate access portals for students, wardens, and administrators. Students can check room details, submit leave requests, report maintenance issues with photos, and view the daily mess menu. Wardens can review out-pass applications and track room occupancy, while administrators oversee system settings and reports.`
};

export interface QuestionnaireItem {
  id: number;
  question: string;
  clientAnswer: string;
  softwareEngineeringDesignDecision: string;
  impactedUMLDiagrams: string[];
}

export const QUESTIONNAIRE_DECISIONS: QuestionnaireItem[] = [
  {
    id: 1,
    question: 'Should wardens assign rooms manually, or should the system assign them automatically based on available beds?',
    clientAnswer: 'Both modes should be supported: an automatic algorithm assigns available beds based on floor/block capacity, but administrators/wardens retain manual override capability.',
    softwareEngineeringDesignDecision: 'Implemented a dual-mode RoomAllocationEngine with autoAssignBeds() rule checker and manual assignBed() override. Reflected in Class Diagram and Activity Diagram.',
    impactedUMLDiagrams: ['Class Diagram', 'Sequence Diagram 3', 'Activity Diagram']
  },
  {
    id: 2,
    question: 'If a student wants to go out during late-night curfew hours, should they need special approval?',
    clientAnswer: 'Yes. Any out-pass departure or return scheduled between 21:00 (9 PM) and 06:00 (6 AM) requires mandatory special justification and warden verification with emergency guardian contact.',
    softwareEngineeringDesignDecision: 'Configured an <<extend>> relationship on OutPass Use Case. State machine transitions into PENDING_CURFEW_APPROVAL requiring warden two-step authorization and parent phone notification.',
    impactedUMLDiagrams: ['Use Case Diagram', 'Sequence Diagram 1', 'State Machine Diagram']
  },
  {
    id: 3,
    question: 'How will wardens take daily attendance—using portal entries or scanning student ID cards?',
    clientAnswer: 'Hybrid approach: Wardens use tablet/mobile portal entries for room-to-room roll calls, or quick barcode scanning of physical/digital student ID cards at hostel entry points.',
    softwareEngineeringDesignDecision: 'AttendanceRecord entity supports verificationMethod enum ("WARDEN_PORTAL" | "BARCODE_SCAN"). Synchronized automatically against active approved out-passes to mark "ON_LEAVE" automatically.',
    impactedUMLDiagrams: ['Activity Diagram 2', 'Class Diagram', 'Component Diagram']
  },
  {
    id: 4,
    question: 'Can students view the contact details or names of their assigned roommates on their profile page?',
    clientAnswer: 'Yes. Students assigned to the same room can view room occupant names, bed numbers, and emergency contact details to facilitate community bonding.',
    softwareEngineeringDesignDecision: 'Encapsulated Student::getRoommates() method in Domain Model with privacy filters (only roommates of active assigned room).',
    impactedUMLDiagrams: ['Class Diagram', 'ER Diagram', 'Use Case Diagram']
  },
  {
    id: 5,
    question: 'What happens if a repair complaint is not updated or resolved within 48 hours?',
    clientAnswer: 'If a complaint remains unresolved past 48 hours, it must automatically escalate to High Priority and notify the Chief Hostel Administrator.',
    softwareEngineeringDesignDecision: 'Engineered an SLA background cron watcher that checks (NOW() > sla_deadline AND status != RESOLVED), firing an automated state transition to ESCALATED_SLA with high-priority admin banner.',
    impactedUMLDiagrams: ['Sequence Diagram 2', 'State Machine Diagram 2', 'Class Diagram']
  },
  {
    id: 6,
    question: 'Does the admin page need a built-in payment link or gateway to track hostel fees?',
    clientAnswer: 'Yes. The system requires an integrated fee ledger showing total dues, payment history, and payment gateway simulation with instant receipt generation.',
    softwareEngineeringDesignDecision: 'Created FeeLedger and PaymentTransaction modules with reconciliation dashboard and downloadable fee audit reports.',
    impactedUMLDiagrams: ['Use Case Diagram', 'Component Diagram', 'Deployment Diagram']
  },
  {
    id: 7,
    question: 'Can students give star ratings or feedback on the daily mess food through the portal?',
    clientAnswer: 'Yes. Daily meal cards (Breakfast, Lunch, Snacks, Dinner) allow 1-5 star ratings and qualitative reviews to improve food quality.',
    softwareEngineeringDesignDecision: 'Formulated MessMenu & MessRating entities with aggregated averageRating calculation and warden feedback metrics.',
    impactedUMLDiagrams: ['Class Diagram', 'Use Case Diagram', 'ER Diagram']
  },
  {
    id: 8,
    question: 'Are students allowed to edit an out-pass request after it has been submitted for approval?',
    clientAnswer: 'No. To maintain audit integrity and prevent unauthorized changes after warden inspection, requests become immutable once in "Submitted" state.',
    softwareEngineeringDesignDecision: 'Enforced strict state machine immutability: SUBMITTED state rejects field mutation. To make changes, student must cancel and submit a new request.',
    impactedUMLDiagrams: ['State Machine Diagram 1', 'Activity Diagram 1']
  },
  {
    id: 9,
    question: 'What specific monthly reports does the admin need to see (e.g., total complaints, fee dues, attendance)?',
    clientAnswer: 'Monthly executive summaries covering total complaints vs resolution rate, curfew breach logs, pending fee dues by block, and average mess ratings.',
    softwareEngineeringDesignDecision: 'Engineered ReportService supporting automated monthly aggregations and CSV/PDF exportable data models.',
    impactedUMLDiagrams: ['Use Case Diagram', 'Component Diagram']
  },
  {
    id: 10,
    question: 'What security measures are needed to ensure students cannot access warden or admin pages?',
    clientAnswer: 'Strict Role-Based Access Control (RBAC) with secure session authentication and route protection so students cannot invoke administrative endpoints.',
    softwareEngineeringDesignDecision: 'Implemented JWT & RoleGuard middleware with UI-level and API-level authorization checks (Student vs Warden vs Administrator).',
    impactedUMLDiagrams: ['Component Diagram', 'Deployment Diagram', 'Use Case Diagram']
  }
];

export const INITIAL_SCRUM_TASKS: ScrumTask[] = [
  {
    id: 'TASK-1',
    title: 'Project Abstract and Client Requirements Questionnaire',
    description: 'Finalize core problem statement, stakeholder identification, and questionnaire with 10 critical operational rules.',
    category: 'Done',
    assignee: 'Yash Vaghani (24BCB044)',
    priority: 'high',
    tags: ['SE-Lab-1', 'Requirements', 'Documentation']
  },
  {
    id: 'TASK-2',
    title: 'Room Assignment Logic Check',
    description: 'Implement bed availability constraints, floor capacity validation, and automatic vs manual allocation algorithms.',
    category: 'Testing',
    assignee: 'Harsh Parmar (24BCB041)',
    priority: 'medium',
    tags: ['Allocation', 'Testing', 'Logic']
  },
  {
    id: 'TASK-3',
    title: 'Database Setup & Relational Schema',
    description: 'Configure relational schema (PostgreSQL) for Users, Students, Wardens, Rooms, OutPasses, and Maintenance Complaints.',
    category: 'In Progress',
    assignee: 'Yash Vaghani (24BCB044)',
    priority: 'critical',
    tags: ['Database', 'Postgres', 'Backend']
  },
  {
    id: 'TASK-4',
    title: 'Out-Pass Request Form Design',
    description: 'Build responsive out-pass request UI with automated late-night curfew detection and guardian contact prompts.',
    category: 'In Progress',
    assignee: 'Yash Vaghani (24BCB044)',
    priority: 'high',
    tags: ['Frontend', 'UI/UX', 'OutPass']
  },
  {
    id: 'TASK-5',
    title: 'Secure Login Routing & RBAC',
    description: 'Role-based access control protecting student, warden, and administrator routes and data views.',
    category: 'Backlog',
    assignee: 'Yash Vaghani (24BCB044)',
    priority: 'critical',
    tags: ['Security', 'Auth', 'RBAC']
  },
  {
    id: 'TASK-6',
    title: 'Mess Food Rating Module',
    description: 'Daily interactive mess menu with meal rating stars and constructive feedback aggregation.',
    category: 'Backlog',
    assignee: 'Harsh Parmar (24BCB041)',
    priority: 'medium',
    tags: ['Mess', 'Feature']
  },
  {
    id: 'TASK-7',
    title: 'Admin Fee Dashboard & Payment Simulation',
    description: 'Financial ledger tracking room fees, pending dues, installment schedules, and receipt generation.',
    category: 'Backlog',
    assignee: 'Harsh Parmar (24BCB041)',
    priority: 'medium',
    tags: ['Finance', 'Admin']
  },
  {
    id: 'TASK-8',
    title: 'Automated Late Notice & 48h SLA Alerts',
    description: 'Cron daemon trigger for curfew return violations and automatic escalation of repair complaints over 48 hours.',
    category: 'Backlog',
    assignee: 'Yash Vaghani (24BCB044)',
    priority: 'high',
    tags: ['Alerts', 'SLA', 'Cron']
  }
];

export const IEEE_SRS_DATA = {
  title: 'Software Requirements Specification (IEEE 830 Standard)',
  project: 'Hostel Management Web Platform',
  version: '1.0.0',
  preparedFor: 'Software Engineering Lab Session 01 & System Architecture Submission',
  author: 'Yash Bhaveshbhai Vaghani (24BCB044) & Harsh Parmar (24BCB041)',
  functionalRequirements: [
    {
      id: 'FR-01',
      title: 'Role-Based Authentication & Guarding',
      spec: 'The system must authenticate users via encrypted credentials and restrict interface access strictly according to Student, Warden, or Administrator role.'
    },
    {
      id: 'FR-02',
      title: 'Digital Out-Pass Workflow with Curfew Check',
      spec: 'Students must be able to file out-pass applications. If departure/return intersects curfew hours (21:00-06:00), the system must enforce special approval workflow and parent verification.'
    },
    {
      id: 'FR-03',
      title: 'Photo-Enabled Maintenance Logging & 48h SLA Escalation',
      spec: 'Students must be able to log repair tickets with photo uploads. If not marked resolved within 48 hours, the ticket automatically escalates to Chief Administrator with SLA breach alert.'
    },
    {
      id: 'FR-04',
      title: 'Dual Attendance Roll Call (Roster & Barcode)',
      spec: 'Wardens must be able to conduct evening roll calls either by checking room rosters or scanning student ID barcodes. System auto-cross references approved leaves.'
    },
    {
      id: 'FR-05',
      title: 'Mess Schedule & Food Quality Auditing',
      spec: 'The system must publish daily breakfast, lunch, snack, and dinner menus with real-time 1-5 star ratings and student feedback.'
    },
    {
      id: 'FR-06',
      title: 'Room Capacity & Bed Allocation Engine',
      spec: 'Admins can perform automatic bed assignments based on block availability or execute manual room transfers with zero double-booking.'
    }
  ],
  nonFunctionalRequirements: [
    {
      id: 'NFR-01',
      category: 'Security & Access Control',
      metric: 'Zero access leakage between roles; all passwords hashed with bcrypt / argon2; JWT token expiration after 8 hours.'
    },
    {
      id: 'NFR-02',
      category: 'Availability & Reliability',
      metric: '99.9% uptime during evening roll call and curfew inspection windows (20:00 to 23:00 daily).'
    },
    {
      id: 'NFR-03',
      category: 'Performance & Response Time',
      metric: 'Page load under 1.2s; Barcode scan verification under 400ms on mobile devices.'
    },
    {
      id: 'NFR-04',
      category: 'Auditability & Immutability',
      metric: 'Out-passes become read-only once submitted; all warden approvals log exact timestamp and employee ID.'
    }
  ]
};
