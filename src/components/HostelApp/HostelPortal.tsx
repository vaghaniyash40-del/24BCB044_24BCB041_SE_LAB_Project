import React, { useState, useEffect } from 'react';
import {
  Student,
  Warden,
  Room,
  OutPass,
  MaintenanceComplaint,
  MessItem,
  AttendanceRecord,
  BranchType
} from '../../types';
import {
  generateSeedStudents,
  generateSeedRooms,
  SEED_WARDENS,
  INITIAL_OUTPASSES,
  INITIAL_COMPLAINTS,
  INITIAL_MESS_ITEMS
} from '../../data/seedData';
import { useAuth } from '../../context/AuthContext';
import { SignIn } from '../Auth/SignIn';
import {
  User,
  Shield,
  Building,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Camera,
  Star,
  QrCode,
  CreditCard,
  Download,
  Users,
  Send,
  Sparkles,
  PhoneCall,
  Calendar,
  BedDouble,
  DollarSign,
  Search,
  Check,
  RefreshCw,
  LogOut,
  Sliders,
  Filter,
  FileSpreadsheet,
  KeyRound,
  Plus,
  Trash2,
  Edit,
  Eye,
  CheckSquare,
  AlertCircle
} from 'lucide-react';

interface HostelPortalProps {
  activeSection?: string;
}

export const HostelPortal: React.FC<HostelPortalProps> = ({ activeSection }) => {
  const { user, logout } = useAuth();

  // Persistent / Initial State with full 100 Students and 5 Wardens across all branches
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('hms_students_data_v3');
    if (saved) {
      try { return JSON.parse(saved); } catch { return generateSeedStudents(); }
    }
    return generateSeedStudents();
  });

  const [wardens, setWardens] = useState<Warden[]>(() => {
    const saved = localStorage.getItem('hms_wardens_data_v3');
    if (saved) {
      try { return JSON.parse(saved); } catch { return SEED_WARDENS; }
    }
    return SEED_WARDENS;
  });

  const [rooms, setRooms] = useState<Room[]>(() => {
    const saved = localStorage.getItem('hms_rooms_data_v3');
    if (saved) {
      try { return JSON.parse(saved); } catch { return generateSeedRooms(generateSeedStudents()); }
    }
    return generateSeedRooms(generateSeedStudents());
  });

  const [outPasses, setOutPasses] = useState<OutPass[]>(() => {
    const saved = localStorage.getItem('hms_outpasses_data_v3');
    if (saved) {
      try { return JSON.parse(saved); } catch { return INITIAL_OUTPASSES; }
    }
    return INITIAL_OUTPASSES;
  });

  const [complaints, setComplaints] = useState<MaintenanceComplaint[]>(() => {
    const saved = localStorage.getItem('hms_complaints_data_v3');
    if (saved) {
      try { return JSON.parse(saved); } catch { return INITIAL_COMPLAINTS; }
    }
    return INITIAL_COMPLAINTS;
  });

  const [messItems, setMessItems] = useState<MessItem[]>(() => {
    const saved = localStorage.getItem('hms_mess_data_v3');
    if (saved) {
      try { return JSON.parse(saved); } catch { return INITIAL_MESS_ITEMS; }
    }
    return INITIAL_MESS_ITEMS;
  });

  // Current Logged-in Student (Defaults to Yash Vaghani 24BCB044)
  const currentStudent = students.find(s => s.rollNumber === (user?.rollNumber || '24BCB044')) || students[0];

  // Tab State
  const [activeStudentTab, setActiveStudentTab] = useState<'profile' | 'outpass' | 'complaints' | 'mess' | 'fees'>('profile');
  const [activeAdminTab, setActiveAdminTab] = useState<'users' | 'rooms' | 'complaints' | 'reports'>('users');
  const [activeWardenTab, setActiveWardenTab] = useState<'outpass' | 'attendance' | 'curfew'>('outpass');

  // Search & Filters in Admin
  const [studentSearch, setStudentSearch] = useState('');
  const [studentBlockFilter, setStudentBlockFilter] = useState<'all' | 'StayWell Boys Wing' | 'StayWell Girls Wing'>('all');
  const [studentBranchFilter, setStudentBranchFilter] = useState<string>('all');
  const [studentBatchFilter, setStudentBatchFilter] = useState<string>('all');
  const [userManagementMode, setUserManagementMode] = useState<'students' | 'wardens'>('students');

  // New Student Form Modal State
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentRoll, setNewStudentRoll] = useState('');
  const [newStudentBranch, setNewStudentBranch] = useState<BranchType>('BCB');
  const [newStudentBatch, setNewStudentBatch] = useState<string>('2024');
  const [newStudentGender, setNewStudentGender] = useState<'male' | 'female'>('male');
  const [newStudentRoom, setNewStudentRoom] = useState('101');
  const [newStudentPhone, setNewStudentPhone] = useState('+91 98700 00000');

  // New Warden Modal State
  const [showAddWardenModal, setShowAddWardenModal] = useState(false);
  const [newWardenName, setNewWardenName] = useState('');
  const [newWardenEmail, setNewWardenEmail] = useState('');
  const [newWardenBlock, setNewWardenBlock] = useState<'StayWell Boys Wing' | 'StayWell Girls Wing'>('StayWell Boys Wing');
  const [newWardenShift, setNewWardenShift] = useState<'Morning' | 'Evening' | 'Night'>('Evening');

  // OutPass Form State
  const [newPassType, setNewPassType] = useState<'day_pass' | 'home_leave' | 'late_curfew_emergency'>('late_curfew_emergency');
  const [newDestination, setNewDestination] = useState('Central University CS Computer Lab');
  const [newDeparture, setNewDeparture] = useState('18:00');
  const [newReturn, setNewReturn] = useState('22:30');
  const [newPurpose, setNewPurpose] = useState('Academic laboratory assignment work and system testing.');
  const [newCurfewReason, setNewCurfewReason] = useState('Project deadline submission with team.');
  const [newParentPhone, setNewParentPhone] = useState('+91 98111 22334');
  const [outPassAlert, setOutPassAlert] = useState<string | null>(null);

  // Complaint Form State
  const [compCategory, setCompCategory] = useState<'plumbing' | 'electricity' | 'wifi' | 'furniture'>('plumbing');
  const [compTitle, setCompTitle] = useState('');
  const [compDesc, setCompDesc] = useState('');
  const [compPhotoSim, setCompPhotoSim] = useState(false);
  const [compSuccess, setCompSuccess] = useState(false);

  // Attendance scanner simulation
  const [scannerRoll, setScannerRoll] = useState('24BCB044');
  const [scanResult, setScanResult] = useState<string | null>(null);

  // Sync with navbar
  useEffect(() => {
    if (activeSection === 'outpass') {
      setActiveStudentTab('outpass');
      setActiveWardenTab('outpass');
    } else if (activeSection === 'maintenance') {
      setActiveStudentTab('complaints');
      setActiveAdminTab('complaints');
    } else if (activeSection === 'mess') {
      setActiveStudentTab('mess');
    } else if (activeSection === 'rooms') {
      setActiveStudentTab('profile');
      setActiveAdminTab('rooms');
    } else if (activeSection === 'fees') {
      setActiveStudentTab('fees');
    }
  }, [activeSection]);

  // Persist State to localStorage
  useEffect(() => {
    localStorage.setItem('hms_students_data_v3', JSON.stringify(students));
    localStorage.setItem('hms_wardens_data_v3', JSON.stringify(wardens));
    localStorage.setItem('hms_rooms_data_v3', JSON.stringify(rooms));
    localStorage.setItem('hms_outpasses_data_v3', JSON.stringify(outPasses));
    localStorage.setItem('hms_complaints_data_v3', JSON.stringify(complaints));
    localStorage.setItem('hms_mess_data_v3', JSON.stringify(messItems));
  }, [students, wardens, rooms, outPasses, complaints, messItems]);

  if (!user) {
    return (
      <div className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 text-blue-900 p-4 rounded-xl text-center text-xs font-semibold">
          Hostel Residential Access: Please sign in as Student, Administrator, or Warden.
        </div>
        <SignIn />
      </div>
    );
  }

  const isCurfew = (timeStr: string) => {
    const hours = parseInt(timeStr.split(':')[0], 10);
    return hours >= 21 || hours < 6;
  };

  // Student Actions
  const handleApplyOutPass = (e: React.FormEvent) => {
    e.preventDefault();
    const curfewBreached = isCurfew(newReturn);

    const newPass: OutPass = {
      id: `OP-${Math.floor(1000 + Math.random() * 9000)}`,
      studentId: currentStudent.id,
      studentName: currentStudent.name,
      rollNumber: currentStudent.rollNumber,
      roomNumber: currentStudent.roomNumber,
      block: currentStudent.block,
      type: newPassType,
      purpose: newPurpose,
      departureTime: `2026-10-28T${newDeparture}`,
      expectedReturnTime: `2026-10-28T${newReturn}`,
      destination: newDestination,
      isCurfewHours: curfewBreached,
      specialApprovalReason: curfewBreached ? newCurfewReason : undefined,
      parentPhone: newParentPhone,
      status: 'under_review',
      appliedAt: new Date().toISOString()
    };

    setOutPasses([newPass, ...outPasses]);
    setOutPassAlert('Out-Pass request submitted successfully! Under review by Duty Warden.');
    setTimeout(() => setOutPassAlert(null), 5000);
  };

  const handleCreateComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!compTitle || !compDesc) return;

    const newComp: MaintenanceComplaint = {
      id: `CMP-${Math.floor(400 + Math.random() * 500)}`,
      studentId: currentStudent.id,
      studentName: currentStudent.name,
      roomNumber: currentStudent.roomNumber,
      block: currentStudent.block,
      category: compCategory,
      title: compTitle,
      description: compDesc,
      status: 'logged',
      loggedAt: new Date().toISOString(),
      slaDeadline: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
      isOverdue: false,
      imageUrl: compPhotoSim ? 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&auto=format&fit=crop&q=60' : undefined
    };

    setComplaints([newComp, ...complaints]);
    setCompTitle('');
    setCompDesc('');
    setCompSuccess(true);
    setTimeout(() => setCompSuccess(false), 4000);
  };

  // Admin Actions
  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName || !newStudentRoll) return;

    const targetBlock = newStudentGender === 'male' ? 'StayWell Boys Wing' : 'StayWell Girls Wing';
    const newStu: Student = {
      id: `STU-${newStudentGender[0].toUpperCase()}-${Date.now().toString().slice(-4)}`,
      name: newStudentName,
      rollNumber: newStudentRoll.toUpperCase().trim(),
      email: `${newStudentName.toLowerCase().replace(/[^a-z]/g, '.')}@hostel.edu`,
      gender: newStudentGender,
      block: targetBlock,
      roomNumber: newStudentRoom,
      bedNumber: 'Bed 1',
      division: 'div 1',
      branch: newStudentBranch,
      batch: newStudentBatch,
      contact: newStudentPhone,
      guardianContact: '+91 98111 00000',
      status: 'active',
      feeStatus: { total: 75000, paid: 40000, due: 35000, dueDate: '2026-11-15' }
    };

    setStudents([newStu, ...students]);
    setShowAddStudentModal(false);
    setNewStudentName('');
    setNewStudentRoll('');
  };

  const handleDeleteStudent = (roll: string) => {
    if (window.confirm(`Are you sure you want to delete student ${roll}?`)) {
      setStudents(students.filter(s => s.rollNumber !== roll));
    }
  };

  const handleAddWarden = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWardenName || !newWardenEmail) return;

    const newW: Warden = {
      id: `WRD-${Date.now().toString().slice(-3)}`,
      name: newWardenName,
      email: newWardenEmail,
      contact: '+91 98234 99999',
      assignedBlock: newWardenBlock,
      shift: newWardenShift,
      status: 'active'
    };

    setWardens([...wardens, newW]);
    setShowAddWardenModal(false);
    setNewWardenName('');
    setNewWardenEmail('');
  };

  const handleDeleteWarden = (id: string) => {
    if (window.confirm(`Are you sure you want to remove warden ${id}?`)) {
      setWardens(wardens.filter(w => w.id !== id));
    }
  };

  // Filtered Students in Admin Table
  const filteredStudents = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
                          s.rollNumber.toLowerCase().includes(studentSearch.toLowerCase()) ||
                          s.roomNumber.includes(studentSearch);
    const matchesBlock = studentBlockFilter === 'all' || s.block === studentBlockFilter;
    const matchesBranch = studentBranchFilter === 'all' || s.branch === studentBranchFilter || s.rollNumber.includes(studentBranchFilter);
    const matchesBatch = studentBatchFilter === 'all' || s.batch === studentBatchFilter || s.rollNumber.startsWith(studentBatchFilter.slice(2));
    return matchesSearch && matchesBlock && matchesBranch && matchesBatch;
  });

  return (
    <div className="space-y-6">
      {/* Authenticated Session Header */}
      <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 shrink-0">
            {user.role === 'admin' ? (
              <Shield className="w-5 h-5 text-amber-600" />
            ) : user.role === 'warden' ? (
              <KeyRound className="w-5 h-5 text-indigo-600" />
            ) : (
              <User className="w-5 h-5 text-blue-600" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900">{user.name}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
                user.role === 'admin'
                  ? 'bg-amber-100 text-amber-800 border border-amber-200'
                  : user.role === 'warden'
                  ? 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                  : 'bg-blue-100 text-blue-800 border border-blue-200'
              }`}>
                {user.role} Console
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Authenticated Session • Role-Based Access Control (RBAC) Active
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors border border-slate-200"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. STUDENT PORTAL */}
      {/* ========================================================================= */}
      {user.role === 'student' && (
        <div className="space-y-6">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 rounded-2xl p-6 text-white shadow-md">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white font-bold text-xl shadow-inner">
                  {currentStudent.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold">{currentStudent.name}</h2>
                    <span className="px-2 py-0.5 rounded-full bg-blue-500/30 text-blue-200 text-xs font-mono font-semibold border border-blue-400/30">
                      {currentStudent.rollNumber}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-white/20 text-white text-xs font-semibold">
                      {currentStudent.division}
                    </span>
                  </div>
                  <p className="text-sm text-blue-100 mt-0.5">
                    {currentStudent.block} • Room {currentStudent.roomNumber} ({currentStudent.bedNumber})
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20 text-center min-w-[110px]">
                  <span className="text-[10px] text-blue-200 uppercase tracking-wider block">Curfew Hours</span>
                  <span className="text-xs font-bold text-emerald-300 flex items-center justify-center gap-1 mt-0.5">
                    21:00 - 06:00
                  </span>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20 text-center min-w-[110px]">
                  <span className="text-[10px] text-blue-200 uppercase tracking-wider block">Fee Dues</span>
                  <span className="text-xs font-bold text-amber-300 mt-0.5 block">
                    ₹{currentStudent.feeStatus.due.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Sub-tabs */}
          <div className="flex border-b border-slate-200 gap-2 sm:gap-4 text-xs font-semibold overflow-x-auto">
            {[
              { id: 'profile', label: 'Room & Inhabitants', icon: Users },
              { id: 'outpass', label: 'Out-Pass & Curfew', icon: Clock },
              { id: 'complaints', label: 'Maintenance (48h SLA)', icon: AlertTriangle },
              { id: 'mess', label: 'Mess Menu & Rating', icon: Star },
              { id: 'fees', label: 'Fees Ledger', icon: CreditCard }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveStudentTab(tab.id as any)}
                  className={`flex items-center gap-2 pb-3 pt-1 border-b-2 transition-all whitespace-nowrap ${
                    activeStudentTab === tab.id
                      ? 'border-blue-600 text-blue-600 font-bold'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* TAB 1: Profile & Roommates */}
          {activeStudentTab === 'profile' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7 bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="font-bold text-slate-900 text-base">
                    Room {currentStudent.roomNumber} Inhabitants ({currentStudent.block})
                  </h3>
                  <p className="text-xs text-slate-500">Contact details of assigned roommates.</p>
                </div>

                <div className="space-y-3">
                  {students
                    .filter(s => s.block === currentStudent.block && s.roomNumber === currentStudent.roomNumber)
                    .map((stu) => {
                      const isMe = stu.rollNumber === currentStudent.rollNumber;
                      return (
                        <div
                          key={stu.id}
                          className={`p-4 rounded-xl border flex flex-wrap items-center justify-between gap-3 text-xs ${
                            isMe ? 'border-blue-300 bg-blue-50/50' : 'border-slate-200 bg-slate-50/50'
                          }`}
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <strong className="text-slate-900 font-bold text-sm">{stu.name}</strong>
                              {isMe ? (
                                <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">YOU</span>
                              ) : null}
                              <span className="bg-slate-200 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                {stu.bedNumber}
                              </span>
                            </div>
                            <p className="text-slate-600 text-[11px] mt-0.5">
                              Roll: {stu.rollNumber} • Phone: {stu.contact}
                            </p>
                          </div>
                          {!isMe && (
                            <a
                              href={`tel:${stu.contact}`}
                              className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-100 font-semibold flex items-center gap-1.5 shadow-2xs"
                            >
                              <PhoneCall className="w-3.5 h-3.5 text-blue-600" /> Call
                            </a>
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Digital ID */}
              <div className="lg:col-span-5 bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4 text-center">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="font-bold text-slate-900 text-base">Digital Hostel Barcode ID</h3>
                  <p className="text-xs text-slate-500">Scan at entrance or show to warden during roll call.</p>
                </div>

                <div className="p-4 bg-slate-900 text-white rounded-xl text-left space-y-3 font-mono shadow-md">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                    <span className="text-[10px] text-blue-400 uppercase">HOSTEL RESIDENT IDENTITY</span>
                    <span className="text-[10px] text-emerald-400 font-bold">VERIFIED</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{currentStudent.name}</h4>
                    <p className="text-xs text-slate-400">Roll: {currentStudent.rollNumber}</p>
                    <p className="text-xs text-slate-400">Room: {currentStudent.roomNumber} • {currentStudent.block}</p>
                  </div>
                  <div className="bg-white p-3 rounded text-center text-slate-900">
                    <div className="h-9 flex items-center justify-center gap-1">
                      {[3, 1, 4, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 2, 4, 1, 2, 3].map((w, i) => (
                        <div key={i} className="h-full bg-black" style={{ width: `${w * 2}px` }} />
                      ))}
                    </div>
                    <span className="text-[10px] font-mono tracking-widest text-slate-600 block mt-1">
                      * {currentStudent.rollNumber}-HOSTEL *
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Out-Pass */}
          {activeStudentTab === 'outpass' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-6 bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="font-bold text-slate-900 text-base">Apply for Out-Pass / Campus Leave</h3>
                  <p className="text-xs text-slate-500">Curfew hours: 21:00 (9 PM) to 06:00 (6 AM).</p>
                </div>

                {outPassAlert && (
                  <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs rounded-lg flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{outPassAlert}</span>
                  </div>
                )}

                <form onSubmit={handleApplyOutPass} className="space-y-4 text-xs">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Pass Category</label>
                    <select
                      value={newPassType}
                      onChange={(e) => setNewPassType(e.target.value as any)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium"
                    >
                      <option value="day_pass">Standard Daytime Pass (Return before 21:00)</option>
                      <option value="late_curfew_emergency">Late Curfew Emergency Pass (Return after 21:00)</option>
                      <option value="home_leave">Multi-Day Home Leave</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Departure Time</label>
                      <input
                        type="time"
                        value={newDeparture}
                        onChange={(e) => setNewDeparture(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                        required
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Expected Return Time</label>
                      <input
                        type="time"
                        value={newReturn}
                        onChange={(e) => setNewReturn(e.target.value)}
                        className={`w-full px-3 py-2 bg-slate-50 border rounded-lg text-slate-800 ${
                          isCurfew(newReturn) ? 'border-amber-400 bg-amber-50/50' : 'border-slate-200'
                        }`}
                        required
                      />
                    </div>
                  </div>

                  {isCurfew(newReturn) && (
                    <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-lg space-y-2">
                      <div className="flex items-center gap-1.5 text-amber-900 font-bold">
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                        <span>Curfew Hours Detected (Past 21:00)</span>
                      </div>
                      <p className="text-[11px] text-amber-800">
                        Late-night returns require emergency guardian verification and special justification.
                      </p>
                      <div>
                        <label className="font-semibold text-amber-900 block mb-0.5">Special Justification</label>
                        <input
                          type="text"
                          value={newCurfewReason}
                          onChange={(e) => setNewCurfewReason(e.target.value)}
                          placeholder="e.g. Lab sprint milestone work"
                          className="w-full px-2.5 py-1.5 bg-white border border-amber-300 rounded text-slate-800"
                          required
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-amber-900 block mb-0.5">Guardian Phone Number</label>
                        <input
                          type="text"
                          value={newParentPhone}
                          onChange={(e) => setNewParentPhone(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-white border border-amber-300 rounded text-slate-800 font-mono"
                          required
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Destination</label>
                    <input
                      type="text"
                      value={newDestination}
                      onChange={(e) => setNewDestination(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                      required
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Detailed Purpose</label>
                    <textarea
                      rows={2}
                      value={newPurpose}
                      onChange={(e) => setNewPurpose(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors shadow-2xs"
                  >
                    Submit Out-Pass Request
                  </button>
                </form>
              </div>

              {/* History */}
              <div className="lg:col-span-6 space-y-4">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="font-bold text-slate-900 text-base">Your Out-Pass History</h3>
                    <span className="text-xs text-slate-400">Total: {outPasses.filter(p => p.rollNumber === currentStudent.rollNumber).length}</span>
                  </div>

                  <div className="space-y-3 max-h-[480px] overflow-y-auto">
                    {outPasses
                      .filter(p => p.rollNumber === currentStudent.rollNumber)
                      .map((pass) => (
                        <div key={pass.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-mono font-bold text-slate-800">{pass.id}</span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                pass.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                                pass.status === 'under_review' ? 'bg-blue-100 text-blue-800' : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              {pass.status.replace('_', ' ')}
                            </span>
                          </div>
                          <p className="text-slate-700 font-medium">{pass.purpose}</p>
                          <div className="text-[11px] text-slate-500 flex justify-between">
                            <span>To: <strong>{pass.destination}</strong></span>
                            <span>Return: <strong>{pass.expectedReturnTime}</strong></span>
                          </div>
                          {pass.wardenComments && (
                            <div className="p-2 bg-slate-100 rounded text-[11px] text-slate-600">
                              <strong>Warden Remarks:</strong> {pass.wardenComments}
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Maintenance */}
          {activeStudentTab === 'complaints' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-5 bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Report Maintenance Issue</h3>
                  <p className="text-xs text-slate-500">48-Hour SLA resolution guarantee.</p>
                </div>

                {compSuccess && (
                  <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs rounded-lg flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Ticket logged! 48-Hour resolution countdown active.</span>
                  </div>
                )}

                <form onSubmit={handleCreateComplaint} className="space-y-4 text-xs">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Issue Category</label>
                    <select
                      value={compCategory}
                      onChange={(e) => setCompCategory(e.target.value as any)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium"
                    >
                      <option value="plumbing">Plumbing (Tap / Sink / Drain / Geyser)</option>
                      <option value="electricity">Electrical (Light / Switch / Fan / Socket)</option>
                      <option value="wifi">Hostel Wi-Fi &amp; Internet LAN</option>
                      <option value="furniture">Furniture (Desk / Bed / Chair / Almirah)</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Issue Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Bathroom sink leaking"
                      value={compTitle}
                      onChange={(e) => setCompTitle(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                      required
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Description</label>
                    <textarea
                      rows={3}
                      placeholder="Describe what is damaged..."
                      value={compDesc}
                      onChange={(e) => setCompDesc(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                      required
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Mock Photo Upload</label>
                    <div
                      onClick={() => setCompPhotoSim(!compPhotoSim)}
                      className={`border-2 border-dashed rounded-lg p-3 text-center cursor-pointer transition-all ${
                        compPhotoSim ? 'border-emerald-500 bg-emerald-50/40 text-emerald-800' : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                      }`}
                    >
                      <Camera className="w-5 h-5 mx-auto mb-1 text-slate-400" />
                      <span className="text-[11px]">
                        {compPhotoSim ? '✓ Damage Evidence Attached (photo_evidence.jpg)' : 'Click to attach photo evidence (Mock)'}
                      </span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors shadow-2xs"
                  >
                    Submit Ticket
                  </button>
                </form>
              </div>

              {/* Active tickets */}
              <div className="lg:col-span-7 bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="font-bold text-slate-900 text-base">Active Maintenance Complaints (Room {currentStudent.roomNumber})</h3>
                  <p className="text-xs text-slate-500">Tickets tracked against 48h SLA.</p>
                </div>

                <div className="space-y-3">
                  {complaints
                    .filter(c => c.roomNumber === currentStudent.roomNumber && c.block === currentStudent.block)
                    .map((c) => (
                      <div key={c.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-slate-900">#{c.id}</span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              c.status === 'resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {c.status.replace('_', ' ')}
                          </span>
                        </div>
                        <h4 className="font-bold text-slate-900 text-sm">{c.title}</h4>
                        <p className="text-slate-600 text-xs">{c.description}</p>
                        <div className="p-2.5 bg-white border border-slate-200 rounded flex justify-between items-center text-[11px]">
                          <span>48h SLA Deadline: <strong>{new Date(c.slaDeadline).toLocaleString()}</strong></span>
                          {c.technicianAssigned && <span>Tech: <strong>{c.technicianAssigned}</strong></span>}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Mess */}
          {activeStudentTab === 'mess' && (
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-900 text-base">Today's Mess Menu &amp; Food Quality Ratings</h3>
                <p className="text-xs text-slate-500">Rate daily meals 1 to 5 stars to improve dining hall quality.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {messItems.map((meal) => (
                  <div key={meal.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 flex flex-col justify-between space-y-3 text-xs">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <strong className="text-slate-900 text-sm">{meal.mealType}</strong>
                        <span className="flex items-center gap-1 font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                          {meal.averageRating}
                        </span>
                      </div>
                      <ul className="space-y-1 text-slate-600 text-[11px]">
                        {meal.items.map((it, idx) => (
                          <li key={idx} className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                            <span>{it}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="border-t border-slate-200 pt-3">
                      <span className="text-[11px] font-semibold text-slate-500 block mb-1">Your Rating:</span>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((starVal) => (
                          <button
                            key={starVal}
                            onClick={() => {
                              setMessItems(messItems.map(m => m.id === meal.id ? { ...m, userRated: starVal } : m));
                              alert(`Thank you for rating ${meal.mealType} ${starVal} stars!`);
                            }}
                            className="p-1 hover:scale-110 transition-transform"
                          >
                            <Star
                              className={`w-4 h-4 ${
                                (meal.userRated || 0) >= starVal ? 'fill-amber-400 text-amber-500' : 'text-slate-300'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: Fees */}
          {activeStudentTab === 'fees' && (
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-900 text-base">Hostel Fee Ledger &amp; Online Payment</h3>
                <p className="text-xs text-slate-500">Term boarding and mess fee invoice.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-xs text-slate-500">Total Term Fee</span>
                  <p className="text-xl font-bold text-slate-900 mt-1">₹{currentStudent.feeStatus.total.toLocaleString()}</p>
                </div>
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                  <span className="text-xs text-emerald-700">Amount Paid</span>
                  <p className="text-xl font-bold text-emerald-900 mt-1">₹{currentStudent.feeStatus.paid.toLocaleString()}</p>
                </div>
                <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                  <span className="text-xs text-amber-700">Outstanding Due</span>
                  <p className="text-xl font-bold text-amber-900 mt-1">₹{currentStudent.feeStatus.due.toLocaleString()}</p>
                </div>
              </div>

              {currentStudent.feeStatus.due > 0 ? (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div>
                    <strong className="text-slate-900 block font-bold">Due Date: {currentStudent.feeStatus.dueDate}</strong>
                    <span className="text-slate-500">Pay via UPI, Debit Card, or Netbanking.</span>
                  </div>
                  <button
                    onClick={() => {
                      setStudents(students.map(s => s.rollNumber === currentStudent.rollNumber ? {
                        ...s,
                        feeStatus: { ...s.feeStatus, paid: s.feeStatus.total, due: 0 }
                      } : s));
                      alert(`Payment of ₹${currentStudent.feeStatus.due.toLocaleString()} successful! Receipt generated.`);
                    }}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg flex items-center gap-2 shadow-2xs transition-colors"
                  >
                    <CreditCard className="w-4 h-4" /> Pay ₹{currentStudent.feeStatus.due.toLocaleString()} Online
                  </button>
                </div>
              ) : (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center justify-between">
                  <span>All hostel dues for this term are cleared!</span>
                  <button className="px-3 py-1.5 bg-white border border-emerald-300 rounded text-emerald-800 font-semibold flex items-center gap-1">
                    <Download className="w-3.5 h-3.5" /> Download PDF Receipt
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. ADMIN DASHBOARD */}
      {/* ========================================================================= */}
      {user.role === 'admin' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 text-white shadow-md">
            <h2 className="text-xl font-bold">Hostel Administration Console: Dr. Rajesh Mehta</h2>
            <p className="text-xs text-slate-300 mt-1">
              Full CRUD System: User Management (100 Students, 5 Wardens), Room Allocations, Central Complaints, and Reports.
            </p>
          </div>

          {/* Admin Sub-Tabs */}
          <div className="flex border-b border-slate-200 gap-2 sm:gap-4 text-xs font-semibold overflow-x-auto">
            {[
              { id: 'users', label: 'User Management (CRUD)', icon: Users },
              { id: 'rooms', label: 'Room Allocation Module', icon: BedDouble },
              { id: 'complaints', label: 'Central Complaint Box', icon: AlertTriangle },
              { id: 'reports', label: 'System Reports & Overviews', icon: FileSpreadsheet }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveAdminTab(tab.id as any)}
                  className={`flex items-center gap-2 pb-3 pt-1 border-b-2 transition-all whitespace-nowrap ${
                    activeAdminTab === tab.id
                      ? 'border-blue-600 text-blue-600 font-bold'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* TAB 1: User Management (CRUD) */}
          {activeAdminTab === 'users' && (
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setUserManagementMode('students')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      userManagementMode === 'students' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    Students Directory ({students.length})
                  </button>
                  <button
                    onClick={() => setUserManagementMode('wardens')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      userManagementMode === 'wardens' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    Wardens Directory ({wardens.length})
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {userManagementMode === 'students' ? (
                    <button
                      onClick={() => setShowAddStudentModal(true)}
                      className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs"
                    >
                      <Plus className="w-4 h-4" /> Add Student
                    </button>
                  ) : (
                    <button
                      onClick={() => setShowAddWardenModal(true)}
                      className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs"
                    >
                      <Plus className="w-4 h-4" /> Appoint Warden
                    </button>
                  )}
                </div>
              </div>

              {/* Students View */}
              {userManagementMode === 'students' && (
                <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden space-y-3 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="relative flex-1 min-w-[200px]">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search student by name, roll no (e.g. 24BCB044, 23ICT015), or room..."
                        value={studentSearch}
                        onChange={(e) => setStudentSearch(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                      />
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-500 font-semibold">Block:</span>
                        <select
                          value={studentBlockFilter}
                          onChange={(e) => setStudentBlockFilter(e.target.value as any)}
                          className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                        >
                          <option value="all">All Wings (100)</option>
                          <option value="StayWell Boys Wing">StayWell Boys Wing (50)</option>
                          <option value="StayWell Girls Wing">StayWell Girls Wing (50)</option>
                        </select>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-500 font-semibold">Branch:</span>
                        <select
                          value={studentBranchFilter}
                          onChange={(e) => setStudentBranchFilter(e.target.value)}
                          className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-semibold"
                        >
                          <option value="all">All Branches</option>
                          <option value="BCB">BCB (24 to 26)</option>
                          <option value="ICT">ICT (22 to 26)</option>
                          <option value="BCP">BCP (22 to 26)</option>
                          <option value="IEE">IEE (22 to 26)</option>
                        </select>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-500 font-semibold">Batch:</span>
                        <select
                          value={studentBatchFilter}
                          onChange={(e) => setStudentBatchFilter(e.target.value)}
                          className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-semibold"
                        >
                          <option value="all">All Batches</option>
                          <option value="2022">Batch 2022 (22...)</option>
                          <option value="2023">Batch 2023 (23...)</option>
                          <option value="2024">Batch 2024 (24...)</option>
                          <option value="2025">Batch 2025 (25...)</option>
                          <option value="2026">Batch 2026 (26...)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Table with horizontal scroll on mobile */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-700 divide-y divide-slate-200">
                      <thead className="bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                        <tr>
                          <th className="py-2.5 px-3">Roll No</th>
                          <th className="py-2.5 px-3">Name</th>
                          <th className="py-2.5 px-3">Branch &amp; Batch</th>
                          <th className="py-2.5 px-3">Gender / Block</th>
                          <th className="py-2.5 px-3">Room / Bed</th>
                          <th className="py-2.5 px-3">Contact</th>
                          <th className="py-2.5 px-3">Fee Status</th>
                          <th className="py-2.5 px-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredStudents.slice(0, 30).map((stu) => (
                          <tr key={stu.id} className="hover:bg-slate-50/70 transition-colors">
                            <td className="py-2.5 px-3 font-mono font-bold text-slate-900">
                              <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                                {stu.rollNumber}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 font-medium text-slate-900">{stu.name}</td>
                            <td className="py-2.5 px-3">
                              <div className="flex items-center gap-1.5">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono border ${
                                  stu.branch === 'BCB'
                                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                                    : stu.branch === 'ICT'
                                    ? 'bg-purple-50 text-purple-700 border-purple-200'
                                    : stu.branch === 'BCP'
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                    : 'bg-amber-50 text-amber-700 border-amber-200'
                                }`}>
                                  {stu.branch}
                                </span>
                                <span className="text-[10px] text-slate-500 font-mono">
                                  {stu.batch}
                                </span>
                              </div>
                            </td>
                            <td className="py-2.5 px-3">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                stu.gender === 'male' ? 'bg-blue-100 text-blue-800' : 'bg-rose-100 text-rose-800'
                              }`}>
                                {stu.block.split(' ')[0]}
                              </span>
                            </td>
                            <td className="py-2.5 px-3">Room {stu.roomNumber} ({stu.bedNumber})</td>
                            <td className="py-2.5 px-3 font-mono text-[11px]">{stu.contact}</td>
                            <td className="py-2.5 px-3">
                              {stu.feeStatus.due === 0 ? (
                                <span className="text-emerald-700 font-semibold">Cleared</span>
                              ) : (
                                <span className="text-amber-700 font-semibold">₹{stu.feeStatus.due.toLocaleString()} Due</span>
                              )}
                            </td>
                            <td className="py-2.5 px-3 text-right">
                              <button
                                onClick={() => handleDeleteStudent(stu.rollNumber)}
                                className="p-1 text-rose-600 hover:bg-rose-50 rounded"
                                title="Delete Student"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="text-[11px] text-slate-400 text-right">Showing {Math.min(30, filteredStudents.length)} of {filteredStudents.length} students</p>
                </div>
              )}

              {/* Wardens View */}
              {userManagementMode === 'wardens' && (
                <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden p-4 space-y-3">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-700 divide-y divide-slate-200">
                      <thead className="bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                        <tr>
                          <th className="py-2.5 px-3">ID</th>
                          <th className="py-2.5 px-3">Name</th>
                          <th className="py-2.5 px-3">Email</th>
                          <th className="py-2.5 px-3">Assigned Block</th>
                          <th className="py-2.5 px-3">Shift</th>
                          <th className="py-2.5 px-3">Contact</th>
                          <th className="py-2.5 px-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {wardens.map((w) => (
                          <tr key={w.id} className="hover:bg-slate-50/70 transition-colors">
                            <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{w.id}</td>
                            <td className="py-2.5 px-3 font-medium text-slate-900">{w.name}</td>
                            <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500">{w.email}</td>
                            <td className="py-2.5 px-3 font-semibold text-slate-800">{w.assignedBlock}</td>
                            <td className="py-2.5 px-3">
                              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                                {w.shift}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 font-mono text-[11px]">{w.contact}</td>
                            <td className="py-2.5 px-3 text-right">
                              <button
                                onClick={() => handleDeleteWarden(w.id)}
                                className="p-1 text-rose-600 hover:bg-rose-50 rounded"
                                title="Remove Warden"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Room Allocation Module */}
          {activeAdminTab === 'rooms' && (
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Room Allocation Engine (Boys &amp; Girls Blocks)</h3>
                  <p className="text-xs text-slate-500">Assign students to specific blocks and rooms with zero double-booking.</p>
                </div>
                <button
                  onClick={() => {
                    alert('Automated Batch Bed Allocation Engine executed! Vacant beds matched to pending students with gender constraints.');
                  }}
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Run Automated Batch Allocation
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Boys Block */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg border border-blue-200 text-xs">
                    <strong className="text-blue-900">StayWell Boys Wing</strong>
                    <span className="font-mono text-blue-700 font-bold">50 Students / 51 Capacity</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[350px] overflow-y-auto">
                    {rooms.filter(r => r.block === 'StayWell Boys Wing').map((r) => {
                      const isFull = r.occupied >= r.capacity;
                      return (
                        <div key={r.id} className={`p-3 rounded-xl border text-xs space-y-1 ${
                          isFull ? 'bg-slate-50 border-slate-200' : 'bg-emerald-50/50 border-emerald-300'
                        }`}>
                          <div className="flex justify-between font-bold text-slate-900">
                            <span>Room {r.roomNumber}</span>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded ${isFull ? 'bg-slate-200 text-slate-700' : 'bg-emerald-100 text-emerald-800'}`}>
                              {r.occupied}/{r.capacity}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-500 truncate">
                            {r.occupantIds.slice(0, 2).join(', ')}{r.occupantIds.length > 2 ? '...' : ''}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Girls Block */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between bg-rose-50 p-3 rounded-lg border border-rose-200 text-xs">
                    <strong className="text-rose-900">StayWell Girls Wing</strong>
                    <span className="font-mono text-rose-700 font-bold">50 Students / 51 Capacity</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[350px] overflow-y-auto">
                    {rooms.filter(r => r.block === 'StayWell Girls Wing').map((r) => {
                      const isFull = r.occupied >= r.capacity;
                      return (
                        <div key={r.id} className={`p-3 rounded-xl border text-xs space-y-1 ${
                          isFull ? 'bg-slate-50 border-slate-200' : 'bg-emerald-50/50 border-emerald-300'
                        }`}>
                          <div className="flex justify-between font-bold text-slate-900">
                            <span>Room {r.roomNumber}</span>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded ${isFull ? 'bg-slate-200 text-slate-700' : 'bg-emerald-100 text-emerald-800'}`}>
                              {r.occupied}/{r.capacity}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-500 truncate">
                            {r.occupantIds.slice(0, 2).join(', ')}{r.occupantIds.length > 2 ? '...' : ''}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Central Complaint Box */}
          {activeAdminTab === 'complaints' && (
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
              <div className="border-b border-slate-100 pb-3 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Central Complaint Box &amp; SLA Monitor</h3>
                  <p className="text-xs text-slate-500">Track and update the status of maintenance complaints across all blocks.</p>
                </div>
              </div>

              <div className="space-y-3">
                {complaints.map((c) => (
                  <div key={c.id} className={`p-4 rounded-xl border text-xs space-y-2 ${
                    c.status === 'escalated_sla' ? 'bg-rose-50 border-rose-300 ring-2 ring-rose-400/20' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-900">{c.id}</span>
                        <span className="capitalize font-semibold text-slate-600">({c.category})</span>
                        <span className="text-[11px] text-slate-500">• {c.block} (Room {c.roomNumber})</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        c.status === 'escalated_sla' ? 'bg-rose-600 text-white animate-pulse' :
                        c.status === 'resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {c.status.replace('_', ' ')}
                      </span>
                    </div>

                    <h4 className="font-bold text-slate-900 text-sm">{c.title}</h4>
                    <p className="text-slate-600">{c.description}</p>

                    <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-200/70 text-[11px]">
                      <span>Student: <strong>{c.studentName}</strong> • Logged: {new Date(c.loggedAt).toLocaleDateString()}</span>
                      <div className="flex items-center gap-2">
                        {c.status !== 'resolved' && (
                          <button
                            onClick={() => {
                              setComplaints(complaints.map(item => item.id === c.id ? { ...item, status: 'resolved' } : item));
                              alert(`Ticket ${c.id} marked as RESOLVED!`);
                            }}
                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded"
                          >
                            Mark Resolved
                          </button>
                        )}
                        {c.status === 'logged' && (
                          <button
                            onClick={() => {
                              setComplaints(complaints.map(item => item.id === c.id ? { ...item, status: 'in_progress', technicianAssigned: 'Assigned Senior Tech' } : item));
                            }}
                            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded"
                          >
                            Assign Technician
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: Reports */}
          {activeAdminTab === 'reports' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-center">
                <div className="bg-white p-4 rounded-xl border border-slate-200">
                  <span className="text-xs text-slate-500">Total Registered Students</span>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{students.length}</p>
                  <span className="text-[10px] text-blue-600 font-semibold">50 Boys / 50 Girls</span>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200">
                  <span className="text-xs text-slate-500">Appointed Wardens</span>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{wardens.length}</p>
                  <span className="text-[10px] text-slate-400">All Blocks Covered</span>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200">
                  <span className="text-xs text-slate-500">Room Occupancy</span>
                  <p className="text-2xl font-bold text-emerald-600 mt-1">98.0%</p>
                  <span className="text-[10px] text-slate-400">100 / 102 Beds Filled</span>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200">
                  <span className="text-xs text-slate-500">Pending Out-Passes</span>
                  <p className="text-2xl font-bold text-amber-600 mt-1">{outPasses.filter(p => p.status === 'under_review').length}</p>
                  <span className="text-[10px] text-slate-400">Under Warden Review</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-3">
                <h3 className="font-bold text-slate-900 text-base">Export System Reports (CSV)</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <button
                    onClick={() => {
                      const csv = 'RollNumber,Name,Block,Room,Bed,Status,FeeDue\n' + students.map(s => `${s.rollNumber},${s.name},${s.block},${s.roomNumber},${s.bedNumber},${s.status},${s.feeStatus.due}`).join('\n');
                      const blob = new Blob([csv], { type: 'text/csv' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a'); a.href = url; a.download = 'students_roster_100.csv'; a.click();
                    }}
                    className="p-3 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 flex items-center justify-center gap-2 font-semibold text-slate-800"
                  >
                    <Download className="w-4 h-4 text-blue-600" /> Export 100 Students Roster
                  </button>
                  <button
                    onClick={() => {
                      const csv = 'TicketID,Student,Room,Block,Category,Status,Overdue\n' + complaints.map(c => `${c.id},${c.studentName},${c.roomNumber},${c.block},${c.category},${c.status},${c.isOverdue}`).join('\n');
                      const blob = new Blob([csv], { type: 'text/csv' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a'); a.href = url; a.download = 'complaints_audit.csv'; a.click();
                    }}
                    className="p-3 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 flex items-center justify-center gap-2 font-semibold text-slate-800"
                  >
                    <Download className="w-4 h-4 text-emerald-600" /> Export Complaints Audit
                  </button>
                  <button
                    onClick={() => {
                      const csv = 'PassID,Student,Roll,Block,Destination,ReturnTime,CurfewHours,Status\n' + outPasses.map(p => `${p.id},${p.studentName},${p.rollNumber},${p.block},${p.destination},${p.expectedReturnTime},${p.isCurfewHours},${p.status}`).join('\n');
                      const blob = new Blob([csv], { type: 'text/csv' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a'); a.href = url; a.download = 'outpass_logs.csv'; a.click();
                    }}
                    className="p-3 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 flex items-center justify-center gap-2 font-semibold text-slate-800"
                  >
                    <Download className="w-4 h-4 text-purple-600" /> Export Out-Pass Logs
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. WARDEN DASHBOARD */}
      {/* ========================================================================= */}
      {user.role === 'warden' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-indigo-800 to-indigo-950 rounded-2xl p-6 text-white shadow-md">
            <h2 className="text-xl font-bold">Hostel Warden Operational Console</h2>
            <p className="text-xs text-indigo-200 mt-1">
              Duty Officer: Mr. Rameshwar Sharma • Assigned: StayWell Boys Wing • Evening Shift
            </p>
          </div>

          <div className="flex border-b border-slate-200 gap-4 text-xs font-semibold">
            {[
              { id: 'outpass', label: 'Out-Pass Management', icon: Clock },
              { id: 'attendance', label: 'Daily Roll Call & Attendance', icon: QrCode },
              { id: 'curfew', label: 'Curfew Monitoring', icon: AlertTriangle }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveWardenTab(tab.id as any)}
                  className={`flex items-center gap-2 pb-3 pt-1 border-b-2 transition-all ${
                    activeWardenTab === tab.id
                      ? 'border-indigo-600 text-indigo-600 font-bold'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {activeWardenTab === 'outpass' && (
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
              <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
                <h3 className="font-bold text-slate-900 text-base">Pending Leave Applications</h3>
                <span className="text-xs font-semibold px-2.5 py-0.5 bg-blue-100 text-blue-800 rounded-full">
                  {outPasses.filter(p => p.status === 'under_review').length} Pending
                </span>
              </div>

              <div className="space-y-3">
                {outPasses.filter(p => p.status === 'under_review').map((pass) => (
                  <div key={pass.id} className="p-4 rounded-xl border border-amber-200 bg-amber-50/30 space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <strong className="text-slate-900 text-sm">{pass.studentName} ({pass.rollNumber})</strong>
                      {pass.isCurfewHours && (
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-900 font-bold text-[10px] rounded border border-amber-300">
                          Curfew Alert (Return &gt; 21:00)
                        </span>
                      )}
                    </div>
                    <p className="text-slate-700"><strong>Destination:</strong> {pass.destination} | <strong>Return:</strong> {pass.expectedReturnTime}</p>
                    <p className="text-slate-600"><strong>Purpose:</strong> {pass.purpose}</p>
                    {pass.specialApprovalReason && (
                      <p className="text-amber-900"><strong>Curfew Justification:</strong> {pass.specialApprovalReason}</p>
                    )}
                    {pass.parentPhone && (
                      <p className="text-slate-500"><strong>Parent Contact:</strong> {pass.parentPhone} (Call to verify)</p>
                    )}
                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        onClick={() => {
                          setOutPasses(outPasses.map(p => p.id === pass.id ? { ...p, status: 'rejected', wardenComments: 'Declined' } : p));
                        }}
                        className="px-3 py-1.5 bg-white border border-rose-300 text-rose-700 rounded font-semibold"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => {
                          setOutPasses(outPasses.map(p => p.id === pass.id ? { ...p, status: 'approved', wardenComments: 'Approved by Warden' } : p));
                        }}
                        className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-semibold"
                      >
                        Approve Out-Pass
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeWardenTab === 'attendance' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-5 bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="font-bold text-slate-900 text-base">Evening Attendance Barcode Scanner</h3>
                  <p className="text-xs text-slate-500">Scan or enter student roll number.</p>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={scannerRoll}
                      onChange={(e) => setScannerRoll(e.target.value)}
                      placeholder="e.g. 24BCB044"
                      className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono"
                    />
                    <button
                      onClick={() => {
                        const targetStu = students.find(s => s.rollNumber.toLowerCase() === scannerRoll.toLowerCase());
                        if (targetStu) {
                          setScanResult(`✓ Verified: ${targetStu.name} (Room ${targetStu.roomNumber}, ${targetStu.block}) • Attendance Marked PRESENT`);
                        } else {
                          setScanResult(`✓ Scanned Roll ${scannerRoll} • Marked PRESENT`);
                        }
                      }}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg flex items-center gap-1.5"
                    >
                      <QrCode className="w-3.5 h-3.5" /> Scan ID
                    </button>
                  </div>

                  {scanResult && (
                    <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-lg text-emerald-900 font-medium text-xs">
                      {scanResult}
                    </div>
                  )}
                </div>
              </div>

              <div className="lg:col-span-7 bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-3">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="font-bold text-slate-900 text-base">StayWell Boys Wing Attendance Roster</h3>
                  <p className="text-xs text-slate-500">Floor 3 Evening Roll Call.</p>
                </div>
                <div className="divide-y divide-slate-100 text-xs">
                  {students.filter(s => s.block === 'StayWell Boys Wing').slice(0, 8).map((stu) => (
                    <div key={stu.id} className="py-2.5 flex items-center justify-between">
                      <span>Room {stu.roomNumber} - {stu.name} ({stu.rollNumber})</span>
                      <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Present</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeWardenTab === 'curfew' && (
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-900 text-base">Late Curfew Monitoring (21:00 - 06:00)</h3>
                <p className="text-xs text-slate-500">Students with late returns require verified guardian contacts.</p>
              </div>

              <div className="space-y-3">
                {outPasses.filter(p => p.isCurfewHours).map((pass) => (
                  <div key={pass.id} className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/40 text-xs space-y-1">
                    <div className="flex justify-between font-bold text-slate-900">
                      <span>{pass.studentName} ({pass.rollNumber}) - Room {pass.roomNumber}</span>
                      <span className="text-amber-800">Return: {pass.expectedReturnTime}</span>
                    </div>
                    <p className="text-slate-600"><strong>Justification:</strong> {pass.specialApprovalReason || pass.purpose}</p>
                    <p className="text-slate-500"><strong>Emergency Phone:</strong> {pass.parentPhone || '+91 98111 22334'}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal: Add Student */}
      {showAddStudentModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm">Add New Student to Hostel</h3>
              <button onClick={() => setShowAddStudentModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <form onSubmit={handleAddStudent} className="space-y-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Branch</label>
                  <select
                    value={newStudentBranch}
                    onChange={(e) => {
                      const b = e.target.value as BranchType;
                      setNewStudentBranch(b);
                      if (b === 'BCB' && (newStudentBatch === '2022' || newStudentBatch === '2023')) {
                        setNewStudentBatch('2024');
                      }
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-semibold"
                  >
                    <option value="BCB">BCB (24-26)</option>
                    <option value="ICT">ICT (22-26)</option>
                    <option value="BCP">BCP (22-26)</option>
                    <option value="IEE">IEE (22-26)</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Batch / Year</label>
                  <select
                    value={newStudentBatch}
                    onChange={(e) => setNewStudentBatch(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-semibold"
                  >
                    {newStudentBranch !== 'BCB' && (
                      <>
                        <option value="2022">Batch 2022</option>
                        <option value="2023">Batch 2023</option>
                      </>
                    )}
                    <option value="2024">Batch 2024</option>
                    <option value="2025">Batch 2025</option>
                    <option value="2026">Batch 2026</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Roll Number (Format: {newStudentBatch.slice(2)}{newStudentBranch}xxx)
                </label>
                <input
                  type="text"
                  placeholder={`e.g. ${newStudentBatch.slice(2)}${newStudentBranch}055`}
                  value={newStudentRoll}
                  onChange={(e) => setNewStudentRoll(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Gender</label>
                  <select
                    value={newStudentGender}
                    onChange={(e) => setNewStudentGender(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  >
                    <option value="male">Male (Boys Block)</option>
                    <option value="female">Female (Girls Block)</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Assigned Room</label>
                  <input
                    type="text"
                    value={newStudentRoom}
                    onChange={(e) => setNewStudentRoom(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Phone Number</label>
                <input
                  type="text"
                  value={newStudentPhone}
                  onChange={(e) => setNewStudentPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddStudentModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold"
                >
                  Save Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Warden */}
      {showAddWardenModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm">Appoint New Hostel Warden</h3>
              <button onClick={() => setShowAddWardenModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <form onSubmit={handleAddWarden} className="space-y-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Warden Name</label>
                <input
                  type="text"
                  placeholder="e.g. Mr. Alok Saxena"
                  value={newWardenName}
                  onChange={(e) => setNewWardenName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="warden@hostel.edu"
                  value={newWardenEmail}
                  onChange={(e) => setNewWardenEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Assigned Block</label>
                  <select
                    value={newWardenBlock}
                    onChange={(e) => setNewWardenBlock(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  >
                    <option value="StayWell Boys Wing">StayWell Boys Wing</option>
                    <option value="StayWell Girls Wing">StayWell Girls Wing</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Duty Shift</label>
                  <select
                    value={newWardenShift}
                    onChange={(e) => setNewWardenShift(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg"
                  >
                    <option value="Morning">Morning</option>
                    <option value="Evening">Evening</option>
                    <option value="Night">Night</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddWardenModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold"
                >
                  Appoint Warden
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
