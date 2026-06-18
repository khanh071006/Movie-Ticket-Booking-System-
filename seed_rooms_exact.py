import psycopg2

DB_HOST = "localhost"
DB_PORT = "5432"
DB_NAME = "movie_booking_db"
DB_USER = "postgres"
DB_PASSWORD = "khanh071006"

def seed_exact_layouts():
    conn = None
    try:
        conn = psycopg2.connect(host=DB_HOST, port=DB_PORT, dbname=DB_NAME, user=DB_USER, password=DB_PASSWORD)
        cursor = conn.cursor()

        # 1. Ensure Seat Types exist
        cursor.execute("SELECT id, name FROM seat_type")
        existing_seat_types = {name: id for id, name in cursor.fetchall()}

        # 2. Get all rooms
        cursor.execute("SELECT id, theatre_num FROM theatres")
        rooms = cursor.fetchall()

        print("Đang xóa tất cả ghế cũ...")
        cursor.execute("TRUNCATE TABLE seats CASCADE")
        
        total_seats = 0
        batch_size = 5000
        seats_to_insert = []

        def flush_inserts():
            nonlocal total_seats, seats_to_insert
            if not seats_to_insert: return
            args_str = ','.join(cursor.mogrify("(%s,%s,%s)", x).decode("utf-8") for x in seats_to_insert)
            cursor.execute(f"INSERT INTO seats (seat_location, theatre_id, seat_type_id) VALUES {args_str}")
            total_seats += len(seats_to_insert)
            seats_to_insert = []

        for room_id, room_name in rooms:
            if "Standard" in room_name:
                # Rows A-E: 1-14 Thường
                for row in ['A','B','C','D','E']:
                    for col in range(1, 15):
                        seats_to_insert.append((f"{row}{col}", room_id, existing_seat_types["Thường"]))
                # Rows F-I: 1-2 Thường, 3-12 VIP, 13-14 Thường
                for row in ['F','G','H','I']:
                    for col in range(1, 15):
                        if 3 <= col <= 12:
                            seats_to_insert.append((f"{row}{col}", room_id, existing_seat_types["VIP"]))
                        else:
                            seats_to_insert.append((f"{row}{col}", room_id, existing_seat_types["Thường"]))
                # Rows J-L: 1-14 Thường
                for row in ['J','K','L']:
                    for col in range(1, 15):
                        seats_to_insert.append((f"{row}{col}", room_id, existing_seat_types["Thường"]))
                # Rows M-N: Couple
                for row in ['M','N']:
                    for col in range(1, 15, 2):
                        seats_to_insert.append((f"{row}{col}", room_id, existing_seat_types["Couple"]))

            elif "VIP" in room_name:
                # Rows A-C: 1-8 Thường
                for row in ['A','B','C']:
                    for col in range(1, 9):
                        seats_to_insert.append((f"{row}{col}", room_id, existing_seat_types["Thường"]))
                # Rows D-F: 1-8 VIP
                for row in ['D','E','F']:
                    for col in range(1, 9):
                        seats_to_insert.append((f"{row}{col}", room_id, existing_seat_types["VIP"]))
                # Rows G-H: Couple
                for row in ['G','H']:
                    for col in range(1, 9, 2):
                        seats_to_insert.append((f"{row}{col}", room_id, existing_seat_types["Couple"]))

            elif "Couple" in room_name:
                # 1 row x 2 cols -> exactly 1 couple seat
                seats_to_insert.append(("A1", room_id, existing_seat_types["Couple"]))

            elif "Gia Đình" in room_name:
                # 2 rows x 4 cols, dung ghe VIP
                for row in ['A','B']:
                    for col in range(1, 5):
                        seats_to_insert.append((f"{row}{col}", room_id, existing_seat_types["VIP"]))

            if len(seats_to_insert) >= batch_size:
                flush_inserts()

        flush_inserts()
        conn.commit()
        print(f"✅ Đã tạo thành công cấu hình ghế siêu chuẩn cho {total_seats} ghế ngồi của {len(rooms)} phòng chiếu!")

    except psycopg2.Error as err:
        print(f"Lỗi Database: {err}")
        if conn:
            conn.rollback()
    finally:
        if conn:
            cursor.close()
            conn.close()

if __name__ == "__main__":
    seed_exact_layouts()
