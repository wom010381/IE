import React, { useState } from 'react';
import { ProductionVerificationRecord, WorkStudyProject } from '../types';
import {
  Activity,
  Plus,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Clock,
  TrendingUp,
  FileSpreadsheet,
} from 'lucide-react';

interface ProductionVerificationViewProps {
  verifications: ProductionVerificationRecord[];
  projects: WorkStudyProject[];
  onAddVerification: (record: ProductionVerificationRecord) => void;
  onNavigate: (tabId: string) => void;
}

export const ProductionVerificationView: React.FC<ProductionVerificationViewProps> = ({
  verifications,
  projects,
  onAddVerification,
  onNavigate,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Shift Log form state
  const [newRun, setNewRun] = useState<Partial<ProductionVerificationRecord>>({
    productModel: 'WH-ENG-8402',
    revision: 'Rev C.1',
    productionLine: 'Line 4 (Alpha)',
    shiftDate: new Date().toISOString().split('T')[0],
    shiftName: 'Shift 1 (Day)',
    plannedManpower: 5,
    actualManpower: 5,
    targetCycleTime: 36.0,
    actualCycleTime: 36.2,
    plannedOutput: 700,
    actualOutput: 694,
    downtimeMinutes: 6.0,
    defectsCount: 0,
    reworkCount: 0,
    methodDeviationsNoted: 'None. All operators adhered to standard work sheet instructions.',
    downtimeCauses: '6.0 min terminal reel changeover',
    supervisorRemarks: 'Stable line rhythm achieved. Operator workload balance confirmed.',
    investigationRequired: false,
  });

  const handleSaveShift = (e: React.FormEvent) => {
    e.preventDefault();

    const actualOut = Number(newRun.actualOutput) || 0;
    const plannedOut = Number(newRun.plannedOutput) || 700;
    const actualCyc = Number(newRun.actualCycleTime) || 36.0;
    const targetCyc = Number(newRun.targetCycleTime) || 36.0;
    const actualMp = Number(newRun.actualManpower) || 5;
    const plannedMp = Number(newRun.plannedManpower) || 5;

    const outputAchievement = Number(((actualOut / plannedOut) * 100).toFixed(1));
    const cycleTimeGap = Number((actualCyc - targetCyc).toFixed(2));
    const manpowerGap = actualMp - plannedMp;

    const created: ProductionVerificationRecord = {
      id: `pvr-${Date.now()}`,
      studyProjectId: 'WSP-2026-001',
      productModel: newRun.productModel || 'WH-ENG-8402',
      revision: newRun.revision || 'Rev C.1',
      productionLine: newRun.productionLine || 'Line 4 (Alpha)',
      shiftDate: newRun.shiftDate || new Date().toISOString().split('T')[0],
      shiftName: newRun.shiftName || 'Shift 1 (Day)',
      plannedManpower: plannedMp,
      actualManpower: actualMp,
      targetCycleTime: targetCyc,
      actualCycleTime: actualCyc,
      plannedOutput: plannedOut,
      actualOutput: actualOut,
      outputAchievementPercent: outputAchievement,
      cycleTimeGap,
      manpowerGap,
      downtimeMinutes: Number(newRun.downtimeMinutes) || 0,
      defectsCount: Number(newRun.defectsCount) || 0,
      reworkCount: Number(newRun.reworkCount) || 0,
      methodDeviationsNoted: newRun.methodDeviationsNoted || 'None',
      downtimeCauses: newRun.downtimeCauses || 'None',
      supervisorRemarks: newRun.supervisorRemarks || 'Confirmed',
      investigationRequired: outputAchievement < 95.0 || Math.abs(cycleTimeGap) > 1.5,
    };

    onAddVerification(created);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Mass Production Verification</h2>
          <p className="text-xs text-slate-500">
            Compare post-transfer actual shift results against original work study and line balance assumptions.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Log Shift Run Results</span>
        </button>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
            Verified Shift Runs
          </span>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-0.5">
            {verifications.length} Shifts
          </div>
          <span className="text-[11px] text-slate-500">Mass production tracking</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
            Average Output Achievement
          </span>
          <div className="text-2xl font-bold font-mono text-emerald-600 mt-0.5">
            {(
              verifications.reduce((a, b) => a + b.outputAchievementPercent, 0) /
              (verifications.length || 1)
            ).toFixed(1)}%
          </div>
          <span className="text-[11px] text-slate-500">Target: &ge; 95%</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
            Average Cycle Time Gap
          </span>
          <div className="text-2xl font-bold font-mono text-blue-600 mt-0.5">
            +{(
              verifications.reduce((a, b) => a + b.cycleTimeGap, 0) /
              (verifications.length || 1)
            ).toFixed(2)}s
          </div>
          <span className="text-[11px] text-slate-500">Within 0.5s tolerance</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
            Manpower Variance
          </span>
          <div className="text-2xl font-bold font-mono text-emerald-600 mt-0.5">
            0 Gap
          </div>
          <span className="text-[11px] text-slate-500">Exact 5 operators deployed</span>
        </div>
      </div>

      {/* Verification Logs Table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
        <div className="p-3.5 bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-700 flex justify-between items-center">
          <span>Actual Shift Performance Logs</span>
          <span className="text-slate-500 font-mono">WH-ENG-8402 (Line 4 Alpha)</span>
        </div>

        <div className="table-responsive overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/50 border-b border-slate-200 text-slate-600 font-semibold">
              <tr>
                <th className="py-2.5 px-3">Date / Shift</th>
                <th className="py-2.5 px-3">Output (Actual / Planned)</th>
                <th className="py-2.5 px-3">Achievement %</th>
                <th className="py-2.5 px-3">Cycle Time (Actual vs Target)</th>
                <th className="py-2.5 px-3">Manpower</th>
                <th className="py-2.5 px-3">Downtime &amp; Defects</th>
                <th className="py-2.5 px-3">Supervisor Remarks</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {verifications.map((v) => {
                const isUnderperforming = v.outputAchievementPercent < 95.0;
                return (
                  <tr key={v.id} className="hover:bg-slate-50">
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900 font-mono">{v.shiftDate}</div>
                      <div className="text-[11px] text-slate-500">{v.shiftName}</div>
                    </td>
                    <td className="py-3 px-3 font-mono">
                      <span className="font-bold text-slate-900">{v.actualOutput}</span>
                      <span className="text-slate-400"> / {v.plannedOutput} pcs</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`inline-flex items-center gap-1 font-mono font-bold text-xs ${
                        isUnderperforming ? 'text-amber-600' : 'text-emerald-600'
                      }`}>
                        {v.outputAchievementPercent}%
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono">
                      <span className="font-semibold text-slate-900">{v.actualCycleTime}s</span>
                      <span className="text-slate-400"> (Target: {v.targetCycleTime}s)</span>
                      <div className={`text-[10px] ${v.cycleTimeGap <= 0 ? 'text-emerald-600 font-bold' : 'text-slate-500'}`}>
                        Gap: {v.cycleTimeGap > 0 ? `+${v.cycleTimeGap}s` : `${v.cycleTimeGap}s`}
                      </div>
                    </td>
                    <td className="py-3 px-3 font-mono">
                      <span className="font-semibold text-slate-900">{v.actualManpower} Ops</span>
                      <span className="text-slate-400"> (Plan: {v.plannedManpower})</span>
                    </td>
                    <td className="py-3 px-3 text-[11px]">
                      <div className="text-slate-800">Downtime: <strong className="font-mono">{v.downtimeMinutes}m</strong></div>
                      <div className="text-slate-500">Defects: <span className="font-mono">{v.defectsCount}</span> &bull; Rework: <span className="font-mono">{v.reworkCount}</span></div>
                    </td>
                    <td className="py-3 px-3 text-slate-600 text-[11px] max-w-xs leading-relaxed">
                      {v.supervisorRemarks}
                    </td>
                    <td className="py-3 px-3">
                      {v.investigationRequired ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          <AlertTriangle className="w-3 h-3 text-amber-600" /> Gap Audit
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Confirmed
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Re-study Trigger Alert Card */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Continuous Improvement (Kaizen) Trigger
          </h4>
          <p className="text-xs text-slate-600 mt-0.5">
            Per Section 11 of the Master Prompt, if actual production results materially differ from the approved plan, an engineer may initiate a work-study revision project.
          </p>
        </div>
        <button
          onClick={() => onNavigate('projects')}
          className="px-3.5 py-2 border border-slate-300 rounded font-semibold text-xs text-slate-700 hover:bg-white shadow-xs whitespace-nowrap"
        >
          Create Revalidation Project &rarr;
        </button>
      </div>

      {/* Log Shift Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h3 className="text-sm font-bold text-slate-900">Log Mass Production Shift Run</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg leading-none"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveShift} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Shift Date</label>
                  <input
                    type="date"
                    required
                    value={newRun.shiftDate}
                    onChange={(e) => setNewRun({ ...newRun, shiftDate: e.target.value })}
                    className="w-full border border-slate-300 rounded p-1.5 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Shift Name</label>
                  <select
                    value={newRun.shiftName}
                    onChange={(e) => setNewRun({ ...newRun, shiftName: e.target.value })}
                    className="w-full border border-slate-300 rounded p-1.5"
                  >
                    <option value="Shift 1 (Day)">Shift 1 (Day)</option>
                    <option value="Shift 2 (Night)">Shift 2 (Night)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Planned Output (pcs)</label>
                  <input
                    type="number"
                    value={newRun.plannedOutput}
                    onChange={(e) => setNewRun({ ...newRun, plannedOutput: Number(e.target.value) })}
                    className="w-full border border-slate-300 rounded p-1.5 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Actual Output (pcs) *</label>
                  <input
                    type="number"
                    required
                    value={newRun.actualOutput}
                    onChange={(e) => setNewRun({ ...newRun, actualOutput: Number(e.target.value) })}
                    className="w-full border border-slate-300 rounded p-1.5 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Actual Cycle Time (sec) *</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={newRun.actualCycleTime}
                    onChange={(e) => setNewRun({ ...newRun, actualCycleTime: Number(e.target.value) })}
                    className="w-full border border-slate-300 rounded p-1.5 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Actual Manpower Deployed</label>
                  <input
                    type="number"
                    value={newRun.actualManpower}
                    onChange={(e) => setNewRun({ ...newRun, actualManpower: Number(e.target.value) })}
                    className="w-full border border-slate-300 rounded p-1.5 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Downtime Minutes</label>
                  <input
                    type="number"
                    step="0.5"
                    value={newRun.downtimeMinutes}
                    onChange={(e) => setNewRun({ ...newRun, downtimeMinutes: Number(e.target.value) })}
                    className="w-full border border-slate-300 rounded p-1.5 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Defects / Rework</label>
                  <input
                    type="number"
                    value={newRun.defectsCount}
                    onChange={(e) => setNewRun({ ...newRun, defectsCount: Number(e.target.value) })}
                    className="w-full border border-slate-300 rounded p-1.5 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Supervisor Remarks</label>
                <textarea
                  rows={2}
                  value={newRun.supervisorRemarks}
                  onChange={(e) => setNewRun({ ...newRun, supervisorRemarks: e.target.value })}
                  className="w-full border border-slate-300 rounded p-1.5"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 border border-slate-300 rounded text-slate-700 hover:bg-slate-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold"
                >
                  Save Shift Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
