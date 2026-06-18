import psycopg2
import uuid
import re
import unicodedata

DB_HOST = "localhost"
DB_PORT = "5432"
DB_NAME = "movie_booking_db"
DB_USER = "postgres"
DB_PASSWORD = "khanh071006"

provinces = [
    "An Giang", "Bà Rịa - Vũng Tàu", "Bắc Giang", "Bắc Kạn", "Bạc Liêu", "Bắc Ninh", "Bến Tre", "Bình Định", "Bình Dương", "Bình Phước", "Bình Thuận", "Cà Mau", "Cần Thơ", "Cao Bằng", "Đà Nẵng", "Đắk Lắk", "Đắk Nông", "Điện Biên", "Đồng Nai", "Đồng Tháp", "Gia Lai", "Hà Giang", "Hà Nam", "Hà Nội", "Hà Tĩnh", "Hải Dương", "Hải Phòng", "Hậu Giang", "Hòa Bình", "Hưng Yên", "Khánh Hòa", "Kiên Giang", "Kon Tum", "Lai Châu", "Lâm Đồng", "Lạng Sơn", "Lào Cai", "Long An", "Nam Định", "Nghệ An", "Ninh Bình", "Ninh Thuận", "Phú Thọ", "Phú Yên", "Quảng Bình", "Quảng Nam", "Quảng Ngãi", "Quảng Ninh", "Quảng Trị", "Sóc Trăng", "Sơn La", "Tây Ninh", "Thái Bình", "Thái Nguyên", "Thanh Hóa", "Thừa Thiên Huế", "Tiền Giang", "TP.HCM", "Trà Vinh", "Tuyên Quang", "Vĩnh Long", "Vĩnh Phúc", "Yên Bái"
]

def remove_accents(input_str):
    s1 = unicodedata.normalize('NFKD', input_str).encode('ASCII', 'ignore').decode('utf-8')
    return re.sub(r'[^a-zA-Z0-9]', '', s1).lower()

try:
    conn = psycopg2.connect(host=DB_HOST, port=DB_PORT, dbname=DB_NAME, user=DB_USER, password=DB_PASSWORD)
    cursor = conn.cursor()

    # Get roles from DB
    cursor.execute("SELECT id, name FROM roles")
    roles = {row[1]: row[0] for row in cursor.fetchall()}
    
    # Check if SUPERADMIN, MANAGER, STAFF exist, if not we need to wait for spring boot or seed_role to create them, or create them here.
    # We will create them if missing.
    roles_needed = ["SUPERADMIN", "MANAGER", "STAFF"]
    for role in roles_needed:
        if role not in roles:
            cursor.execute("INSERT INTO roles (name) VALUES (%s) RETURNING id", (role,))
            roles[role] = cursor.fetchone()[0]
            print(f"Role {role} added")

    # Valid Spring BCrypt Hash for '123456'
    password_hash = "$2a$12$Z2.GIf0.T0eL6yD71Qh2/.7H9xI6Xh30fR1P.T8i2J.gY0gI8Gk3a"

    # 1. Insert SUPERADMIN
    cursor.execute("SELECT id FROM accounts WHERE email = 'superadmin@gmail.com'")
    if not cursor.fetchone():
        acc_id = str(uuid.uuid4())
        cursor.execute("INSERT INTO accounts (id, email, full_name, password_hash, is_active) VALUES (%s, %s, %s, %s, %s)", 
                       (acc_id, 'superadmin@gmail.com', 'Super Admin', password_hash, True))
        cursor.execute("INSERT INTO account_roles (account_id, role_id) VALUES (%s, %s)", (acc_id, roles["SUPERADMIN"]))
        print("Created superadmin@gmail.com")

    # Fetch all cinemas and group by province
    cursor.execute("SELECT id, city FROM cinemas ORDER BY name ASC")
    all_cinemas = cursor.fetchall()
    prov_cinemas_map = {}
    for c_id, c_city in all_cinemas:
        if c_city not in prov_cinemas_map:
            prov_cinemas_map[c_city] = []
        prov_cinemas_map[c_city].append(c_id)

    # 2 & 3. Manager and Staff for 63 provinces
    for prov in provinces:
        clean_prov = remove_accents(prov)
        c_list = prov_cinemas_map.get(prov, [])
        
        for i in range(1, 4):
            c_id = c_list[i-1] if i-1 < len(c_list) else None

            # Manager
            mgr_email = f"manager_{clean_prov}_{i}@gmail.com"
            cursor.execute("SELECT id FROM accounts WHERE email = %s", (mgr_email,))
            if not cursor.fetchone():
                acc_id = str(uuid.uuid4())
                cursor.execute("INSERT INTO accounts (id, email, full_name, password_hash, is_active, cinema_id) VALUES (%s, %s, %s, %s, %s, %s)", 
                               (acc_id, mgr_email, f"Manager {prov} {i}", password_hash, True, c_id))
                cursor.execute("INSERT INTO account_roles (account_id, role_id) VALUES (%s, %s)", (acc_id, roles["MANAGER"]))
            else:
                cursor.execute("UPDATE accounts SET cinema_id = %s WHERE email = %s", (c_id, mgr_email))
            
            # Staff
            staff_email = f"staff_{clean_prov}_{i}@gmail.com"
            cursor.execute("SELECT id FROM accounts WHERE email = %s", (staff_email,))
            if not cursor.fetchone():
                acc_id = str(uuid.uuid4())
                cursor.execute("INSERT INTO accounts (id, email, full_name, password_hash, is_active, cinema_id) VALUES (%s, %s, %s, %s, %s, %s)", 
                               (acc_id, staff_email, f"Staff {prov} {i}", password_hash, True, c_id))
                cursor.execute("INSERT INTO account_roles (account_id, role_id) VALUES (%s, %s)", (acc_id, roles["STAFF"]))
            else:
                cursor.execute("UPDATE accounts SET cinema_id = %s WHERE email = %s", (c_id, staff_email))

    conn.commit()
    cursor.close()
    conn.close()
    print("Done seeding superadmin, managers and staff accounts.")
except Exception as e:
    print("Error:", e)
