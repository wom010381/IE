import React, { useState } from 'react';
import {
  ProductModel,
  OperatorPosition,
  TaskElement,
  AllowanceSettings,
} from '../types';
import { getElementStandardTimeSummary } from '../utils/calculations';
import { Printer, FileText, CheckCircle2, AlertTriangle, Shield, Wrench, Eye } from 'lucide-react';

interface StandardWorkViewProps {
  products: ProductModel[];
  positions: OperatorPosition[];
  elements: TaskElement[];
  allowanceSettings: AllowanceSettings;
  targetCycleTime: number;
}

export const StandardWorkView: React.FC<StandardWorkViewProps> = ({
  products,
  positions,
  elements,
  allowanceSettings,
  targetCycleTime,
}) => {
  const [selectedPositionId, setSelectedPositionId] = useState<string>(positions[0]?.id || '');
  const product = products[0];
  const position = positions.find((p) => p.id === selectedPositionId) || positions[0];

  const assignedElements = elements.filter((el) =>
    position?.assignedElementIds.includes(el.id)
  );

  const totalAssignedStandardTime = assignedElements.reduce((acc, el) => {
    const summary = getElementStandardTimeSummary(el, allowanceSettings);
    return acc + summary.standardTime;
  }, 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Title & Actions */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Standard Work Documentation (SWI / SOP)</h2>
          <p className="text-xs text-slate-500">
            Controlled Standardized Work Instructions with critical quality gates and safety guidelines.
          </p>
        </div>
        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md shadow-xs transition-colors"
        >
          <Printer className="w-4 h-4 text-slate-200" />
          <span>Print Shop-Floor Instruction Sheet</span>
        </button>
      </div>

      {/* Position Selector Bar */}
      <div className="no-print flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
        {positions.map((pos) => {
          const isSelected = pos.id === selectedPositionId;
          return (
            <button
              key={pos.id}
              onClick={() => setSelectedPositionId(pos.id)}
              className={`px-3.5 py-2 rounded-md text-xs font-medium whitespace-nowrap transition-all border ${
                isSelected
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span className="font-bold font-mono mr-1.5">{pos.positionNumber}:</span>
              <span>{pos.positionName.substring(0, 28)}...</span>
            </button>
          );
        })}
      </div>

      {/* Standard Work Sheet (Styled for Screen & Print) */}
      <div className="bg-white border-2 border-slate-800 rounded-lg p-6 shadow-sm space-y-6 print:border-black print:p-0 print:shadow-none">
        {/* Engineering Header Block */}
        <div className="border-b-2 border-slate-800 pb-4 space-y-3">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                AUTOMOTIVE WIRING HARNESS STANDARD WORK INSTRUCTION (SWI)
              </div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                {product?.modelNumber} ({product?.revision}) — {product?.name}
              </h1>
            </div>
            <div className="text-right font-mono text-xs text-slate-700">
              <div>Doc No: <strong className="text-slate-900">SWI-WH-ENG-8402-001</strong></div>
              <div>Controlled Rev: <strong>Rev 2.0 (Approved)</strong></div>
              <div>Effective Date: <strong>2026-10-28</strong></div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-200 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Assembly Line</span>
              <span className="font-semibold text-slate-900">{product?.assemblyLine}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Operator Station</span>
              <span className="font-bold text-slate-900 font-mono">{position?.positionNumber} ({position?.workstation})</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Target Cycle Time</span>
              <span className="font-mono font-bold text-blue-700">{targetCycleTime.toFixed(1)}s</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Station Standard Time</span>
              <span className="font-mono font-bold text-emerald-700">{totalAssignedStandardTime.toFixed(1)}s</span>
            </div>
          </div>
        </div>

        {/* Step-by-Step Operations Table */}
        <div className="space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Standard Work Sequence &amp; Operational Detail
          </div>

          <div className="border border-slate-300 rounded overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 border-b border-slate-300 font-bold text-slate-800">
                <tr>
                  <th className="py-2.5 px-3 w-12 text-center">Step</th>
                  <th className="py-2.5 px-3 w-48">Operation &amp; Tools</th>
                  <th className="py-2.5 px-3">Work Instruction &amp; Key Quality Points</th>
                  <th className="py-2.5 px-3 w-48">Safety &amp; Ergonomics</th>
                  <th className="py-2.5 px-3 w-20 text-right">Std Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {assignedElements.map((el, idx) => {
                  const summary = getElementStandardTimeSummary(el, allowanceSettings);
                  return (
                    <tr key={el.id} className="align-top">
                      <td className="py-3 px-3 text-center font-bold font-mono text-slate-900">
                        {idx + 1}
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900">{el.operationName}</div>
                        <div className="text-[11px] text-slate-500 mt-1 flex items-start gap-1">
                          <Wrench className="w-3 h-3 text-slate-400 shrink-0 mt-0.5" />
                          <span>{el.tools}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 space-y-2">
                        <p className="text-slate-800 leading-relaxed">{el.workDescription}</p>
                        <div className="p-2 bg-emerald-50 rounded border border-emerald-200 text-[11px] text-emerald-950 flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <div>
                            <strong>Critical Quality Point: </strong>
                            <span>{el.qualityChecks}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="p-2 bg-amber-50 rounded border border-amber-200 text-[11px] text-amber-950 flex items-start gap-1.5">
                          <Shield className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                          <span>{el.safetyConsiderations}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                        {summary.standardTime}s
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quality Gate & Station Layout Check */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
          <div className="p-3.5 border border-slate-300 rounded space-y-1">
            <span className="font-bold text-slate-900 block flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Station Quality Gate Checkpoint:
            </span>
            <p className="text-slate-700 leading-relaxed text-[11px]">
              {position?.qualityGate}
            </p>
          </div>

          <div className="p-3.5 border border-slate-300 rounded space-y-1">
            <span className="font-bold text-slate-900 block flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-blue-600" /> Required Operator Competencies:
            </span>
            <div className="text-slate-700 text-[11px]">
              {position?.requiredSkills.join(' &bull; ')}
            </div>
          </div>
        </div>

        {/* Formal Sign-off Signature Strip */}
        <div className="border-t-2 border-slate-800 pt-4 grid grid-cols-3 gap-6 text-xs text-center font-mono">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Prepared By</span>
            <div className="h-10 flex items-end justify-center font-semibold text-slate-900">
              Marcus Vance, PE
            </div>
            <div className="border-t border-slate-300 pt-1 text-[10px] text-slate-500">
              Lead Work Study Engineer
            </div>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Reviewed By</span>
            <div className="h-10 flex items-end justify-center font-semibold text-slate-900">
              Eleanor Torres
            </div>
            <div className="border-t border-slate-300 pt-1 text-[10px] text-slate-500">
              Industrial Eng Leader
            </div>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Approved By</span>
            <div className="h-10 flex items-end justify-center font-semibold text-slate-900">
              David K. Henderson
            </div>
            <div className="border-t border-slate-300 pt-1 text-[10px] text-slate-500">
              Plant Operations Director
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
