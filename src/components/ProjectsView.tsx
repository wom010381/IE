import React, { useState } from 'react';
import { WorkStudyProject, ProjectStatus, ProductModel } from '../types';
import {
  FolderKanban,
  CheckCircle,
  Clock,
  ArrowRight,
  RotateCcw,
  User,
  Calendar,
  AlertCircle,
} from 'lucide-react';

interface ProjectsViewProps {
  projects: WorkStudyProject[];
  products: ProductModel[];
  onUpdateProject: (updated: WorkStudyProject) => void;
  onNavigate: (tabId: string) => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  projects,
  products,
  onUpdateProject,
  onNavigate,
}) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects[0]?.id || '');
  const project = projects.find((p) => p.id === selectedProjectId) || projects[0];

  const workflowStages: ProjectStatus[] = [
    'Draft',
    'Data Collection',
    'Video Analysis',
    'Time Study',
    'Standard Work Preparation',
    'Workload Balancing',
    'Manpower Validation',
    'Review',
    'Approval',
    'Training Transfer',
    'Production Verification',
    'Closed',
  ];

  const currentStageIndex = workflowStages.indexOf(project?.status || 'Draft');

  const handleAdvanceStage = () => {
    if (!project) return;
    if (currentStageIndex < workflowStages.length - 1) {
      const nextStatus = workflowStages[currentStageIndex + 1];
      onUpdateProject({
        ...project,
        status: nextStatus,
        updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      });
    }
  };

  const handleReturnStage = () => {
    if (!project) return;
    if (currentStageIndex > 0) {
      const prevStatus = workflowStages[currentStageIndex - 1];
      onUpdateProject({
        ...project,
        status: prevStatus,
        updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      });
    }
  };

  const product = products.find((p) => p.id === project?.productId);

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Work-Study Project Management</h2>
          <p className="text-xs text-slate-500">
            Controlled 12-stage engineering lifecycle from video collection to mass production verification.
          </p>
        </div>
      </div>

      {/* Project Selector Bar */}
      <div className="bg-white border border-slate-200 rounded-lg p-3 flex flex-wrap items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <FolderKanban className="w-5 h-5 text-blue-600" />
          <div>
            <label className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              Selected Study Project
            </label>
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="font-bold text-xs text-slate-900 bg-transparent border-0 focus:outline-none cursor-pointer"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.id} — {p.studyPurpose.substring(0, 48)}...
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReturnStage}
            disabled={currentStageIndex === 0}
            className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 rounded flex items-center gap-1"
            title="Return project to previous stage for correction"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Return Stage</span>
          </button>
          <button
            onClick={handleAdvanceStage}
            disabled={currentStageIndex === workflowStages.length - 1}
            className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-40 rounded flex items-center gap-1 shadow-xs"
          >
            <span>Advance to Next Stage</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 12-Stage Visual Stepper */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs overflow-x-auto">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">
          Traceable Work Study Lifecycle Stages
        </h3>
        <div className="flex items-center gap-1 min-w-[900px]">
          {workflowStages.map((stage, idx) => {
            const isCompleted = idx < currentStageIndex;
            const isCurrent = idx === currentStageIndex;

            return (
              <React.Fragment key={stage}>
                <div className="flex flex-col items-center flex-1 text-center group">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      isCurrent
                        ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                        : isCompleted
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 text-slate-400 border border-slate-200'
                    }`}
                  >
                    {isCompleted ? <CheckCircle className="w-4 h-4" /> : idx + 1}
                  </div>
                  <span
                    className={`text-[10px] mt-2 font-medium leading-tight px-1 ${
                      isCurrent
                        ? 'text-blue-600 font-bold'
                        : isCompleted
                        ? 'text-slate-800'
                        : 'text-slate-400'
                    }`}
                  >
                    {stage}
                  </span>
                </div>
                {idx < workflowStages.length - 1 && (
                  <div
                    className={`h-0.5 flex-1 shrink-0 ${
                      idx < currentStageIndex ? 'bg-emerald-500' : 'bg-slate-200'
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Project Details Sheet */}
      {project && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-5">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-blue-600">{project.id}</span>
                <span className="text-xs text-slate-400">Last updated: {project.updatedAt}</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mt-1">{project.studyPurpose}</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Customer Requirement: {project.customerRequirement}
              </p>
            </div>

            {/* Scope & Planning Targets Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-2">
              <div className="p-3 bg-slate-50 rounded border border-slate-100">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Available Time</span>
                <span className="text-base font-bold font-mono text-slate-900">
                  {project.availableTimePerShift.toLocaleString()}s
                </span>
                <span className="text-[10px] text-slate-500 block">7.0h net work</span>
              </div>

              <div className="p-3 bg-slate-50 rounded border border-slate-100">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Shift Demand</span>
                <span className="text-base font-bold font-mono text-slate-900">
                  {project.expectedShiftQuantity} pcs
                </span>
                <span className="text-[10px] text-slate-500 block">Customer orders</span>
              </div>

              <div className="p-3 bg-slate-50 rounded border border-slate-100">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Target Cycle Time</span>
                <span className="text-base font-bold font-mono text-blue-600">
                  {project.targetCycleTime.toFixed(1)}s
                </span>
                <span className="text-[10px] text-slate-500 block">Line balance target</span>
              </div>

              <div className="p-3 bg-slate-50 rounded border border-slate-100">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Planned Shifts</span>
                <span className="text-base font-bold font-mono text-slate-900">
                  {project.plannedShifts} Shifts
                </span>
                <span className="text-[10px] text-slate-500 block">Day / Night</span>
              </div>
            </div>

            {/* Notes & Progress Summary */}
            <div className="p-3.5 bg-blue-50/50 rounded-md border border-blue-100 text-xs text-slate-700 space-y-1">
              <span className="font-semibold text-blue-900 block">Engineering Status Notes:</span>
              <p className="leading-relaxed">{project.notes}</p>
            </div>

            {/* Quick Action Buttons for This Study */}
            <div className="pt-2 flex flex-wrap gap-2 text-xs">
              <button
                onClick={() => onNavigate('video')}
                className="px-3 py-1.5 border border-slate-300 rounded font-medium hover:bg-slate-50 text-slate-700"
              >
                Go to Video Analysis &rarr;
              </button>
              <button
                onClick={() => onNavigate('timestudy')}
                className="px-3 py-1.5 border border-slate-300 rounded font-medium hover:bg-slate-50 text-slate-700"
              >
                Go to Elemental Time Study &rarr;
              </button>
              <button
                onClick={() => onNavigate('workload')}
                className="px-3 py-1.5 border border-slate-300 rounded font-medium hover:bg-slate-50 text-slate-700"
              >
                Go to Workload Balancing &rarr;
              </button>
              <button
                onClick={() => onNavigate('manpower')}
                className="px-3 py-1.5 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 shadow-xs"
              >
                Go to Manpower Plan &rarr;
              </button>
            </div>
          </div>

          {/* Right Col: Team Stakeholders & Schedule */}
          <div className="space-y-4">
            <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-4 text-xs">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                Assigned Responsibilities
              </h4>

              <div className="space-y-3">
                <div className="flex items-start gap-2.5">
                  <User className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Work Study Engineer</span>
                    <span className="font-semibold text-slate-900">{project.assignedEngineer}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <User className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Industrial Eng Leader (Reviewer)</span>
                    <span className="font-semibold text-slate-900">{project.reviewer}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <User className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Plant Operations Director (Approver)</span>
                    <span className="font-semibold text-slate-900">{project.approver}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-2">
                <div className="flex items-center justify-between text-slate-600">
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <Calendar className="w-3.5 h-3.5" /> Start Date:
                  </span>
                  <span className="font-mono text-slate-900 font-medium">{project.startDate}</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <Calendar className="w-3.5 h-3.5" /> Target SOP Date:
                  </span>
                  <span className="font-mono text-slate-900 font-medium">{project.targetCompletionDate}</span>
                </div>
              </div>
            </div>

            {product && (
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-xs space-y-2">
                <span className="font-bold text-slate-700 block">Associated Product Model:</span>
                <div className="font-mono font-bold text-slate-900">{product.modelNumber} ({product.revision})</div>
                <div className="text-slate-600">{product.name}</div>
                <div className="text-[11px] text-slate-500">{product.circuitCount} Circuits · {product.assemblyLine}</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
