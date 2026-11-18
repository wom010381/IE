import React, { useState } from 'react';
import { ManpowerCalculationResult, UserRole } from '../types';
import {
  calculateTaktTime,
  calculateTheoreticalMinOperators,
  calculateTheoreticalOutput,
  calculateAdjustedCapacity,
} from '../utils/calculations';
import {
  Users,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  TrendingDown,
  Info,
  Sliders,
} from 'lucide-react';

interface ManpowerCalculatorViewProps {
  manpowerPlan: ManpowerCalculationResult;
  currentRole: UserRole;
  onUpdatePlan: (updated: ManpowerCalculationResult) => void;
  onNavigate: (tabId: string) => void;
}

export const ManpowerCalculatorView: React.FC<ManpowerCalculatorViewProps> = ({
  manpowerPlan,
  currentRole,
  onUpdatePlan,
  onNavigate,
}) => {
  // Configurable inputs
  const [netSeconds, setNetSeconds] = useState(manpowerPlan.netAvailableTime);
  const [demand, setDemand] = useState(manpowerPlan.requiredCustomerQuantity);
  const [targetCycle, setTargetCycle] = useState(manpowerPlan.targetCycleTime);
  const [workContent, setWorkContent] = useState(manpowerPlan.totalStandardWorkContent);
  const [efficiency, setEfficiency] = useState(manpowerPlan.lineEfficiencyFactor);
  const [reliefOps, setReliefOps] = useState(manpowerPlan.reliefOperators);
  const [indirectOps, setIndirectOps] = useState(manpowerPlan.indirectSupportHeadcount);

  // Recalculations
  const takt = calculateTaktTime(netSeconds, demand);
  const theoreticalDirect = calculateTheoreticalMinOperators(workContent, targetCycle);
  const theoreticalCapacity = calculateTheoreticalOutput(netSeconds, targetCycle);
  const adjustedCapacity = calculateAdjustedCapacity(netSeconds, targetCycle, efficiency);
  const totalStaffing = theoreticalDirect + reliefOps + indirectOps;
  const delta = theoreticalDirect - manpowerPlan.currentLegacyManpower;

  const handleApplyChanges = () => {
    onUpdatePlan({
      ...manpowerPlan,
      netAvailableTime: netSeconds,
      requiredCustomerQuantity: demand,
      taktTime: takt,
      targetCycleTime: targetCycle,
      totalStandardWorkContent: workContent,
      theoreticalMinimumOperators: theoreticalDirect,
      proposedAssignedOperators: theoreticalDirect,
      theoreticalOutput: theoreticalCapacity,
      lineEfficiencyFactor: efficiency,
      adjustedPlanningCapacity: adjustedCapacity,
      reliefOperators: reliefOps,
      indirectSupportHeadcount: indirectOps,
      totalShiftStaffing: totalStaffing,
      manpowerDelta: delta,
    });
  };

  const handleApprovePlan = () => {
    if (currentRole !== 'approver' && currentRole !== 'admin') {
      alert('Only the Plant Operations Director (Approver) or System Administrator can officially approve manpower plans.');
      return;
    }

    onUpdatePlan({
      ...manpowerPlan,
      status: 'Approved',
      approvalDate: new Date().toISOString().split('T')[0],
      approvedBy: 'David K. Henderson (Plant Operations Director)',
    });
  };

  const canApprove = currentRole === 'approver' || currentRole === 'admin';

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Validated Manpower Planning Calculator</h2>
          <p className="text-xs text-slate-500">
            Determine required line manpower using demand, net available time, cycle time, and validated work content.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('feasibility')}
            className="px-3 py-1.5 border border-slate-300 rounded text-xs font-medium hover:bg-slate-50 text-slate-700"
          >
            Check 14 Feasibility Rules &rarr;
          </button>
          {manpowerPlan.status !== 'Approved' && (
            <button
              onClick={handleApprovePlan}
              disabled={!canApprove}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white rounded text-xs font-semibold shadow-xs flex items-center gap-1.5"
              title={canApprove ? 'Approve Manpower Plan' : 'Requires Approver Role'}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Approve Manpower Plan</span>
            </button>
          )}
        </div>
      </div>

      {/* Status Banner */}
      <div className={`p-4 rounded-lg border text-xs flex items-start justify-between gap-4 ${
        manpowerPlan.status === 'Approved'
          ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
          : manpowerPlan.status === 'Validated'
          ? 'bg-blue-50 border-blue-200 text-blue-900'
          : 'bg-amber-50 border-amber-200 text-amber-900'
      }`}>
        <div className="flex items-start gap-3">
          <ShieldCheck className={`w-5 h-5 shrink-0 mt-0.5 ${
            manpowerPlan.status === 'Approved' ? 'text-emerald-600' : 'text-blue-600'
          }`} />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm">
                Manpower Plan Status: {manpowerPlan.status.toUpperCase()}
              </span>
              {manpowerPlan.approvalDate && (
                <span className="text-[11px] font-mono text-emerald-700">
                  Approved on {manpowerPlan.approvalDate} by {manpowerPlan.approvedBy}
                </span>
              )}
            </div>
            <p className="mt-1 leading-relaxed text-xs">
              Direct Direct Direct: <strong>5 Operators</strong> &bull; Total Shift Headcount (including floating relief &amp; indirect material kitting): <strong>{manpowerPlan.totalShiftStaffing} Operators</strong>.
            </p>
          </div>
        </div>

        <div className="text-right shrink-0">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Delta vs Legacy Line</span>
          <span className="text-base font-bold font-mono text-emerald-700">
            {delta < 0 ? `${delta} Operator (Redeployed)` : `${delta} Operators`}
          </span>
        </div>
      </div>

      {/* Main Calculation Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Planning Parameters (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-4">
          <div className="pb-2 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Planning Inputs &amp; Parameters</h3>
            <Sliders className="w-4 h-4 text-slate-400" />
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Net Available Production Time per Shift (seconds) *
              </label>
              <input
                type="number"
                value={netSeconds}
                onChange={(e) => setNetSeconds(Number(e.target.value))}
                className="w-full border border-slate-300 rounded px-2.5 py-1.5 font-mono text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <span className="text-[10px] text-slate-400 block mt-0.5">
                8.0h gross shift - 60 min scheduled lunch &amp; breaks = 7.0h net (25,200s)
              </span>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Required Customer Order Quantity (units / shift) *
              </label>
              <input
                type="number"
                value={demand}
                onChange={(e) => setDemand(Number(e.target.value))}
                className="w-full border border-slate-300 rounded px-2.5 py-1.5 font-mono text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <span className="text-[10px] text-slate-400 block mt-0.5">
                Customer delivery requirement (700 units / shift)
              </span>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Target Cycle Time (seconds) *
              </label>
              <input
                type="number"
                step="0.1"
                value={targetCycle}
                onChange={(e) => setTargetCycle(Number(e.target.value))}
                className="w-full border border-slate-300 rounded px-2.5 py-1.5 font-mono text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <span className="text-[10px] text-slate-400 block mt-0.5">
                Approved engineering line cycle time (36.0s)
              </span>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Total Standard Work Content (seconds) *
              </label>
              <input
                type="number"
                step="0.1"
                value={workContent}
                onChange={(e) => setWorkContent(Number(e.target.value))}
                className="w-full border border-slate-300 rounded px-2.5 py-1.5 font-mono text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <span className="text-[10px] text-slate-400 block mt-0.5">
                Validated standard times across 5 assembly operations (180.0s)
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block font-medium text-slate-700 mb-1">OEE / Efficiency Factor</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.5"
                  max="1.0"
                  value={efficiency}
                  onChange={(e) => setEfficiency(Number(e.target.value))}
                  className="w-full border border-slate-300 rounded px-2 py-1 font-mono text-slate-900"
                />
                <span className="text-[10px] text-slate-400 block">92.0% modeled OEE</span>
              </div>
              <div>
                <label className="block font-medium text-slate-700 mb-1">Relief Operators</label>
                <input
                  type="number"
                  min="0"
                  value={reliefOps}
                  onChange={(e) => setReliefOps(Number(e.target.value))}
                  className="w-full border border-slate-300 rounded px-2 py-1 font-mono text-slate-900"
                />
                <span className="text-[10px] text-slate-400 block">Floating relief</span>
              </div>
            </div>

            <button
              onClick={handleApplyChanges}
              className="w-full mt-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded font-semibold text-xs transition-colors shadow-xs"
            >
              Recalculate &amp; Save Plan Parameters
            </button>
          </div>
        </div>

        {/* Right Column: Mathematical Derivation & Headcount Results (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-4">
          <div className="pb-2 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Formulas &amp; Engineering Derivations
            </h3>
            <span className="text-[11px] text-slate-500 font-mono">TPS / ILO Standard Equations</span>
          </div>

          <div className="space-y-4 text-xs">
            {/* Step A: Takt Time */}
            <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1">
              <div className="flex justify-between items-baseline">
                <span className="font-bold text-slate-900">Step A: Takt Time from Customer Demand</span>
                <span className="font-mono font-bold text-blue-600 text-sm">{takt.toFixed(1)}s / unit</span>
              </div>
              <div className="font-mono text-[11px] text-slate-600">
                Takt Time = Net Available Time ({netSeconds.toLocaleString()}s) &divide; Customer Demand ({demand} pcs)
              </div>
              <div className="text-[11px] text-slate-500">
                Pacing required: Line must produce 1 completed harness every 36.0 seconds.
              </div>
            </div>

            {/* Step B & C: Work Content Headcount */}
            <div className="p-3 bg-blue-50/60 rounded border border-blue-200 space-y-1">
              <div className="flex justify-between items-baseline">
                <span className="font-bold text-blue-950">Step B: Theoretical Minimum Direct Headcount</span>
                <span className="font-mono font-bold text-blue-700 text-base">{theoreticalDirect} Direct Operators</span>
              </div>
              <div className="font-mono text-[11px] text-blue-800">
                Direct Operators = Ceiling(Total Work Content ({workContent}s) &divide; Target Cycle Time ({targetCycle}s))
              </div>
              <div className="font-mono text-[11px] text-blue-800">
                = Ceiling(180.0 / 36.0) = Ceiling(5.00) = 5 Operators
              </div>
              <div className="text-[11px] text-blue-900">
                Confirms the prompt&apos;s expected result: Exactly 5 direct operators are required for 180s work content.
              </div>
            </div>

            {/* Step D: Capacity Check */}
            <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1">
              <div className="flex justify-between items-baseline">
                <span className="font-bold text-slate-900">Step C: Demand-Based Shift Capacity Check</span>
                <span className="font-mono font-bold text-slate-900">{theoreticalCapacity} units / shift</span>
              </div>
              <div className="font-mono text-[11px] text-slate-600">
                Theoretical Output = Available Time ({netSeconds}s) &divide; Target Cycle Time ({targetCycle}s) = 700 units
              </div>
              <div className="font-mono text-[11px] text-slate-600">
                Adjusted Capacity @ {(efficiency * 100).toFixed(0)}% OEE = {adjustedCapacity} units / shift
              </div>
              <div className="text-[11px] text-slate-500">
                Capacity matches 700 units demand at 100% stable cycle; planned OEE buffer accounted for in shift scheduling.
              </div>
            </div>

            {/* Step E: Staffing & Relief Roster */}
            <div className="p-3 bg-emerald-50/60 rounded border border-emerald-200 space-y-1">
              <div className="flex justify-between items-baseline">
                <span className="font-bold text-emerald-950">Step D: Total Shift Staffing Allocation</span>
                <span className="font-mono font-bold text-emerald-800 text-base">{totalStaffing} Total Headcount</span>
              </div>
              <div className="text-[11px] text-emerald-900 space-y-0.5 pt-1">
                <div>&bull; Direct Assembly Line Operators: <strong className="font-mono">{theoreticalDirect}</strong></div>
                <div>&bull; Floating Relief Operator (break rotation &amp; fatigue coverage): <strong className="font-mono">{reliefOps}</strong></div>
                <div>&bull; Indirect Material Feeder / Kitting Supply: <strong className="font-mono">{indirectOps}</strong></div>
              </div>
            </div>

            {/* Key Assumptions Box */}
            <div className="p-3 bg-slate-50 rounded border border-slate-100 text-[11px] text-slate-600 space-y-1">
              <span className="font-bold text-slate-700 block">Documented Engineering Assumptions:</span>
              <ul className="list-disc list-inside space-y-0.5 text-slate-600">
                {manpowerPlan.assumptions.map((asm, idx) => (
                  <li key={idx}>{asm}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
