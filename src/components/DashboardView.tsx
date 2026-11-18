import React from 'react';
import {
  ProductModel,
  WorkStudyProject,
  TaskElement,
  OperatorPosition,
  ManpowerCalculationResult,
  AllowanceSettings,
  ProductionVerificationRecord,
} from '../types';
import { calculateLineBalancingMetrics } from '../utils/calculations';
import {
  Clock,
  Users,
  Target,
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Cpu,
  ShieldAlert,
} from 'lucide-react';

interface DashboardViewProps {
  products: ProductModel[];
  projects: WorkStudyProject[];
  elements: TaskElement[];
  positions: OperatorPosition[];
  manpowerPlan: ManpowerCalculationResult;
  allowanceSettings: AllowanceSettings;
  verifications: ProductionVerificationRecord[];
  onNavigate: (tabId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  products,
  projects,
  elements,
  positions,
  manpowerPlan,
  allowanceSettings,
  verifications,
  onNavigate,
}) => {
  const currentProject = projects[0];
  const metrics = calculateLineBalancingMetrics(
    positions,
    elements,
    allowanceSettings,
    manpowerPlan.targetCycleTime
  );

  const latestVerification = verifications[verifications.length - 1];

  return (
    <div className="space-y-6">
      {/* Top Banner: Study Status & Active Product */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600 mb-1">
            <Cpu className="w-3.5 h-3.5" />
            <span>Active Work Study Case · Automotive Wiring Harness</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            WH-ENG-8402 (Rev C.1) — Hybrid Engine Compartment Main Harness
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Assembly Line 4 (Alpha) · 74 Circuits · 48-Way Sealed ECU Connector · Dual-Stage Terminal Lock Check · Progressive Flow
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[11px] text-slate-500 block">Study Workflow Stage</span>
            <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200 rounded-md">
              {currentProject?.status || 'Manpower Validation'}
            </span>
          </div>
          <button
            onClick={() => onNavigate('manpower')}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <span>Review Plan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Takt & Cycle Time */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-semibold uppercase tracking-wider">Target Cycle Time</span>
            <Clock className="w-4 h-4 text-blue-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
              {manpowerPlan.targetCycleTime.toFixed(1)}s
            </span>
            <span className="text-xs text-slate-500">Takt: {manpowerPlan.taktTime.toFixed(1)}s</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Available: 25,200s (7.0h net) / 700 units demand
          </div>
        </div>

        {/* KPI 2: Total Work Content */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-semibold uppercase tracking-wider">Total Work Content</span>
            <Target className="w-4 h-4 text-purple-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
              {metrics.totalAssignedWorkContent.toFixed(1)}s
            </span>
            <span className="text-xs text-slate-500">5 Task Elements</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Standard time with 12% total PF&amp;D allowance
          </div>
        </div>

        {/* KPI 3: Validated Headcount */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-semibold uppercase tracking-wider">Direct Manpower</span>
            <Users className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
              {manpowerPlan.proposedAssignedOperators} Ops
            </span>
            <span className="text-xs text-emerald-700 font-medium">
              (Legacy: {manpowerPlan.currentLegacyManpower} Ops)
            </span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Theoretical: Ceiling(180s/36s) = 5 direct + 1 relief
          </div>
        </div>

        {/* KPI 4: Line Balance Efficiency */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-semibold uppercase tracking-wider">Line Balance Efficiency</span>
            <BarChart3 className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
              {metrics.balanceEfficiency}%
            </span>
            <span className="text-xs text-slate-500">Smoothness: {metrics.smoothnessIndex}</span>
          </div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Optimal balance (Overloaded: {metrics.overloadedCount})</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Line Balancing Chart & Workflow Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Interactive Line Balancing Chart */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Workload Distribution by Operator Position
              </h3>
              <p className="text-xs text-slate-500">
                Target Cycle Time: 36.0s (horizontal threshold). All stations must remain &le; 36.0s.
              </p>
            </div>
            <button
              onClick={() => onNavigate('workload')}
              className="text-xs font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <span>Balance Board</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Bar Chart Representation */}
          <div className="space-y-4 pt-2">
            {metrics.positionStats.map((pos) => {
              const target = manpowerPlan.targetCycleTime;
              const percent = (pos.totalAssignedTime / target) * 100;
              const isOver = pos.totalAssignedTime > target;

              return (
                <div key={pos.positionId} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 w-12 font-mono">{pos.positionNumber}</span>
                      <span className="text-slate-600 truncate max-w-[280px] sm:max-w-md">
                        {pos.positionName}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 font-mono text-xs">
                      <span className="font-semibold text-slate-900">{pos.totalAssignedTime.toFixed(1)}s</span>
                      <span className="text-slate-400">/ 36.0s</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${
                        isOver
                          ? 'bg-rose-100 text-rose-700'
                          : 'bg-emerald-50 text-emerald-700'
                      }`}>
                        {pos.utilization}%
                      </span>
                    </div>
                  </div>

                  {/* Visual Progress Bar with 100% Marker */}
                  <div className="relative w-full h-4 bg-slate-100 rounded overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        isOver
                          ? 'bg-rose-500'
                          : percent > 95
                          ? 'bg-blue-600'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(percent, 100)}%` }}
                    />
                    {/* Target Benchmark indicator */}
                    <div
                      className="absolute top-0 bottom-0 right-0 w-0.5 bg-slate-900 z-10"
                      title="Target Cycle Time (36.0s)"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary Strip */}
          <div className="mt-6 pt-4 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">Max Station Time</span>
              <span className="font-bold font-mono text-slate-800">{metrics.maxStationTime.toFixed(1)}s (OP-03)</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Min Station Time</span>
              <span className="font-bold font-mono text-slate-800">35.2s (OP-04)</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Line Balance</span>
              <span className="font-bold font-mono text-emerald-600">{metrics.balanceEfficiency}% Balanced</span>
            </div>
          </div>
        </div>

        {/* Right Col: Quick Access & Mass Production Verification */}
        <div className="space-y-6">
          {/* Mass Production Verification Summary */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span>Mass Production Results</span>
              </h3>
              <button
                onClick={() => onNavigate('verification')}
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                Shift Logs &rarr;
              </button>
            </div>

            {latestVerification ? (
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-slate-500">Shift Date</span>
                  <span className="font-semibold text-slate-900">{latestVerification.shiftDate} ({latestVerification.shiftName})</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-slate-500">Actual vs Planned Output</span>
                  <span className="font-mono font-bold text-emerald-600">
                    {latestVerification.actualOutput} / {latestVerification.plannedOutput} pcs ({latestVerification.outputAchievementPercent}%)
                  </span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-slate-500">Cycle Time Achievement</span>
                  <span className="font-mono font-bold text-slate-900">
                    {latestVerification.actualCycleTime}s (Target: {latestVerification.targetCycleTime}s)
                  </span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-slate-500">Manpower Deployed</span>
                  <span className="font-mono font-bold text-slate-900">
                    {latestVerification.actualManpower} Operators (0 Gap)
                  </span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded text-[11px] text-slate-600 border border-slate-100">
                  <span className="font-semibold text-slate-800">Supervisor Note: </span>
                  {latestVerification.supervisorRemarks}
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500">No shift verification logs recorded yet.</p>
            )}
          </div>

          {/* Pending Action Card */}
          <div className="bg-amber-50/70 border border-amber-200 rounded-lg p-5">
            <div className="flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                  Pending Study Approval
                </h4>
                <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                  The proposed 5-operator workload plan and 180s work content have been validated by Industrial Engineering and are awaiting final sign-off by the Plant Operations Director.
                </p>
                <button
                  onClick={() => onNavigate('feasibility')}
                  className="mt-3 px-3 py-1.5 text-xs font-semibold text-amber-900 bg-amber-200/80 hover:bg-amber-200 rounded transition-colors"
                >
                  View 14-Point Feasibility Checklist
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
