"""
Hostel Management System - SQLite3 Database & Seed Data Module
Automated creation of 2 blocks (50 Boys, 50 Girls), 100 Students, 5 Wardens, and 1 Admin.
"""

import sqlite3
import os
from datetime import datetime, timedelta

DB_FILE = "hostel_management.db"

def get_db_connection():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()

    # 1. Users Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL,
        phone TEXT
    )
    """)

    # 2. Students Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS students (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        name TEXT NOT NULL,
        roll_number TEXT UNIQUE NOT NULL,
        gender TEXT NOT NULL,
        block TEXT NOT NULL,
        room_number TEXT NOT NULL,
        bed_number TEXT NOT NULL,
        division TEXT DEFAULT 'div 1',
        branch TEXT DEFAULT 'BCB',
        batch TEXT DEFAULT '2024',
        contact TEXT NOT NULL,
        guardian_contact TEXT NOT NULL,
        fee_total INTEGER DEFAULT 75000,
        fee_paid INTEGER DEFAULT 40000,
        fee_due INTEGER DEFAULT 35000,
        FOREIGN KEY (user_id) REFERENCES users(id)
    )
    """)

    # 3. Wardens Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS wardens (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        contact TEXT NOT NULL,
        assigned_block TEXT NOT NULL,
        shift TEXT DEFAULT 'Evening',
        FOREIGN KEY (user_id) REFERENCES users(id)
    )
    """)

    # 4. Rooms Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS rooms (
        id TEXT PRIMARY KEY,
        room_number TEXT NOT NULL,
        block TEXT NOT NULL,
        floor INTEGER NOT NULL,
        capacity INTEGER DEFAULT 3,
        occupied INTEGER DEFAULT 0
    )
    """)

    # 5. OutPass Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS outpasses (
        id TEXT PRIMARY KEY,
        student_id TEXT NOT NULL,
        student_name TEXT NOT NULL,
        roll_number TEXT NOT NULL,
        room_number TEXT NOT NULL,
        block TEXT NOT NULL,
        pass_type TEXT NOT NULL,
        purpose TEXT NOT NULL,
        departure_time TEXT NOT NULL,
        expected_return_time TEXT NOT NULL,
        destination TEXT NOT NULL,
        is_curfew_hours INTEGER DEFAULT 0,
        special_reason TEXT,
        parent_phone TEXT,
        status TEXT DEFAULT 'under_review',
        warden_comments TEXT,
        applied_at TEXT NOT NULL
    )
    """)

    # 6. Maintenance Complaints Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS complaints (
        id TEXT PRIMARY KEY,
        student_id TEXT NOT NULL,
        student_name TEXT NOT NULL,
        room_number TEXT NOT NULL,
        block TEXT NOT NULL,
        category TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        image_url TEXT,
        status TEXT DEFAULT 'logged',
        logged_at TEXT NOT NULL,
        sla_deadline TEXT NOT NULL,
        is_overdue INTEGER DEFAULT 0,
        technician_assigned TEXT,
        resolution_notes TEXT
    )
    """)

    # 7. Mess Menu & Ratings Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS mess_ratings (
        id TEXT PRIMARY KEY,
        day TEXT NOT NULL,
        meal_type TEXT NOT NULL,
        items TEXT NOT NULL,
        average_rating REAL DEFAULT 4.5,
        total_ratings INTEGER DEFAULT 150
    )
    """)

    # 8. Attendance Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS attendance (
        id TEXT PRIMARY KEY,
        student_id TEXT NOT NULL,
        roll_number TEXT NOT NULL,
        date TEXT NOT NULL,
        status TEXT NOT NULL,
        verified_by TEXT DEFAULT 'warden_portal'
    )
    """)

    conn.commit()

    # Seed Database if empty
    cursor.execute("SELECT COUNT(*) FROM users")
    user_count = cursor.fetchone()[0]

    if user_count == 0:
        seed_database(cursor, conn)

    conn.close()

def seed_database(cursor, conn):
    print("Initializing and seeding Hostel Management SQLite Database...")

    # 1. Seed Admin
    cursor.execute("""
    INSERT INTO users (id, name, email, password, role, phone)
    VALUES ('ADM-1001', 'Dr. Rajesh Mehta', 'admin@hostel.edu', 'admin123', 'admin', '+91 98000 11111')
    """)

    # 2. Seed 5 Wardens
    wardens_data = [
        ('WRD-501', 'Mr. Rameshwar Sharma', 'warden1@hostel.edu', 'warden123', 'StayWell Boys Wing', 'Evening', '+91 98234 56781'),
        ('WRD-502', 'Mrs. Sunita Rao', 'warden2@hostel.edu', 'warden123', 'StayWell Girls Wing', 'Morning', '+91 98234 56782'),
        ('WRD-503', 'Mr. Suresh Patel', 'warden3@hostel.edu', 'warden123', 'StayWell Boys Wing', 'Morning', '+91 98234 56783'),
        ('WRD-504', 'Mrs. Priya Nair', 'warden4@hostel.edu', 'warden123', 'StayWell Girls Wing', 'Evening', '+91 98234 56784'),
        ('WRD-505', 'Mr. Vikram Singh', 'warden5@hostel.edu', 'warden123', 'StayWell Boys Wing', 'Night', '+91 98234 56785'),
    ]

    for w_id, w_name, w_email, w_pass, w_block, w_shift, w_phone in wardens_data:
        cursor.execute("INSERT INTO users (id, name, email, password, role, phone) VALUES (?, ?, ?, ?, 'warden', ?)",
                       (w_id, w_name, w_email, w_pass, w_phone))
        cursor.execute("INSERT INTO wardens (id, user_id, name, email, contact, assigned_block, shift) VALUES (?, ?, ?, ?, ?, ?, ?)",
                       (w_id, w_id, w_name, w_email, w_phone, w_block, w_shift))

    # 3. Seed Rooms (Boys Block & Girls Block, 17 rooms each = 51 beds capacity each)
    room_numbers = ['101', '102', '103', '104', '105', '201', '202', '203', '204', '205', '301', '302', '303', '304', '305', '306', '307']
    for r_num in room_numbers:
        floor = int(r_num[0])
        cursor.execute("INSERT INTO rooms (id, room_number, block, floor, capacity, occupied) VALUES (?, ?, ?, ?, 3, 0)",
                       (f"ROOM-B-{r_num}", r_num, 'StayWell Boys Wing', floor))
        cursor.execute("INSERT INTO rooms (id, room_number, block, floor, capacity, occupied) VALUES (?, ?, ?, ?, 3, 0)",
                       (f"ROOM-G-{r_num}", r_num, 'StayWell Girls Wing', floor))

    # 4. Seed 100 Students (50 Boys in StayWell Boys Wing, 50 Girls in StayWell Girls Wing)
    boy_names = [
        'Yash Bhaveshbhai Vaghani', 'Harsh Parmar', 'Rohan Patel', 'Aman Verma', 'Karan Johar',
        'Aditya Sharma', 'Praveen Kumar', 'Siddharth Malhotra', 'Nikhil Rao', 'Gaurav Tiwari',
        'Tanmay Joshi', 'Vikas Singhal', 'Abhishek Gupta', 'Deepak Verma', 'Manish Pandey',
        'Rahul Dravid', 'Sachin Tendulkar', 'Virat Kohli', 'Rohit Sharma', 'Hardik Pandya',
        'Ravindra Jadeja', 'Jasprit Bumrah', 'Shubman Gill', 'Rishabh Pant', 'Shreyas Iyer',
        'KL Rahul', 'Mohammed Shami', 'Kuldeep Yadav', 'Yuzvendra Chahal', 'Axar Patel',
        'Ishant Sharma', 'Ajinkya Rahane', 'Cheteshwar Pujara', 'Umesh Yadav', 'Suryakumar Yadav',
        'Prithvi Shaw', 'Devdutt Padikkal', 'Ruturaj Gaikwad', 'Arshdeep Singh', 'Umran Malik',
        'Washington Sundar', 'Deepak Chahar', 'Shardul Thakur', 'Avesh Khan', 'Sanju Samson',
        'Ishan Kishan', 'Shivam Dube', 'Tilak Varma', 'Rinku Singh', 'Yashasvi Jaiswal'
    ]

    girl_names = [
        'Ananya Sharma', 'Priya Patel', 'Sneha Reddy', 'Ritu Desai', 'Kavita Iyer',
        'Pooja Verma', 'Neha Singh', 'Tanvi Mehta', 'Divya Nair', 'Swati Bhatt',
        'Simran Kaur', 'Meera Joshi', 'Rhea Chakraborty', 'Aishwarya Roy', 'Deepika Padukone',
        'Anushka Sharma', 'Alia Bhatt', 'Katrina Kaif', 'Kareena Kapoor', 'Priyanka Chopra',
        'Shraddha Kapoor', 'Kriti Sanon', 'Kiara Advani', 'Sara Ali Khan', 'Janhvi Kapoor',
        'Disha Patani', 'Taapsee Pannu', 'Bhumi Pednekar', 'Yami Gautam', 'Vidya Balan',
        'Sonam Kapoor', 'Parineeti Chopra', 'Huma Qureshi', 'Radhika Apte', 'Sanya Malhotra',
        'Fatima Sana Shaikh', 'Mrunal Thakur', 'Tara Sutaria', 'Ananya Panday', 'Rashmika Mandanna',
        'Samantha Ruth Prabhu', 'Nayanthara Kurian', 'Trisha Krishnan', 'Keerthy Suresh', 'Sai Pallavi',
        'Pooja Hegde', 'Tamannaah Bhatia', 'Kajal Aggarwal', 'Rakul Preet Singh', 'Ileana D\'Cruz'
    ]

    branches_config = [
        ('BCB', ['24', '25', '26']),
        ('ICT', ['22', '23', '24', '25', '26']),
        ('BCP', ['22', '23', '24', '25', '26']),
        ('IEE', ['22', '23', '24', '25', '26'])
    ]

    # Insert 50 Boys
    for idx, name in enumerate(boy_names):
        s_id = f"STU-B-{100 + idx}"
        if idx == 0:
            roll = '24BCB044'
            branch = 'BCB'
            batch = '2024'
        elif idx == 1:
            roll = '24BCB041'
            branch = 'BCB'
            batch = '2024'
        else:
            b_tuple = branches_config[idx % len(branches_config)]
            branch = b_tuple[0]
            year = b_tuple[1][(idx // len(branches_config)) % len(b_tuple[1])]
            batch = f"20{year}"
            roll = f"{year}{branch}{str(10 + idx).zfill(3)}"

        email = f"{name.lower().replace(' ', '.')}@hostel.edu"
        room = '304' if idx < 3 else str(101 + (idx // 3))
        bed = f"Bed {(idx % 3) + 1}"
        div = 'div 1 – (j2)' if idx == 0 else ('div 1' if idx % 2 == 0 else 'div 2')
        phone = f"+91 987{str(10000 + idx).zfill(5)}"
        parent_phone = f"+91 981{str(20000 + idx).zfill(5)}"

        cursor.execute("INSERT INTO users (id, name, email, password, role, phone) VALUES (?, ?, ?, 'student123', 'student', ?)",
                       (s_id, name, email, phone))
        cursor.execute("""
        INSERT INTO students (id, user_id, name, roll_number, gender, block, room_number, bed_number, division, branch, batch, contact, guardian_contact, fee_total, fee_paid, fee_due)
        VALUES (?, ?, ?, ?, 'male', 'StayWell Boys Wing', ?, ?, ?, ?, ?, ?, ?, 75000, 40000, 35000)
        """, (s_id, s_id, name, roll, room, bed, div, branch, batch, phone, parent_phone))

    # Insert 50 Girls
    for idx, name in enumerate(girl_names):
        s_id = f"STU-G-{200 + idx}"
        b_tuple = branches_config[(idx + 1) % len(branches_config)]
        branch = b_tuple[0]
        year = b_tuple[1][((idx + 1) // len(branches_config)) % len(b_tuple[1])]
        batch = f"20{year}"
        roll = f"{year}{branch}{str(100 + idx).zfill(3)}"

        email = f"{name.lower().replace(' ', '.')}@hostel.edu"
        room = str(101 + (idx // 3))
        bed = f"Bed {(idx % 3) + 1}"
        div = 'div 1' if idx % 2 == 0 else 'div 2'
        phone = f"+91 986{str(30000 + idx).zfill(5)}"
        parent_phone = f"+91 982{str(40000 + idx).zfill(5)}"

        cursor.execute("INSERT INTO users (id, name, email, password, role, phone) VALUES (?, ?, ?, 'student123', 'student', ?)",
                       (s_id, name, email, phone))
        cursor.execute("""
        INSERT INTO students (id, user_id, name, roll_number, gender, block, room_number, bed_number, division, branch, batch, contact, guardian_contact, fee_total, fee_paid, fee_due)
        VALUES (?, ?, ?, ?, 'female', 'StayWell Girls Wing', ?, ?, ?, ?, ?, ?, ?, 75000, 45000, 30000)
        """, (s_id, s_id, name, roll, room, bed, div, branch, batch, phone, parent_phone))

    # Update Room Occupancy numbers
    cursor.execute("""
    UPDATE rooms SET occupied = (
        SELECT COUNT(*) FROM students WHERE students.room_number = rooms.room_number AND students.block = rooms.block
    )
    """)

    # 5. Seed Initial OutPasses (including late curfew request)
    cursor.execute("""
    INSERT INTO outpasses (id, student_id, student_name, roll_number, room_number, block, pass_type, purpose, departure_time, expected_return_time, destination, is_curfew_hours, special_reason, parent_phone, status, applied_at)
    VALUES ('OP-8902', 'STU-B-100', 'Yash Bhaveshbhai Vaghani', '24BCB044', '304', 'StayWell Boys Wing', 'late_curfew_emergency',
            'University Software Engineering Lab Sprint Deployment', '2026-10-28 18:00', '2026-10-28 22:30',
            'CS Computer Lab 3', 1, 'Urgent system deployment and testing with Product Owner Harsh Parmar.',
            '+91 98120000', 'under_review', '2026-10-28 10:30')
    """)

    cursor.execute("""
    INSERT INTO outpasses (id, student_id, student_name, roll_number, room_number, block, pass_type, purpose, departure_time, expected_return_time, destination, is_curfew_hours, status, applied_at, warden_comments)
    VALUES ('OP-8840', 'STU-B-100', 'Yash Bhaveshbhai Vaghani', '24BCB044', '304', 'StayWell Boys Wing', 'day_pass',
            'Central Library study', '2026-10-25 14:00', '2026-10-25 19:00',
            'Library Hall', 0, 'checked_in', '2026-10-25 11:00', 'Approved. Returned on time.')
    """)

    # 6. Seed Complaints (including 48h SLA Escalation breach)
    cursor.execute("""
    INSERT INTO complaints (id, student_id, student_name, room_number, block, category, title, description, status, logged_at, sla_deadline, is_overdue, technician_assigned)
    VALUES ('CMP-401', 'STU-B-100', 'Yash Bhaveshbhai Vaghani', '304', 'StayWell Boys Wing', 'plumbing',
            'Bathroom sink faucet continuous drip', 'Faucet handle loose and water leaks constantly.',
            'in_progress', '2026-10-27 14:00:00', '2026-10-29 14:00:00', 0, 'Ramesh Kumar (Plumber)')
    """)

    cursor.execute("""
    INSERT INTO complaints (id, student_id, student_name, room_number, block, category, title, description, status, logged_at, sla_deadline, is_overdue, technician_assigned)
    VALUES ('CMP-395', 'STU-B-103', 'Aman Verma', '201', 'StayWell Boys Wing', 'wifi',
            'Block B 2nd Floor Wi-Fi router reboot loop', 'Cannot connect to hostel LAN or access study portal.',
            'escalated_sla', '2026-10-25 08:00:00', '2026-10-27 08:00:00', 1, 'Senior NOC Tech')
    """)

    # 7. Seed Mess Items
    mess_items = [
        ('MESS-1', 'Wednesday', 'Breakfast', 'Poha with Sev, Boiled Eggs / Bananas, Bread & Jam, Masala Tea, Filter Coffee', 4.3, 184),
        ('MESS-2', 'Wednesday', 'Lunch', 'Paneer Butter Masala, Dal Tadka, Jeera Rice, Butter Roti, Cucumber Salad, Papad', 4.6, 210),
        ('MESS-3', 'Wednesday', 'Snacks', 'Crispy Samosa (2 pcs), Tamarind & Mint Chutney, Hot Ginger Tea', 4.1, 165),
        ('MESS-4', 'Wednesday', 'Dinner', 'Mix Vegetable Curry, Dal Fry, Steamed Rice, Tawa Chapati, Hot Gulab Jamun', 4.5, 195),
    ]
    for m_id, day, m_type, items, rating, count in mess_items:
        cursor.execute("INSERT INTO mess_ratings (id, day, meal_type, items, average_rating, total_ratings) VALUES (?, ?, ?, ?, ?, ?)",
                       (m_id, day, m_type, items, rating, count))

    conn.commit()
    print("Database successfully initialized with 100 Students, 5 Wardens, 1 Admin, 34 Rooms, and Seed Records.")

if __name__ == "__main__":
    init_db()
