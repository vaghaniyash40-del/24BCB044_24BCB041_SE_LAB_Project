import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import {
  Lock,
  User,
  Shield,
  Building,
  KeyRound,
  Eye,
  EyeOff,
  AlertCircle,
  ShieldCheck,
  Check,
  Info
} from 'lucide-react';

interface SignInProps {
  onSuccess?: () => void;
}

export const SignIn: React.FC<SignInProps> = ({ onSuccess }) => {
  const { login } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
    setError(null);
    setIdentifier('');
    setPassword('');
  };

  const handleApplyCredentialsToForm = (id: string, pass: string, role: UserRole) => {
    setSelectedRole(role);
    setIdentifier(id);
    setPassword(pass);
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password.trim()) {
      setError('Please enter both your Roll Number / Email and password.');
      return;
    }
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      const res = login(identifier, password, selectedRole);
      setIsLoading(false);
      if (!res.success) {
        setError(res.error || 'Authentication failed. Please verify credentials.');
      } else {
        onSuccess?.();
      }
    }, 350);
  };

  return (
    <div className="max-w-md mx-auto my-6 bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
      {/* Top Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 p-6 text-white text-center relative">
        <div className="w-12 h-12 mx-auto rounded-xl bg-blue-600 flex items-center justify-center text-white mb-3 shadow-lg shadow-blue-500/30">
          <Building className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold tracking-tight text-white">Hostel Management Portal</h2>
        <p className="text-xs text-blue-200 mt-1">
          Secure Role-Based Authentication System (IEEE 830 FR-01)
        </p>

        <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-[11px] font-mono border border-blue-400/30">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Role Guard Active • Login Required</span>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Role Selector Tabs */}
        <div>
          <label className="text-xs font-semibold text-slate-500 block mb-2 uppercase tracking-wider text-center">
            Select Portal Account Type:
          </label>
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl">
            <button
              type="button"
              onClick={() => handleRoleChange('student')}
              className={`flex flex-col items-center gap-1 py-2 px-1 rounded-lg text-xs font-semibold transition-all ${
                selectedRole === 'student'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Student</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleChange('admin')}
              className={`flex flex-col items-center gap-1 py-2 px-1 rounded-lg text-xs font-semibold transition-all ${
                selectedRole === 'admin'
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>Admin</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleChange('warden')}
              className={`flex flex-col items-center gap-1 py-2 px-1 rounded-lg text-xs font-semibold transition-all ${
                selectedRole === 'warden'
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <KeyRound className="w-4 h-4" />
              <span>Warden</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              {selectedRole === 'student' ? 'Student Roll Number or Email' : 'Official Email Address'}
            </label>
            <div className="relative">
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder={selectedRole === 'student' ? 'e.g. 24BCB044, 23ICT015, 22BCP021, 25IEE029' : selectedRole === 'admin' ? 'e.g. admin@hostel.edu' : 'e.g. warden1@hostel.edu'}
                className="w-full pl-3 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 font-medium"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter account password"
                className="w-full pl-3 pr-10 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg transition-colors shadow-2xs flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Lock className="w-3.5 h-3.5" />
                <span>
                  Sign In to {selectedRole === 'student' ? 'Student' : selectedRole === 'admin' ? 'Administrator' : 'Warden'} Portal
                </span>
              </>
            )}
          </button>
        </form>

        {/* Demo Credentials Reference Box */}
        <div className="border-t border-slate-100 pt-4 space-y-2.5">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
            <div className="flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-blue-500" />
              <span>Valid Roll Number Formats (24-26 BCB &amp; 22-26 ICT/BCP/IEE):</span>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-lg border border-blue-200 bg-blue-50/50 flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="font-semibold text-blue-950 block">🎓 Student: Yash Vaghani (24BCB044)</span>
                <span className="text-[11px] text-blue-800 font-mono">Password: password123 • (Also: 23ICT015, 22BCP021, 25IEE029)</span>
              </div>
              <button
                type="button"
                onClick={() => handleApplyCredentialsToForm('24BCB044', 'password123', 'student')}
                className="text-[11px] font-semibold text-blue-700 bg-white border border-blue-300 hover:bg-blue-100 px-2 py-1 rounded transition-colors"
              >
                Use in Form
              </button>
            </div>

            <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <span className="font-semibold text-slate-900 block">Admin (Dr. Rajesh Mehta)</span>
                <span className="text-[11px] text-slate-700 font-mono">Email: admin@hostel.edu • Pass: adminpassword</span>
              </div>
              <button
                type="button"
                onClick={() => handleApplyCredentialsToForm('admin@hostel.edu', 'adminpassword', 'admin')}
                className="text-[11px] font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 px-2 py-1 rounded transition-colors"
              >
                Use in Form
              </button>
            </div>

            <div className="p-2.5 rounded-lg border border-indigo-200 bg-indigo-50/50 flex items-center justify-between">
              <div>
                <span className="font-semibold text-indigo-950 block">Warden (Mr. R. Sharma)</span>
                <span className="text-[11px] text-indigo-800 font-mono">Email: warden1@hostel.edu • Pass: wardenpassword</span>
              </div>
              <button
                type="button"
                onClick={() => handleApplyCredentialsToForm('warden1@hostel.edu', 'wardenpassword', 'warden')}
                className="text-[11px] font-semibold text-indigo-700 bg-white border border-indigo-300 hover:bg-indigo-100 px-2 py-1 rounded transition-colors"
              >
                Use in Form
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
