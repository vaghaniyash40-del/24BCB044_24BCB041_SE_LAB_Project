# STAYWELL HOSTELS MANAGEMENT PORTAL
## COMPREHENSIVE END-USER OPERATIONAL MANUAL

**Applicable System:** StayWell Hostels Management System  
**Version:** 3.0.0  
**Target Audience:** Students, Resident Wardens, Chief Hostel Administrators  

---

## 1. SYSTEM OVERVIEW & GETTING STARTED

The **StayWell Hostels Management Portal** is a secure, digital portal designed to handle residential student life, room allocations, leave authorizations, facility repairs, and catering feedback.

### 1.1 Supported Roles
1. **Resident Student:** Check assigned room/bed, view roommates, apply for daytime and late-night curfew out-passes, log maintenance complaints, rate mess food, and monitor semester fee dues.
2. **Duty Warden:** Review student leave applications, approve/reject curfew exceptions, conduct daily night roll calls, and monitor building occupancy.
3. **Chief Administrator:** Complete administrative control over user records (students and wardens), room capacity and bed assignments, central maintenance complaint resolution, and occupancy reporting.

---

## 2. LOGIN & AUTHENTICATION WALKTHROUGH

### 2.1 Accessing the Sign-In Modal
1. Open the portal at the primary web URL.
2. If unauthenticated, click the blue **Sign In** button in the top navigation bar.
3. A modal dialogue will open prompting you for your credentials.

### 2.2 Signing in by Role

#### A. Student Sign-In
- **Role:** Select `Student`
- **Identifier:** Enter your University Roll Number (e.g., `24BCB044` for Yash Bhaveshbhai Vaghani) or student email (`yash.vaghani@hostel.edu`).
- **Password:** Enter your student password (e.g., `student123`).
- **Action:** Click **Authenticate & Open Student Portal**.

#### B. Warden Sign-In
- **Role:** Select `Warden`
- **Identifier:** Enter your warden email (e.g., `warden1@hostel.edu` for Mr. Rameshwar Sharma).
- **Password:** Enter your warden password (e.g., `warden123`).
- **Action:** Click **Authenticate & Open Warden Portal**.

#### C. Administrator Sign-In
- **Role:** Select `Administrator`
- **Identifier:** Enter administrator email (e.g., `admin@hostel.edu` for Dr. Rajesh Mehta).
- **Password:** Enter admin master password (e.g., `admin123`).
- **Action:** Click **Authenticate & Open Administrator Portal**.

### 2.3 Signing Out
To prevent unauthorized access on shared laboratory or campus computers:
- Look at the top-right user account chip.
- Click the **Sign Out** button with the logout icon.
- Your session is immediately terminated, and the portal locks out role dashboards until re-authenticated.

---

## 3. STUDENT DASHBOARD GUIDE

Once authenticated as a Student (e.g., Yash Bhaveshbhai Vaghani, `24BCB044`), you have access to 5 tabs:

### 3.1 Tab 1: Profile & Room Details
- **Personal Identity Card:** Displays your Full Name, Roll Number, Academic Division (`div 1 – (j2)`), Branch (`BCB`), Batch (`2024`), Registered Mobile, and Parent Phone.
- **Assigned Room Badge:** Highlights your Wing (`StayWell Boys Wing`), Room Number (`Room 304`), and Bed Number (`Bed 1`).
- **Roommate Directory:** Lists fellow occupants assigned to your room with their names, roll numbers, bed numbers, and emergency phone numbers.

### 3.2 Tab 2: Out-Pass & Curfew Request Module
1. Navigate to the **Out-Pass** tab.
2. Select your **Pass Type**:
   - `Day Pass`: Quick daytime campus exit for library, groceries, or sports.
   - `Home Leave`: Multi-day departure for hometown visits or vacations.
   - `Late Curfew Emergency Pass`: Required if returning after 21:00 or departing before 06:00.
3. Enter your **Destination** (e.g., `CS Computer Lab 3`) and **Purpose**.
4. Specify **Departure Time** and **Expected Return Time**.
   - *Automatic Curfew Flagging:* If your return time is set to 21:00 or later, the system automatically marks your pass as **Late Curfew Request**. You must provide a verified reason and confirm your parent contact number.
5. Click **Submit Out-Pass Application**.
6. Monitor the status card:
   - `under_review`: Application pending review by duty warden.
   - `approved`: Leave granted. Your digital out-pass slip with QR stamp will be displayed.
   - `rejected`: Leave declined. View warden comments explaining the reason.

### 3.3 Tab 3: 48-Hour SLA Maintenance Complaints
1. Navigate to the **Complaints** tab.
2. Select the issue **Category**: Plumbing, Electricity, Wi-Fi, Furniture, or Cleanliness.
3. Enter a concise **Title** (e.g., `Bathroom sink faucet continuous drip`) and **Detailed Description**.
4. *(Optional)* Check **Simulate Photo Attachment** to attach proof of damage.
5. Click **Submit Maintenance Ticket**.
6. **48-Hour SLA Guarantee:**
   - Every logged ticket initiates a 48-hour countdown timer.
   - If maintenance is not initiated within 48 hours, the ticket automatically highlights in **Red** with an `Escalated (48h SLA)` status, notifying the Chief Administrator directly.

### 3.4 Tab 4: Daily Mess Menu & Star Ratings
- View the daily meal schedule across **Breakfast**, **Lunch**, **Snacks**, and **Dinner**.
- Review today's prepared dishes and aggregate resident ratings (e.g., 4.6 / 5.0).
- Click on any star (1 to 5) to submit your personal food quality rating. Your score instantly recalculates the catering satisfaction metric.

### 3.5 Tab 5: Hostel Fees Status
- View your total semester residential fee breakdown (₹75,000).
- Check your **Paid Amount** (e.g., ₹40,000) and **Outstanding Due Balance** (e.g., ₹35,000).
- Check the official semester payment deadline date.

---

## 4. WARDEN DASHBOARD GUIDE

When logged in as a Resident Warden (e.g., Mr. Rameshwar Sharma, assigned to StayWell Boys Wing):

### 4.1 Out-Pass Review & Decision Console
- View all pending student leave applications in real time.
- Applications with late returns (> 21:00) are flagged with a **Yellow Curfew Warning Banner**.
- For each student request:
  - Verify destination, reason, and parent emergency telephone number.
  - Enter optional warden remarks.
  - Click **Approve Out-Pass** to issue the pass or **Reject** with feedback.
  - When a student returns to campus, click **Mark Return / Check-In** to close the ticket.

### 4.2 Daily Night Roll Call & Attendance
- Review the residential roster for your assigned wing.
- Inspect student room-by-room presence for the evening roll call.
- Mark students as `Present`, `Absent`, or `On Approved Leave`.

### 4.3 Curfew Monitoring Desk
- View a dedicated list of all students currently outside the campus during curfew hours (21:00 – 06:00).
- Quick access to parent phone numbers for emergency verification calls.

---

## 5. ADMINISTRATOR DASHBOARD GUIDE

When logged in as the Chief Administrator (e.g., Dr. Rajesh Mehta):

### 5.1 User Management Subsystem
- **Student Directory:** Browse, search by name or roll number, and filter all 100 students by:
  - Residential Wing (`All Wings`, `StayWell Boys Wing`, `StayWell Girls Wing`)
  - Branch (`BCB`, `ICT`, `BCP`, `IEE`)
  - Batch Year (`2022`, `2023`, `2024`, `2025`, `2026`)
- **Add New Student:** Click **+ Add Student Profile** to register a new student, choose branch/batch, and assign room.
- **Delete Student:** Remove inactive or graduated student profiles with confirmation.
- **Warden Directory:** View the 5 duty wardens, their assigned wings, shifts (Morning, Evening, Night), and appointment details.

### 5.2 Room Allocation & Capacity Module
- Visual grid of all 34 rooms (Rooms 101 to 307 across Floors 1, 2, and 3).
- **Bed Capacity Rule:** Each room supports a maximum of 3 beds.
- Green cards indicate vacant beds (`1/3` or `2/3`); slate cards indicate full capacity (`3/3`).
- Overrides and reallocations can be executed without data corruption.

### 5.3 Central Complaint Box & SLA Monitoring
- Global view of all logged maintenance tickets across both hostel wings.
- Sort tickets by `All`, `Active`, `SLA Breached`, or `Resolved`.
- Assign technicians (e.g., `Ramesh Kumar (Plumber)`) and update statuses to `in_progress` or `resolved`.
- Immediate visibility on overdue repairs exceeding the 48-hour SLA deadline.

### 5.4 System Reports & Analytics
- Live visual overview of:
  - Total Room Occupancy rate (e.g., 100 / 102 beds occupied = 98.0%).
  - Active Out-Pass statistics and curfew counts.
  - Total Maintenance complaints breakdown by category and resolution rate.
  - Aggregate mess catering satisfaction index.

---

## 6. TROUBLESHOOTING & FAQS

**Q1: Why does the system ask for an emergency reason when I submit my out-pass?**  
*A:* University regulations enforce a mandatory curfew between 21:00 and 06:00. Any return time within this window triggers curfew protocols requiring special justification and guardian phone confirmation.

**Q2: What happens if a maintenance ticket is ignored?**  
*A:* The system automatically checks ticket timestamps against the current time. Once 48 hours elapse without resolution, the ticket status changes to `escalated_sla` and alerts the Chief Administrator directly.

**Q3: Can a student access the admin console by guessing URLs?**  
*A:* No. Session state routing actively checks the authenticated user's role. If a student tries to render warden or admin views, the portal renders access-denied warnings.

**Q4: How do I run the Python Streamlit alternative?**  
*A:* In your terminal, initialize the SQLite database using `python3 -c "import database; database.init_db()"` and launch the web interface via `streamlit run streamlit_app.py --server.port 8501`.
