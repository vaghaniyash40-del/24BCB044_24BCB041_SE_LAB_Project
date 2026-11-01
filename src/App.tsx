import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { HostelPortal } from './components/HostelApp/HostelPortal';
import { LAB_STUDENT_INFO } from './data/seDocumentData';
import { Building2 } from 'lucide-react';

function AppContent() {
  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans selection:bg-blue-500 selection:text-white">
      {/* Navigation Header with Portal Identity and Sign In / Sign Out */}
      <Navbar />

      {/* Main Working Portal Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <HostelPortal />
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 py-6 mt-12 text-xs print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-400" />
            <div>
              <p className="font-semibold text-slate-200">
                Hostel Management System Portal
              </p>
              <p className="text-[11px] text-slate-400">
                Residential Halls &amp; Student Housing Platform
              </p>
            </div>
          </div>

          <div className="text-center sm:text-right space-y-0.5">
            <p className="text-slate-300">
              Student Lead: <strong className="text-white">{LAB_STUDENT_INFO.studentName}</strong> ({LAB_STUDENT_INFO.rollNumber}, {LAB_STUDENT_INFO.division})
            </p>
            <p className="text-slate-400 text-[11px]">
              Product Owner: Harsh Parmar (24BCB041) • Developer: Yash Vaghani (24BCB044)
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
