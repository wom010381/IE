import React, { useState } from 'react';
import { OperatorSkillRecord, SkillLevel, TrainingStatus } from '../types';
import {
  GraduationCap,
  Award,
  CheckCircle2,
  Clock,
  Plus,
  Search,
  Filter,
  FileCheck,
  ShieldCheck,
} from 'lucide-react';

interface SkillMatrixViewProps {
  skills: OperatorSkillRecord[];
  onAddSkill: (record: OperatorSkillRecord) => void;
  onUpdateSkill: (record: OperatorSkillRecord) => void;
}

export const SkillMatrixView: React.FC<SkillMatrixViewProps> = ({
  skills,
  onAddSkill,
  onUpdateSkill,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Record state
  const [newRecord, setNewRecord] = useState<Partial<OperatorSkillRecord>>({
    operatorId: '',
    operatorName: '',
    assignedLine: 'Line 4 (Alpha)',
    shift: 'Shift 1 (Day)',
    productModel: 'WH-ENG-8402',
    workstation: 'ST-01 Terminal Insertion 1',
    skillName: 'Terminal Insertion & Tactile Push-Pull-Push Verification',
    currentSkillLevel: 'Level 3: Qualified',
    trainingStatus: 'Qualified',
    trainingDate: new Date().toISOString().split('T')[0],
    trainerName: 'Marcus Vance, PE',
    qualificationDate: new Date().toISOString().split('T')[0],
    requalificationDueDate: '2027-10-28',
    assessmentResult: '100% correct cavity insertion across 50 verification test pieces',
    evidenceRef: 'TRN-2026-NEW',
    remarks: 'Certified for Line 4 mass production standard work execution',
  });

  const filteredSkills = skills.filter((sk) => {
    const matchesSearch =
      sk.operatorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sk.operatorId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sk.workstation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sk.skillName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || sk.trainingStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSaveSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRecord.operatorId || !newRecord.operatorName) {
      alert('Please fill in Operator ID and Name.');
      return;
    }

    const created: OperatorSkillRecord = {
      id: `sk-${Date.now()}`,
      operatorId: newRecord.operatorId!,
      operatorName: newRecord.operatorName!,
      assignedLine: newRecord.assignedLine || 'Line 4 (Alpha)',
      shift: newRecord.shift || 'Shift 1 (Day)',
      productModel: newRecord.productModel || 'WH-ENG-8402',
      workstation: newRecord.workstation || 'ST-01 Terminal Insertion',
      skillName: newRecord.skillName || 'Terminal Insertion',
      currentSkillLevel: (newRecord.currentSkillLevel as SkillLevel) || 'Level 3: Qualified',
      trainingStatus: (newRecord.trainingStatus as TrainingStatus) || 'Qualified',
      trainingDate: newRecord.trainingDate || new Date().toISOString().split('T')[0],
      trainerName: newRecord.trainerName || 'Marcus Vance, PE',
      qualificationDate: newRecord.qualificationDate,
      requalificationDueDate: newRecord.requalificationDueDate,
      assessmentResult: newRecord.assessmentResult || 'Standard Work competency demonstrated',
      evidenceRef: newRecord.evidenceRef || 'TRN-REF',
      remarks: newRecord.remarks || 'Standard work certified',
    };

    onAddSkill(created);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Operator Skill Matrix &amp; Training Transfer</h2>
          <p className="text-xs text-slate-500">
            Formal transfer of studied standard work instructions from Industrial Engineering to mass production operators.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Record Operator Qualification</span>
        </button>
      </div>

      {/* Formal Training Transfer Certificate Card */}
      <div className="bg-emerald-50/70 border border-emerald-200 rounded-lg p-5 shadow-xs">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-emerald-950">
                Official Work-Study Knowledge Transfer &amp; Handover Certificate
              </h3>
              <p className="text-xs text-emerald-900 leading-relaxed max-w-3xl">
                The skilled manpower industrial engineering team certifies that the standard work instructions, cycle time expectations (36.0s), and quality checkpoints for <strong>WH-ENG-8402 (Rev C.1)</strong> have been transferred and demonstrated to the Line 4 assembly team. All direct and relief operators have satisfied practical competency evaluations.
              </p>
              <div className="flex flex-wrap gap-4 text-xs font-mono text-emerald-800 pt-2">
                <span>Trainer: <strong>Marcus Vance, PE (Lead IE)</strong></span>
                <span>Line Leader: <strong>Carlos Mendez (Line 4)</strong></span>
                <span>Transfer Status: <strong className="text-emerald-700">100% Certified</strong></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white border border-slate-200 rounded-lg p-3 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2 flex-grow max-w-md">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Operator ID (OP-104), Name, Workstation..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-2 text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-500 font-medium">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded px-2 py-1 text-slate-700 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="Qualified">Qualified</option>
            <option value="Training">Training</option>
            <option value="Under Evaluation">Under Evaluation</option>
            <option value="Requalification Required">Requalification Required</option>
          </select>
        </div>
      </div>

      {/* Skill Matrix Table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
        <div className="p-3.5 bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-700 flex justify-between items-center">
          <span>Certified Operator Roster ({filteredSkills.length})</span>
          <span className="text-slate-400 font-mono">Line 4 Alpha Progressive Team</span>
        </div>

        <div className="table-responsive overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/50 border-b border-slate-200 text-slate-600 font-semibold">
              <tr>
                <th className="py-2.5 px-3">Operator ID / Name</th>
                <th className="py-2.5 px-3">Station &amp; Shift</th>
                <th className="py-2.5 px-3">Competency &amp; Skill Description</th>
                <th className="py-2.5 px-3">Level</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Qualification Dates</th>
                <th className="py-2.5 px-3">Assessment Evidence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSkills.map((sk) => {
                return (
                  <tr key={sk.id} className="hover:bg-slate-50">
                    <td className="py-3 px-3">
                      <div className="font-bold font-mono text-slate-900">{sk.operatorId}</div>
                      <div className="font-medium text-slate-800">{sk.operatorName}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-800">{sk.workstation}</div>
                      <div className="text-[11px] text-slate-500">{sk.assignedLine} &bull; {sk.shift}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="text-slate-900 font-medium">{sk.skillName}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{sk.remarks}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded font-medium bg-slate-100 text-slate-800 border border-slate-200">
                        {sk.currentSkillLevel}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded font-medium ${
                        sk.trainingStatus === 'Qualified'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        <CheckCircle2 className="w-3 h-3" />
                        {sk.trainingStatus}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-[11px] font-mono text-slate-600">
                      <div>Certified: <strong>{sk.qualificationDate || '-'}</strong></div>
                      <div>Due: <span>{sk.requalificationDueDate || '-'}</span></div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-mono text-[11px] font-bold text-blue-600">{sk.evidenceRef}</div>
                      <div className="text-[11px] text-slate-600 max-w-xs truncate" title={sk.assessmentResult}>
                        {sk.assessmentResult}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Operator Skill Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h3 className="text-sm font-bold text-slate-900">Record Operator Training Qualification</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg leading-none"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveSkill} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Operator ID *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. OP-150"
                    value={newRecord.operatorId}
                    onChange={(e) => setNewRecord({ ...newRecord, operatorId: e.target.value })}
                    className="w-full border border-slate-300 rounded p-1.5 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Operator Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jordan Smith"
                    value={newRecord.operatorName}
                    onChange={(e) => setNewRecord({ ...newRecord, operatorName: e.target.value })}
                    className="w-full border border-slate-300 rounded p-1.5"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Workstation</label>
                  <input
                    type="text"
                    value={newRecord.workstation}
                    onChange={(e) => setNewRecord({ ...newRecord, workstation: e.target.value })}
                    className="w-full border border-slate-300 rounded p-1.5"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Shift</label>
                  <select
                    value={newRecord.shift}
                    onChange={(e) => setNewRecord({ ...newRecord, shift: e.target.value })}
                    className="w-full border border-slate-300 rounded p-1.5"
                  >
                    <option value="Shift 1 (Day)">Shift 1 (Day)</option>
                    <option value="Shift 2 (Night)">Shift 2 (Night)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Skill &amp; Competency Title</label>
                <input
                  type="text"
                  value={newRecord.skillName}
                  onChange={(e) => setNewRecord({ ...newRecord, skillName: e.target.value })}
                  className="w-full border border-slate-300 rounded p-1.5"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Skill Level</label>
                  <select
                    value={newRecord.currentSkillLevel}
                    onChange={(e) => setNewRecord({ ...newRecord, currentSkillLevel: e.target.value as SkillLevel })}
                    className="w-full border border-slate-300 rounded p-1.5"
                  >
                    <option value="Level 1: Trainee">Level 1: Trainee</option>
                    <option value="Level 2: Supervised">Level 2: Supervised</option>
                    <option value="Level 3: Qualified">Level 3: Qualified</option>
                    <option value="Level 4: Trainer/Expert">Level 4: Trainer/Expert</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Training Status</label>
                  <select
                    value={newRecord.trainingStatus}
                    onChange={(e) => setNewRecord({ ...newRecord, trainingStatus: e.target.value as TrainingStatus })}
                    className="w-full border border-slate-300 rounded p-1.5"
                  >
                    <option value="Qualified">Qualified</option>
                    <option value="Under Evaluation">Under Evaluation</option>
                    <option value="Training">Training</option>
                    <option value="Requalification Required">Requalification Required</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Assessment Result &amp; Audit Evidence</label>
                <input
                  type="text"
                  placeholder="e.g. Zero cavity error; standard time of 35.8s confirmed"
                  value={newRecord.assessmentResult}
                  onChange={(e) => setNewRecord({ ...newRecord, assessmentResult: e.target.value })}
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
                  Save Qualification
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
