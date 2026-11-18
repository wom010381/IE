import React from 'react';
import { UserRole } from '../types';
import { Download, ShieldCheck, Cpu, Terminal } from 'lucide-react';

interface HeaderProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  activeTab: string;
  onNavigateToTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  activeTab,
  onNavigateToTab,
}) => {
  const roleLabels: Record<UserRole, { label: string; badge: string }> = {
    admin: { label: 'System Administrator', badge: 'bg-purple-100 text-purple-800 border-purple-200' },
    engineer: { label: 'Work Study Engineer', badge: 'bg-blue-100 text-blue-800 border-blue-200' },
    reviewer: { label: 'Industrial Eng Leader / Reviewer', badge: 'bg-amber-100 text-amber-800 border-amber-200' },
    approver: { label: 'Plant Operations Director / Approver', badge: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
    line_leader: { label: 'Line 4 Production Leader', badge: 'bg-cyan-100 text-cyan-800 border-cyan-200' },
    viewer: { label: 'Management Viewer', badge: 'bg-slate-100 text-slate-800 border-slate-200' },
  };

  return (
    <header className="no-print bg-white border-b border-slate-200 sticky top-0 z-40 px-6 py-3 flex items-center justify-between gap-8">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-sm tracking-wider shadow-sm">
          AW
        </div>
        <div>
          <span className="text-base font-bold text-slate-900 tracking-tight whitespace-nowrap block">
            AWSMPS Industrial Engineering
          </span>
          <span className="text-xs text-slate-500 block">
            Automotive Wiring Harness Work Study &amp; Manpower System
          </span>
        </div>
      </div>

      {/* Zone 2: Model & Study Context Strip */}
      <div className="hidden lg:flex items-center gap-4 text-xs text-slate-600 bg-slate-50 px-3.5 py-1.5 rounded-md border border-slate-200">
        <div className="flex items-center gap-1.5 font-medium text-slate-900">
          <Cpu className="w-3.5 h-3.5 text-blue-600" />
          <span>WH-ENG-8402 (Rev C.1)</span>
        </div>
        <span className="text-slate-300">|</span>
        <span>Line 4 Alpha</span>
        <span className="text-slate-300">|</span>
        <span>Target Cycle: <strong className="font-mono text-slate-900">36.0s</strong></span>
        <span className="text-slate-300">|</span>
        <span>Work Content: <strong className="font-mono text-slate-900">180.0s</strong></span>
        <span className="text-slate-300">|</span>
        <span>Shift Demand: <strong className="font-mono text-slate-900">700 pcs</strong></span>
      </div>

      {/* Zone 3: Role Switcher & XAMPP ZIP Package Action */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Role Switcher */}
        <div className="flex items-center gap-2">
          <label htmlFor="role-select" className="text-xs font-medium text-slate-500 hidden sm:inline whitespace-nowrap">
            Role:
          </label>
          <select
            id="role-select"
            value={currentRole}
            onChange={(e) => onRoleChange(e.target.value as UserRole)}
            className="text-xs font-medium bg-slate-50 border border-slate-300 text-slate-800 rounded-md px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="engineer">Work Study Engineer</option>
            <option value="reviewer">IE Leader (Reviewer)</option>
            <option value="approver">Plant Director (Approver)</option>
            <option value="line_leader">Production Line Leader</option>
            <option value="admin">System Administrator</option>
            <option value="viewer">Management Viewer</option>
          </select>
        </div>

        {/* Python Tkinter Action Button */}
        <button
          onClick={() => onNavigateToTab('python')}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors shadow-sm whitespace-nowrap ${
            activeTab === 'python'
              ? 'bg-blue-600 text-white'
              : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200'
          }`}
          title="Open Python Tkinter Desktop (Zero-SQL)"
        >
          <Terminal className="w-3.5 h-3.5 text-indigo-500" />
          <span>Python Tkinter App</span>
        </button>

        {/* Python Tkinter ZIP Download */}
        <a
          href="/AWSMPS_Python_Tkinter.zip"
          download="AWSMPS_Python_Tkinter.zip"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded-md hover:bg-slate-800 transition-colors shadow-sm whitespace-nowrap"
          title="Download complete Python Tkinter package with auto-provisioning SQLite3"
        >
          <Download className="w-3.5 h-3.5 text-slate-200" />
          <span>Python ZIP</span>
        </a>
      </div>
    </header>
  );
};
