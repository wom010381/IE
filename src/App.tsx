/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  UserRole,
  ProductModel,
  WorkStudyProject,
  TaskElement,
  OperatorPosition,
  AllowanceSettings,
  ManpowerCalculationResult,
  VideoObservation,
  OperatorSkillRecord,
  ProductionVerificationRecord,
  AuditLogEntry,
} from './types';
import {
  INITIAL_PRODUCTS,
  INITIAL_PROJECTS,
  INITIAL_ALLOWANCE_SETTINGS,
  INITIAL_TASK_ELEMENTS,
  INITIAL_OPERATOR_POSITIONS,
  INITIAL_MANPOWER_PLAN,
  INITIAL_VIDEO_OBSERVATIONS,
  INITIAL_SKILL_RECORDS,
  INITIAL_PRODUCTION_VERIFICATIONS,
  INITIAL_AUDIT_LOGS,
} from './data/mockData';

import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { ProductMasterView } from './components/ProductMasterView';
import { ProjectsView } from './components/ProjectsView';
import { VideoAnalysisView } from './components/VideoAnalysisView';
import { TimeStudyView } from './components/TimeStudyView';
import { StandardTimeView } from './components/StandardTimeView';
import { StandardWorkView } from './components/StandardWorkView';
import { WorkloadBalancingView } from './components/WorkloadBalancingView';
import { ManpowerCalculatorView } from './components/ManpowerCalculatorView';
import { FeasibilityCheckView } from './components/FeasibilityCheckView';
import { SkillMatrixView } from './components/SkillMatrixView';
import { ProductionVerificationView } from './components/ProductionVerificationView';
import { ReportsView } from './components/ReportsView';
import { LanDeploymentView } from './components/LanDeploymentView';
import { PythonDesktopView } from './components/PythonDesktopView';

export default function App() {
  const [currentRole, setCurrentRole] = useState<UserRole>('engineer');
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Application State
  const [products, setProducts] = useState<ProductModel[]>(INITIAL_PRODUCTS);
  const [projects, setProjects] = useState<WorkStudyProject[]>(INITIAL_PROJECTS);
  const [allowanceSettings, setAllowanceSettings] = useState<AllowanceSettings>(INITIAL_ALLOWANCE_SETTINGS);
  const [elements, setElements] = useState<TaskElement[]>(INITIAL_TASK_ELEMENTS);
  const [positions, setPositions] = useState<OperatorPosition[]>(INITIAL_OPERATOR_POSITIONS);
  const [manpowerPlan, setManpowerPlan] = useState<ManpowerCalculationResult>(INITIAL_MANPOWER_PLAN);
  const [videoObservations, setVideoObservations] = useState<VideoObservation[]>(INITIAL_VIDEO_OBSERVATIONS);
  const [skillRecords, setSkillRecords] = useState<OperatorSkillRecord[]>(INITIAL_SKILL_RECORDS);
  const [verifications, setVerifications] = useState<ProductionVerificationRecord[]>(INITIAL_PRODUCTION_VERIFICATIONS);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);

  // Helper to append audit logs
  const addAuditEntry = (action: string, module: string, recordRef: string, details: string) => {
    const entry: AuditLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      userId: `usr-${currentRole}`,
      userName: currentRole === 'engineer' ? 'Marcus Vance, PE' : currentRole === 'approver' ? 'David K. Henderson' : 'System User',
      userRole: currentRole,
      action,
      module,
      recordReference: recordRef,
      details,
    };
    setAuditLogs((prev) => [entry, ...prev]);
  };

  // Handlers
  const handleAddProduct = (newProd: ProductModel) => {
    setProducts((prev) => [newProd, ...prev]);
    addAuditEntry('Product Registered', 'Product Master', newProd.modelNumber, `Created new wiring harness model ${newProd.modelNumber} (${newProd.revision}).`);
  };

  const handleUpdateProduct = (updated: ProductModel) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    addAuditEntry('Product Updated', 'Product Master', updated.modelNumber, `Updated configuration for ${updated.modelNumber}.`);
  };

  const handleUpdateProject = (updated: WorkStudyProject) => {
    setProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    addAuditEntry('Project Stage Transitioned', 'Work Study Projects', updated.id, `Status updated to ${updated.status}.`);
  };

  const handleAddVideoObservation = (obs: VideoObservation) => {
    setVideoObservations((prev) => [obs, ...prev]);
    addAuditEntry('Video Observation Logged', 'Video Analysis', obs.processStep, `Recorded ${obs.duration}s cycle observation (${obs.isAbnormal ? 'Abnormal Outlier' : 'Valid'}).`);
  };

  const handleUpdateElement = (updated: TaskElement) => {
    setElements((prev) => prev.map((el) => (el.id === updated.id ? updated : el)));
    addAuditEntry('Time Study Element Updated', 'Elemental Time Study', updated.elementCode, `Updated observations/rating for ${updated.operationName}.`);
  };

  const handleUpdatePositions = (updatedPositions: OperatorPosition[]) => {
    setPositions(updatedPositions);
    addAuditEntry('Workload Rebalanced', 'Workload Balancing', 'Line 4', 'Reassigned task elements across 5 operator stations.');
  };

  const handleUpdatePlan = (updatedPlan: ManpowerCalculationResult) => {
    setManpowerPlan(updatedPlan);
    addAuditEntry('Manpower Plan Updated', 'Manpower Calculator', 'WSP-2026-001', `Recalculated staffing: ${updatedPlan.proposedAssignedOperators} direct operators (Status: ${updatedPlan.status}).`);
  };

  const handleAddSkillRecord = (rec: OperatorSkillRecord) => {
    setSkillRecords((prev) => [rec, ...prev]);
    addAuditEntry('Operator Skill Certified', 'Skill Matrix', rec.operatorId, `Recorded ${rec.currentSkillLevel} competency for ${rec.operatorName}.`);
  };

  const handleAddVerification = (rec: ProductionVerificationRecord) => {
    setVerifications((prev) => [rec, ...prev]);
    addAuditEntry('Production Shift Logged', 'Production Verification', rec.shiftDate, `Logged actual output: ${rec.actualOutput}/${rec.plannedOutput} pcs (${rec.outputAchievementPercent}%).`);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800">
      {/* Top Header */}
      <Header
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        activeTab={activeTab}
        onNavigateToTab={setActiveTab}
      />

      {/* Main Body */}
      <div className="flex flex-1">
        {/* Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          pendingApprovalsCount={manpowerPlan.status !== 'Approved' ? 1 : 0}
        />

        {/* Dynamic Content Viewport */}
        <main className="flex-1 p-6 max-w-7xl overflow-y-auto">
          {activeTab === 'dashboard' && (
            <DashboardView
              products={products}
              projects={projects}
              elements={elements}
              positions={positions}
              manpowerPlan={manpowerPlan}
              allowanceSettings={allowanceSettings}
              verifications={verifications}
              onNavigate={setActiveTab}
            />
          )}

          {activeTab === 'products' && (
            <ProductMasterView
              products={products}
              onAddProduct={handleAddProduct}
              onUpdateProduct={handleUpdateProduct}
            />
          )}

          {activeTab === 'projects' && (
            <ProjectsView
              projects={projects}
              products={products}
              onUpdateProject={handleUpdateProject}
              onNavigate={setActiveTab}
            />
          )}

          {activeTab === 'video' && (
            <VideoAnalysisView
              observations={videoObservations}
              elements={elements}
              onAddObservation={handleAddVideoObservation}
            />
          )}

          {activeTab === 'timestudy' && (
            <TimeStudyView
              elements={elements}
              onUpdateElement={handleUpdateElement}
              onNavigate={setActiveTab}
            />
          )}

          {activeTab === 'standardtime' && (
            <StandardTimeView
              elements={elements}
              allowanceSettings={allowanceSettings}
              onUpdateAllowanceSettings={setAllowanceSettings}
              onNavigate={setActiveTab}
            />
          )}

          {activeTab === 'workload' && (
            <WorkloadBalancingView
              positions={positions}
              elements={elements}
              allowanceSettings={allowanceSettings}
              targetCycleTime={manpowerPlan.targetCycleTime}
              onUpdatePositions={handleUpdatePositions}
              onNavigate={setActiveTab}
            />
          )}

          {activeTab === 'manpower' && (
            <ManpowerCalculatorView
              manpowerPlan={manpowerPlan}
              currentRole={currentRole}
              onUpdatePlan={handleUpdatePlan}
              onNavigate={setActiveTab}
            />
          )}

          {activeTab === 'feasibility' && (
            <FeasibilityCheckView
              elements={elements}
              positions={positions}
              allowanceSettings={allowanceSettings}
              manpowerPlan={manpowerPlan}
              onNavigate={setActiveTab}
            />
          )}

          {activeTab === 'standardwork' && (
            <StandardWorkView
              products={products}
              positions={positions}
              elements={elements}
              allowanceSettings={allowanceSettings}
              targetCycleTime={manpowerPlan.targetCycleTime}
            />
          )}

          {activeTab === 'skills' && (
            <SkillMatrixView
              skills={skillRecords}
              onAddSkill={handleAddSkillRecord}
              onUpdateSkill={() => {}}
            />
          )}

          {activeTab === 'verification' && (
            <ProductionVerificationView
              verifications={verifications}
              projects={projects}
              onAddVerification={handleAddVerification}
              onNavigate={setActiveTab}
            />
          )}

          {activeTab === 'reports' && (
            <ReportsView
              products={products}
              projects={projects}
              elements={elements}
              positions={positions}
              manpowerPlan={manpowerPlan}
              allowanceSettings={allowanceSettings}
              verifications={verifications}
              auditLogs={auditLogs}
            />
          )}

          {activeTab === 'python' && <PythonDesktopView onNavigate={setActiveTab} />}
          {activeTab === 'lan' && <LanDeploymentView />}
        </main>
      </div>
    </div>
  );
}
