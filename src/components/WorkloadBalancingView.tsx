import React, { useState } from 'react';
import { OperatorPosition, TaskElement, AllowanceSettings } from '../types';
import {
  calculateLineBalancingMetrics,
  getElementStandardTimeSummary,
} from '../utils/calculations';
import {
  Scale,
  AlertTriangle,
  CheckCircle2,
  ArrowRightLeft,
  Users,
  ShieldAlert,
  ArrowRight,
  Plus,
} from 'lucide-react';

interface WorkloadBalancingViewProps {
  positions: OperatorPosition[];
  elements: TaskElement[];
  allowanceSettings: AllowanceSettings;
  targetCycleTime: number;
  onUpdatePositions: (updatedPositions: OperatorPosition[]) => void;
  onNavigate: (tabId: string) => void;
}

export const WorkloadBalancingView: React.FC<WorkloadBalancingViewProps> = ({
  positions,
  elements,
  allowanceSettings,
  targetCycleTime,
  onUpdatePositions,
  onNavigate,
}) => {
  const [selectedPositionId, setSelectedPositionId] = useState<string>(positions[0]?.id || '');
  const [moveElementId, setMoveElementId] = useState<string | null>(null);
  const [targetPosId, setTargetPosId] = useState<string>(positions[0]?.id || '');

  const metrics = calculateLineBalancingMetrics(
    positions,
    elements,
    allowanceSettings,
    targetCycleTime
  );

  // Element times lookup
  const elementTimeMap = new Map<string, number>();
  elements.forEach((el) => {
    const summary = getElementStandardTimeSummary(el, allowanceSettings);
    elementTimeMap.set(el.id, summary.standardTime);
  });

  // Handle task re-assignment
  const handleExecuteMove = () => {
    if (!moveElementId || !targetPosId) return;

    const newPositions = positions.map((p) => {
      // Remove from current position
      const filtered = p.assignedElementIds.filter((id) => id !== moveElementId);
      // Add to target position
      if (p.id === targetPosId) {
        return {
          ...p,
          assignedElementIds: [...filtered, moveElementId],
        };
      }
      return {
        ...p,
        assignedElementIds: filtered,
      };
    });

    onUpdatePositions(newPositions);
    setMoveElementId(null);
  };

  const selectedPos = positions.find((p) => p.id === selectedPositionId) || positions[0];
  const selectedPosStats = metrics.positionStats.find((s) => s.positionId === selectedPos?.id);

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Workload Distribution &amp; Line Balancing</h2>
          <p className="text-xs text-slate-500">
            Automotive assembly line balancing board with live cycle time, utilization, and overload governance.
          </p>
        </div>
        <button
          onClick={() => onNavigate('manpower')}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-xs transition-colors"
        >
          <span>Validated Manpower Calculator</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Balancing Metrics Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
            Target Cycle Time
          </span>
          <div className="text-xl font-bold font-mono text-slate-900 mt-0.5">
            {targetCycleTime.toFixed(1)}s
          </div>
          <span className="text-[11px] text-slate-500">Benchmark pacing</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
            Total Work Content
          </span>
          <div className="text-xl font-bold font-mono text-blue-600 mt-0.5">
            {metrics.totalAssignedWorkContent}s
          </div>
          <span className="text-[11px] text-slate-500">5 Task elements</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
            Line Balance Efficiency
          </span>
          <div className="text-xl font-bold font-mono text-emerald-600 mt-0.5">
            {metrics.balanceEfficiency}%
          </div>
          <span className="text-[11px] text-slate-500">Smoothness: {metrics.smoothnessIndex}</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
            Overloaded Stations
          </span>
          <div className={`text-xl font-bold font-mono mt-0.5 ${
            metrics.overloadedCount > 0 ? 'text-rose-600' : 'text-emerald-600'
          }`}>
            {metrics.overloadedCount} Stations
          </div>
          <span className="text-[11px] text-slate-500">
            {metrics.overloadedCount === 0 ? 'All stations within limit' : 'Action required'}
          </span>
        </div>
      </div>

      {/* Alarms if any */}
      {metrics.overloadedCount > 0 && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800 flex items-start gap-2.5">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <strong className="block font-semibold">Overload Constraint Violation Detected:</strong>
            One or more operator stations exceed the target cycle time of {targetCycleTime}s. Reassign task elements to adjacent underloaded stations to restore balance before seeking manpower plan approval.
          </div>
        </div>
      )}

      {/* 5-Station Operator Board Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {positions.map((pos) => {
          const stat = metrics.positionStats.find((s) => s.positionId === pos.id);
          const assignedCount = pos.assignedElementIds.length;
          const isSelected = selectedPositionId === pos.id;
          const assignedTime = stat?.totalAssignedTime || 0;
          const isOver = assignedTime > targetCycleTime;
          const isUnder = assignedTime < targetCycleTime * 0.85;

          return (
            <div
              key={pos.id}
              onClick={() => setSelectedPositionId(pos.id)}
              className={`bg-white border rounded-lg p-4 cursor-pointer transition-all shadow-xs flex flex-col justify-between ${
                isSelected
                  ? 'border-blue-500 ring-2 ring-blue-100'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-xs font-mono text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                    {pos.positionNumber}
                  </span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-medium ${
                    isOver
                      ? 'bg-rose-100 text-rose-700'
                      : isUnder
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {stat?.utilization || 0}%
                  </span>
                </div>

                <h4 className="text-xs font-bold text-slate-800 mb-1 line-clamp-2">
                  {pos.positionName}
                </h4>
                <div className="text-[11px] text-slate-400 mb-3">{pos.workstation}</div>

                {/* Assigned Elements Chips */}
                <div className="space-y-1.5 mb-3">
                  {pos.assignedElementIds.map((elemId) => {
                    const el = elements.find((e) => e.id === elemId);
                    const elTime = elementTimeMap.get(elemId) || 0;
                    return (
                      <div
                        key={elemId}
                        className="p-2 bg-slate-50 border border-slate-100 rounded text-[11px] flex items-center justify-between group"
                      >
                        <div className="truncate pr-1">
                          <span className="font-mono font-bold text-blue-600 block">{el?.elementCode}</span>
                          <span className="text-slate-700 truncate block">{el?.operationName}</span>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="font-mono font-semibold text-slate-900 block">{elTime}s</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setMoveElementId(elemId);
                            }}
                            className="text-[10px] text-blue-600 hover:text-blue-800 underline block"
                          >
                            Move
                          </button>
                        </div>
                      </div>
                    );
                  })}
                  {assignedCount === 0 && (
                    <div className="p-3 border border-dashed border-slate-200 rounded text-center text-[11px] text-slate-400">
                      Empty station
                    </div>
                  )}
                </div>
              </div>

              {/* Station Timing Footprint */}
              <div className="pt-3 border-t border-slate-100">
                <div className="flex justify-between items-baseline text-xs mb-1">
                  <span className="text-slate-500 font-medium">Assigned Time:</span>
                  <span className={`font-mono font-bold ${isOver ? 'text-rose-600' : 'text-slate-900'}`}>
                    {assignedTime.toFixed(1)}s
                  </span>
                </div>
                <div className="flex justify-between items-baseline text-[11px] text-slate-500">
                  <span>Difference:</span>
                  <span className="font-mono font-medium">
                    {stat && stat.timeDifference >= 0 ? `+${stat.timeDifference.toFixed(1)}s remaining` : `${stat?.timeDifference.toFixed(1)}s overload`}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Position Station Card */}
      {selectedPos && selectedPosStats && (
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold font-mono text-slate-900">{selectedPos.positionNumber}</span>
                <span className="text-sm font-semibold text-slate-700">{selectedPos.positionName}</span>
              </div>
              <div className="text-xs text-slate-500 mt-0.5">{selectedPos.workstation}</div>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Workload Utilization</span>
              <span className="text-lg font-bold font-mono text-blue-600">{selectedPosStats.utilization}%</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3 bg-slate-50 rounded border border-slate-100 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Certified Skills</span>
              <ul className="list-disc list-inside text-slate-700 space-y-0.5">
                {selectedPos.requiredSkills.map((sk, i) => (
                  <li key={i}>{sk}</li>
                ))}
              </ul>
            </div>

            <div className="p-3 bg-slate-50 rounded border border-slate-100 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Assigned Fixtures &amp; Tools</span>
              <ul className="list-disc list-inside text-slate-700 space-y-0.5">
                {selectedPos.requiredTools.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            </div>

            <div className="p-3 bg-emerald-50/60 rounded border border-emerald-100 space-y-1">
              <span className="text-[10px] text-emerald-800 uppercase font-bold block">Station Quality Gate</span>
              <div className="text-emerald-900 font-medium flex items-start gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{selectedPos.qualityGate}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Task Reassignment Modal */}
      {moveElementId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <ArrowRightLeft className="w-4 h-4 text-blue-600" />
                <span>Reassign Task Element</span>
              </h3>
              <button
                onClick={() => setMoveElementId(null)}
                className="text-slate-400 hover:text-slate-600 text-lg leading-none"
              >
                &times;
              </button>
            </div>

            <div className="p-3 bg-slate-50 rounded text-xs space-y-1 border border-slate-200">
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Moving Element:</span>
              <div className="font-bold font-mono text-blue-600">
                {elements.find((e) => e.id === moveElementId)?.elementCode}
              </div>
              <div className="text-slate-800 font-medium">
                {elements.find((e) => e.id === moveElementId)?.operationName}
              </div>
              <div className="text-slate-500 font-mono">
                Standard Time: {elementTimeMap.get(moveElementId)}s
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Select Destination Station:
              </label>
              <select
                value={targetPosId}
                onChange={(e) => setTargetPosId(e.target.value)}
                className="w-full text-xs border border-slate-300 rounded p-2 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium text-slate-900"
              >
                {positions.map((p) => {
                  const pStat = metrics.positionStats.find((s) => s.positionId === p.id);
                  return (
                    <option key={p.id} value={p.id}>
                      {p.positionNumber}: {p.positionName} ({pStat?.totalAssignedTime || 0}s current)
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setMoveElementId(null)}
                className="px-3 py-1.5 border border-slate-300 rounded text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteMove}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold shadow-xs"
              >
                Confirm Reassignment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
