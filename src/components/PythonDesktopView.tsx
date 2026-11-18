import React, { useState } from 'react';
import {
  Download,
  Terminal,
  Monitor,
  CheckCircle2,
  Database,
  RefreshCw,
  Copy,
  Check,
  FileCode,
  FolderArchive,
  Layers,
  Scale,
  Users,
  Timer,
  ShieldCheck,
  Sliders,
  ExternalLink,
  Cpu,
} from 'lucide-react';

interface PythonDesktopViewProps {
  onNavigate?: (tab: string) => void;
}

export const PythonDesktopView: React.FC<PythonDesktopViewProps> = ({ onNavigate }) => {
  const [activeSimTab, setActiveSimTab] = useState<string>('dashboard');
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);
  const [simDbResetCount, setSimDbResetCount] = useState<number>(0);
  const [showNotification, setShowNotification] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const handleSimResetDb = () => {
    setSimDbResetCount((prev) => prev + 1);
    setShowNotification('Database awsmps.db re-seeded with 100% factory sample data directly from Python code!');
    setTimeout(() => setShowNotification(null), 3500);
  };

  const handleSimExportCsv = () => {
    setShowNotification('Exported "AWSMPS_Line_Balancing_Report.csv" with 5 operator stations and standard times.');
    setTimeout(() => setShowNotification(null), 3500);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Notification Toast */}
      {showNotification && (
        <div className="fixed top-16 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-lg shadow-xl border border-blue-500/50 flex items-center gap-3 animate-fade-in text-sm font-medium">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{showNotification}</span>
        </div>
      )}

      {/* Top Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-xl p-6 sm:p-8 border border-slate-800 shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(circle_at_70%_50%,rgba(59,130,246,0.15),transparent_70%)] pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
              <Terminal className="w-3.5 h-3.5" />
              <span>Native Python Tkinter Desktop GUI</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Python Desktop Edition (Zero-SQL Required)
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Complete desktop application built in standard Python with Tkinter and embedded SQLite3.
              All tables, relations, and sample engineering data (Toyota WH-ENG-8402 74-circuit engine harness)
              are created, validated, and seeded directly inside the Python code with zero manual SQL imports or database server setup.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto shrink-0">
            <a
              href="/AWSMPS_Python_Tkinter.zip"
              download="AWSMPS_Python_Tkinter.zip"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg text-sm font-bold bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-md hover:shadow-blue-500/25"
            >
              <FolderArchive className="w-4 h-4" />
              <span>Download Full Package (.ZIP)</span>
            </a>
            <a
              href="/awsmps_desktop.py"
              download="awsmps_desktop.py"
              className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all"
            >
              <FileCode className="w-4 h-4 text-emerald-400" />
              <span>Single Script (.py)</span>
            </a>
          </div>
        </div>

        {/* Quick Highlights Bar */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Zero SQL Imports</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <Database className="w-4 h-4 text-blue-400 shrink-0" />
            <span>Built-in SQLite3 Engine</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <Monitor className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Standard Tkinter GUI</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <RefreshCw className="w-4 h-4 text-purple-400 shrink-0" />
            <span>1-Click Data Re-Seed</span>
          </div>
        </div>
      </div>

      {/* Zero-SQL Architecture vs Traditional Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-emerald-700 font-bold text-base">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h3>How Python Tkinter Solves the SQL Errors</h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            In traditional setups (like XAMPP/MySQL), errors such as{' '}
            <code className="bg-rose-50 text-rose-700 px-1 py-0.5 rounded border border-rose-200 font-mono text-[11px]">
              Unknown column 'sequence_order'
            </code>{' '}
            or{' '}
            <code className="bg-rose-50 text-rose-700 px-1 py-0.5 rounded border border-rose-200 font-mono text-[11px]">
              Unknown column 'product_name'
            </code>{' '}
            occur when an external database is out of sync with application code.
          </p>
          <div className="space-y-2.5 text-xs">
            <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-200/80 text-emerald-900">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong>Self-Bootstrapping Database:</strong> The Python <code className="font-mono text-emerald-800">DatabaseManager</code> automatically calls <code className="font-mono text-emerald-800">ensure_schema_and_seed()</code> every time the application boots.
              </div>
            </div>
            <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-200/80 text-emerald-900">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong>Integrated Schema:</strong> Tables for <code className="font-mono text-emerald-800">products</code>, <code className="font-mono text-emerald-800">task_elements</code> (with sequence_order), <code className="font-mono text-emerald-800">operator_positions</code>, and <code className="font-mono text-emerald-800">manpower_plans</code> are created in code.
              </div>
            </div>
            <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-200/80 text-emerald-900">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong>No Servers Required:</strong> Runs completely standalone with Python's standard library. No Apache, no MySQL daemon, and no port conflicts.
              </div>
            </div>
          </div>
        </div>

        {/* Execution Instructions */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
            <Terminal className="w-5 h-5 text-blue-600" />
            <h3>How to Run on Your Computer</h3>
          </div>
          
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Windows (Option A - Double Click):</span>
                <span className="text-[11px] text-slate-500">Included in ZIP</span>
              </div>
              <div className="p-2.5 bg-slate-900 text-slate-200 rounded-lg font-mono text-xs flex items-center justify-between">
                <span>Double-click "run_desktop.bat"</span>
                <span className="text-emerald-400 text-[10px]">One-click</span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Windows / Mac / Linux (Option B - Command Line):</span>
                <button
                  onClick={() => copyToClipboard('python awsmps_desktop.py', 'cmd1')}
                  className="text-[11px] text-blue-600 hover:text-blue-700 flex items-center gap-1 font-medium"
                >
                  {copiedCmd === 'cmd1' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCmd === 'cmd1' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <div className="p-2.5 bg-slate-900 text-slate-200 rounded-lg font-mono text-xs flex items-center justify-between">
                <span>python awsmps_desktop.py</span>
                <span className="text-slate-400 text-[10px]">Terminal</span>
              </div>
            </div>

            <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-800">
              <strong className="block font-semibold mb-0.5">Prerequisites:</strong>
              Python 3.8 or higher. Tkinter is bundled with standard Windows Python installers from python.org. On Linux, if missing run: <code className="font-mono bg-amber-100 px-1 py-0.5 rounded">sudo apt install python3-tk</code>.
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Tkinter Window Simulator */}
      <div className="bg-white rounded-xl border border-slate-300 shadow-md overflow-hidden">
        {/* Desktop Window Title Bar */}
        <div className="bg-slate-800 text-white px-4 py-2.5 flex items-center justify-between select-none border-b border-slate-700">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-rose-500 hover:opacity-80 cursor-pointer" />
              <div className="w-3 h-3 rounded-full bg-amber-500 hover:opacity-80 cursor-pointer" />
              <div className="w-3 h-3 rounded-full bg-emerald-500 hover:opacity-80 cursor-pointer" />
            </div>
            <span className="text-xs font-semibold tracking-wide text-slate-200">
              Automotive Work Study &amp; Manpower Planning System (AWSMPS) - Tkinter Desktop [SQLite3]
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            <span className="flex items-center gap-1 font-mono text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              awsmps.db (Connected)
            </span>
            <span className="hidden sm:inline">Engine: SQLite3</span>
          </div>
        </div>

        {/* Tkinter Notebook Tab Bar */}
        <div className="bg-slate-100 border-b border-slate-300 px-3 pt-2 flex items-center gap-1 overflow-x-auto scrollbar-thin">
          {[
            { id: 'dashboard', label: '1. Executive Dashboard', icon: Monitor },
            { id: 'products', label: '2. Product Master', icon: Layers },
            { id: 'timestudy', label: '3. Elemental Time Study', icon: Timer },
            { id: 'workload', label: '4. Workload Balancing', icon: Scale },
            { id: 'manpower', label: '5. Manpower Calculator', icon: Users },
            { id: 'feasibility', label: '6. Feasibility (14-Pt)', icon: CheckCircle2 },
            { id: 'standardwork', label: '7. Standard Work (SWI)', icon: FileCode },
            { id: 'skills', label: '8. Skill Matrix', icon: Cpu },
            { id: 'verification', label: '9. Shift Verification', icon: RefreshCw },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSimTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSimTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium border-t border-l border-r rounded-t-md transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-white text-blue-700 border-slate-300 font-bold shadow-[0_2px_0_0_#fff]'
                    : 'bg-slate-200/80 text-slate-600 border-transparent hover:bg-slate-200'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-600' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Display (Interactive GUI simulation) */}
        <div className="p-6 bg-slate-50/50 min-h-[480px]">
          {/* TAB 1: EXECUTIVE DASHBOARD */}
          {activeSimTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Simulator Action Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white rounded-lg border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-700">Active Study:</span>
                  <span className="text-xs font-mono bg-blue-50 text-blue-800 px-2 py-0.5 rounded border border-blue-200 font-semibold">
                    WH-ENG-8402 (74 Circuits Engine Harness)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSimResetDb}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-rose-50 text-rose-700 hover:bg-rose-100 rounded border border-rose-200 transition-colors"
                    title="Simulate self-bootstrapping database re-seed"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Reset &amp; Re-Seed Database</span>
                  </button>
                  <button
                    onClick={handleSimExportCsv}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded border border-emerald-200 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export CSV Report</span>
                  </button>
                </div>
              </div>

              {/* KPI Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-sm text-center">
                  <div className="text-[11px] font-bold text-slate-500 uppercase">Target Cycle Time</div>
                  <div className="text-2xl font-mono font-bold text-blue-700 mt-1">36.0s</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Takt Time Cap</div>
                </div>
                <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-sm text-center">
                  <div className="text-[11px] font-bold text-slate-500 uppercase">Total Work Content</div>
                  <div className="text-2xl font-mono font-bold text-slate-800 mt-1">180.0s</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Sum of 5 Tasks</div>
                </div>
                <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-sm text-center">
                  <div className="text-[11px] font-bold text-slate-500 uppercase">Direct Operators</div>
                  <div className="text-2xl font-mono font-bold text-emerald-700 mt-1">5 Ops</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Balanced Stations</div>
                </div>
                <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-sm text-center">
                  <div className="text-[11px] font-bold text-slate-500 uppercase">Line Efficiency</div>
                  <div className="text-2xl font-mono font-bold text-emerald-700 mt-1">100.0%</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Perfect Balance</div>
                </div>
                <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-sm text-center">
                  <div className="text-[11px] font-bold text-slate-500 uppercase">Balancing Delay</div>
                  <div className="text-2xl font-mono font-bold text-slate-800 mt-1">0.0s</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">No Idle Loss</div>
                </div>
              </div>

              {/* Station Balancing Table (Tkinter Treeview Replica) */}
              <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-4 py-2.5 bg-slate-100 border-b border-slate-200 font-bold text-xs text-slate-700 flex items-center justify-between">
                  <span>Line 4 Alpha: Balanced Station Allocations (SQLite Table: operator_positions)</span>
                  <span className="text-[11px] font-normal text-slate-500">5 Operator Positions / Target 36.0s</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="px-3 py-2">Pos</th>
                        <th className="px-3 py-2">Operation &amp; Process Step</th>
                        <th className="px-3 py-2">Workstation</th>
                        <th className="px-3 py-2 text-right">Standard Time</th>
                        <th className="px-3 py-2 text-right">Target Cycle</th>
                        <th className="px-3 py-2 text-center">Utilization</th>
                        <th className="px-3 py-2">Quality Gate Verification</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono">
                      {[
                        { pos: 'OP-01', name: 'Wire Prep & Housing Insertion', st: 36.0, ws: 'ST-01 Assembly Board', util: '100%', q: 'Terminal Click & Pull Verification' },
                        { pos: 'OP-02', name: 'Engine Branch Routing & Corrugated Tube', st: 36.0, ws: 'ST-02 Form Board', util: '100%', q: 'Branch Length & Gauge Check' },
                        { pos: 'OP-03', name: 'Ground Ring Lug & Fuse Clip Insertion', st: 36.0, ws: 'ST-03 Intermediate Bench', util: '100%', q: 'Torque Click & Polarity' },
                        { pos: 'OP-04', name: 'Spot Taping & Secondary Locks (TPA)', st: 36.0, ws: 'ST-04 Secondary Bench', util: '100%', q: 'Double Lock Engagement' },
                        { pos: 'OP-05', name: '100% Continuity & Clip Verification', st: 36.0, ws: 'ST-05 Electric Test Bench', util: '100%', q: '100% Hi-Pot & Resistance Test' },
                      ].map((row, idx) => (
                        <tr key={idx} className="hover:bg-blue-50/50">
                          <td className="px-3 py-2.5 font-bold text-blue-700">{row.pos}</td>
                          <td className="px-3 py-2.5 font-sans font-medium text-slate-800">{row.name}</td>
                          <td className="px-3 py-2.5 text-slate-600 font-sans">{row.ws}</td>
                          <td className="px-3 py-2.5 text-right font-bold text-slate-800">{row.st.toFixed(1)}s</td>
                          <td className="px-3 py-2.5 text-right text-slate-600">36.0s</td>
                          <td className="px-3 py-2.5 text-center">
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              {row.util}
                            </span>
                          </td>
                          <td className="px-3 py-2.5 font-sans text-slate-700 flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>{row.q}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PRODUCT MASTER */}
          {activeSimTab === 'products' && (
            <div className="space-y-4">
              <div className="p-4 bg-white rounded-lg border border-slate-200">
                <h4 className="font-bold text-sm text-slate-800 mb-2">Product Master: Toyota WH-ENG-8402</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-slate-500 block">Part Number:</span>
                    <strong className="font-mono text-slate-800">82121-06Z40</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Revision:</span>
                    <strong className="font-mono text-blue-700">Rev C.1 (ECO-2026-088)</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Circuit Count:</span>
                    <strong className="font-mono text-slate-800">74 Circuits</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Customer / Vehicle:</span>
                    <strong className="text-slate-800">Toyota Motor North America (Camry / RAV4)</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ELEMENTAL TIME STUDY */}
          {activeSimTab === 'timestudy' && (
            <div className="space-y-4">
              <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                <div className="px-4 py-2 bg-slate-100 border-b border-slate-200 font-bold text-xs text-slate-700">
                  SQLite Table: task_elements (Includes 'sequence_order' and 'standard_time')
                </div>
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="px-3 py-2">Seq</th>
                      <th className="px-3 py-2">Code</th>
                      <th className="px-3 py-2">Operation Description</th>
                      <th className="px-3 py-2 text-right">Observed (s)</th>
                      <th className="px-3 py-2 text-right">Rating</th>
                      <th className="px-3 py-2 text-right">Basic (s)</th>
                      <th className="px-3 py-2 text-right">Allowance</th>
                      <th className="px-3 py-2 text-right">Standard Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    {[
                      { seq: 1, code: 'EL-01', desc: 'Wire Prep & Terminal Insertion', obs: 31.3, rate: '100%', basic: 31.3, allow: '15.0%', std: 36.0 },
                      { seq: 2, code: 'EL-02', desc: 'Sub-Assembly Routing & Tube Wrap', obs: 31.3, rate: '100%', basic: 31.3, allow: '15.0%', std: 36.0 },
                      { seq: 3, code: 'EL-03', desc: 'Ground Ring Lug & Fuse Clip Insertion', obs: 31.3, rate: '100%', basic: 31.3, allow: '15.0%', std: 36.0 },
                      { seq: 4, code: 'EL-04', desc: 'Spot Taping & Secondary Locks (TPA)', obs: 31.3, rate: '100%', basic: 31.3, allow: '15.0%', std: 36.0 },
                      { seq: 5, code: 'EL-05', desc: '100% Continuity & Clip Verification', obs: 31.3, rate: '100%', basic: 31.3, allow: '15.0%', std: 36.0 },
                    ].map((el, i) => (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="px-3 py-2 font-bold text-slate-800">{el.seq}</td>
                        <td className="px-3 py-2 text-blue-700">{el.code}</td>
                        <td className="px-3 py-2 font-sans text-slate-800">{el.desc}</td>
                        <td className="px-3 py-2 text-right">{el.obs.toFixed(1)}</td>
                        <td className="px-3 py-2 text-right">{el.rate}</td>
                        <td className="px-3 py-2 text-right">{el.basic.toFixed(1)}</td>
                        <td className="px-3 py-2 text-right text-emerald-700">{el.allow}</td>
                        <td className="px-3 py-2 text-right font-bold text-slate-900">{el.std.toFixed(1)}s</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: WORKLOAD BALANCING */}
          {activeSimTab === 'workload' && (
            <div className="space-y-4">
              <div className="p-4 bg-white rounded-lg border border-slate-200">
                <h4 className="font-bold text-sm text-slate-800 mb-3">5 Operator Workload Balancing Graph (Cap: 36.0s)</h4>
                <div className="space-y-3">
                  {['OP-01', 'OP-02', 'OP-03', 'OP-04', 'OP-05'].map((op, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="font-bold text-slate-700">{op} Station</span>
                        <span className="text-emerald-700 font-bold">36.0s / 36.0s (100.0% Util)</span>
                      </div>
                      <div className="w-full bg-slate-200 h-4 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full w-full rounded-full flex items-center justify-center text-[10px] text-white font-bold" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: MANPOWER CALCULATOR */}
          {activeSimTab === 'manpower' && (
            <div className="space-y-4">
              <div className="p-4 bg-white rounded-lg border border-slate-200">
                <h4 className="font-bold text-sm text-slate-800 mb-2">Automated Manpower Formula (SQLite Stored)</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono mt-3">
                  <div className="p-3 bg-slate-50 rounded border border-slate-200">
                    <span className="text-slate-500 font-sans block">1. Takt Time</span>
                    <strong className="text-base text-blue-700">25,200s / 700 = 36.0s</strong>
                  </div>
                  <div className="p-3 bg-slate-50 rounded border border-slate-200">
                    <span className="text-slate-500 font-sans block">2. Direct Manpower</span>
                    <strong className="text-base text-emerald-700">180.0s / 36.0s = 5 Ops</strong>
                  </div>
                  <div className="p-3 bg-slate-50 rounded border border-slate-200">
                    <span className="text-slate-500 font-sans block">3. Total Staffing</span>
                    <strong className="text-base text-slate-800">5 Direct + 1 Reliever = 6 Ops</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: FEASIBILITY CHECKLIST */}
          {activeSimTab === 'feasibility' && (
            <div className="space-y-2">
              <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-xs text-emerald-900 font-medium">
                14 / 14 Automotive Wiring Harness Engineering Constraints Validated (100% Pass)
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {[
                  'Takt Time Feasibility (all stations <= 36.0s)',
                  'Workstation Reach Envelope (< 600mm)',
                  'Terminal Pull-Test Verification',
                  'High Voltage / Ground Lug Torque Validation',
                  'Secondary Lock (TPA/CPA) 100% Check',
                  'Electrical Continuity Hi-Pot Testing',
                ].map((rule, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 bg-white rounded border border-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="text-slate-700">{rule}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: STANDARD WORK */}
          {activeSimTab === 'standardwork' && (
            <div className="p-4 bg-white rounded-lg border border-slate-200 font-mono text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">
{`STANDARD WORK INSTRUCTION (SWI) - WH-ENG-8402
--------------------------------------------------------------------------------
POSITION: OP-01 | WORKSTATION: ST-01 Assembly Board | CYCLE TIME: 36.0s
1. Retrieve prepared wire circuits #1 through #18 from feeder rack.
2. Insert terminals into Housing A (Engine ECU 34-pin connector) per pinning chart.
3. Perform tactile 90-degree pull-check on each inserted terminal (Audible Click).
4. Engage secondary terminal lock (TPA). Verify zero back-out.
CRITICAL QUALITY POINT: 100% terminal retention check before passing to ST-02.`}
            </div>
          )}

          {/* TAB 8: SKILL MATRIX */}
          {activeSimTab === 'skills' && (
            <div className="p-4 bg-white rounded-lg border border-slate-200">
              <h4 className="font-bold text-sm text-slate-800 mb-2">Line 4 Multi-Skill Certification Matrix</h4>
              <div className="text-xs text-slate-600">
                Tracks operator cross-training (Level 1: Trainee, Level 2: Under Supervision, Level 3: Fully Qualified, Level 4: Certified Trainer).
              </div>
            </div>
          )}

          {/* TAB 9: PRODUCTION VERIFICATION */}
          {activeSimTab === 'verification' && (
            <div className="p-4 bg-white rounded-lg border border-slate-200">
              <h4 className="font-bold text-sm text-slate-800 mb-2">Shift Production Run Verification</h4>
              <div className="text-xs text-slate-600 font-mono">
                Shift 1: Actual 702 pcs vs Plan 700 pcs (100.3% Output, Cycle Time Gap: -0.1s)
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Package Contents Breakdown */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
          <FolderArchive className="w-5 h-5 text-blue-600" />
          <span>What's Inside AWSMPS_Python_Tkinter.zip</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
            <div className="font-bold text-slate-800 flex items-center gap-1.5">
              <FileCode className="w-4 h-4 text-blue-600" />
              <span>awsmps_desktop.py</span>
            </div>
            <p className="text-slate-500">
              Complete application with Tkinter GUI and auto-bootstrapping SQLite3 database logic.
            </p>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
            <div className="font-bold text-slate-800 flex items-center gap-1.5">
              <Terminal className="w-4 h-4 text-emerald-600" />
              <span>run_desktop.bat</span>
            </div>
            <p className="text-slate-500">
              One-click batch launcher for Windows with automatic Python detection and error pause.
            </p>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
            <div className="font-bold text-slate-800 flex items-center gap-1.5">
              <Terminal className="w-4 h-4 text-purple-600" />
              <span>run_desktop.sh</span>
            </div>
            <p className="text-slate-500">
              Executable bash script for macOS and Linux environments.
            </p>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
            <div className="font-bold text-slate-800 flex items-center gap-1.5">
              <FileCode className="w-4 h-4 text-amber-600" />
              <span>README.txt</span>
            </div>
            <p className="text-slate-500">
              Comprehensive setup and architecture guide explaining zero-SQL execution and feature list.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
