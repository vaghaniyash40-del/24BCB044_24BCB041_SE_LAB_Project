# STAYWELL HOSTELS MANAGEMENT SYSTEM
## SCRUM TEAM REFLECTION & SPRINT RETROSPECTIVE

**Project:** StayWell Hostels Management Portal  
**Course:** Software Engineering Laboratory (SE Lab)  
**Academic Division:** div 1 – (j2)  
**Submission Date:** Academic Term 2026 – 2027  

---

## 1. TEAM FORMATION & ROLE ASSIGNMENTS

| Member Name | University Roll No. | Division | Scrum Role | Primary Responsibilities |
|---|---|---|---|---|
| **Yash Bhaveshbhai Vaghani** | `24BCB044` | div 1 – (j2) | **Scrum Master & Lead Full-Stack Developer** | System architecture, React 19 / TypeScript development, RBAC security design, curfew and 48h SLA algorithms, SQLite database engine, technical documentation. |
| **Harsh Parmar** | `24BCB041` | div 1 – (j2) | **Product Owner & QA Lead** | Client requirements gathering (Lab Session 01 questionnaire), backlog grooming, user story acceptance criteria, workflow validation, user acceptance testing (UAT). |

---

## 2. EVOLUTION FROM LAB SESSION 01 TO FINAL PRODUCTION SYSTEM

In **Lab Session 01**, our team initiated the project with a core theme: *"Hostel Management System: Tracking room allocations, approving out-passes, and filing complaints without relying on paper registers."*

We conducted an extensive **10-Point Questionnaire Asked to the Client** and mapped each question into an active system feature:
1. *Room Assignment Method:* Addressed with both automated capacity-limited assignment and admin manual override.
2. *Late-Night Curfew Approval:* Implemented an automatic curfew detector for requests past 21:00 or before 06:00, requiring verified emergency justification and guardian contacts.
3. *Daily Attendance Protocol:* Designed the Warden Attendance Roster with status toggles (`Present`, `Absent`, `On Leave`).
4. *Roommate Visibility:* Built roommate lookup displaying names, roll numbers, and contact numbers on the Student Profile tab.
5. *48-Hour Complaint Resolution Guarantee:* Created an automated 48-Hour SLA escalation engine flagging overdue tickets to the Chief Administrator in Red.
6. *Hostel Fee Tracking:* Developed the Student Fee Status widget and Admin fee overview (₹75k total, ₹40k paid, ₹35k due).
7. *Mess Food Rating:* Built an interactive 5-star rating module across 4 daily meals (Breakfast, Lunch, Snacks, Dinner).
8. *Out-Pass Immutability:* Enforced state transitions (`submitted` -> `under_review` -> `approved`/`rejected`) preventing post-submission student tampering.
9. *Monthly Reports:* Created real-time metrics for room occupancy, out-pass counts, and maintenance category distributions.
10. *Security Access Control:* Implemented strict Role-Based Access Control (RBAC) preventing students from viewing or mutating warden or admin dashboards.

---

## 3. SPRINT RETROSPECTIVE & CHALLENGES FACED

### Sprint 1: Architecture & Data Modeling
- **What Went Well:** Swift agreement on domain entities (`Student`, `Warden`, `Room`, `OutPass`, `Complaint`, `MessItem`) and clear separation between frontend presentation and business logic.
- **Challenges:** Defining a scalable student roll number structure. Initially, only `24BCB` was supported, but university requirements expanded to multi-branch (`BCB`, `ICT`, `BCP`, `IEE`) and multi-batch (`2022–2026`).
- **Remediation:** Refactored seed generators and database schemas with dynamic branch/batch cycle logic.

### Sprint 2: Core Workflows & Logic
- **What Went Well:** Smooth implementation of the Out-Pass curfew logic and 48-hour SLA maintenance escalation.
- **Challenges:** Designing a realistic 48-hour SLA escalation test in a demo environment.
- **Remediation:** Seeded pre-existing complaints with timestamps older than 48 hours (e.g. `CMP-395` logged on 2026-10-25) to immediately verify that the SLA engine highlights overdue tickets correctly.

### Sprint 3: UI/UX Refinement & Edge Cases
- **What Went Well:** Visual feedback with clean badges, responsive status indicators, and modal dialogues.
- **Challenges:**
  1. *Navbar Overlap on Mobile Screens:* Feature buttons (`Task Board`, `Host`) were overlapping brand headers on smaller viewports.
  2. *Default Credential Pre-filling:* Login inputs originally pre-filled demo credentials, which caused confusion during manual testing.
  3. *Insecure Role Switcher Bypass:* Early builds had a quick "SWITCH ROLE" button that allowed logged-in students to switch to Admin with a single click, bypassing security.
- **Remediation:**
  1. Redesigned navigation into a structured two-tier responsive layout.
  2. Cleared default credentials in sign-in inputs to require explicit user typing.
  3. Completely eliminated the insecure role switcher, requiring an explicit sign-out and password-authenticated sign-in to cross role boundaries.

### Sprint 4: Branding & Final Packaging
- **What Went Well:** The user requested replacing the traditional "Aryabhata & Gargi" names with modern branding: **StayWell Hostels**, **StayWell Boys Wing**, and **StayWell Girls Wing**.
- **Execution:** Systematically updated all occurrences across types, seed records, components, Python SQLite databases, and HTML metadata with zero regressions.

---

## 4. SOFTWARE ENGINEERING PRINCIPLES APPLIED

1. **Single Responsibility Principle (SRP):**
   - Individual modules handle strictly defined operations: `AuthContext` handles credential validation and session state; `HostelPortal` coordinates dashboard tabs; `database.py` manages SQLite tables and relational constraints.
2. **Separation of Concerns (SoC):**
   - Decoupled presentation (React 19 Tailwind components) from data persistence (`localStorage` v3 and SQLite relational tables).
3. **Defense in Depth (Security):**
   - Both client-side route guards and internal state verification validate whether an active session possesses the required role authority before rendering privileged actions.
4. **Don't Repeat Yourself (DRY):**
   - Reusable seed helper functions and standardized data interfaces (`OutPass`, `MaintenanceComplaint`, `Student`) across both the React application and Python Streamlit engine.
5. **Fail-Safe Defaults:**
   - Unauthenticated users are strictly barred from all resident data and presented exclusively with an authentication gate.

---

## 5. INDIVIDUAL REFLECTIONS & KEY TAKEAWAYS

### Reflection by Yash Bhaveshbhai Vaghani (`24BCB044`):
> *"Serving as Scrum Master and Lead Developer on StayWell Hostels provided invaluable practical experience in applying Agile principles to a full-stack system. The most critical lesson was understanding that software development is iterative: user feedback regarding security loopholes (like removing the one-click role switcher) and layout responsiveness (eliminating navbar overlap) taught me to prioritize defensive design and accessibility alongside core functionality."*

### Reflection by Harsh Parmar (`24BCB041`):
> *"As Product Owner, my priority was ensuring our software directly solved the ten client pain points identified in Lab Session 01. Collaborating through sprint backlogs and conducting user acceptance testing showed how essential clear acceptance criteria are. The resulting 48h SLA maintenance escalation and curfew detection workflows provide genuine operational value for real hostel administration."*
