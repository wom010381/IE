import React, { useState } from 'react';
import {
  ProductModel,
  WorkStudyProject,
  TaskElement,
  OperatorPosition,
  ManpowerCalculationResult,
  AllowanceSettings,
  ProductionVerificationRecord,
  AuditLogEntry,
} from '../types';
import {
  getElementStandardTimeSummary,
  calculateLineBalancingMetrics,
} from '../utils/calculations';
import {
  FileSpreadsheet,
  Download,
  Printer,
  History,
  Shield,
  Search,
  Filter,
} from 'lucide-react';

interface ReportsViewProps {
  products: ProductModel[];
  projects: WorkStudyProject[];
  elements: TaskElement[];
  positions: OperatorPosition[];
  manpowerPlan: ManpowerCalculationResult;
  allowanceSettings: AllowanceSettings;
  verifications: ProductionVerificationRecord[];
  auditLogs: AuditLogEntry[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  products,
  projects,
  elements,
  positions,
  manpowerPlan,
  allowanceSettings,
  verifications,
  auditLogs,
}) => {
  const [activeReportTab, setActiveReportTab] = useState<'line_balance' | 'audit_log'>('line_balance');
  const [auditSearch, setAuditSearch] = useState('');

  const metrics = calculateLineBalancingMetrics(
    positions,
    elements,
    allowanceSettings,
    manpowerPlan.targetCycleTime
  );

  // Generate CSV download
  const handleExportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Position Number,Position Name,Workstation,Total Assigned Time (s),Target Cycle Time (s),Time Difference (s),Utilization (%)\n';

    metrics.positionStats.forEach((p) => {
      csvContent += `"${p.positionNumber}","${p.positionName}","${p.workstation}",${p.totalAssignedTime},${p.targetCycleTime},${p.timeDifference},${p.utilization}%\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'AWSMPS_Line_Balancing_Report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredLogs = auditLogs.filter(
    (log) =>
      log.action.toLowerCase().includes(auditSearch.toLowerCase()) ||
      log.userName.toLowerCase().includes(auditSearch.toLowerCase()) ||
      log.module.toLowerCase().includes(auditSearch.toLowerCase()) ||
      log.details.toLowerCase().includes(auditSearch.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Management Reports &amp; Audit Log</h2>
          <p className="text-xs text-slate-500">
            Exportable engineering reports, line balance summaries, and permanent compliance audit trail.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors shadow-xs"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors shadow-xs"
          >
            <Printer className="w-4 h-4 text-slate-200" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Report View Selector Tabs */}
      <div className="no-print flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveReportTab('line_balance')}
          className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-all ${
            activeReportTab === 'line_balance'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Line Balancing &amp; Manpower Summary Report
        </button>
        <button
          onClick={() => setActiveReportTab('audit_log')}
          className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-all ${
            activeReportTab === 'audit_log'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Compliance Audit Log Trail ({auditLogs.length})
        </button>
      </div>

      {activeReportTab === 'line_balance' ? (
        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs space-y-6">
          {/* Executive Header */}
          <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">
                INDUSTRIAL ENGINEERING MANAGEMENT SUMMARY
              </div>
              <h3 className="text-base font-bold text-slate-900">
                WH-ENG-8402 (Rev C.1) — Assembly Line 4 Manpower &amp; Balance Report
              </h3>
            </div>
            <div className="text-left sm:text-right font-mono text-xs text-slate-500">
              <div>Generated: {new Date().toISOString().split('T')[0]}</div>
              <div>Report Reference: REP-2026-ENG-8402</div>
            </div>
          </div>

          {/* KPI Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded border border-slate-100">
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Target Cycle Time</span>
              <span className="text-lg font-bold font-mono text-slate-900">36.0s</span>
            </div>
            <div className="p-3 bg-slate-50 rounded border border-slate-100">
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Total Work Content</span>
              <span className="text-lg font-bold font-mono text-blue-600">
                {metrics.totalAssignedWorkContent}s
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded border border-slate-100">
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Direct Manpower</span>
              <span className="text-lg font-bold font-mono text-emerald-600">5 Operators</span>
            </div>
            <div className="p-3 bg-slate-50 rounded border border-slate-100">
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Balance Efficiency</span>
              <span className="text-lg font-bold font-mono text-slate-900">
                {metrics.balanceEfficiency}%
              </span>
            </div>
          </div>

          {/* Tabular Distribution */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Operator Station Timing Breakdown
            </h4>
            <div className="table-responsive border border-slate-200 rounded overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-600">
                  <tr>
                    <th className="py-2.5 px-3">Position</th>
                    <th className="py-2.5 px-3">Description</th>
                    <th className="py-2.5 px-3">Workstation</th>
                    <th className="py-2.5 px-3 text-right">Assigned Time</th>
                    <th className="py-2.5 px-3 text-right">Target Cycle</th>
                    <th className="py-2.5 px-3 text-right">Difference</th>
                    <th className="py-2.5 px-3 text-right">Utilization</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {metrics.positionStats.map((p) => (
                    <tr key={p.positionId} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-bold text-slate-900">{p.positionNumber}</td>
                      <td className="py-2.5 px-3 font-sans text-slate-800 font-medium">{p.positionName}</td>
                      <td className="py-2.5 px-3 font-sans text-slate-500 text-[11px]">{p.workstation}</td>
                      <td className="py-2.5 px-3 text-right font-bold text-blue-600">{p.totalAssignedTime}s</td>
                      <td className="py-2.5 px-3 text-right text-slate-600">{p.targetCycleTime}s</td>
                      <td className="py-2.5 px-3 text-right text-emerald-700">+{p.timeDifference}s</td>
                      <td className="py-2.5 px-3 text-right font-bold text-slate-900">{p.utilization}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* Audit Log View */
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <History className="w-4 h-4 text-blue-600" />
                <span>System Modification Audit Trail</span>
              </h3>
              <p className="text-xs text-slate-500">
                Rule 8.12: System preserves historical approved standards and logs all user modifications.
              </p>
            </div>
            <div className="flex items-center gap-2 max-w-xs w-full">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search audit trail..."
                value={auditSearch}
                onChange={(e) => setAuditSearch(e.target.value)}
                className="w-full text-xs border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="table-responsive border border-slate-200 rounded overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <tr>
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3">User &amp; Role</th>
                  <th className="py-2.5 px-3">Module</th>
                  <th className="py-2.5 px-3">Action</th>
                  <th className="py-2.5 px-3">Record Ref</th>
                  <th className="py-2.5 px-3">Audit Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                      {log.timestamp}
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="font-semibold text-slate-900">{log.userName}</div>
                      <div className="text-[10px] text-slate-400 font-mono uppercase">{log.userRole}</div>
                    </td>
                    <td className="py-2.5 px-3 font-medium text-slate-800">{log.module}</td>
                    <td className="py-2.5 px-3 font-semibold text-blue-700">{log.action}</td>
                    <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600">{log.recordReference}</td>
                    <td className="py-2.5 px-3 text-slate-600 text-[11px] max-w-sm leading-relaxed">
                      {log.details}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
