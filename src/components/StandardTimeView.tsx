import React from 'react';
import { TaskElement, AllowanceSettings, AllowanceMethod } from '../types';
import {
  calculateObservationStats,
  calculateNormalTime,
  calculateStandardTime,
  getElementStandardTimeSummary,
} from '../utils/calculations';
import { Calculator, CheckCircle2, Sliders, Info, ArrowRight } from 'lucide-react';

interface StandardTimeViewProps {
  elements: TaskElement[];
  allowanceSettings: AllowanceSettings;
  onUpdateAllowanceSettings: (updated: AllowanceSettings) => void;
  onNavigate: (tabId: string) => void;
}

export const StandardTimeView: React.FC<StandardTimeViewProps> = ({
  elements,
  allowanceSettings,
  onUpdateAllowanceSettings,
  onNavigate,
}) => {
  const handleMethodChange = (method: AllowanceMethod) => {
    onUpdateAllowanceSettings({
      ...allowanceSettings,
      method,
    });
  };

  const handleAllowanceChange = (field: keyof AllowanceSettings, value: number) => {
    const updated = {
      ...allowanceSettings,
      [field]: value,
    };
    // Recalculate total
    updated.totalAllowancePercent = Number(
      (
        updated.personalAllowancePercent +
        updated.basicFatiguePercent +
        updated.unavoidableDelayPercent +
        updated.specialProcessPercent
      ).toFixed(1)
    );
    onUpdateAllowanceSettings(updated);
  };

  // Compute all element summaries
  const summaries = elements.map((e) => getElementStandardTimeSummary(e, allowanceSettings));
  const totalStandardWorkContent = Number(
    summaries.reduce((acc, s) => acc + s.standardTime, 0).toFixed(2)
  );

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Standard Time Calculation Engine</h2>
          <p className="text-xs text-slate-500">
            Transparent policy-driven calculation from observed time to normal time and approved standard time.
          </p>
        </div>
        <button
          onClick={() => onNavigate('workload')}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-xs transition-colors"
        >
          <span>Line Balancing Board</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Allowance Settings & Formula Selector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Method Toggle Card */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-4">
          <div className="pb-2 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Allowance Calculation Method</h3>
            <Sliders className="w-4 h-4 text-slate-400" />
          </div>

          <div className="space-y-2 text-xs">
            <label
              className={`block p-3 rounded-lg border cursor-pointer transition-all ${
                allowanceSettings.method === 'fraction_of_standard'
                  ? 'bg-blue-50/70 border-blue-500 ring-1 ring-blue-500'
                  : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  name="allowanceMethod"
                  checked={allowanceSettings.method === 'fraction_of_standard'}
                  onChange={() => handleMethodChange('fraction_of_standard')}
                  className="text-blue-600"
                />
                <span className="font-bold text-slate-900">Method A: Fraction of Total Standard Time (Default)</span>
              </div>
              <div className="font-mono text-[11px] text-blue-700 mt-1 pl-5">
                Standard Time = Normal Time / (1 - Allowance)
              </div>
              <div className="text-[11px] text-slate-500 mt-1 pl-5">
                Standard automotive ILO / TPS convention where allowance is expressed as a proportion of total standard working day.
              </div>
            </label>

            <label
              className={`block p-3 rounded-lg border cursor-pointer transition-all ${
                allowanceSettings.method === 'percent_of_normal'
                  ? 'bg-blue-50/70 border-blue-500 ring-1 ring-blue-500'
                  : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  name="allowanceMethod"
                  checked={allowanceSettings.method === 'percent_of_normal'}
                  onChange={() => handleMethodChange('percent_of_normal')}
                  className="text-blue-600"
                />
                <span className="font-bold text-slate-900">Method B: Percentage of Normal Time</span>
              </div>
              <div className="font-mono text-[11px] text-blue-700 mt-1 pl-5">
                Standard Time = Normal Time &times; (1 + Allowance)
              </div>
              <div className="text-[11px] text-slate-500 mt-1 pl-5">
                Alternative convention used when allowances are added directly as a percentage markup over basic work pace.
              </div>
            </label>
          </div>
        </div>

        {/* PF&D Allowance Builder (2 cols) */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-4">
          <div className="pb-2 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Personal, Fatigue &amp; Delay (PF&amp;D) Allowances
              </h3>
              <p className="text-xs text-slate-500">
                Calibrated against standard manufacturing industrial engineering benchmarks.
              </p>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Total Allowance</span>
              <span className="text-lg font-bold font-mono text-blue-600">
                {allowanceSettings.totalAllowancePercent.toFixed(1)}%
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1.5">
              <div className="flex justify-between font-medium text-slate-800">
                <span>Personal Needs Allowance</span>
                <span className="font-mono font-bold">{allowanceSettings.personalAllowancePercent}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                step="0.5"
                value={allowanceSettings.personalAllowancePercent}
                onChange={(e) => handleAllowanceChange('personalAllowancePercent', parseFloat(e.target.value))}
                className="w-full accent-blue-600"
              />
              <span className="text-[10px] text-slate-400 block">Hydration, washroom, personal comfort (5.0% standard)</span>
            </div>

            <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1.5">
              <div className="flex justify-between font-medium text-slate-800">
                <span>Basic Fatigue Allowance</span>
                <span className="font-mono font-bold">{allowanceSettings.basicFatiguePercent}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="12"
                step="0.5"
                value={allowanceSettings.basicFatiguePercent}
                onChange={(e) => handleAllowanceChange('basicFatiguePercent', parseFloat(e.target.value))}
                className="w-full accent-blue-600"
              />
              <span className="text-[10px] text-slate-400 block">Standing posture, continuous fine eye strain (4.0% standard)</span>
            </div>

            <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1.5">
              <div className="flex justify-between font-medium text-slate-800">
                <span>Unavoidable Delays</span>
                <span className="font-mono font-bold">{allowanceSettings.unavoidableDelayPercent}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                step="0.5"
                value={allowanceSettings.unavoidableDelayPercent}
                onChange={(e) => handleAllowanceChange('unavoidableDelayPercent', parseFloat(e.target.value))}
                className="w-full accent-blue-600"
              />
              <span className="text-[10px] text-slate-400 block">Tape dispenser reload, jig sensor wipe (3.0% standard)</span>
            </div>

            <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1.5">
              <div className="flex justify-between font-medium text-slate-800">
                <span>Special Process / Thermal</span>
                <span className="font-mono font-bold">{allowanceSettings.specialProcessPercent}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                step="0.5"
                value={allowanceSettings.specialProcessPercent}
                onChange={(e) => handleAllowanceChange('specialProcessPercent', parseFloat(e.target.value))}
                className="w-full accent-blue-600"
              />
              <span className="text-[10px] text-slate-400 block">Severe heat shrink tunnel or heavy cable bending (0.0%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Standard Time Breakdown Table */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Task Elements Standard Time Schedule
            </h3>
            <p className="text-xs text-slate-500">
              Complete traceable breakdown from Average Observed Time &rarr; Normal Time &rarr; Standard Time.
            </p>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Total Work Content</span>
            <span className="text-xl font-bold font-mono text-slate-900">{totalStandardWorkContent}s</span>
          </div>
        </div>

        <div className="table-responsive overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
              <tr>
                <th className="py-2.5 px-3">Element Code</th>
                <th className="py-2.5 px-3">Operation Description</th>
                <th className="py-2.5 px-3">Workstation</th>
                <th className="py-2.5 px-3 text-right">Avg Observed</th>
                <th className="py-2.5 px-3 text-right">Rating Factor</th>
                <th className="py-2.5 px-3 text-right">Normal Time</th>
                <th className="py-2.5 px-3 text-right">Allowance</th>
                <th className="py-2.5 px-3 text-right font-bold text-slate-900">Standard Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {summaries.map((s) => {
                const el = elements.find((e) => e.id === s.elementId);
                return (
                  <tr key={s.elementId} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-bold text-blue-600">{el?.elementCode}</td>
                    <td className="py-2.5 px-3 font-sans text-slate-800 font-medium">{el?.operationName}</td>
                    <td className="py-2.5 px-3 font-sans text-slate-500 text-[11px]">{el?.workstation}</td>
                    <td className="py-2.5 px-3 text-right text-slate-700">{s.averageObservedTime}s</td>
                    <td className="py-2.5 px-3 text-right text-slate-700">{s.performanceRating.toFixed(2)}</td>
                    <td className="py-2.5 px-3 text-right font-semibold text-slate-900">{s.normalTime}s</td>
                    <td className="py-2.5 px-3 text-right text-slate-500">
                      {(s.allowanceFraction * 100).toFixed(1)}%
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-blue-600 text-sm">
                      {s.standardTime}s
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="bg-slate-50/80 border-t-2 border-slate-200 font-mono font-bold text-slate-900">
              <tr>
                <td colSpan={3} className="py-2.5 px-3 font-sans uppercase text-[11px] text-slate-600">
                  Total Measured Automotive Harness Work Content
                </td>
                <td colSpan={4} className="py-2.5 px-3 text-right font-sans text-xs text-slate-500">
                  Sum of 5 Standard Work Elements:
                </td>
                <td className="py-2.5 px-3 text-right text-blue-700 text-base">
                  {totalStandardWorkContent}s
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};
