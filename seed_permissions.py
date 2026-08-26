import psycopg2

DB_HOST = "localhost"
DB_PORT = "5432"
DB_NAME = "movie_booking_db"
DB_USER = "postgres"
DB_PASSWORD = "khanh071006"

permissions = [
    ("ACCOUNT", "CREATE", "ACCOUNT_CREATE"),
    ("ACCOUNT", "READ", "ACCOUNT_READ"),
    ("ACCOUNT", "UPDATE", "ACCOUNT_UPDATE"),
    ("ACCOUNT", "DELETE", "ACCOUNT_DELETE"),
    ("MOVIE", "CREATE", "MOVIE_CREATE"),
    ("MOVIE", "UPDATE", "MOVIE_UPDATE"),
    ("MOVIE", "DELETE", "MOVIE_DELETE"),
    ("CINEMA", "CREATE", "CINEMA_CREATE"),
    ("CINEMA", "READ", "CINEMA_READ"),
    ("CINEMA", "UPDATE", "CINEMA_UPDATE"),
    ("CINEMA", "DELETE", "CINEMA_DELETE"),
    ("ROOM", "CREATE", "ROOM_CREATE"),
    ("ROOM", "UPDATE", "ROOM_UPDATE"),
    ("ROOM", "DELETE", "ROOM_DELETE"),
    ("SHOWTIME", "CREATE", "SHOWTIME_CREATE"),
    ("SHOWTIME", "UPDATE", "SHOWTIME_UPDATE"),
    ("SHOWTIME", "DELETE", "SHOWTIME_DELETE"),
    ("SNACK", "CREATE", "SNACK_CREATE"),
    ("SNACK", "UPDATE", "SNACK_UPDATE"),
    ("SNACK", "DELETE", "SNACK_DELETE"),
    ("CATEGORY", "CREATE", "CATEGORY_CREATE"),
    ("CATEGORY", "UPDATE", "CATEGORY_UPDATE"),
    ("CATEGORY", "DELETE", "CATEGORY_DELETE"),
    ("CONFIG", "CREATE", "CONFIG_CREATE"),
    ("CONFIG", "UPDATE", "CONFIG_UPDATE"),
    ("CONFIG", "DELETE", "CONFIG_DELETE"),
    ("BOOKING", "CREATE", "BOOKING_CREATE"),
    ("BOOKING", "READ", "BOOKING_READ"),
    ("BOOKING", "CHECKIN", "BOOKING_CHECKIN"),
    ("REPORT", "VIEW", "REPORT_VIEW"),
    ("PRICING", "MANAGE", "PRICING_MANAGE")
]

role_permissions_mapping = {
    "SUPERADMIN": [p[2] for p in permissions], # Gets ALL
    "MANAGER": ["ACCOUNT_READ", "ACCOUNT_UPDATE", "CINEMA_READ", "ROOM_CREATE", "ROOM_UPDATE", "ROOM_DELETE", "SHOWTIME_CREATE", "SHOWTIME_UPDATE", "SHOWTIME_DELETE", "SNACK_CREATE", "SNACK_UPDATE", "SNACK_DELETE", "BOOKING_READ", "BOOKING_CHECKIN", "REPORT_VIEW", "PRICING_MANAGE"],
    "STAFF": ["BOOKING_CHECKIN", "REPORT_VIEW", "BOOKING_READ"],
    "USER": ["BOOKING_CREATE", "BOOKING_READ", "ACCOUNT_READ", "ACCOUNT_UPDATE"]
}

try:
    conn = psycopg2.connect(host=DB_HOST, port=DB_PORT, dbname=DB_NAME, user=DB_USER, password=DB_PASSWORD)
    cursor = conn.cursor()
    
    # 1. Insert Permissions
    print("Inserting permissions...")
    for resource, action, code in permissions:
        cursor.execute("SELECT id FROM permissions WHERE code = %s", (code,))
        if not cursor.fetchone():
            cursor.execute("INSERT INTO permissions (resource, action, code) VALUES (%s, %s, %s)", (resource, action, code))
    
    # 2. Map Permissions to Roles
    print("Mapping permissions to roles...")
    for role_name, perms in role_permissions_mapping.items():
        cursor.execute("SELECT id FROM roles WHERE name = %s", (role_name,))
        role_row = cursor.fetchone()
        if not role_row:
            continue
        role_id = role_row[0]
        
        for p_code in perms:
            cursor.execute("SELECT id FROM permissions WHERE code = %s", (p_code,))
            perm_row = cursor.fetchone()
            if not perm_row:
                continue
            perm_id = perm_row[0]
            
            cursor.execute("SELECT id FROM role_permissions WHERE role_id = %s AND permission_id = %s", (role_id, perm_id))
            if not cursor.fetchone():
                cursor.execute("INSERT INTO role_permissions (role_id, permission_id) VALUES (%s, %s)", (role_id, perm_id))
                
    conn.commit()
    print("Successfully seeded permissions and role_permissions!")
    
    cursor.close()
    conn.close()
except Exception as e:
    print(f"Error: {e}")
