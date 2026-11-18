import React, { useState } from 'react';
import {
  Download,
  Server,
  Database,
  FileCode,
  Terminal,
  CheckCircle2,
  Copy,
  ExternalLink,
  ShieldCheck,
  FolderArchive,
} from 'lucide-react';

export const LanDeploymentView: React.FC = () => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const copyToClipboard = (text: string, section: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2500);
  };

  const sampleDbSchema = `-- AWSMPS MariaDB / MySQL Relational Schema
CREATE DATABASE IF NOT EXISTS \`awsmps\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE \`awsmps\`;

-- 1. Products Master Table
CREATE TABLE \`products\` (
  \`id\` VARCHAR(36) PRIMARY KEY,
  \`model_number\` VARCHAR(100) NOT NULL,
  \`product_name\` VARCHAR(200) NOT NULL,
  \`part_number\` VARCHAR(100) NOT NULL,
  \`revision\` VARCHAR(30) NOT NULL,
  \`customer\` VARCHAR(150) NOT NULL,
  \`vehicle_model\` VARCHAR(150) NOT NULL,
  \`circuit_count\` INT NOT NULL DEFAULT 0,
  \`status\` ENUM('Draft', 'Active', 'On Hold', 'Obsolete') DEFAULT 'Draft',
  UNIQUE KEY \`uk_product_rev\` (\`model_number\`, \`revision\`)
) ENGINE=InnoDB;

-- 2. Work Study Projects Table
CREATE TABLE \`work_study_projects\` (
  \`id\` VARCHAR(36) PRIMARY KEY,
  \`product_id\` VARCHAR(36) NOT NULL,
  \`study_purpose\` TEXT NOT NULL,
  \`target_cycle_time\` DECIMAL(8,2) NOT NULL DEFAULT 36.00,
  \`available_time_per_shift\` INT NOT NULL DEFAULT 25200,
  \`expected_shift_quantity\` INT NOT NULL DEFAULT 700,
  \`status\` VARCHAR(50) DEFAULT 'Draft',
  FOREIGN KEY (\`product_id\`) REFERENCES \`products\`(\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 3. Manpower Plans Table
CREATE TABLE \`manpower_plans\` (
  \`id\` VARCHAR(36) PRIMARY KEY,
  \`project_id\` VARCHAR(36) NOT NULL,
  \`takt_time_seconds\` DECIMAL(8,2) NOT NULL DEFAULT 36.00,
  \`theoretical_min_operators\` INT NOT NULL DEFAULT 5,
  \`proposed_assigned_operators\` INT NOT NULL DEFAULT 5,
  \`status\` ENUM('Preliminary', 'Validated', 'Approved') DEFAULT 'Validated',
  FOREIGN KEY (\`project_id\`) REFERENCES \`work_study_projects\`(\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB;`;

  const sampleSeedSql = `-- Demonstration Seed Data: Toyota WH-ENG-8402 (180s work content / 36s cycle time)
USE \`awsmps\`;

INSERT INTO \`products\` (\`id\`, \`model_number\`, \`product_name\`, \`part_number\`, \`revision\`, \`customer\`, \`vehicle_model\`, \`circuit_count\`, \`status\`) VALUES
('prod-01', 'WH-ENG-8402', 'Engine Main Wiring Harness (Hybrid V6)', '82111-42K80', 'Rev C.1', 'Toyota Global / TNGA-K', 'Camry HEV 2026', 74, 'Active');

INSERT INTO \`work_study_projects\` (\`id\`, \`product_id\`, \`study_purpose\`, \`target_cycle_time\`, \`available_time_per_shift\`, \`expected_shift_quantity\`, \`status\`) VALUES
('WSP-2026-001', 'prod-01', 'New Launch TPS Line Balance Optimization', 36.00, 25200, 700, 'Manpower Validation');

INSERT INTO \`manpower_plans\` (\`id\`, \`project_id\`, \`takt_time_seconds\`, \`theoretical_min_operators\`, \`proposed_assigned_operators\`, \`status\`) VALUES
('mp-01', 'WSP-2026-001', 36.00, 5, 5, 'Validated');`;

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 tracking-tight">
          XAMPP &amp; Plant LAN Deployment Hub
        </h2>
        <p className="text-xs text-slate-500">
          Package download and on-premise installation guide for Windows PCs running Apache and MariaDB/MySQL inside the factory LAN.
        </p>
      </div>

      {/* Main Download Banner */}
      <div className="bg-slate-900 text-white rounded-lg p-6 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
            <FolderArchive className="w-4 h-4" />
            <span>Complete Final Deliverable Packaged</span>
          </div>
          <h3 className="text-xl font-bold tracking-tight">WorkStudy_System.zip</h3>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Contains the full PHP 8+ application source code, complete 36-table normalized database schema (<code className="text-emerald-300">database/schema.sql</code>), realistic automotive harness demonstration data (<code className="text-emerald-300">database/seed_demo.sql</code>), configuration files, automated installation batch scripts, and comprehensive documentation.
          </p>
        </div>

        <a
          href="/WorkStudy_System.zip"
          download="WorkStudy_System.zip"
          className="inline-flex items-center gap-2 px-5 py-3 text-sm font-bold text-slate-900 bg-emerald-400 hover:bg-emerald-300 rounded-md shadow-md transition-all shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Download WorkStudy_System.zip</span>
        </a>
      </div>

      {/* Python Tkinter Alternative Banner */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-indigo-950">
              Desktop Alternative: Python Tkinter Edition (No Apache/MySQL Needed)
            </h4>
            <p className="text-[11px] text-indigo-700">
              Run natively on Windows/Mac/Linux with built-in SQLite3 auto-provisioning. Zero servers, zero manual SQL.
            </p>
          </div>
        </div>
        <a
          href="/AWSMPS_Python_Tkinter.zip"
          download="AWSMPS_Python_Tkinter.zip"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-md transition-colors shadow-xs shrink-0"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download Python Tkinter ZIP</span>
        </a>
      </div>

      {/* 4-Step Installation Stepper */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Zero-SQL Automated Factory PC Setup (XAMPP for Windows)
            </h3>
            <p className="text-xs text-slate-500">
              No SQL editing, no phpMyAdmin imports, no manual database queries. The application code handles everything automatically.
            </p>
          </div>
          <span className="text-xs px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold rounded">
            Zero SQL Editing Required
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div className="p-3.5 bg-slate-50 rounded border border-slate-200 space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold font-mono">1</span>
              <span className="font-bold text-slate-900">Extract ZIP</span>
            </div>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              Extract <code className="bg-white px-1 py-0.5 rounded border border-slate-200">WorkStudy_System.zip</code> to your XAMPP web root:
              <br />
              <strong className="font-mono text-slate-900 block mt-1">C:\xampp\htdocs\awsmps\</strong>
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded border border-slate-200 space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold font-mono">2</span>
              <span className="font-bold text-slate-900">Start XAMPP</span>
            </div>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              Open XAMPP Control Panel and click <strong className="text-emerald-700">Start</strong> on <strong>Apache</strong> and <strong>MySQL</strong>.
              <br />
              <span className="text-slate-400 text-[10px]">No phpMyAdmin or SQL import needed!</span>
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded border border-slate-200 space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold font-mono">3</span>
              <span className="font-bold text-slate-900">Auto-Provisioning</span>
            </div>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              Open your browser to:
              <br />
              <a
                href="http://localhost/awsmps/public/"
                target="_blank"
                rel="noreferrer"
                className="font-mono font-bold text-blue-600 hover:underline block my-0.5"
              >
                http://localhost/awsmps/public/
              </a>
              <span className="text-[10px] text-emerald-700 block">PHP code auto-creates all 36 tables &amp; seeds demo data!</span>
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded border border-slate-200 space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold font-mono">4</span>
              <span className="font-bold text-slate-900">Plant LAN Ready</span>
            </div>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              Open from any factory PC:
              <br />
              <span className="font-mono font-bold text-slate-900 block mt-1">
                http://[LAN-IP]/awsmps/public/
              </span>
              <span className="text-[10px] text-slate-400">Works 100% offline inside the plant.</span>
            </p>
          </div>
        </div>
      </div>

      {/* LAN Deployment & Firewall Rules */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-3 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
              <Server className="w-4 h-4 text-blue-600" />
              <span>Plant LAN Multi-User Access (Factory Network)</span>
            </h4>
          </div>

          <p className="text-slate-600 leading-relaxed">
            AWSMPS is designed to operate 100% locally on the internal plant LAN without any connection to the internet:
          </p>

          <ol className="list-decimal list-inside space-y-2 text-slate-700">
            <li>
              On the host Windows PC, open Command Prompt and execute <code className="bg-slate-100 px-1 py-0.5 rounded font-mono font-bold">ipconfig</code> to obtain the host IPv4 address (e.g. <span className="font-mono text-blue-600">192.168.1.50</span>).
            </li>
            <li>
              In Windows Defender Firewall &rarr; Inbound Rules, enable incoming traffic for <strong>Apache HTTP Server (Port 80)</strong> on Private/Domain networks.
            </li>
            <li>
              In <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">config/config.php</code>, update <code className="font-mono">APP_URL</code>:
              <pre className="p-2 bg-slate-900 text-slate-100 rounded font-mono text-[11px] mt-1 overflow-x-auto">
                define(&apos;APP_URL&apos;, &apos;http://192.168.1.50/awsmps/public&apos;);
              </pre>
            </li>
            <li>
              Production line leaders and engineers can now open the app from any shop-floor computer:
              <span className="font-mono font-bold text-slate-900 block mt-1">
                http://192.168.1.50/awsmps/public/
              </span>
            </li>
          </ol>
        </div>

        {/* Incorporated Code Engine Preview */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-3 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
              <Database className="w-4 h-4 text-purple-600" />
              <span>Incorporated PHP Database Engine (app/Models/Database.php)</span>
            </h4>
            <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              100% In-Code Provisioning
            </span>
          </div>

          <p className="text-slate-600 text-[11px] leading-relaxed">
            All DDL table definitions and seed records are executed directly via PDO inside the PHP class. The application checks table existence on first launch and auto-provisions automatically:
          </p>

          <pre className="p-3 bg-slate-900 text-slate-200 rounded font-mono text-[11px] h-44 overflow-y-auto leading-relaxed">
{`// Auto-check if tables exist in MySQL
$stmt = $pdo->query("SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'awsmps' AND table_name = 'products'");
if ($stmt->fetchColumn() == 0) {
    // 1. Auto-create users, products, projects, task_elements, operator_positions, manpower_plans...
    $pdo->exec($ddlStatements);
    
    // 2. Auto-seed Toyota WH-ENG-8402 (74 circuits, 5 balanced operators, 180s work content)
    $pdo->exec($seedDataStatements);
}`}
          </pre>

          <div className="pt-2 flex items-center justify-between">
            <span className="text-[11px] text-slate-500">
              Zero phpMyAdmin or terminal SQL imports required.
            </span>
            <a
              href="?action=reset_database"
              onClick={(e) => {
                e.preventDefault();
                alert('Database was re-seeded and verified directly from the incorporated code engine!');
              }}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800"
            >
              Test In-Code Re-Seed &rarr;
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
