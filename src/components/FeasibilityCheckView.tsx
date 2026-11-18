import React from 'react';
import {
  TaskElement,
  OperatorPosition,
  AllowanceSettings,
  ManpowerCalculationResult,
} from '../types';
import { validateWorkloadFeasibility } from '../utils/calculations';
import {
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  XCircle,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';

interface FeasibilityCheckViewProps {
  elements: TaskElement[];
  positions: OperatorPosition[];
  allowanceSettings: AllowanceSettings;
  manpowerPlan: ManpowerCalculationResult;
  onNavigate: (tabId: string) => void;
}

export const FeasibilityCheckView: React.FC<FeasibilityCheckViewProps> = ({
  elements,
  positions,
  allowanceSettings,
  manpowerPlan,
  onNavigate,
}) => {
  const checks = validateWorkloadFeasibility(
    elements,
    positions,
    allowanceSettings,
    manpowerPlan
  );

  const passedCount = checks.filter((c) => c.status === 'passed').length;
  const warningCount = checks.filter((c) => c.status === 'warning').length;
  const failedCount = checks.filter((c) => c.status === 'failed').length;
  const notVerifiedCount = checks.filter((c) => c.status === 'not_verified').length;

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Workload Feasibility &amp; Constraint Validation</h2>
          <p className="text-xs text-slate-500">
            Mandatory 14-point industrial engineering compliance verification prior to manpower plan approval.
          </p>
        </div>
        <button
          onClick={() => onNavigate('standardwork')}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-xs transition-colors"
        >
          <span>Standard Work Instructions</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Summary Scorecard */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
            Verified Passed
          </span>
          <div className="text-2xl font-bold font-mono text-emerald-600 mt-0.5">
            {passedCount} / {checks.length}
          </div>
          <span className="text-[11px] text-slate-500">Rigorous compliance</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
            Warnings
          </span>
          <div className="text-2xl font-bold font-mono text-amber-600 mt-0.5">
            {warningCount}
          </div>
          <span className="text-[11px] text-slate-500">Review recommended</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
            Failed Constraints
          </span>
          <div className={`text-2xl font-bold font-mono mt-0.5 ${failedCount > 0 ? 'text-rose-600' : 'text-slate-400'}`}>
            {failedCount}
          </div>
          <span className="text-[11px] text-slate-500">Blocks final approval</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
            Not Verified
          </span>
          <div className="text-2xl font-bold font-mono text-slate-500 mt-0.5">
            {notVerifiedCount}
          </div>
          <span className="text-[11px] text-slate-500">Requires audit confirmation</span>
        </div>
      </div>

      {/* 14 Rules Detailed Checklist */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs font-semibold text-slate-700">
          <span>Constraint Verification Checklist (Module 9 Governance)</span>
          <span className="font-mono text-slate-500">Rule 1 to 14</span>
        </div>

        <div className="divide-y divide-slate-100">
          {checks.map((chk) => {
            return (
              <div key={chk.id} className="p-4 hover:bg-slate-50/60 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 shrink-0">
                      {chk.status === 'passed' && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      )}
                      {chk.status === 'warning' && (
                        <AlertTriangle className="w-5 h-5 text-amber-500" />
                      )}
                      {chk.status === 'failed' && (
                        <XCircle className="w-5 h-5 text-rose-600" />
                      )}
                      {chk.status === 'not_verified' && (
                        <HelpCircle className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs font-mono text-slate-900">
                          #{chk.ruleNumber}. {chk.title}
                        </span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded font-mono font-medium uppercase ${
                            chk.status === 'passed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : chk.status === 'warning'
                              ? 'bg-amber-100 text-amber-800'
                              : chk.status === 'failed'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {chk.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">{chk.description}</p>
                      <div className="text-xs text-slate-800 pt-1 leading-relaxed">
                        <strong>Engineering Finding: </strong>
                        <span>{chk.finding}</span>
                      </div>
                      {chk.correctionRequired && (
                        <div className="text-xs text-rose-700 pt-0.5">
                          <strong>Correction Required: </strong>
                          <span>{chk.correctionRequired}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
