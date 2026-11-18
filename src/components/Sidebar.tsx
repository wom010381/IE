import React from 'react';
import {
  LayoutDashboard,
  Layers,
  FolderKanban,
  Video,
  Timer,
  Calculator,
  FileText,
  Scale,
  Users,
  CheckCircle2,
  GraduationCap,
  Activity,
  FileSpreadsheet,
  Server,
  Terminal,
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  pendingApprovalsCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  pendingApprovalsCount = 1,
}) => {
  const menuSections = [
    {
      title: 'Study & Engineering',
      items: [
        { id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard },
        { id: 'products', label: 'Product Master Data', icon: Layers },
        { id: 'projects', label: 'Work Study Projects', icon: FolderKanban },
        { id: 'video', label: 'Video Analysis', icon: Video },
        { id: 'timestudy', label: 'Elemental Time Study', icon: Timer },
        { id: 'standardtime', label: 'Standard Time Engine', icon: Calculator },
      ],
    },
    {
      title: 'Planning & Documentation',
      items: [
        { id: 'standardwork', label: 'Standard Work (SWI)', icon: FileText },
        { id: 'workload', label: 'Workload Balancing', icon: Scale },
        { id: 'manpower', label: 'Manpower Calculator', icon: Users, badge: pendingApprovalsCount > 0 ? 'Pending' : undefined },
        { id: 'feasibility', label: 'Constraint Checklist', icon: CheckCircle2 },
      ],
    },
    {
      title: 'Execution & Verification',
      items: [
        { id: 'skills', label: 'Skill Matrix & Transfer', icon: GraduationCap },
        { id: 'verification', label: 'Production Verification', icon: Activity },
        { id: 'reports', label: 'Reports & Audit Log', icon: FileSpreadsheet },
        { id: 'python', label: 'Python Tkinter App', icon: Terminal, badge: 'Zero-SQL' },
        { id: 'lan', label: 'XAMPP & LAN Hub', icon: Server, badge: 'ZIP' },
      ],
    },
  ];

  return (
    <aside className="no-print w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 min-h-[calc(100vh-57px)] border-r border-slate-800">
      <div className="p-4 flex-grow overflow-y-auto space-y-6">
        {menuSections.map((section, sIdx) => (
          <div key={sIdx} className="space-y-1">
            <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              {section.title}
            </div>
            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-md transition-all text-left ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-medium ${
                        item.badge === 'Pending'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-800/80 text-[11px] text-slate-400 bg-slate-950/40">
        <div className="flex items-center justify-between mb-1">
          <span className="font-medium text-slate-300">AWSMPS Plant LAN</span>
          <span className="text-emerald-400 font-mono text-[10px]">100% Offline</span>
        </div>
        <p className="text-[10px] text-slate-400 leading-relaxed">
          XAMPP MySQL v8.1+ · MariaDB Compatible
        </p>
      </div>
    </aside>
  );
};
