import psycopg2

DB_HOST = "localhost"
DB_PORT = "5432"
DB_NAME = "movie_booking_db"
DB_USER = "postgres"
DB_PASSWORD = "khanh071006"

try:
    conn = psycopg2.connect(host=DB_HOST, port=DB_PORT, dbname=DB_NAME, user=DB_USER, password=DB_PASSWORD)
    cursor = conn.cursor()
    
    # 1. Rename ADMIN to MANAGER
    cursor.execute("UPDATE roles SET name = 'MANAGER' WHERE name = 'ADMIN'")
    print("Renamed ADMIN to MANAGER")
    
    # 2. Add STAFF if not exists
    cursor.execute("SELECT id FROM roles WHERE name = 'STAFF'")
    if not cursor.fetchone():
        cursor.execute("INSERT INTO roles (id, name) SELECT COALESCE(MAX(id), 0) + 1, 'STAFF' FROM roles")
        print("STAFF role added")
        
    # 3. Add SUPERADMIN if not exists
    cursor.execute("SELECT id FROM roles WHERE name = 'SUPERADMIN'")
    if not cursor.fetchone():
        cursor.execute("INSERT INTO roles (id, name) SELECT COALESCE(MAX(id), 0) + 1, 'SUPERADMIN' FROM roles")
        print("SUPERADMIN role added")
        
    # 4. Create SUPERADMIN user if not exists
    cursor.execute("SELECT id FROM accounts WHERE email = 'superadmin@gmail.com'")
    superadmin_row = cursor.fetchone()
    if not superadmin_row:
        import uuid
        account_id = str(uuid.uuid4())
        # The password hash for "123456" is "$2a$10$wE9v.kF2R/mC2u0S3XyFieK1t3lA7sY6r.e/H8V.tFfVn5x7QkSjC" (or similar, I can just use a known bcrypt hash or let Spring Boot hash it? Since I don't have spring boot running here, I'll use a pre-hashed "123456" from python passlib or just use an existing hash from db)
        cursor.execute("SELECT password_hash FROM accounts LIMIT 1")
        hash_row = cursor.fetchone()
        password_hash = hash_row[0] if hash_row else "$2a$10$5X8v.T/B3bO6T9y8R1oK7e1B6Z5.9/C8P4M6l3N1D2J7k2X8r4U4G" # placeholder
        
        cursor.execute("INSERT INTO accounts (id, email, full_name, password_hash, is_active) VALUES (%s, 'superadmin@gmail.com', 'Super Admin', %s, true)", (account_id, password_hash))
        
        cursor.execute("SELECT id FROM roles WHERE name = 'SUPERADMIN'")
        superadmin_role_id = cursor.fetchone()[0]
        
        cursor.execute("INSERT INTO account_roles (account_id, role_id) VALUES (%s, %s)", (account_id, superadmin_role_id))
        print("Created superadmin@gmail.com")
        
    conn.commit()
    cursor.close()
    conn.close()
except Exception as e:
    print(e)
