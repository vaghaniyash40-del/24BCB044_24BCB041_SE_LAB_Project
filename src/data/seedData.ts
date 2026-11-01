import { Student, Warden, Room, OutPass, MaintenanceComplaint, MessItem, AttendanceRecord, BranchType } from '../types';

export const SEED_ADMIN = {
  id: 'ADM-1001',
  name: 'Dr. Rajesh Mehta',
  email: 'admin@hostel.edu',
  role: 'admin' as const,
  designation: 'Chief Hostel Administrator & Warden Dean'
};

export const SEED_WARDENS: Warden[] = [
  {
    id: 'WRD-501',
    name: 'Mr. Rameshwar Sharma',
    email: 'warden1@hostel.edu',
    contact: '+91 98234 56781',
    assignedBlock: 'StayWell Boys Wing',
    shift: 'Evening',
    status: 'active'
  },
  {
    id: 'WRD-502',
    name: 'Mrs. Sunita Rao',
    email: 'warden2@hostel.edu',
    contact: '+91 98234 56782',
    assignedBlock: 'StayWell Girls Wing',
    shift: 'Morning',
    status: 'active'
  },
  {
    id: 'WRD-503',
    name: 'Mr. Suresh Patel',
    email: 'warden3@hostel.edu',
    contact: '+91 98234 56783',
    assignedBlock: 'StayWell Boys Wing',
    shift: 'Morning',
    status: 'active'
  },
  {
    id: 'WRD-504',
    name: 'Mrs. Priya Nair',
    email: 'warden4@hostel.edu',
    contact: '+91 98234 56784',
    assignedBlock: 'StayWell Girls Wing',
    shift: 'Evening',
    status: 'active'
  },
  {
    id: 'WRD-505',
    name: 'Mr. Vikram Singh',
    email: 'warden5@hostel.edu',
    contact: '+91 98234 56785',
    assignedBlock: 'StayWell Boys Wing',
    shift: 'Night',
    status: 'active'
  }
];

// Helper to generate 50 Boys and 50 Girls
const boyNames = [
  'Yash Bhaveshbhai Vaghani', 'Harsh Parmar', 'Rohan Patel', 'Aman Verma', 'Karan Johar',
  'Aditya Sharma', 'Praveen Kumar', 'Siddharth Malhotra', 'Nikhil Rao', 'Gaurav Tiwari',
  'Tanmay Joshi', 'Vikas Singhal', 'Abhishek Gupta', 'Deepak Verma', 'Manish Pandey',
  'Rahul Dravid', 'Sachin Tendulkar', 'Virat Kohli', 'Rohit Sharma', 'Hardik Pandya',
  'Ravindra Jadeja', 'Jasprit Bumrah', 'Shubman Gill', 'Rishabh Pant', 'Shreyas Iyer',
  'KL Rahul', 'Mohammed Shami', 'Kuldeep Yadav', 'Yuzvendra Chahal', 'Axar Patel',
  'Ishant Sharma', 'Ajinkya Rahane', 'Cheteshwar Pujara', 'Umesh Yadav', 'Suryakumar Yadav',
  'Prithvi Shaw', 'Devdutt Padikkal', 'Ruturaj Gaikwad', 'Arshdeep Singh', 'Umran Malik',
  'Washington Sundar', 'Deepak Chahar', 'Shardul Thakur', 'Avesh Khan', 'Sanju Samson',
  'Ishan Kishan', 'Shivam Dube', 'Tilak Varma', 'Rinku Singh', 'Yashasvi Jaiswal'
];

const girlNames = [
  'Ananya Sharma', 'Priya Patel', 'Sneha Reddy', 'Ritu Desai', 'Kavita Iyer',
  'Pooja Verma', 'Neha Singh', 'Tanvi Mehta', 'Divya Nair', 'Swati Bhatt',
  'Simran Kaur', 'Meera Joshi', 'Rhea Chakraborty', 'Aishwarya Roy', 'Deepika Padukone',
  'Anushka Sharma', 'Alia Bhatt', 'Katrina Kaif', 'Kareena Kapoor', 'Priyanka Chopra',
  'Shraddha Kapoor', 'Kriti Sanon', 'Kiara Advani', 'Sara Ali Khan', 'Janhvi Kapoor',
  'Disha Patani', 'Taapsee Pannu', 'Bhumi Pednekar', 'Yami Gautam', 'Vidya Balan',
  'Sonam Kapoor', 'Parineeti Chopra', 'Huma Qureshi', 'Radhika Apte', 'Sanya Malhotra',
  'Fatima Sana Shaikh', 'Mrunal Thakur', 'Tara Sutaria', 'Ananya Panday', 'Rashmika Mandanna',
  'Samantha Ruth Prabhu', 'Nayanthara Kurian', 'Trisha Krishnan', 'Keerthy Suresh', 'Sai Pallavi',
  'Pooja Hegde', 'Tamannaah Bhatia', 'Kajal Aggarwal', 'Rakul Preet Singh', 'Ileana D\'Cruz'
];

const BRANCH_SPECS: { branch: BranchType; years: string[] }[] = [
  { branch: 'BCB', years: ['24', '25', '26'] },
  { branch: 'ICT', years: ['22', '23', '24', '25', '26'] },
  { branch: 'BCP', years: ['22', '23', '24', '25', '26'] },
  { branch: 'IEE', years: ['22', '23', '24', '25', '26'] }
];

export const generateSeedStudents = (): Student[] => {
  const students: Student[] = [];

  // 50 Boys in StayWell Boys Wing
  boyNames.forEach((name, index) => {
    let rollNumber: string;
    let branch: BranchType;
    let yearPrefix: string;

    if (index === 0) {
      // Yash Bhaveshbhai Vaghani
      rollNumber = '24BCB044';
      branch = 'BCB';
      yearPrefix = '24';
    } else if (index === 1) {
      // Harsh Parmar (Product Owner)
      rollNumber = '24BCB041';
      branch = 'BCB';
      yearPrefix = '24';
    } else {
      // Cycle through BCB (24-26), ICT (22-26), BCP (22-26), IEE (22-26)
      const spec = BRANCH_SPECS[index % BRANCH_SPECS.length];
      branch = spec.branch;
      yearPrefix = spec.years[Math.floor(index / BRANCH_SPECS.length) % spec.years.length];
      const seq = String(10 + index).padStart(3, '0');
      rollNumber = `${yearPrefix}${branch}${seq}`;
    }

    const roomNum = index < 3 ? '304' : `${101 + Math.floor(index / 3)}`;
    const bedNum = `Bed ${(index % 3) + 1}`;

    students.push({
      id: `STU-B-${100 + index}`,
      name,
      rollNumber,
      email: `${name.toLowerCase().replace(/[^a-z]/g, '.')}@hostel.edu`,
      gender: 'male',
      block: 'StayWell Boys Wing',
      roomNumber: roomNum,
      bedNumber: bedNum,
      branch,
      batch: `20${yearPrefix}`,
      division: index === 0 ? 'div 1 – (j2)' : (index % 2 === 0 ? 'div 1' : 'div 2'),
      contact: `+91 987${String(10000 + index).padStart(5, '0')}`,
      guardianContact: `+91 981${String(20000 + index).padStart(5, '0')}`,
      status: 'active',
      feeStatus: {
        total: 75000,
        paid: index === 0 ? 40000 : (index % 4 === 0 ? 75000 : 50000),
        due: index === 0 ? 35000 : (index % 4 === 0 ? 0 : 25000),
        dueDate: '2026-11-15'
      }
    });
  });

  // 50 Girls in StayWell Girls Wing
  girlNames.forEach((name, index) => {
    // Cycle across BCB (24-26), ICT (22-26), BCP (22-26), IEE (22-26)
    const spec = BRANCH_SPECS[(index + 1) % BRANCH_SPECS.length];
    const branch = spec.branch;
    const yearPrefix = spec.years[Math.floor((index + 1) / BRANCH_SPECS.length) % spec.years.length];
    const seq = String(100 + index).padStart(3, '0');
    const rollNumber = `${yearPrefix}${branch}${seq}`;

    const roomNum = `${101 + Math.floor(index / 3)}`;
    const bedNum = `Bed ${(index % 3) + 1}`;

    students.push({
      id: `STU-G-${200 + index}`,
      name,
      rollNumber,
      email: `${name.toLowerCase().replace(/[^a-z]/g, '.')}@hostel.edu`,
      gender: 'female',
      block: 'StayWell Girls Wing',
      roomNumber: roomNum,
      bedNumber: bedNum,
      branch,
      batch: `20${yearPrefix}`,
      division: index % 2 === 0 ? 'div 1' : 'div 2',
      contact: `+91 986${String(30000 + index).padStart(5, '0')}`,
      guardianContact: `+91 982${String(40000 + index).padStart(5, '0')}`,
      status: 'active',
      feeStatus: {
        total: 75000,
        paid: index % 3 === 0 ? 75000 : 45000,
        due: index % 3 === 0 ? 0 : 30000,
        dueDate: '2026-11-15'
      }
    });
  });

  return students;
};

export const generateSeedRooms = (students: Student[]): Room[] => {
  const rooms: Room[] = [];

  // Boys Rooms (17 rooms for 50 boys: 16 with 3, 1 with 2)
  const boysRooms = ['101', '102', '103', '104', '105', '201', '202', '203', '204', '205', '301', '302', '303', '304', '305', '306', '307'];
  boysRooms.forEach((rNum) => {
    const occupants = students.filter(s => s.block === 'StayWell Boys Wing' && s.roomNumber === rNum).map(s => s.name);
    rooms.push({
      id: `ROOM-B-${rNum}`,
      roomNumber: rNum,
      block: 'StayWell Boys Wing',
      floor: parseInt(rNum[0], 10),
      capacity: 3,
      occupied: occupants.length,
      occupantIds: occupants
    });
  });

  // Girls Rooms (17 rooms for 50 girls)
  const girlsRooms = ['101', '102', '103', '104', '105', '201', '202', '203', '204', '205', '301', '302', '303', '304', '305', '306', '307'];
  girlsRooms.forEach((rNum) => {
    const occupants = students.filter(s => s.block === 'StayWell Girls Wing' && s.roomNumber === rNum).map(s => s.name);
    rooms.push({
      id: `ROOM-G-${rNum}`,
      roomNumber: rNum,
      block: 'StayWell Girls Wing',
      floor: parseInt(rNum[0], 10),
      capacity: 3,
      occupied: occupants.length,
      occupantIds: occupants
    });
  });

  return rooms;
};

export const INITIAL_OUTPASSES: OutPass[] = [
  {
    id: 'OP-8902',
    studentId: 'STU-B-100',
    studentName: 'Yash Bhaveshbhai Vaghani',
    rollNumber: '24BCB044',
    roomNumber: '304',
    block: 'StayWell Boys Wing',
    type: 'late_curfew_emergency',
    purpose: 'University Software Engineering Lab Sprint Deployment',
    departureTime: '2026-10-28T18:00',
    expectedReturnTime: '2026-10-28T22:30', // > 21:00 Curfew
    destination: 'CS Computer Lab 3',
    isCurfewHours: true,
    specialApprovalReason: 'Urgent system deployment and lab milestone verification with Product Owner Harsh Parmar.',
    status: 'under_review',
    appliedAt: '2026-10-28T10:30',
    parentPhone: '+91 98120 00000'
  },
  {
    id: 'OP-8840',
    studentId: 'STU-B-100',
    studentName: 'Yash Bhaveshbhai Vaghani',
    rollNumber: '24BCB044',
    roomNumber: '304',
    block: 'StayWell Boys Wing',
    type: 'day_pass',
    purpose: 'Library Study & Reference Books Collection',
    departureTime: '2026-10-25T14:00',
    expectedReturnTime: '2026-10-25T19:00',
    destination: 'Central University Library',
    isCurfewHours: false,
    status: 'checked_in',
    wardenComments: 'Approved. Returned on time.',
    appliedAt: '2026-10-25T11:00',
    approvedAt: '2026-10-25T12:15'
  },
  {
    id: 'OP-8915',
    studentId: 'STU-G-200',
    studentName: 'Ananya Sharma',
    rollNumber: '24BCB110',
    roomNumber: '101',
    block: 'StayWell Girls Wing',
    type: 'late_curfew_emergency',
    purpose: 'Robotics Workshop in Central Campus',
    departureTime: '2026-10-28T17:30',
    expectedReturnTime: '2026-10-28T22:00',
    destination: 'Mech Workshop Hall',
    isCurfewHours: true,
    specialApprovalReason: 'Hardware testing for Inter-college competition.',
    status: 'under_review',
    appliedAt: '2026-10-28T11:15',
    parentPhone: '+91 98240 00000'
  },
  {
    id: 'OP-8822',
    studentId: 'STU-B-101',
    studentName: 'Harsh Parmar',
    rollNumber: '24BCB041',
    roomNumber: '304',
    block: 'StayWell Boys Wing',
    type: 'home_leave',
    purpose: 'Family Function in Ahmedabad',
    departureTime: '2026-10-29T08:00',
    expectedReturnTime: '2026-11-01T20:00',
    destination: 'Ahmedabad Home',
    isCurfewHours: false,
    status: 'approved',
    appliedAt: '2026-10-27T16:00',
    approvedAt: '2026-10-27T18:00',
    wardenComments: 'Approved by Mr. Rameshwar Sharma'
  }
];

export const INITIAL_COMPLAINTS: MaintenanceComplaint[] = [
  {
    id: 'CMP-401',
    studentId: 'STU-B-100',
    studentName: 'Yash Bhaveshbhai Vaghani',
    roomNumber: '304',
    block: 'StayWell Boys Wing',
    category: 'plumbing',
    title: 'Bathroom sink faucet continuous drip',
    description: 'Faucet handle is loose and water leaks continuously causing floor dampness.',
    status: 'in_progress',
    loggedAt: '2026-10-27T14:00:00',
    slaDeadline: '2026-10-29T14:00:00', // 48h from loggedAt
    isOverdue: false,
    technicianAssigned: 'Ramesh Kumar (Plumber)',
    imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&auto=format&fit=crop&q=60'
  },
  {
    id: 'CMP-395',
    studentId: 'STU-B-103',
    studentName: 'Aman Verma',
    roomNumber: '201',
    block: 'StayWell Boys Wing',
    category: 'wifi',
    title: 'Block B 2nd Floor Wi-Fi router reboot loop',
    description: 'Cannot connect to hostel LAN or access university study portal.',
    status: 'escalated_sla',
    loggedAt: '2026-10-25T08:00:00',
    slaDeadline: '2026-10-27T08:00:00', // Elapsed past 48h!
    isOverdue: true,
    technicianAssigned: 'Airtel NOC Senior Tech'
  },
  {
    id: 'CMP-408',
    studentId: 'STU-G-200',
    studentName: 'Ananya Sharma',
    roomNumber: '101',
    block: 'StayWell Girls Wing',
    category: 'electricity',
    title: 'Ceiling fan regulator stuck at top speed',
    description: 'Knob broken and making high noise.',
    status: 'logged',
    loggedAt: '2026-10-28T09:00:00',
    slaDeadline: '2026-10-30T09:00:00',
    isOverdue: false
  }
];

export const INITIAL_MESS_ITEMS: MessItem[] = [
  {
    id: 'MESS-1',
    day: 'Today (Wednesday)',
    mealType: 'Breakfast',
    items: ['Poha with Sev & Onions', 'Boiled Eggs / Bananas', 'Bread & Jam', 'Masala Tea', 'Filter Coffee'],
    averageRating: 4.3,
    totalRatings: 184,
    userRated: 4
  },
  {
    id: 'MESS-2',
    day: 'Today (Wednesday)',
    mealType: 'Lunch',
    items: ['Paneer Butter Masala', 'Dal Tadka', 'Jeera Rice', 'Butter Roti', 'Cucumber Salad', 'Papad'],
    averageRating: 4.6,
    totalRatings: 210,
    userRated: 5
  },
  {
    id: 'MESS-3',
    day: 'Today (Wednesday)',
    mealType: 'Snacks',
    items: ['Crispy Samosa (2 pcs)', 'Tamarind & Mint Chutney', 'Hot Ginger Tea'],
    averageRating: 4.1,
    totalRatings: 165
  },
  {
    id: 'MESS-4',
    day: 'Today (Wednesday)',
    mealType: 'Dinner',
    items: ['Mix Vegetable Curry', 'Dal Fry', 'Steamed Rice', 'Tawa Chapati', 'Hot Gulab Jamun'],
    averageRating: 4.5,
    totalRatings: 195
  }
];
