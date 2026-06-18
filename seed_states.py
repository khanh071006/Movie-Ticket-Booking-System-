import psycopg2

DB_HOST = "localhost"
DB_PORT = "5432"
DB_NAME = "movie_booking_db"
DB_USER = "postgres"
DB_PASSWORD = "khanh071006"

states = [
    "Đang hoạt động",
    "Bảo trì",
    "Tạm ngừng",
    "Ngừng hoạt động",
    "Sắp khai trương"
]

def seed_states():
    try:
        conn = psycopg2.connect(host=DB_HOST, port=DB_PORT, dbname=DB_NAME, user=DB_USER, password=DB_PASSWORD)
        cursor = conn.cursor()
        
        print("Đang đổ dữ liệu trạng thái rạp...")
        
        count = 0
        for state in states:
            try:
                cursor.execute("SELECT id FROM state WHERE name = %s", (state,))
                if not cursor.fetchone():
                    cursor.execute("INSERT INTO state (name) VALUES (%s)", (state,))
                    if cursor.rowcount > 0:
                        count += 1
            except Exception as e:
                print(f"Lỗi khi chèn {state}: {e}")
                
        # Update existing "Active" to "Đang hoạt động" if needed
        cursor.execute("UPDATE state SET name = 'Đang hoạt động' WHERE name = 'Active'")
                
        conn.commit()
        print(f"Đã chèn thành công {count} trạng thái mới vào database!")
        
    except psycopg2.Error as err:
        print(f"Lỗi kết nối CSDL PostgreSQL: {err}")
    finally:
        if 'conn' in locals() and conn:
            cursor.close()
            conn.close()

if __name__ == "__main__":
    seed_states()
