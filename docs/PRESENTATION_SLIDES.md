# STAYWELL HOSTELS MANAGEMENT PORTAL
## SEMINAR & PROJECT DEFENSE PRESENTATION SLIDES
**Course:** Software Engineering (SE Lab)  
**Academic Year:** 2026 – 2027  
**Team Members:**  
- **Yash Bhaveshbhai Vaghani** (`24BCB044`, div 1 – j2) — *Scrum Master & Full-Stack Developer*  
- **Harsh Parmar** (`24BCB041`, div 1 – j2) — *Product Owner*  

---

### SLIDE 1: TITLE SLIDE
```
========================================================================================
                      STAYWELL HOSTELS MANAGEMENT PORTAL
             A Modular, Production-Grade Residential Operations System
========================================================================================
Course: Software Engineering Laboratory (SE Lab)
Lead Developer & Scrum Master: Yash Bhaveshbhai Vaghani (24BCB044, div 1 – j2)
Product Owner: Harsh Parmar (24BCB041)
Theme: Cloud-Ready Campus Automation & Facility Management
Tech Stack: React 19, TypeScript, Tailwind CSS, Express, Python Streamlit, SQLite3
========================================================================================
```

---

### SLIDE 2: THE PROBLEM STATEMENT
**Challenges with Legacy Hostel Administration:**
- **Paper Register Bottlenecks:** Physical logbooks for leave applications get lost, damaged, or delayed.
- **Curfew & Safety Loopholes:** No automated tracking of students returning after 21:00 curfew hours.
- **Unaccountable Facility Repairs:** Complaints filed in registers languish for weeks with zero escalation or technician tracking.
- **Room Allocation Chaos:** Manual tracking causes accidental overbooking of 3-bed capacity limits.
- **Disconnected Food Services:** Lack of feedback channels leads to recurring student mess dissatisfaction.

---

### SLIDE 3: OUR SOLUTION — STAYWELL HOSTELS PORTAL
**A Comprehensive, Real-Time Web Platform:**
- **3 Distinct Role Portals:** Dedicated consoles for Students, Wardens, and Administrators.
- **Automated Curfew Decision Engine:** Automatic curfew detection (> 21:00) requiring mandatory emergency reasoning and guardian verification.
- **48-Hour SLA Maintenance Guarantee:** Built-in escalation timer that flags unresolved tickets to Chief Admin in Red.
- **Multi-Wing & Multi-Branch Architecture:** Supports 100 students across StayWell Boys Wing & StayWell Girls Wing, with branches `BCB`, `ICT`, `BCP`, `IEE` for batches `2022–2026`.
- **Live Mess & Fee Tracking:** Daily 4-meal star ratings and semester financial visibility.

---

### SLIDE 4: SDLC METHODOLOGY — AGILE SCRUM & KANBAN
**Why Agile Scrum?**
- Evolving campus requirements and multi-stakeholder needs (wardens, students, admin).
- Fast 2-week iterations with demonstrable increments.
- **Scrum Ceremonies:**
  - *Sprint Planning:* User stories estimated in Fibonacci story points.
  - *Kanban Task Board:* Live tracking across `Backlog`, `In Progress`, `Testing`, `Done`.
  - *Daily Standups:* Blocker identification (e.g. session persistence, mobile layout overlap).
  - *Sprint Retrospective:* Continuous process refinement.

---

### SLIDE 5: SYSTEM ARCHITECTURE & TECH STACK
```
+--------------------------------------------------------------------------------------+
| CLIENT TIER:     React 19 SPA, TypeScript 7, Tailwind CSS 4, Lucide Icons, Motion    |
+--------------------------------------------------------------------------------------+
| APPLICATION:     AuthContext RBAC Engine, Out-Pass Curfew Validator, 48h SLA Timer   |
+--------------------------------------------------------------------------------------+
| PERSISTENCE:     Isolated Browser LocalStorage (V3) & Embedded SQLite3 Database      |
+--------------------------------------------------------------------------------------+
| COMPANION:       Python 3.11 Streamlit Web Portal (`database.py` & `streamlit_app.py`)|
+--------------------------------------------------------------------------------------+
```

---

### SLIDE 6: CORE SYSTEM MODULES
1. **Admin Console:**
   - User directory with multi-filter searching (Wing, Branch, Batch).
   - Visual 34-room capacity manager (max 3 beds/room).
   - Global complaint escalation center and occupancy analytics.
2. **Warden Console:**
   - Real-time leave approval queue with yellow curfew alerts.
   - Evening roll call and room attendance roster.
   - Curfew monitoring desk for students outside campus.
3. **Student Console:**
   - Digital student ID card, room number (304), bed number (Bed 1), and roommate contacts.
   - Leave application generator with instant digital gate pass.
   - 48h SLA maintenance logger with simulated photo proof.
   - Daily mess menu star rating and semester fee status (₹75k total, ₹40k paid, ₹35k due).

---

### SLIDE 7: UML DESIGN ARTIFACTS
- **Use Case Diagram:** Defines primary actors (Student, Warden, Admin) and key relationships (`<<extends>>` for Curfew Validation, `<<includes>>` for SLA Overdue Escalation).
- **Class Diagram:** Complete OOP models (`User`, `Student`, `Warden`, `Administrator`, `Room`, `OutPass`, `MaintenanceComplaint`, `MessItem`) with strict multiplicities and type contracts.
- **Sequence Diagrams:**
  1. Authentication & Session Routing.
  2. Out-Pass Application with 21:00 Curfew Check.
  3. 48-Hour SLA Maintenance Escalation Timer.
- **Activity & State Machine Diagrams:** End-to-end lifecycle from Out-Pass submission to gate check-in and complaint closure.

---

### SLIDE 8: KEY ENGINEERING HIGHLIGHTS & INNOVATIONS
- **Curfew Intelligence:** Time-parsing algorithms automatically detect departures/returns outside 06:00–21:00.
- **48h SLA Clock:** Dynamic date-delta calculation flags tickets past 48 hours without needing external cron daemons.
- **Rigid RBAC Security:** Eliminated insecure role switching; enforces full authentication checks on every role boundary.
- **Multi-Branch Multi-Batch Numbering:** Full support for `24-26 BCB` and `22-26 ICT, BCP, IEE` formatting.
- **Zero-Overlap Responsive Layout:** Two-tier sticky header ensuring pristine rendering across mobile and 4K displays.

---

### SLIDE 9: LIVE DEMO FLOW (WALKTHROUGH)
1. **Step 1 (Student Persona):** Log in as Yash Vaghani (`24BCB044`). View Room 304 roommate details. Submit late out-pass for 22:30. Observe curfew alert.
2. **Step 2 (Warden Persona):** Log in as Mr. Rameshwar Sharma (`warden1@hostel.edu`). Inspect pending curfew pass in Boys Wing queue. Approve request with remarks. Mark evening attendance.
3. **Step 3 (Admin Persona):** Log in as Dr. Rajesh Mehta (`admin@hostel.edu`). Inspect 48h SLA escalated Wi-Fi ticket. Filter student directory by branch `BCB` and batch `2024`. Verify room capacity limits.

---

### SLIDE 10: QUALITY ASSURANCE & VERIFICATION
- **Compilation & Linting:** 100% clean TypeScript build (`tsc --noEmit`), zero syntax or type errors.
- **Test Suite Results:**
  - *TC-01 (Auth Routing):* **PASS**
  - *TC-02 (Role Security Boundary):* **PASS**
  - *TC-03 (Curfew Hours Detection):* **PASS**
  - *TC-04 (48h SLA Escalation):* **PASS**
  - *TC-05 (Room Capacity Bounds):* **PASS**
  - *TC-06 (100 Students / 5 Wardens Seeder):* **PASS**

---

### SLIDE 11: TEAM ROLES & REFLECTION
- **Yash Bhaveshbhai Vaghani (`24BCB044`):**
  - *Role:* Lead Engineer & Scrum Master.
  - *Contribution:* Frontend architecture, RBAC auth system, curfew & SLA algorithms, database seeding, documentation.
- **Harsh Parmar (`24BCB041`):**
  - *Role:* Product Owner.
  - *Contribution:* Requirements elicitation (Lab Session 01 questionnaire), acceptance criteria definition, backlog prioritization, user acceptance testing (UAT).
- **Key Takeaway:** Adopting Agile Scrum enabled rapid adaptation to feedback (e.g. eliminating insecure role switchers and implementing multi-branch roll numbering).

---

### SLIDE 12: CONCLUSION & FUTURE WORK
- **Summary:** The StayWell Hostels Management Portal delivers a robust, secure, and modern digital operating system for university residential halls.
- **Future Roadmap:**
  - RFID turnstile hardware integration for automated gate logging.
  - SMS / WhatsApp API notifications to guardians for approved late curfew passes.
  - UPI / Net Banking payment gateway integration for fee clearance.
- **Thank You! Any Questions?**
