/**
 * Core Types for Automotive Work Study & Manpower Planning System (AWSMPS)
 */

export type UserRole = 
  | 'admin'               // System Administrator
  | 'engineer'            // Work Study Engineer / Skilled Manpower
  | 'reviewer'            // Work Study Leader / Reviewer
  | 'approver'            // Production Manager / Approver
  | 'line_leader'         // Production Line Leader
  | 'viewer';             // Management Viewer

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  plantId: string;
}

export type ProductStatus = 'Draft' | 'Active' | 'On Hold' | 'Obsolete';

export interface ProductModel {
  id: string;
  modelNumber: string;       // e.g. WH-ENG-8402
  name: string;              // Engine Main Wiring Harness
  partNumber: string;        // 82111-42K80
  revision: string;          // Rev C.1
  customer: string;          // Global OEM Motors / Platform T
  vehicleModel: string;      // Platform 350-HEV
  harnessType: string;       // Engine Compartment High Voltage & Low Voltage Mix
  housingReferences: string; // 48-Way Sealed ECU, 24-Way Fuse Box, 12x 2-Way Sensor Connectors
  circuitCount: number;      // 74 circuits
  processName: string;       // Sub-Assembly, Connector Insertion & Final Taping
  assemblyLine: string;      // Assembly Line 4 (Alpha)
  productionMethod: string;  // Progressive Conveyor Board with Jig Fixtures
  qualityCheckpoints: string;// Push-Pull-Push Terminal Lock Check, High-Pot Continuity Test, Grommet Seated Visual
  effectiveDate: string;
  status: ProductStatus;
  currentWorkStudyRev: string;
}

export type ProjectStatus = 
  | 'Draft'
  | 'Data Collection'
  | 'Video Analysis'
  | 'Time Study'
  | 'Standard Work Preparation'
  | 'Workload Balancing'
  | 'Manpower Validation'
  | 'Review'
  | 'Approval'
  | 'Training Transfer'
  | 'Production Verification'
  | 'Closed';

export interface WorkStudyProject {
  id: string;                // WSP-2026-001
  productId: string;
  productRevision: string;
  studyPurpose: string;      // New Product Launch & Line Balance Optimization
  customerRequirement: string;
  assignedEngineer: string;
  reviewer: string;
  approver: string;
  startDate: string;
  targetCompletionDate: string;
  productionProcess: string;
  expectedShiftQuantity: number; // 700 units/shift
  plannedLine: string;
  targetCycleTime: number;       // 36.0 seconds
  availableTimePerShift: number; // 25,200 seconds (7 hours net)
  plannedShifts: number;         // 2 shifts/day
  currentManpower: number;       // 6 operators (legacy)
  status: ProjectStatus;
  notes: string;
  updatedAt: string;
}

export interface VideoObservation {
  id: string;
  projectId: string;
  videoUrl: string;
  videoTitle: string;
  workstation: string;
  operatorName: string;
  processStep: string;
  studyDate: string;
  elementId?: string;
  startTime: number;  // in seconds
  endTime: number;    // in seconds
  duration: number;   // endTime - startTime
  cycleNumber: number;
  isAbnormal: boolean;
  abnormalReason?: string;
  notes: string;
}

export type ElementCategory = 'Manual' | 'Machine-controlled' | 'Walking' | 'Handling' | 'Inspection';

export interface TimeObservation {
  observationId: string;
  observationIndex: number; // 1 to 5
  timestampStart: string;
  timestampEnd: string;
  duration: number; // seconds
  isValid: boolean;
  exclusionReason?: string;
  operatorRef: string;
}

export interface TaskElement {
  id: string;                 // ELE-01
  projectId: string;
  elementCode: string;        // e.g. "INS-01"
  operationName: string;      // "Insert terminals into 48-Way ECU housing"
  workDescription: string;    // "Select wire group A, insert terminals 1-12, listen for click, perform push-pull-push check"
  sequenceOrder: number;
  workstation: string;        // "ST-01 Terminal Insertion"
  tools: string;              // "Needle-nose extraction tool, magnifier jig"
  components: string;         // "Housing 90980-12543, Terminal 82998-12440"
  category: ElementCategory;
  safetyConsiderations: string; // "Repetitive strain relief, eye protection"
  qualityChecks: string;        // "Zero cavity error, 100% lock engagement confirmation"
  observations: TimeObservation[];
  performanceRating: number;   // 1.00 default (WestingHouse or rating factor)
  ratingJustification?: string;
  manualDuration?: number;     // manual entry fallback
  assignedOperatorPosition?: string; // OP-01, etc.
}

export type AllowanceMethod = 'fraction_of_standard' | 'percent_of_normal';

export interface AllowanceSettings {
  method: AllowanceMethod;
  personalAllowancePercent: number;  // 5%
  basicFatiguePercent: number;       // 4%
  unavoidableDelayPercent: number;   // 3%
  specialProcessPercent: number;     // 0%
  totalAllowancePercent: number;     // 12%
}

export interface StandardTimeSummary {
  elementId: string;
  validObservationCount: number;
  totalValidObservedTime: number;
  averageObservedTime: number;
  minObservedTime: number;
  maxObservedTime: number;
  medianObservedTime: number;
  stdDevObservedTime: number;
  performanceRating: number;
  normalTime: number;
  allowanceFraction: number;
  standardTime: number; // calculated according to selected method
}

export interface StandardWorkStep {
  id: string;
  stepNumber: number;
  workstation: string;
  operatorPosition: string; // OP-01
  operationName: string;
  detailedInstruction: string;
  keyQualityPoints: string;
  safetyPrecautions: string;
  requiredTools: string;
  standardTime: number;
  cumulativeTime: number;
  photoOrVideoRef?: string;
}

export interface StandardWorkDocument {
  id: string;
  docNumber: string;         // SWI-WH-ENG-8402-001
  productId: string;
  revision: string;
  title: string;
  effectiveDate: string;
  reviewer: string;
  approver: string;
  targetCycleTime: number;
  totalStandardTime: number;
  status: 'Draft' | 'Submitted' | 'Approved' | 'Obsolete';
  steps: StandardWorkStep[];
  changeHistory: string;
}

export interface OperatorPosition {
  id: string;               // pos-1
  positionNumber: string;   // OP-01
  positionName: string;     // Primary Sub-Assembly & Terminal Insertion
  workstation: string;      // WS-01
  targetCycleTime: number;  // 36.0s
  assignedElementIds: string[];
  requiredSkills: string[];
  requiredTools: string[];
  qualityGate: string;
}

export type ValidationStatus = 'passed' | 'warning' | 'not_verified' | 'failed';

export interface FeasibilityCheckItem {
  id: string;
  ruleNumber: number;
  title: string;
  description: string;
  status: ValidationStatus;
  finding: string;
  correctionRequired?: string;
}

export interface ManpowerCalculationResult {
  netAvailableTime: number;     // 25,200s (7 hours * 3600)
  requiredCustomerQuantity: number; // 700 units
  taktTime: number;             // 36.0s
  targetCycleTime: number;      // 36.0s
  totalStandardWorkContent: number; // 180.0s
  theoreticalMinimumOperators: number; // Ceiling(180 / 36) = 5
  proposedAssignedOperators: number;   // 5
  currentLegacyManpower: number;       // 6
  manpowerDelta: number;               // -1 potential reduction if validated
  theoreticalOutput: number;           // 700 units
  lineEfficiencyFactor: number;        // 0.92 (92%)
  adjustedPlanningCapacity: number;    // ~644 units
  reliefOperators: number;             // 1 operator (floating break relief)
  indirectSupportHeadcount: number;    // 1 (material handler/feeder)
  totalShiftStaffing: number;          // 5 direct + 1 relief + 1 indirect = 7
  status: 'Preliminary' | 'Validated' | 'Approved';
  approvalDate?: string;
  approvedBy?: string;
  assumptions: string[];
}

export type SkillLevel = 'Level 1: Trainee' | 'Level 2: Supervised' | 'Level 3: Qualified' | 'Level 4: Trainer/Expert';
export type TrainingStatus = 'Not Started' | 'Training' | 'Under Evaluation' | 'Qualified' | 'Requalification Required';

export interface OperatorSkillRecord {
  id: string;
  operatorId: string;
  operatorName: string;
  assignedLine: string;
  shift: string;
  productModel: string;
  workstation: string;
  skillName: string;
  currentSkillLevel: SkillLevel;
  trainingStatus: TrainingStatus;
  trainingDate: string;
  trainerName: string;
  qualificationDate?: string;
  requalificationDueDate?: string;
  assessmentResult: string;
  evidenceRef: string;
  remarks: string;
}

export interface ProductionVerificationRecord {
  id: string;
  studyProjectId: string;
  productModel: string;
  revision: string;
  productionLine: string;
  shiftDate: string;
  shiftName: string; // Shift 1 (Day) / Shift 2 (Night)
  plannedManpower: number;
  actualManpower: number;
  targetCycleTime: number;
  actualCycleTime: number;
  plannedOutput: number;
  actualOutput: number;
  outputAchievementPercent: number; // (actual / planned) * 100
  cycleTimeGap: number;             // actual - target
  manpowerGap: number;              // actual - planned
  downtimeMinutes: number;
  defectsCount: number;
  reworkCount: number;
  methodDeviationsNoted: string;
  downtimeCauses: string;
  supervisorRemarks: string;
  investigationRequired: boolean;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  module: string;
  recordReference: string;
  details: string;
}
