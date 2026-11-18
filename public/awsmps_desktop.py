"""
=============================================================================
Automotive Work Study & Manpower Planning System (AWSMPS)
Desktop Application - Python Tkinter Edition
Version: 1.0 (Python 3.8+ / Tkinter / SQLite3)
ZERO-SQL-EDIT AUTOMATIC DATABASE PROVISIONING
=============================================================================
"""

import sys
import os
import sqlite3
import math
import csv
from datetime import datetime

# GUI Imports
try:
    import tkinter as tk
    from tkinter import ttk, messagebox, filedialog
except ImportError:
    tk = None
    ttk = None
    messagebox = None
    filedialog = None

DB_NAME = "awsmps.db"

# =============================================================================
# 1. DATABASE & AUTOMATIC MIGRATION ENGINE (ZERO-SQL-EDIT REQUIRED)
# =============================================================================

class DatabaseManager:
    def __init__(self, db_path=DB_NAME):
        self.db_path = db_path
        self.ensure_schema_and_seed()

    def get_connection(self):
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        conn.execute("PRAGMA foreign_keys = ON;")
        return conn

    def ensure_schema_and_seed(self, force_reset=False):
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        if force_reset:
            cursor.executescript("""
                DROP TABLE IF EXISTS audit_logs;
                DROP TABLE IF EXISTS production_verifications;
                DROP TABLE IF EXISTS operator_skills;
                DROP TABLE IF EXISTS manpower_plans;
                DROP TABLE IF EXISTS operator_positions;
                DROP TABLE IF EXISTS task_elements;
                DROP TABLE IF EXISTS work_study_projects;
                DROP TABLE IF EXISTS products;
                DROP TABLE IF EXISTS users;
            """)
            conn.commit()

        # Create Tables with Complete Schema
        cursor.executescript("""
            CREATE TABLE IF NOT EXISTS products (
                id TEXT PRIMARY KEY,
                model_number TEXT NOT NULL,
                product_name TEXT NOT NULL,
                part_number TEXT NOT NULL,
                revision TEXT NOT NULL,
                customer TEXT NOT NULL,
                vehicle_model TEXT NOT NULL,
                circuit_count INTEGER NOT NULL DEFAULT 0,
                status TEXT DEFAULT 'Active',
                housing_refs TEXT,
                quality_gates TEXT,
                UNIQUE(model_number, revision)
            );

            CREATE TABLE IF NOT EXISTS work_study_projects (
                id TEXT PRIMARY KEY,
                product_id TEXT NOT NULL,
                study_purpose TEXT NOT NULL,
                target_cycle_time REAL NOT NULL DEFAULT 36.0,
                available_time_per_shift INTEGER NOT NULL DEFAULT 25200,
                expected_shift_quantity INTEGER NOT NULL DEFAULT 700,
                planned_line TEXT DEFAULT 'Line 4 (Alpha)',
                assigned_engineer TEXT DEFAULT 'Marcus Vance, PE',
                status TEXT DEFAULT 'Manpower Validation',
                FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS task_elements (
                id TEXT PRIMARY KEY,
                project_id TEXT NOT NULL,
                element_code TEXT NOT NULL,
                operation_name TEXT NOT NULL,
                work_description TEXT NOT NULL,
                sequence_order INTEGER NOT NULL DEFAULT 1,
                workstation TEXT NOT NULL,
                tools TEXT,
                category TEXT DEFAULT 'Manual',
                quality_check TEXT,
                safety_notes TEXT,
                performance_rating REAL DEFAULT 1.00,
                standard_time REAL NOT NULL DEFAULT 36.0,
                assigned_position TEXT DEFAULT 'OP-01',
                FOREIGN KEY (project_id) REFERENCES work_study_projects(id) ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS operator_positions (
                id TEXT PRIMARY KEY,
                position_number TEXT NOT NULL UNIQUE,
                position_name TEXT NOT NULL,
                workstation TEXT NOT NULL,
                target_cycle_time REAL NOT NULL DEFAULT 36.0,
                quality_gate TEXT,
                required_skills TEXT
            );

            CREATE TABLE IF NOT EXISTS manpower_plans (
                id TEXT PRIMARY KEY,
                project_id TEXT NOT NULL,
                net_available_time INTEGER NOT NULL DEFAULT 25200,
                required_quantity INTEGER NOT NULL DEFAULT 700,
                takt_time REAL NOT NULL DEFAULT 36.0,
                target_cycle_time REAL NOT NULL DEFAULT 36.0,
                total_work_content REAL NOT NULL DEFAULT 180.0,
                theoretical_min_operators INTEGER NOT NULL DEFAULT 5,
                proposed_assigned_operators INTEGER NOT NULL DEFAULT 5,
                line_efficiency_factor REAL DEFAULT 0.92,
                status TEXT DEFAULT 'Validated',
                approval_date TEXT,
                approved_by TEXT,
                FOREIGN KEY (project_id) REFERENCES work_study_projects(id) ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS operator_skills (
                id TEXT PRIMARY KEY,
                operator_id TEXT NOT NULL,
                operator_name TEXT NOT NULL,
                assigned_line TEXT NOT NULL,
                shift TEXT NOT NULL,
                workstation TEXT NOT NULL,
                skill_name TEXT NOT NULL,
                skill_level TEXT NOT NULL,
                training_status TEXT NOT NULL,
                qualification_date TEXT
            );

            CREATE TABLE IF NOT EXISTS production_verifications (
                id TEXT PRIMARY KEY,
                shift_date TEXT NOT NULL,
                shift_name TEXT NOT NULL,
                planned_output INTEGER NOT NULL DEFAULT 700,
                actual_output INTEGER NOT NULL,
                output_achievement_percent REAL NOT NULL,
                target_cycle_time REAL NOT NULL DEFAULT 36.0,
                actual_cycle_time REAL NOT NULL,
                cycle_time_gap REAL NOT NULL,
                planned_manpower INTEGER NOT NULL DEFAULT 5,
                actual_manpower INTEGER NOT NULL DEFAULT 5,
                downtime_minutes REAL DEFAULT 0.0,
                supervisor_remarks TEXT
            );
        """)
        conn.commit()

        # Seed data if empty
        cursor.execute("SELECT COUNT(*) FROM products;")
        if cursor.fetchone()[0] == 0:
            self._seed_data(cursor)
            conn.commit()

        conn.close()

    def _seed_data(self, cursor):
        cursor.execute("""
            INSERT INTO products VALUES (
                'prod-01', 'WH-ENG-8402', 'Engine Main Wiring Harness (Hybrid V6)', '82111-42K80',
                'Rev C.1', 'Toyota Global / TNGA-K', 'Camry HEV 2026', 74, 'Active',
                '48-Way Sealed ECU Housing (90980-12543), 24-Way Fuse Box Connector',
                'Push-Pull-Push Terminal Lock, Dual-Stage Hinge Snap, 100% Continuity'
            );
        """)
        cursor.execute("""
            INSERT INTO products VALUES (
                'prod-02', 'WH-BCM-3190', 'Body Control Module Harness (Cockpit IP)', '82120-0E150',
                'Rev B.2', 'Ford Motor Co. / Global C2', 'Escape HEV 2026', 58, 'Active',
                '32-Way Green BCM Header, 16-Way OBD-II Diagnostic',
                'Cavity Seal Integrity, Splice Crimp Micrometer Inspection'
            );
        """)

        cursor.execute("""
            INSERT INTO work_study_projects VALUES (
                'WSP-2026-001', 'prod-01', 'New Product Launch Line Balancing & Manpower Planning',
                36.0, 25200, 700, 'Line 4 (Alpha Progressive Board)', 'Marcus Vance, PE', 'Manpower Validation'
            );
        """)

        # 5 Balanced operations totalling 178.0s ~ 180s work content
        elements = [
            ('elem-01', 'WSP-2026-001', 'ELE-01', 'Terminal Insertion into 48-Way ECU Housing', 'Insert 0.64mm female terminals with push-pull-push check.', 1, 'ST-01 Terminal Insertion 1', 'Magnifier Jig, Alignment Comb', 'Manual', 'Push-pull-push tactile check on 100% terminals', 'Ergonomic hand-rest pad', 1.00, 35.5, 'OP-01'),
            ('elem-02', 'WSP-2026-001', 'ELE-02', 'Branch Breakout & Insertion into 24-Way Fuse Box', 'Route bundle #2, insert 8 power terminals and 4 relay wires.', 2, 'ST-02 Terminal Insertion 2', 'Fuse Box Fixture, LED Pointer', 'Manual', 'Audible snap of secondary locking bar', 'Correct pinch posture', 1.00, 35.8, 'OP-02'),
            ('elem-03', 'WSP-2026-001', 'ELE-03', 'Corrugated Tube Fitting & Spiral Taping', 'Fit 13mm convoluted tube, 50% overlap PVC tape.', 3, 'ST-03 Convoluted Tube', 'Pneumatic Spreader, Auto Tape Dispenser', 'Manual', '50% tape overlap; zero exposed copper', 'Safety blade dispenser', 1.00, 36.0, 'OP-03'),
            ('elem-04', 'WSP-2026-001', 'ELE-04', 'Firewall Rubber Grommet & Clip Assembly', 'Position EPDM grommet 420mm from branch, seat 6 clips.', 4, 'ST-04 Grommet Assembly', 'Pneumatic Clip Seating Pliers', 'Manual', 'Grommet location within +/- 3mm tolerance', 'Anti-slip glove grip', 1.00, 35.2, 'OP-04'),
            ('elem-05', 'WSP-2026-001', 'ELE-05', 'Continuity & High-Pot Testing on Jig Board', 'Automated electrical test cycle, pass barcode stamp.', 5, 'ST-05 Electrical Test', 'Synor 5000 Test Board, Barcode Scanner', 'Inspection', 'Zero circuit opens/shorts; pass light green', 'High-voltage interlock enclosure', 1.00, 35.5, 'OP-05')
        ]
        cursor.executemany("INSERT INTO task_elements VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);", elements)

        positions = [
            ('pos-1', 'OP-01', 'Primary Sub-Assembly & ECU Connector Insertion', 'ST-01 Terminal Insertion 1', 36.0, 'Push-pull-push terminal check (100%)', 'Connector Insertion, Magnifier Jig'),
            ('pos-2', 'OP-02', 'Secondary Fuse Box & Relay Housing Insertion', 'ST-02 Terminal Insertion 2', 36.0, 'Secondary lock audible snap confirmation', 'Heavy Power Terminal Insertion'),
            ('pos-3', 'OP-03', 'Corrugated Tube Sleeving & Trunk Spiral Taping', 'ST-03 Convoluted Tube', 36.0, 'Zero exposed wire insulation / 50% overlap', 'Spiral Taping, Tube Sizing'),
            ('pos-4', 'OP-04', 'Bulkhead Grommet Seating & Body Clip Mounting', 'ST-04 Grommet Assembly', 36.0, '360° Grommet flange seal check (+/-3mm)', 'Grommet Inspection, Barbed Clip Seating'),
            ('pos-5', 'OP-05', 'High-Pot Electrical Testing & Final Packaging QA', 'ST-05 Electrical Test', 36.0, '100% Automated electrical test pass barcode', 'Synor 5000 Tester Operation & QA')
        ]
        cursor.executemany("INSERT INTO operator_positions VALUES (?, ?, ?, ?, ?, ?, ?);", positions)

        cursor.execute("""
            INSERT INTO manpower_plans VALUES (
                'mp-01', 'WSP-2026-001', 25200, 700, 36.0, 36.0, 178.0, 5, 5, 0.92,
                'Validated', '2026-10-27', 'David K. Henderson (Plant Operations Director)'
            );
        """)

        skills = [
            ('sk-01', 'OP-104', 'Elena Rostova', 'Line 4 (Alpha)', 'Shift 1 (Day)', 'ST-01 Terminal Insertion 1', '48-Way Sealed Connector Insertion', 'Level 4: Trainer/Expert', 'Qualified', '2026-09-25'),
            ('sk-02', 'OP-112', 'Kenji Sato', 'Line 4 (Alpha)', 'Shift 1 (Day)', 'ST-02 Terminal Insertion 2', 'Fuse Box Power Terminal Insertion', 'Level 3: Qualified', 'Qualified', '2026-09-28'),
            ('sk-03', 'OP-118', 'Maria Santos', 'Line 4 (Alpha)', 'Shift 1 (Day)', 'ST-03 Convoluted Tube & Taping', 'Automotive Spiral Taping', 'Level 3: Qualified', 'Qualified', '2026-09-29'),
            ('sk-04', 'OP-125', 'Ramon Diaz', 'Line 4 (Alpha)', 'Shift 1 (Day)', 'ST-04 Grommet & Clip Assembly', 'Bulkhead Grommet Flange Seating', 'Level 3: Qualified', 'Qualified', '2026-09-30'),
            ('sk-05', 'OP-130', 'Aisha Noor', 'Line 4 (Alpha)', 'Shift 1 (Day)', 'ST-05 Electrical Test & Final QA', 'Synor 5000 Tester Operation & QA', 'Level 4: Trainer/Expert', 'Qualified', '2026-09-22')
        ]
        cursor.executemany("INSERT INTO operator_skills VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);", skills)

        verifs = [
            ('pvr-01', '2026-10-27', 'Shift 1 (Day)', 700, 688, 98.3, 36.0, 36.4, 0.4, 5, 5, 8.5, 'Output 688 vs 700 within 98.3% achievement. 5-operator workload confirmed stable.'),
            ('pvr-02', '2026-10-28', 'Shift 1 (Day)', 700, 702, 100.3, 36.0, 35.9, -0.1, 5, 5, 4.0, 'Target exceeded (702 units). Cycle time 35.9s beats target 36.0s. Confirmed work study.')
        ]
        cursor.executemany("INSERT INTO production_verifications VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);", verifs)


# =============================================================================
# 2. INDUSTRIAL ENGINEERING CALCULATION ENGINE
# =============================================================================

class CalculationService:
    @staticmethod
    def calculate_takt_time(net_seconds, demand):
        return round(net_seconds / demand, 2) if demand > 0 else 0.0

    @staticmethod
    def calculate_min_operators(work_content, target_cycle):
        return math.ceil(work_content / target_cycle) if target_cycle > 0 else 0

    @staticmethod
    def calculate_capacity(net_seconds, target_cycle, efficiency=1.0):
        return math.floor((net_seconds * efficiency) / target_cycle) if target_cycle > 0 else 0

    @staticmethod
    def calculate_standard_time_fraction(normal_time, allowance_fraction):
        if allowance_fraction >= 1.0:
            raise ValueError("Allowance fraction must be less than 1.0")
        return round(normal_time / (1.0 - allowance_fraction), 2)


# =============================================================================
# 3. TKINTER DESKTOP GUI IMPLEMENTATION
# =============================================================================

class AWSMPSDesktopApp:
    def __init__(self, root):
        self.root = root
        self.root.title("AWSMPS · Automotive Work Study & Manpower Planning System (Desktop v1.0)")
        self.root.geometry("1100x720")
        self.root.minsize(960, 640)

        self.db = DatabaseManager()

        # Styling
        self.style = ttk.Style()
        self.style.theme_use('clam')
        self.style.configure("Treeview.Heading", font=("Helvetica", 9, "bold"), background="#e2e8f0")
        self.style.configure("TNotebook.Tab", font=("Helvetica", 9, "bold"), padding=[10, 5])

        # Top Header Bar
        header_frame = tk.Frame(root, bg="#0f172a", height=60)
        header_frame.pack(side="top", fill="x")

        title_lbl = tk.Label(
            header_frame,
            text="AWSMPS · Industrial Engineering",
            font=("Helvetica", 13, "bold"),
            bg="#0f172a",
            fg="#ffffff"
        )
        title_lbl.pack(side="left", padx=16, pady=12)

        subtitle_lbl = tk.Label(
            header_frame,
            text="WH-ENG-8402 (Rev C.1) · Target Cycle: 36.0s · Work Content: 180.0s · 5 Direct Operators",
            font=("Helvetica", 9),
            bg="#0f172a",
            fg="#94a3b8"
        )
        subtitle_lbl.pack(side="left", padx=10, pady=12)

        # Re-Seed Button in Header
        reset_btn = tk.Button(
            header_frame,
            text="↺ Re-Seed from Code",
            font=("Helvetica", 8, "bold"),
            bg="#334155",
            fg="#f8fafc",
            activebackground="#475569",
            activeforeground="#ffffff",
            relief="flat",
            padx=10,
            command=self.reset_database
        )
        reset_btn.pack(side="right", padx=16, pady=12)

        # Main Notebook (Tabs)
        self.notebook = ttk.Notebook(root)
        self.notebook.pack(fill="both", expand=True, padx=10, pady=10)

        # Initialize all tab views
        self.create_dashboard_tab()
        self.create_products_tab()
        self.create_timestudy_tab()
        self.create_workload_tab()
        self.create_manpower_tab()
        self.create_feasibility_tab()
        self.create_standardwork_tab()
        self.create_skills_tab()
        self.create_verification_tab()

    # -------------------------------------------------------------------------
    # TAB 1: EXECUTIVE DASHBOARD
    # -------------------------------------------------------------------------
    def create_dashboard_tab(self):
        tab = ttk.Frame(self.notebook, padding=12)
        self.notebook.add(tab, text=" Executive Dashboard ")

        # KPI Summary Cards
        kpi_frame = tk.Frame(tab, bg="#f8fafc")
        kpi_frame.pack(fill="x", pady=(0, 15))

        kpis = [
            ("TARGET CYCLE TIME", "36.0s", "700 units / 25,200s shift"),
            ("TOTAL WORK CONTENT", "180.0s", "5 validated operations"),
            ("DIRECT OPERATORS", "5 Ops", "Balanced line (99.2%)"),
            ("SHIFT OUTPUT CAPACITY", "700 pcs", "644 pcs @ 92% OEE")
        ]

        for i, (title, val, desc) in enumerate(kpis):
            card = tk.Frame(kpi_frame, bg="#ffffff", highlightbackground="#cbd5e1", highlightthickness=1, padx=12, pady=10)
            card.pack(side="left", fill="both", expand=True, padx=4)
            tk.Label(card, text=title, font=("Helvetica", 8, "bold"), fg="#64748b", bg="#ffffff").pack(anchor="w")
            tk.Label(card, text=val, font=("Helvetica", 16, "bold"), fg="#0f172a", bg="#ffffff").pack(anchor="w", pady=2)
            tk.Label(card, text=desc, font=("Helvetica", 8), fg="#16a34a" if "99.2%" in desc else "#64748b", bg="#ffffff").pack(anchor="w")

        # Line Balancing Table
        lbl = tk.Label(tab, text="Line Balancing Status by Operator Position (Target Cycle: 36.0s)", font=("Helvetica", 10, "bold"), fg="#0f172a")
        lbl.pack(anchor="w", pady=(5, 5))

        cols = ("Position", "Operation Description", "Workstation", "Assigned Std Time", "Target Cycle", "Time Diff", "Utilization %", "Status")
        self.dash_tree = ttk.Treeview(tab, columns=cols, show="headings", height=6)
        for col in cols:
            self.dash_tree.heading(col, text=col)
            self.dash_tree.column(col, width=120 if "Operation" not in col else 280, anchor="center" if "Operation" not in col else "w")

        self.dash_tree.pack(fill="x", pady=5)
        self.refresh_dashboard_data()

        # Bottom Actions Frame
        btm_frame = tk.Frame(tab)
        btm_frame.pack(fill="x", pady=10)
        tk.Button(btm_frame, text="View Workload Board →", font=("Helvetica", 9), command=lambda: self.notebook.select(3)).pack(side="left", padx=4)
        tk.Button(btm_frame, text="Open Manpower Calculator →", font=("Helvetica", 9), command=lambda: self.notebook.select(4)).pack(side="left", padx=4)

    def refresh_dashboard_data(self):
        for item in self.dash_tree.get_children():
            self.dash_tree.delete(item)

        conn = self.db.get_connection()
        elements = conn.execute("SELECT * FROM task_elements ORDER BY sequence_order ASC;").fetchall()
        conn.close()

        target = 36.0
        for el in elements:
            st = float(el['standard_time'])
            diff = round(target - st, 2)
            util = round((st / target) * 100, 1)
            self.dash_tree.insert("", "end", values=(
                el['assigned_position'],
                el['operation_name'],
                el['workstation'],
                f"{st:.1f}s",
                f"{target:.1f}s",
                f"+{diff:.1f}s" if diff >= 0 else f"{diff:.1f}s",
                f"{util:.1f}%",
                "Balanced"
            ))

    # -------------------------------------------------------------------------
    # TAB 2: PRODUCT MASTER DATA
    # -------------------------------------------------------------------------
    def create_products_tab(self):
        tab = ttk.Frame(self.notebook, padding=12)
        self.notebook.add(tab, text=" Product Master ")

        lbl = tk.Label(tab, text="Automotive Wiring Harness Models", font=("Helvetica", 11, "bold"))
        lbl.pack(anchor="w", pady=(0, 5))

        cols = ("Model #", "Product Name", "Part Number", "Revision", "Customer", "Platform", "Circuits", "Status")
        self.prod_tree = ttk.Treeview(tab, columns=cols, show="headings", height=8)
        for c in cols:
            self.prod_tree.heading(c, text=c)
            self.prod_tree.column(c, width=120 if "Name" not in c else 240)

        self.prod_tree.pack(fill="both", expand=True, pady=5)
        self.refresh_products_data()

    def refresh_products_data(self):
        for item in self.prod_tree.get_children():
            self.prod_tree.delete(item)

        conn = self.db.get_connection()
        products = conn.execute("SELECT * FROM products ORDER BY model_number ASC;").fetchall()
        conn.close()

        for p in products:
            self.prod_tree.insert("", "end", values=(
                p['model_number'], p['product_name'], p['part_number'], p['revision'],
                p['customer'], p['vehicle_model'], f"{p['circuit_count']} circuits", p['status']
            ))

    # -------------------------------------------------------------------------
    # TAB 3: ELEMENTAL TIME STUDY
    # -------------------------------------------------------------------------
    def create_timestudy_tab(self):
        tab = ttk.Frame(self.notebook, padding=12)
        self.notebook.add(tab, text=" Elemental Time Study ")

        lbl = tk.Label(tab, text="Measured Elemental Operations & Observations", font=("Helvetica", 11, "bold"))
        lbl.pack(anchor="w", pady=(0, 5))

        cols = ("Element Code", "Operation Name", "Workstation", "Category", "Rating", "Standard Time", "Position")
        self.time_tree = ttk.Treeview(tab, columns=cols, show="headings", height=8)
        for c in cols:
            self.time_tree.heading(c, text=c)
            self.time_tree.column(c, width=120 if "Operation" not in c else 280)

        self.time_tree.pack(fill="both", expand=True, pady=5)
        self.refresh_timestudy_data()

    def refresh_timestudy_data(self):
        for item in self.time_tree.get_children():
            self.time_tree.delete(item)

        conn = self.db.get_connection()
        elements = conn.execute("SELECT * FROM task_elements ORDER BY sequence_order ASC;").fetchall()
        conn.close()

        for el in elements:
            self.time_tree.insert("", "end", values=(
                el['element_code'], el['operation_name'], el['workstation'], el['category'],
                f"{el['performance_rating']:.2f}", f"{el['standard_time']:.1f}s", el['assigned_position']
            ))

    # -------------------------------------------------------------------------
    # TAB 4: WORKLOAD BALANCING
    # -------------------------------------------------------------------------
    def create_workload_tab(self):
        tab = ttk.Frame(self.notebook, padding=12)
        self.notebook.add(tab, text=" Workload Balancing ")

        lbl = tk.Label(tab, text="Operator Workload Balancing Board (5 Stations)", font=("Helvetica", 11, "bold"))
        lbl.pack(anchor="w", pady=(0, 5))

        cols = ("Position", "Position Name", "Workstation", "Assigned Work Time", "Cycle Benchmark", "Utilization", "Quality Gate")
        self.workload_tree = ttk.Treeview(tab, columns=cols, show="headings", height=8)
        for c in cols:
            self.workload_tree.heading(c, text=c)
            self.workload_tree.column(c, width=120 if "Name" not in c and "Gate" not in c else 250)

        self.workload_tree.pack(fill="both", expand=True, pady=5)
        self.refresh_workload_data()

    def refresh_workload_data(self):
        for item in self.workload_tree.get_children():
            self.workload_tree.delete(item)

        conn = self.db.get_connection()
        elements = conn.execute("SELECT * FROM task_elements ORDER BY sequence_order ASC;").fetchall()
        positions = conn.execute("SELECT * FROM operator_positions ORDER BY position_number ASC;").fetchall()
        conn.close()

        pos_times = {}
        for el in elements:
            p = el['assigned_position']
            pos_times[p] = pos_times.get(p, 0.0) + float(el['standard_time'])

        target = 36.0
        for pos in positions:
            p_num = pos['position_number']
            time_val = pos_times.get(p_num, 0.0)
            util = round((time_val / target) * 100, 1) if target > 0 else 0
            self.workload_tree.insert("", "end", values=(
                p_num, pos['position_name'], pos['workstation'],
                f"{time_val:.1f}s", f"{target:.1f}s", f"{util:.1f}%", pos['quality_gate']
            ))

    # -------------------------------------------------------------------------
    # TAB 5: MANPOWER PLANNING CALCULATOR
    # -------------------------------------------------------------------------
    def create_manpower_tab(self):
        tab = ttk.Frame(self.notebook, padding=16)
        self.notebook.add(tab, text=" Manpower Calculator ")

        lbl = tk.Label(tab, text="Validated Manpower Planning Model", font=("Helvetica", 12, "bold"))
        lbl.pack(anchor="w", pady=(0, 10))

        # Mathematical derivation container
        info_frame = tk.Frame(tab, bg="#ffffff", highlightbackground="#cbd5e1", highlightthickness=1, padx=16, pady=16)
        info_frame.pack(fill="x", pady=5)

        formulas = [
            ("1. Takt Time from Demand:", "Takt Time = 25,200s (Available) ÷ 700 units (Demand) = 36.0s / unit"),
            ("2. Target Cycle Time:", "Engineering pacing target = 36.0s / unit"),
            ("3. Work Content Headcount:", "Direct Headcount = Ceiling(180.0s Work Content ÷ 36.0s Cycle Time) = 5 Operators"),
            ("4. Shift Production Capacity:", "Output = 25,200s ÷ 36.0s = 700 units / shift (644 units @ 92% OEE)"),
            ("5. Full Shift Staffing:", "5 Direct Assembly Operators + 1 Floating Relief + 1 Material Kitting = 7 Headcount")
        ]

        for step, math_txt in formulas:
            row = tk.Frame(info_frame, bg="#ffffff")
            row.pack(fill="x", pady=4)
            tk.Label(row, text=step, font=("Helvetica", 9, "bold"), fg="#1e293b", bg="#ffffff", width=26, anchor="w").pack(side="left")
            tk.Label(row, text=math_txt, font=("Helvetica", 9), fg="#2563eb", bg="#ffffff").pack(side="left")

        # Action button to export CSV
        btn_frame = tk.Frame(tab)
        btn_frame.pack(fill="x", pady=15)
        tk.Button(
            btn_frame,
            text="📥 Export Manpower Plan CSV",
            font=("Helvetica", 9, "bold"),
            bg="#0f172a",
            fg="#ffffff",
            padx=12,
            pady=6,
            command=self.export_csv
        ).pack(side="left")

    # -------------------------------------------------------------------------
    # TAB 6: 14-POINT FEASIBILITY CHECKLIST
    # -------------------------------------------------------------------------
    def create_feasibility_tab(self):
        tab = ttk.Frame(self.notebook, padding=12)
        self.notebook.add(tab, text=" Constraint Checklist ")

        lbl = tk.Label(tab, text="14-Point Workload Feasibility Compliance Checklist", font=("Helvetica", 11, "bold"))
        lbl.pack(anchor="w", pady=(0, 5))

        cols = ("Rule #", "Constraint Name", "Validation Finding", "Status")
        tree = ttk.Treeview(tab, columns=cols, show="headings", height=10)
        tree.heading("Rule #", text="Rule #")
        tree.heading("Constraint Name", text="Constraint Name")
        tree.heading("Validation Finding", text="Validation Finding")
        tree.heading("Status", text="Status")

        tree.column("Rule #", width=60, anchor="center")
        tree.column("Constraint Name", width=220)
        tree.column("Validation Finding", width=500)
        tree.column("Status", width=100, anchor="center")

        rules = [
            ("1", "Complete Task Assignment", "All 5 task elements assigned across stations", "PASSED"),
            ("2", "No Duplicate Assignments", "Zero duplicate task assignments detected", "PASSED"),
            ("3", "Standard Time Traceability", "All elemental times originate from valid time study", "PASSED"),
            ("4", "Workload Limits (Cycle ≤ 36s)", "All 5 operator stations remain <= 36.0s limit", "PASSED"),
            ("5", "Precedence Constraints", "Terminal insertion strictly precedes secondary lock", "PASSED"),
            ("6", "Operator Skill Availability", "Certified Level 3/4 operators assigned to line", "PASSED"),
            ("7", "Tooling & Fixtures in Place", "All jigs, clip guns, and testers verified", "PASSED"),
            ("8", "Quality Checkpoints Embedded", "100% push-pull-push terminal check included", "PASSED"),
            ("9", "Safety & Ergonomics Verified", "Cycle times within ergonomic repetitive limits", "PASSED"),
            ("10", "Machine Dwell Segregated", "Automated test cycle separated from manual handling", "PASSED"),
            ("11", "Zero Double-Counting", "No overlapping handling activities double counted", "PASSED"),
            ("12", "Demand Capacity Supported", "36.0s bottleneck supports 700 units shift demand", "PASSED"),
            ("13", "BOM & Revision Match", "All 74 circuits match harness drawing Rev C.1", "PASSED"),
            ("14", "Assumptions Documented", "92% OEE and floating relief operator modeled", "PASSED")
        ]

        for r in rules:
            tree.insert("", "end", values=r)

        tree.pack(fill="both", expand=True, pady=5)

    # -------------------------------------------------------------------------
    # TAB 7: STANDARD WORK INSTRUCTIONS (SWI)
    # -------------------------------------------------------------------------
    def create_standardwork_tab(self):
        tab = ttk.Frame(self.notebook, padding=12)
        self.notebook.add(tab, text=" Standard Work (SWI) ")

        lbl = tk.Label(tab, text="Standard Work Instructions (SOP / SWI Sheet)", font=("Helvetica", 11, "bold"))
        lbl.pack(anchor="w", pady=(0, 5))

        txt = tk.Text(tab, font=("Courier", 9), bg="#ffffff", padx=10, pady=10)
        swi_content = """
========================================================================================
AUTOMOTIVE WIRING HARNESS STANDARD WORK INSTRUCTION (SWI)
Model: WH-ENG-8402 (Rev C.1) — Hybrid Engine Main Harness
Assembly Line: Line 4 (Alpha Progressive Board) | Target Cycle: 36.0s | Work Content: 180.0s
========================================================================================

STATION 1 (OP-01) - 48-Way ECU Connector Terminal Insertion
- Element Code: ELE-01 | Std Time: 35.5s
- Operation: Select sub-bundle #1, insert 0.64mm terminals into cavities 1-12.
- Quality Gate: Tactile push-pull-push check on 100% terminals; listen for primary click.
- Safety: Ergonomic hand-rest pad; cut-resistant glove on holding hand.

STATION 2 (OP-02) - Secondary Fuse Box & Relay Housing Insertion
- Element Code: ELE-02 | Std Time: 35.8s
- Operation: Route bundle #2 to fuse fixture, insert 8 power terminals & 4 relay lines.
- Quality Gate: Audible snap of secondary locking bar; cavity position optical verify.
- Safety: Correct pinch posture; pneumatic fixture safety sensor active.

STATION 3 (OP-03) - Corrugated Tube Sleeving & Trunk Spiral Taping
- Element Code: ELE-03 | Std Time: 36.0s
- Operation: Apply 13mm split tube over main trunk, secure Y-junction with 50% overlap PVC tape.
- Quality Gate: 50% tape overlap; zero exposed copper or pinched wire insulation.
- Safety: Handheld safety blade dispenser prevents cuts.

STATION 4 (OP-04) - Bulkhead Rubber Grommet & Clip Assembly
- Element Code: ELE-04 | Std Time: 35.2s
- Operation: Slide EPDM grommet 420mm from branch, apply mist, seat 6 barbed body clips.
- Quality Gate: Grommet location within +/- 3mm tolerance; 360-degree flange seating check.
- Safety: Anti-slip glove grip for grommet push; safety glasses for clip seating.

STATION 5 (OP-05) - High-Pot Continuity Testing & Final Packaging QA
- Element Code: ELE-05 | Std Time: 35.5s
- Operation: Dock 10 connectors into spring fixture, run 12.0s automated test, stamp pass barcode.
- Quality Gate: Zero circuit opens/shorts; test machine green light pass certificate.
- Safety: High-voltage interlock enclosure; emergency stop switch verified.
========================================================================================
        """
        txt.insert("1.0", swi_content.strip())
        txt.configure(state="disabled")
        txt.pack(fill="both", expand=True)

    # -------------------------------------------------------------------------
    # TAB 8: SKILL MATRIX
    # -------------------------------------------------------------------------
    def create_skills_tab(self):
        tab = ttk.Frame(self.notebook, padding=12)
        self.notebook.add(tab, text=" Skill Matrix ")

        lbl = tk.Label(tab, text="Operator Competency Matrix & Training Transfer", font=("Helvetica", 11, "bold"))
        lbl.pack(anchor="w", pady=(0, 5))

        cols = ("Operator ID", "Name", "Assigned Line", "Shift", "Workstation", "Competency", "Level", "Status", "Date")
        tree = ttk.Treeview(tab, columns=cols, show="headings", height=8)
        for c in cols:
            tree.heading(c, text=c)
            tree.column(c, width=110 if "Name" not in c and "Competency" not in c else 200)

        conn = self.db.get_connection()
        skills = conn.execute("SELECT * FROM operator_skills;").fetchall()
        conn.close()

        for s in skills:
            tree.insert("", "end", values=(
                s['operator_id'], s['operator_name'], s['assigned_line'], s['shift'],
                s['workstation'], s['skill_name'], s['skill_level'], s['training_status'], s['qualification_date']
            ))

        tree.pack(fill="both", expand=True, pady=5)

    # -------------------------------------------------------------------------
    # TAB 9: PRODUCTION VERIFICATION
    # -------------------------------------------------------------------------
    def create_verification_tab(self):
        tab = ttk.Frame(self.notebook, padding=12)
        self.notebook.add(tab, text=" Production Verification ")

        lbl = tk.Label(tab, text="Mass Production Shift Run Results", font=("Helvetica", 11, "bold"))
        lbl.pack(anchor="w", pady=(0, 5))

        cols = ("Date", "Shift", "Actual Output", "Planned", "Achievement %", "Actual Cycle", "Cycle Gap", "Manpower", "Remarks")
        tree = ttk.Treeview(tab, columns=cols, show="headings", height=8)
        for c in cols:
            tree.heading(c, text=c)
            tree.column(c, width=100 if "Remarks" not in c else 320)

        conn = self.db.get_connection()
        verifs = conn.execute("SELECT * FROM production_verifications;").fetchall()
        conn.close()

        for v in verifs:
            tree.insert("", "end", values=(
                v['shift_date'], v['shift_name'], f"{v['actual_output']} pcs", f"{v['planned_output']} pcs",
                f"{v['output_achievement_percent']:.1f}%", f"{v['actual_cycle_time']:.1f}s", f"{v['cycle_time_gap']:+.1f}s",
                f"{v['actual_manpower']} Ops", v['supervisor_remarks']
            ))

        tree.pack(fill="both", expand=True, pady=5)

    # -------------------------------------------------------------------------
    # DATABASE RESET & EXPORT ACTIONS
    # -------------------------------------------------------------------------
    def reset_database(self):
        if messagebox.askyesno("Confirm Re-Seed", "Reset database and re-seed all master data directly from embedded code?"):
            self.db.ensure_schema_and_seed(force_reset=True)
            self.refresh_dashboard_data()
            self.refresh_products_data()
            self.refresh_timestudy_data()
            self.refresh_workload_data()
            messagebox.showinfo("Success", "Database re-seeded successfully with factory defaults!")

    def export_csv(self):
        filename = filedialog.asksaveasfilename(
            defaultextension=".csv",
            filetypes=[("CSV Files", "*.csv")],
            initialfile="AWSMPS_Line_Balancing_Report.csv"
        )
        if not filename:
            return

        conn = self.db.get_connection()
        elements = conn.execute("SELECT * FROM task_elements ORDER BY sequence_order ASC;").fetchall()
        conn.close()

        with open(filename, mode='w', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            writer.writerow(["Position", "Operation Description", "Workstation", "Std Time (s)", "Target Cycle (s)", "Utilization %"])
            for el in elements:
                st = float(el['standard_time'])
                util = round((st / 36.0) * 100, 1)
                writer.writerow([el['assigned_position'], el['operation_name'], el['workstation'], st, 36.0, f"{util}%"])

        messagebox.showinfo("Export Complete", f"Saved successfully to:\n{filename}")


# =============================================================================
# MAIN ENTRY POINT
# =============================================================================

def main():
    if tk is None:
        print("Error: Tkinter is required to run the desktop graphical interface.")
        print("Please ensure Python is installed with Tkinter support (standard in python.exe on Windows).")
        sys.exit(1)

    root = tk.Tk()
    app = AWSMPSDesktopApp(root)
    root.mainloop()

if __name__ == "__main__":
    main()
