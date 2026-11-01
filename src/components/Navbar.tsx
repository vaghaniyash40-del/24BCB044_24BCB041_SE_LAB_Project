import React from 'react';
import {
  Building2,
  User,
  Shield,
  KeyRound,
  LogOut,
  LogIn,
  GraduationCap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  onOpenSignIn?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSignIn }) => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-xs">
      {/* 1. Top Global Bar */}
      <div className="bg-slate-900 text-slate-300 px-4 py-1.5 text-xs border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 sm:gap-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span className="font-semibold text-slate-200">StayWell Hostels</span>
            <span className="hidden sm:inline text-slate-600">|</span>
            <span className="hidden sm:inline text-slate-400 text-[11px]">
              Boys &amp; Girls Residential Wings
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <span className="inline-flex items-center gap-1.5 text-emerald-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live Portal
            </span>
            <span className="text-slate-600">•</span>
            <span>Academic Year 2026-27</span>
          </div>
        </div>
      </div>

      {/* 2. Main Header Row (Branding & User Account Status) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3.5 gap-4">
          {/* Logo & Title */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-tight whitespace-nowrap">
                StayWell Hostels Portal
              </h1>
              <p className="text-[11px] sm:text-xs text-slate-500">
                {user ? (
                  <span>
                    Authenticated: <strong className="text-slate-800 font-semibold">{user.name}</strong> ({user.role.toUpperCase()} CONSOLE)
                  </span>
                ) : (
                  'Please sign in to access your portal'
                )}
              </p>
            </div>
          </div>

          {/* User Status / Account Chip */}
          <div className="flex items-center gap-2 shrink-0">
            {user ? (
              <div className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200/80 transition-colors pl-3 pr-1 py-1 rounded-full border border-slate-200 text-xs">
                <span className="flex items-center gap-1.5">
                  {user.role === 'admin' ? (
                    <Shield className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  ) : user.role === 'warden' ? (
                    <KeyRound className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  ) : (
                    <User className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  )}
                  <span className="text-slate-800 font-medium hidden sm:inline truncate max-w-[140px]">
                    {user.name}
                  </span>
                  <span className="bg-white text-slate-700 border border-slate-200 font-mono text-[10px] px-1.5 py-0.5 rounded capitalize font-semibold shrink-0">
                    {user.role}
                  </span>
                </span>
                <button
                  onClick={logout}
                  title="Sign out of portal"
                  className="flex items-center gap-1 px-2.5 py-1 hover:bg-rose-100 text-slate-600 hover:text-rose-600 rounded-full transition-colors ml-0.5 text-xs font-semibold"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Sign Out</span>
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenSignIn}
                className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors shadow-2xs shrink-0"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
