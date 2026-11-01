"""
Hostel Management System - Modular Streamlit Web Application
Connected to SQLite3 backend with automated 100 students, 5 wardens, and 1 admin seeding.
Author: Yash Bhaveshbhai Vaghani (Roll: 24BCB044, div 1 – j2)
"""

import streamlit as st
import pandas as pd
import sqlite3
from datetime import datetime, timedelta
import os
import database

# Initialize SQLite Database on startup
database.init_db()

# Page Setup
st.set_page_config(
    page_title="Hostel Management System",
    page_icon="🏢",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom Styling for polished UX and mobile responsiveness
st.markdown("""
<style>
    .portal-banner {
        background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
        padding: 20px 24px;
        border-radius: 12px;
        color: white;
        margin-bottom: 20px;
        border-left: 6px solid #3b82f6;
    }
    .status-badge {
        display: inline-block;
        padding: 4px 10px;
        border-radius: 9999px;
        font-size: 0.8rem;
        font-weight: 600;
    }
    .metric-container {
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 10px;
        padding: 16px;
        text-align: center;
    }
</style>
""", unsafe_allow_html=True)

# ----------------- SESSION STATE AUTHENTICATION -----------------
if "authenticated" not in st.session_state:
    st.session_state["authenticated"] = True
    st.session_state["user_role"] = "Student"
    st.session_state["user_id"] = "STU-B-100"
    st.session_state["user_name"] = "Yash Bhaveshbhai Vaghani"
    st.session_state["user_roll"] = "24BCB044"
    st.session_state["user_block"] = "StayWell Boys Wing"
    st.session_state["user_room"] = "304"

def switch_user(role, user_id, name, roll=None, block=None, room=None):
    st.session_state["authenticated"] = True
    st.session_state["user_role"] = role
    st.session_state["user_id"] = user_id
    st.session_state["user_name"] = name
    st.session_state["user_roll"] = roll
    st.session_state["user_block"] = block
    st.session_state["user_room"] = room
    st.rerun()

# ----------------- SIDEBAR & LOGIN -----------------
with st.sidebar:
    st.image("https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=500&auto=format&fit=crop&q=60", use_container_width=True)
    st.title("StayWell Hostels")
    st.caption("Boys & Girls Residential Wings")

    st.markdown(f"**Logged in as:**  \n**{st.session_state['user_name']}**  \n`Role: {st.session_state['user_role']}`")
    
    st.divider()
    if st.button("🚪 Sign Out"):
        st.session_state["authenticated"] = False
        st.rerun()

# If Logged Out, Show Dedicated Sign-In Form
if not st.session_state.get("authenticated", False):
    st.markdown("""
    <div class="portal-banner">
        <h2>Hostel Management System • Sign In</h2>
        <p>Please enter your account credentials to access your dashboard.</p>
    </div>
    """, unsafe_allow_html=True)
    
    with st.form("login_form"):
        role_choice = st.selectbox("Select Account Type", ["Student", "Admin", "Warden"])
        email_or_roll = st.text_input("Roll Number or Email", value="", placeholder="e.g. 24BCB044 or admin@hostel.edu")
        password = st.text_input("Password", type="password", value="", placeholder="Enter your password")
        submit_login = st.form_submit_button("Sign In")
        
        if submit_login:
            conn = database.get_db_connection()
            user_row = conn.execute("SELECT * FROM users WHERE email = ? OR id = ? OR phone = ?",
                                   (email_or_roll, email_or_roll, email_or_roll)).fetchone()
            conn.close()
            
            if user_row:
                st.session_state["authenticated"] = True
                st.session_state["user_role"] = user_row["role"].capitalize()
                st.session_state["user_id"] = user_row["id"]
                st.session_state["user_name"] = user_row["name"]
                st.success("Signed in successfully!")
                st.rerun()
            else:
                # Fallback to demo
                switch_user(role_choice, "USER-1", email_or_roll)
    st.stop()


# =========================================================================
# 1. ADMIN DASHBOARD
# =========================================================================
if st.session_state["user_role"] == "Admin":
    st.markdown("""
    <div class="portal-banner">
        <h2>⚙️ Central Administrator Console: Dr. Rajesh Mehta</h2>
        <p>Full System Access: User Management (100 Students, 5 Wardens), Room Allocations, Global Complaints &amp; Reports</p>
    </div>
    """, unsafe_allow_html=True)

    tab_users, tab_rooms, tab_complaints, tab_reports = st.tabs([
        "👥 User Management (CRUD)",
        "🛏️ Room Allocation Module",
        "🚨 Central Complaint Box",
        "📊 System Statistics & Reports"
    ])

    # --- TAB 1: User Management ---
    with tab_users:
        st.subheader("Manage Students & Wardens")
        user_type = st.radio("Select View:", ["Students (100 Registered)", "Wardens (5 Appointed)"], horizontal=True)
        conn = database.get_db_connection()

        if user_type == "Students (100 Registered)":
            students_df = pd.read_sql_query("SELECT id, name, roll_number, branch, batch, gender, block, room_number, bed_number, contact, fee_due FROM students", conn)
            
            # Search & Filter
            c_f1, c_f2, c_f3 = st.columns([2, 1, 1])
            with c_f1:
                search_query = st.text_input("🔍 Search Student by Name or Roll Number:", "")
            with c_f2:
                branch_filter = st.selectbox("Filter Branch:", ["All Branches", "BCB (24-26)", "ICT (22-26)", "BCP (22-26)", "IEE (22-26)"])
            with c_f3:
                batch_filter = st.selectbox("Filter Batch:", ["All Batches", "2022", "2023", "2024", "2025", "2026"])

            if search_query:
                students_df = students_df[students_df['name'].str.contains(search_query, case=False, na=False) |
                                          students_df['roll_number'].str.contains(search_query, case=False, na=False)]
            if branch_filter != "All Branches":
                b_code = branch_filter.split(' ')[0]
                students_df = students_df[students_df['branch'] == b_code]
            if batch_filter != "All Batches":
                students_df = students_df[students_df['batch'] == batch_filter]
            
            st.dataframe(students_df, use_container_width=True, height=350)

            # Add / Delete Student actions
            with st.expander("➕ Add New Student"):
                with st.form("add_student_form"):
                    new_name = st.text_input("Full Name")
                    new_branch = st.selectbox("Branch", ["BCB", "ICT", "BCP", "IEE"])
                    new_batch = st.selectbox("Batch", ["2024", "2025", "2026"] if new_branch == "BCB" else ["2022", "2023", "2024", "2025", "2026"])
                    new_roll = st.text_input("Roll Number", placeholder=f"e.g. {new_batch[2:]}{new_branch}055")
                    new_gender = st.selectbox("Gender", ["male", "female"])
                    new_block = "StayWell Boys Wing" if new_gender == "male" else "StayWell Girls Wing"
                    new_room = st.text_input("Assigned Room", "101")
                    new_phone = st.text_input("Phone Number", "+91 98000 00000")
                    submit_add = st.form_submit_button("Add Student to Database")
                    
                    if submit_add and new_name and new_roll:
                        new_id = f"STU-{new_gender[0].upper()}-{int(datetime.now().timestamp()) % 10000}"
                        conn.execute("""
                        INSERT INTO students (id, name, roll_number, gender, block, room_number, bed_number, branch, batch, contact, guardian_contact)
                        VALUES (?, ?, ?, ?, ?, ?, 'Bed 1', ?, ?, ?, '+91 98000 11111')
                        """, (new_id, new_name, new_roll, new_gender, new_block, new_room, new_branch, new_batch, new_phone))
                        conn.commit()
                        st.success(f"Student {new_name} ({new_roll}) added to {new_block}!")
                        st.rerun()

            with st.expander("🗑️ Delete Student"):
                del_roll = st.text_input("Enter Student Roll Number to Delete:")
                if st.button("Delete Student Profile"):
                    conn.execute("DELETE FROM students WHERE roll_number = ?", (del_roll,))
                    conn.commit()
                    st.warning(f"Student with Roll Number {del_roll} deleted.")
                    st.rerun()

        else:
            wardens_df = pd.read_sql_query("SELECT id, name, email, contact, assigned_block, shift FROM wardens", conn)
            st.dataframe(wardens_df, use_container_width=True)

            with st.expander("➕ Add New Warden"):
                with st.form("add_warden_form"):
                    w_name = st.text_input("Warden Name")
                    w_email = st.text_input("Email", placeholder="warden@hostel.edu")
                    w_block = st.selectbox("Assigned Wing", ["StayWell Boys Wing", "StayWell Girls Wing"])
                    w_shift = st.selectbox("Duty Shift", ["Morning", "Evening", "Night"])
                    w_contact = st.text_input("Phone Number", "+91 98200 00000")
                    submit_w = st.form_submit_button("Appoint Warden")
                    if submit_w and w_name:
                        w_id = f"WRD-{int(datetime.now().timestamp()) % 1000}"
                        conn.execute("INSERT INTO wardens (id, name, email, contact, assigned_block, shift) VALUES (?, ?, ?, ?, ?, ?)",
                                     (w_id, w_name, w_email, w_contact, w_block, w_shift))
                        conn.commit()
                        st.success(f"Warden {w_name} appointed to {w_block}!")
                        st.rerun()
        conn.close()

    # --- TAB 2: Room Allocation Module ---
    with tab_rooms:
        st.subheader("Room Allocation & Capacity Engine")
        conn = database.get_db_connection()
        rooms_df = pd.read_sql_query("SELECT id, room_number, block, floor, capacity, occupied FROM rooms", conn)
        
        c_r1, c_r2 = st.columns([1, 1])
        with c_r1:
            st.metric("Total Hostel Capacity", f"{rooms_df['capacity'].sum()} Beds")
        with c_r2:
            st.metric("Occupied Beds", f"{rooms_df['occupied'].sum()} / {rooms_df['capacity'].sum()} ({round(rooms_df['occupied'].sum() / rooms_df['capacity'].sum() * 100, 1)}%)")

        block_filter = st.selectbox("Filter Wing:", ["All Wings", "StayWell Boys Wing", "StayWell Girls Wing"])
        filtered_rooms = rooms_df if block_filter == "All Blocks" else rooms_df[rooms_df['block'] == block_filter]
        
        st.dataframe(filtered_rooms, use_container_width=True, height=300)

        with st.expander("🔄 Reassign Student Room / Manual Override"):
            with st.form("realloc_form"):
                stu_roll = st.text_input("Student Roll Number (e.g. 24BCB044)")
                target_room = st.text_input("Target Room Number (e.g. 102)")
                target_bed = st.selectbox("Target Bed", ["Bed 1", "Bed 2", "Bed 3"])
                reassign_btn = st.form_submit_button("Reassign Room")
                if reassign_btn and stu_roll:
                    conn.execute("UPDATE students SET room_number = ?, bed_number = ? WHERE roll_number = ?",
                                 (target_room, target_bed, stu_roll))
                    conn.commit()
                    st.success(f"Student {stu_roll} successfully reassigned to Room {target_room} ({target_bed})!")
                    st.rerun()
        conn.close()

    # --- TAB 3: Central Complaint Box ---
    with tab_complaints:
        st.subheader("Global Student Maintenance Complaint Box")
        conn = database.get_db_connection()
        complaints_df = pd.read_sql_query("SELECT id, student_name, room_number, block, category, title, status, logged_at, is_overdue, technician_assigned FROM complaints", conn)
        
        status_filter = st.selectbox("Filter by Status:", ["All", "logged", "in_progress", "escalated_sla", "resolved"])
        if status_filter != "All":
            complaints_df = complaints_df[complaints_df['status'] == status_filter]
            
        st.dataframe(complaints_df, use_container_width=True)

        st.markdown("#### Update Complaint Status:")
        c_u1, c_u2, c_u3 = st.columns(3)
        with c_u1:
            ticket_id = st.text_input("Complaint ID (e.g. CMP-401)")
        with c_u2:
            new_status = st.selectbox("Change Status To:", ["in_progress", "resolved", "escalated_sla"])
        with c_u3:
            tech_name = st.text_input("Assign Technician", "Ramesh Kumar (Plumber)")
            
        if st.button("Update Complaint Status"):
            if ticket_id:
                conn.execute("UPDATE complaints SET status = ?, technician_assigned = ? WHERE id = ?",
                             (new_status, tech_name, ticket_id))
                conn.commit()
                st.success(f"Ticket {ticket_id} updated to {new_status}!")
                st.rerun()
        conn.close()

    # --- TAB 4: System Reports ---
    with tab_reports:
        st.subheader("Executive System Reports & Overviews")
        conn = database.get_db_connection()
        
        c_st1, c_st2, c_st3, c_st4 = st.columns(4)
        total_students = conn.execute("SELECT COUNT(*) FROM students").fetchone()[0]
        total_complaints = conn.execute("SELECT COUNT(*) FROM complaints").fetchone()[0]
        pending_outpasses = conn.execute("SELECT COUNT(*) FROM outpasses WHERE status='under_review'").fetchone()[0]
        sla_breaches = conn.execute("SELECT COUNT(*) FROM complaints WHERE is_overdue=1").fetchone()[0]

        c_st1.metric("Total Registered Students", total_students)
        c_st2.metric("Total Complaints Logged", total_complaints)
        c_st3.metric("Pending Out-Passes", pending_outpasses)
        c_st4.metric("48h SLA Breaches", sla_breaches)

        st.markdown("#### Download CSV Reports:")
        d1, d2 = st.columns(2)
        with d1:
            st.download_button("📥 Export All Students Ledger (CSV)",
                               pd.read_sql_query("SELECT * FROM students", conn).to_csv(index=False),
                               "all_students_ledger.csv")
        with d2:
            st.download_button("📥 Export Complaints Audit (CSV)",
                               pd.read_sql_query("SELECT * FROM complaints", conn).to_csv(index=False),
                               "complaints_audit.csv")
        conn.close()


# =========================================================================
# 2. WARDEN DASHBOARD
# =========================================================================
elif st.session_state["user_role"] == "Warden":
    st.markdown("""
    <div class="portal-banner">
        <h2>🛡️ Warden Operational Console: Mr. Rameshwar Sharma</h2>
        <p>Out-Pass Approval, Daily Night Attendance &amp; Curfew Hour Enforcement (21:00 - 06:00)</p>
    </div>
    """, unsafe_allow_html=True)

    tab_outpass, tab_attendance, tab_curfew = st.tabs([
        "📄 Out-Pass Management",
        "📋 Occupancy & Daily Attendance",
        "🚨 Curfew Monitoring"
    ])

    # --- TAB 1: Out-Pass Management ---
    with tab_outpass:
        st.subheader("Review Out-Pass (Leave) Applications")
        conn = database.get_db_connection()
        outpasses_df = pd.read_sql_query("SELECT id, student_name, roll_number, room_number, block, pass_type, departure_time, expected_return_time, destination, is_curfew_hours, status FROM outpasses", conn)
        
        st.dataframe(outpasses_df, use_container_width=True)

        st.markdown("#### Adjudicate Out-Pass Application:")
        col_ad1, col_ad2 = st.columns([1, 1])
        with col_ad1:
            pass_to_judge = st.text_input("Enter Out-Pass ID (e.g. OP-8902):", "OP-8902")
        with col_ad2:
            warden_remark = st.text_input("Warden Remarks / Parent Verification:", "Verified with guardian. Return by 22:30.")

        btn_col1, btn_col2 = st.columns(2)
        with btn_col1:
            if st.button("✅ Approve Out-Pass"):
                conn.execute("UPDATE outpasses SET status='approved', warden_comments=? WHERE id=?",
                             (warden_remark, pass_to_judge))
                conn.commit()
                st.success(f"Out-Pass {pass_to_judge} APPROVED!")
                st.rerun()
        with btn_col2:
            if st.button("❌ Reject Out-Pass"):
                conn.execute("UPDATE outpasses SET status='rejected', warden_comments=? WHERE id=?",
                             (warden_remark, pass_to_judge))
                conn.commit()
                st.error(f"Out-Pass {pass_to_judge} REJECTED.")
                st.rerun()
        conn.close()

    # --- TAB 2: Attendance & Occupancy ---
    with tab_attendance:
        st.subheader("Block Room Occupancy & Roll Call")
        conn = database.get_db_connection()
        
        st.info("Conduct evening roll call by checking rooms or scanning roll numbers.")
        
        col_sc1, col_sc2 = st.columns([2, 1])
        with col_sc1:
            scan_roll = st.text_input("Scan / Enter Student Roll Number:", "24BCB044")
        with col_sc2:
            mark_status = st.selectbox("Status", ["present", "absent", "on_leave"])

        if st.button("Record Attendance Log"):
            log_id = f"ATT-{int(datetime.now().timestamp()) % 10000}"
            conn.execute("INSERT INTO attendance (id, student_id, roll_number, date, status) VALUES (?, ?, ?, ?, ?)",
                         (log_id, scan_roll, scan_roll, str(datetime.now().date()), mark_status))
            conn.commit()
            st.success(f"Attendance for {scan_roll} marked as {mark_status.upper()}!")

        st.markdown("#### Recent Roll Call Records:")
        att_df = pd.read_sql_query("SELECT * FROM attendance ORDER BY date DESC LIMIT 10", conn)
        st.dataframe(att_df, use_container_width=True)
        conn.close()

    # --- TAB 3: Curfew Monitoring ---
    with tab_curfew:
        st.subheader("Late Curfew Special Approvals (21:00 - 06:00)")
        conn = database.get_db_connection()
        curfew_passes = pd.read_sql_query("SELECT id, student_name, roll_number, destination, expected_return_time, special_reason, parent_phone, status FROM outpasses WHERE is_curfew_hours=1", conn)
        
        st.warning("⚠️ Any pass with expected return past 21:00 requires special justification and emergency parent contact.")
        st.dataframe(curfew_passes, use_container_width=True)
        conn.close()


# =========================================================================
# 3. STUDENT DASHBOARD
# =========================================================================
else:
    st.markdown(f"""
    <div class="portal-banner">
        <h2>🎓 Student Portal: {st.session_state['user_name']}</h2>
        <p>Roll No: <strong>{st.session_state['user_roll']}</strong> • Room {st.session_state['user_room']} (Bed 1) • {st.session_state['user_block']}</p>
    </div>
    """, unsafe_allow_html=True)

    tab_profile, tab_pass, tab_maint, tab_mess, tab_fee = st.tabs([
        "👤 Profile & Roommates",
        "📝 Apply for Out-Pass",
        "🔧 Maintenance Complaints (48h SLA)",
        "🍽️ Daily Mess Menu & Ratings",
        "💳 Hostel Fees Ledger"
    ])

    # --- TAB 1: Profile & Roommates ---
    with tab_profile:
        st.subheader("Assigned Room & Inhabitants")
        c_p1, c_p2 = st.columns([1, 1])
        with c_p1:
            st.markdown(f"""
            - **Student Name:** {st.session_state['user_name']}
            - **Roll Number:** `{st.session_state['user_roll']}`
            - **Hostel Block:** {st.session_state['user_block']}
            - **Room Number:** Room {st.session_state['user_room']}
            - **Status:** Active Resident
            """)
        with c_p2:
            st.markdown("#### Digital Student ID:")
            st.info(f"Student ID: `STU-B-100`  \nRoll: `{st.session_state['user_roll']}`  \nHostel Curfew: 21:00 daily")

        st.markdown("#### Room 304 Roommates:")
        conn = database.get_db_connection()
        roommates_df = pd.read_sql_query("SELECT name, roll_number, bed_number, contact FROM students WHERE room_number = '304' AND block = 'StayWell Boys Wing'", conn)
        st.dataframe(roommates_df, use_container_width=True)
        conn.close()

    # --- TAB 2: Out-Pass System ---
    with tab_pass:
        st.subheader("Submit Out-Pass / Leave Application")
        with st.form("stu_outpass_form"):
            p_type = st.selectbox("Leave Type", ["Daytime Leave", "Late Curfew Emergency Pass", "Home Leave"])
            destination = st.text_input("Destination", "Central University Computer Science Lab")
            dep_time = st.time_input("Departure Time", value=datetime.now().time())
            ret_time = st.time_input("Expected Return Time", value=(datetime.now() + timedelta(hours=3)).time())
            purpose = st.text_area("Detailed Purpose", "Academic project laboratory assignment work.")
            
            is_curfew = ret_time.hour >= 21 or ret_time.hour < 6
            if is_curfew:
                st.warning("⚠️ **Notice:** Return time falls during Curfew hours (21:00 - 06:00). Special justification & Parent phone required.")
                parent_phone = st.text_input("Emergency Guardian Phone", "+91 98111 22334")
                curfew_reason = st.text_input("Curfew Justification", "Final lab build submission")
            else:
                parent_phone = "+91 98111 22334"
                curfew_reason = None

            submit_pass = st.form_submit_button("Submit Application for Warden Approval")
            if submit_pass:
                conn = database.get_db_connection()
                new_op_id = f"OP-{int(datetime.now().timestamp()) % 10000}"
                conn.execute("""
                INSERT INTO outpasses (id, student_id, student_name, roll_number, room_number, block, pass_type, purpose, departure_time, expected_return_time, destination, is_curfew_hours, special_reason, parent_phone, status, applied_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'under_review', ?)
                """, (new_op_id, st.session_state['user_id'], st.session_state['user_name'], st.session_state['user_roll'],
                      st.session_state['user_room'], st.session_state['user_block'], p_type, purpose,
                      f"2026-10-28 {dep_time}", f"2026-10-28 {ret_time}", destination, 1 if is_curfew else 0,
                      curfew_reason, parent_phone, str(datetime.now())))
                conn.commit()
                conn.close()
                st.success(f"Out-Pass Application {new_op_id} submitted! Status: UNDER_REVIEW.")
                st.rerun()

        st.markdown("#### Your Out-Pass History:")
        conn = database.get_db_connection()
        my_passes = pd.read_sql_query("SELECT id, pass_type, departure_time, expected_return_time, destination, status, warden_comments FROM outpasses WHERE roll_number = ?",
                                     conn, params=(st.session_state['user_roll'],))
        st.dataframe(my_passes, use_container_width=True)
        conn.close()

    # --- TAB 3: Maintenance Reporting ---
    with tab_maint:
        st.subheader("Report Maintenance Issue (48-Hour SLA Guarantee)")
        with st.form("complaint_form"):
            c_cat = st.selectbox("Category", ["Plumbing", "Electricity", "Wi-Fi / Internet", "Furniture", "Cleanliness"])
            c_title = st.text_input("Issue Title", "Bathroom sink faucet leakage")
            c_desc = st.text_area("Description", "Water continuously dripping from main sink pipe.")
            st.file_uploader("Upload Evidence Photo (Mock UI)")
            submit_c = st.form_submit_button("Submit Maintenance Ticket")
            
            if submit_c and c_title:
                conn = database.get_db_connection()
                new_c_id = f"CMP-{int(datetime.now().timestamp()) % 1000}"
                sla_time = datetime.now() + timedelta(hours=48)
                conn.execute("""
                INSERT INTO complaints (id, student_id, student_name, room_number, block, category, title, description, status, logged_at, sla_deadline, is_overdue)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'logged', ?, ?, 0)
                """, (new_c_id, st.session_state['user_id'], st.session_state['user_name'], st.session_state['user_room'],
                      st.session_state['user_block'], c_cat, c_title, c_desc, str(datetime.now()), str(sla_time)))
                conn.commit()
                conn.close()
                st.success(f"Complaint {new_c_id} logged! 48-Hour SLA countdown active.")
                st.rerun()

        st.markdown("#### Active Maintenance Tickets:")
        conn = database.get_db_connection()
        my_comp = pd.read_sql_query("SELECT id, category, title, status, logged_at, sla_deadline, technician_assigned FROM complaints WHERE room_number = ?",
                                   conn, params=(st.session_state['user_room'],))
        st.dataframe(my_comp, use_container_width=True)
        conn.close()

    # --- TAB 4: Daily Mess Menu & Ratings ---
    with tab_mess:
        st.subheader("Today's Food Menu & Star Ratings")
        conn = database.get_db_connection()
        mess_df = pd.read_sql_query("SELECT meal_type, items, average_rating, total_ratings FROM mess_ratings", conn)
        
        for idx, row in mess_df.iterrows():
            with st.expander(f"🍲 {row['meal_type']} — Average Rating: ⭐ {row['average_rating']} / 5.0"):
                st.write(f"**Items:** {row['items']}")
                score = st.slider(f"Rate {row['meal_type']}", 1, 5, 4, key=f"star_{idx}")
                feedback = st.text_input(f"Comment for {row['meal_type']}", key=f"comm_{idx}")
                if st.button(f"Submit Feedback for {row['meal_type']}", key=f"btn_m_{idx}"):
                    st.success("Feedback submitted! Aggregated into weekly food quality audit.")
        conn.close()

    # --- TAB 5: Fee Ledger ---
    with tab_fee:
        st.subheader("Hostel Fee Ledger")
        c_f1, c_f2, c_f3 = st.columns(3)
        c_f1.metric("Total Term Fees", "₹75,000")
        c_f2.metric("Amount Paid", "₹40,000")
        c_f3.metric("Outstanding Dues", "₹35,000")
        
        if st.button("💳 Simulate Online Payment of ₹35,000"):
            st.success("✅ Payment received! Receipt #REC-2026-904 generated and sent to email.")
