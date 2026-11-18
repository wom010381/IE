import React, { useState } from 'react';
import { TaskElement, TimeObservation } from '../types';
import { calculateObservationStats, calculateNormalTime } from '../utils/calculations';
import {
  Timer,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  ChevronRight,
  TrendingDown,
  Layers,
} from 'lucide-react';

interface TimeStudyViewProps {
  elements: TaskElement[];
  onUpdateElement: (updated: TaskElement) => void;
  onNavigate: (tabId: string) => void;
}

export const TimeStudyView: React.FC<TimeStudyViewProps> = ({
  elements,
  onUpdateElement,
  onNavigate,
}) => {
  const [selectedElementId, setSelectedElementId] = useState<string>(elements[0]?.id || '');
  const selectedElement = elements.find((e) => e.id === selectedElementId) || elements[0];

  const [excludeModalObs, setExcludeModalObs] = useState<TimeObservation | null>(null);
  const [exclusionReasonInput, setExclusionReasonInput] = useState('');

  const stats = selectedElement ? calculateObservationStats(selectedElement.observations) : null;
  const normalTime = stats && selectedElement ? calculateNormalTime(stats.average, selectedElement.performanceRating) : 0;

  const handleToggleValid = (obs: TimeObservation) => {
    if (obs.isValid) {
      // Prompt for exclusion reason
      setExcludeModalObs(obs);
      setExclusionReasonInput(obs.exclusionReason || '');
    } else {
      // Re-include
      const updatedObservations = selectedElement.observations.map((o) =>
        o.observationId === obs.observationId ? { ...o, isValid: true, exclusionReason: undefined } : o
      );
      onUpdateElement({ ...selectedElement, observations: updatedObservations });
    }
  };

  const handleConfirmExclusion = () => {
    if (!excludeModalObs || !exclusionReasonInput.trim()) {
      alert('Please state a valid reason for excluding this observation (Rule 4.2).');
      return;
    }

    const updatedObservations = selectedElement.observations.map((o) =>
      o.observationId === excludeModalObs.observationId
        ? { ...o, isValid: false, exclusionReason: exclusionReasonInput }
        : o
    );

    onUpdateElement({ ...selectedElement, observations: updatedObservations });
    setExcludeModalObs(null);
    setExclusionReasonInput('');
  };

  const handlePerformanceRatingChange = (newRating: number) => {
    if (!selectedElement) return;
    onUpdateElement({
      ...selectedElement,
      performanceRating: newRating,
      ratingJustification: newRating === 1.00 ? 'Neutral baseline pace' : selectedElement.ratingJustification || 'Adjusted for operator pace variation',
    });
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Elemental Time Study</h2>
          <p className="text-xs text-slate-500">
            Measured video observations, statistical outlier governance, and normal time calculation.
          </p>
        </div>
        <button
          onClick={() => onNavigate('standardtime')}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-xs transition-colors"
        >
          <span>Calculate Standard Times</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Element Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
        {elements.map((el) => {
          const isSelected = el.id === selectedElement?.id;
          const elStats = calculateObservationStats(el.observations);

          return (
            <button
              key={el.id}
              onClick={() => setSelectedElementId(el.id)}
              className={`px-3.5 py-2 rounded-md text-xs font-medium whitespace-nowrap transition-all border ${
                isSelected
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span className="font-bold font-mono mr-1.5">{el.elementCode}</span>
              <span>{el.operationName.substring(0, 24)}...</span>
              <span className={`ml-2 text-[10px] font-mono px-1 py-0.2 rounded ${
                isSelected ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'
              }`}>
                {elStats.average > 0 ? `${elStats.average}s` : 'Manual'}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Study Details */}
      {selectedElement && stats && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Element Details & Observations Table */}
          <div className="lg:col-span-2 space-y-6">
            {/* Element Metadata Card */}
            <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold font-mono text-slate-900">{selectedElement.elementCode}</span>
                  <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 rounded font-medium">
                    {selectedElement.category}
                  </span>
                  <span className="text-xs text-slate-400">Sequence #{selectedElement.sequenceOrder}</span>
                </div>
                <span className="text-xs font-semibold text-slate-700 font-mono">
                  {selectedElement.workstation}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900">{selectedElement.operationName}</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{selectedElement.workDescription}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2">
                <div className="p-2.5 bg-slate-50 rounded border border-slate-100">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Tooling &amp; Jigs</span>
                  <span className="text-slate-800">{selectedElement.tools}</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded border border-slate-100">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Components / Materials</span>
                  <span className="text-slate-800">{selectedElement.components}</span>
                </div>
                <div className="p-2.5 bg-emerald-50/50 rounded border border-emerald-100">
                  <span className="text-[10px] text-emerald-800 uppercase font-bold block">Quality Checks</span>
                  <span className="text-emerald-900">{selectedElement.qualityChecks}</span>
                </div>
                <div className="p-2.5 bg-amber-50/50 rounded border border-amber-100">
                  <span className="text-[10px] text-amber-800 uppercase font-bold block">Safety Consideration</span>
                  <span className="text-amber-900">{selectedElement.safetyConsiderations}</span>
                </div>
              </div>
            </div>

            {/* Observations List Table */}
            <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Recorded Observation Cycles ({selectedElement.observations.length})
                  </h3>
                  <span className="text-xs text-slate-500">
                    {stats.validCount} valid observations utilized for standard time calculation
                  </span>
                </div>
              </div>

              <div className="table-responsive overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                    <tr>
                      <th className="py-2.5 px-3">Trial #</th>
                      <th className="py-2.5 px-3">Start</th>
                      <th className="py-2.5 px-3">End</th>
                      <th className="py-2.5 px-3">Duration</th>
                      <th className="py-2.5 px-3">Operator</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {selectedElement.observations.map((obs) => (
                      <tr
                        key={obs.observationId}
                        className={`hover:bg-slate-50 ${!obs.isValid ? 'bg-rose-50/30' : ''}`}
                      >
                        <td className="py-2.5 px-3 font-mono font-bold text-slate-900">
                          Trial {obs.observationIndex}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-slate-600">{obs.timestampStart}</td>
                        <td className="py-2.5 px-3 font-mono text-slate-600">{obs.timestampEnd}</td>
                        <td className="py-2.5 px-3 font-mono font-bold text-slate-900">
                          {obs.duration.toFixed(2)}s
                        </td>
                        <td className="py-2.5 px-3 text-slate-700">{obs.operatorRef}</td>
                        <td className="py-2.5 px-3">
                          {obs.isValid ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3" /> Valid
                            </span>
                          ) : (
                            <div>
                              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                                <XCircle className="w-3 h-3" /> Excluded
                              </span>
                              <div className="text-[10px] text-rose-600 mt-0.5 truncate max-w-xs" title={obs.exclusionReason}>
                                {obs.exclusionReason}
                              </div>
                            </div>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <button
                            onClick={() => handleToggleValid(obs)}
                            className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                              obs.isValid
                                ? 'text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200'
                                : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200'
                            }`}
                          >
                            {obs.isValid ? 'Exclude Outlier' : 'Re-include'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Col: Live Statistical Analysis & Normal Time Engine */}
          <div className="space-y-6">
            {/* Statistical Engine Card */}
            <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-4">
              <div className="pb-2 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900">Statistical Analysis Engine</h3>
                <p className="text-xs text-slate-500">Calculated strictly across valid observations.</p>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Valid Observations:</span>
                  <span className="font-mono font-bold text-slate-900">{stats.validCount} of {selectedElement.observations.length}</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Total Valid Observed Time:</span>
                  <span className="font-mono font-bold text-slate-900">{stats.totalTime}s</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Average Observed Time:</span>
                  <span className="font-mono font-bold text-blue-600 text-sm">{stats.average}s</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Minimum Duration:</span>
                  <span className="font-mono text-slate-800">{stats.min}s</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Maximum Duration:</span>
                  <span className="font-mono text-slate-800">{stats.max}s</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Median Duration:</span>
                  <span className="font-mono text-slate-800">{stats.median}s</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Standard Deviation (&sigma;):</span>
                  <span className="font-mono text-slate-800">&plusmn; {stats.stdDev}s</span>
                </div>
              </div>
            </div>

            {/* Performance Rating Card */}
            <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-4">
              <div className="pb-2 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900">Performance Rating Factor</h3>
                <p className="text-xs text-slate-500">
                  Default neutral factor 1.00 (Westinghouse / MTM standard tempo).
                </p>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between font-mono font-bold text-slate-900 mb-1">
                    <span>Rating Factor:</span>
                    <span>{selectedElement.performanceRating.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="0.80"
                    max="1.20"
                    step="0.05"
                    value={selectedElement.performanceRating}
                    onChange={(e) => handlePerformanceRatingChange(parseFloat(e.target.value))}
                    className="w-full accent-blue-600"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-0.5">
                    <span>0.80 (Slow)</span>
                    <span>1.00 (Neutral Standard)</span>
                    <span>1.20 (Fast)</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Formula Trace</span>
                  <div className="font-mono text-slate-800 text-[11px]">
                    Normal Time = Average ({stats.average}s) &times; Rating ({selectedElement.performanceRating.toFixed(2)})
                  </div>
                  <div className="font-mono text-base font-bold text-blue-600 mt-1">
                    Normal Time = {normalTime} seconds
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Outlier Exclusion Modal */}
      {excludeModalObs && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5 text-rose-700">
                <AlertTriangle className="w-4 h-4" />
                <span>Exclude Observation Outlier</span>
              </h3>
              <button
                onClick={() => setExcludeModalObs(null)}
                className="text-slate-400 hover:text-slate-600 text-lg leading-none"
              >
                &times;
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Per <strong>Rule 4.2</strong> of the Work Study Policy, raw observations cannot be deleted or excluded without an auditable engineering reason.
            </p>

            <div className="p-3 bg-slate-50 rounded text-xs space-y-1 border border-slate-200">
              <div>Trial: <strong className="font-mono">#{excludeModalObs.observationIndex}</strong></div>
              <div>Duration: <strong className="font-mono">{excludeModalObs.duration}s</strong></div>
              <div>Operator: <span>{excludeModalObs.operatorRef}</span></div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Reason for Exclusion *
              </label>
              <textarea
                rows={3}
                required
                placeholder="e.g. Dropped terminal on floor; micro-pause due to supervisor query"
                value={exclusionReasonInput}
                onChange={(e) => setExclusionReasonInput(e.target.value)}
                className="w-full text-xs border border-slate-300 rounded p-2 focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setExcludeModalObs(null)}
                className="px-3 py-1.5 border border-slate-300 rounded text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmExclusion}
                className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded text-xs font-semibold"
              >
                Confirm Audited Exclusion
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
