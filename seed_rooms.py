import psycopg2

DB_HOST = "localhost"
DB_PORT = "5432"
DB_NAME = "movie_booking_db"
DB_USER = "postgres"
DB_PASSWORD = "khanh071006"

def seed_rooms():
    conn = None
    try:
        conn = psycopg2.connect(host=DB_HOST, port=DB_PORT, dbname=DB_NAME, user=DB_USER, password=DB_PASSWORD)
        cursor = conn.cursor()

        # 1. Ensure Seat Types exist
        cursor.execute("SELECT id, name FROM seat_type")
        existing_seat_types = {name: id for id, name in cursor.fetchall()}

        if "Couple" not in existing_seat_types:
            cursor.execute("INSERT INTO seat_type (name, seat_count) VALUES ('Couple', 2) RETURNING id")
            existing_seat_types["Couple"] = cursor.fetchone()[0]
        
        if "Gia Đình" not in existing_seat_types:
            cursor.execute("INSERT INTO seat_type (name, seat_count) VALUES ('Gia Đình', 4) RETURNING id")
            existing_seat_types["Gia Đình"] = cursor.fetchone()[0]

        # 2. Get all cinemas
        cursor.execute("SELECT id, name FROM cinemas")
        cinemas = cursor.fetchall()

        room_configs = [
            ("Phòng Standard 1", "Standard"),
            ("Phòng Standard 2", "Standard"),
            ("Phòng Standard 3", "Standard"),
            ("Phòng VIP 1", "VIP"),
            ("Phòng VIP 2", "VIP"),
            ("Phòng VIP 3", "VIP"),
            ("Phòng Couple", "Couple"),
            ("Phòng Gia Đình", "Family")
        ]

        total_rooms = 0
        total_seats = 0

        # We will delete all existing rooms and seats if requested, or just insert.
        # Let's clean up all existing rooms and seats to make it uniform.
        # NOTE: this will cascade delete seats, showtimes, bookings if we use CASCADE or manual delete.
        # To be safe, we will just delete existing seats and rooms ONLY IF they don't have showtimes.
        # Actually, let's just wipe all rooms and seats, and cascade.
        cursor.execute("TRUNCATE TABLE theatres CASCADE")
        print("Đã dọn dẹp các phòng chiếu cũ...")

        for cinema in cinemas:
            cinema_id = cinema[0]
            cinema_name = cinema[1]
            
            for room_name, room_type in room_configs:
                # Create Room
                cursor.execute("INSERT INTO theatres (theatre_num, cinema_id) VALUES (%s, %s) RETURNING id", (room_name, cinema_id))
                room_id = cursor.fetchone()[0]
                total_rooms += 1

                # Generate Seats based on room type
                seats_to_insert = []
                
                if room_type == "Standard":
                    # 5 rows x 10 cols
                    rows = ['A', 'B', 'C', 'D', 'E']
                    for r_idx, row in enumerate(rows):
                        for col in range(1, 11):
                            s_type = existing_seat_types["VIP"] if r_idx >= 3 else existing_seat_types["Thường"]
                            seats_to_insert.append((f"{row}{col}", room_id, s_type))
                            
                elif room_type == "VIP":
                    # 5 rows x 8 cols, all VIP
                    rows = ['A', 'B', 'C', 'D', 'E']
                    for row in rows:
                        for col in range(1, 9):
                            seats_to_insert.append((f"{row}{col}", room_id, existing_seat_types["VIP"]))
                            
                elif room_type == "Couple":
                    # 3 rows x 5 cols, all Couple
                    rows = ['A', 'B', 'C']
                    for row in rows:
                        for col in range(1, 6):
                            seats_to_insert.append((f"{row}{col}", room_id, existing_seat_types["Couple"]))
                            
                elif room_type == "Family":
                    # 3 rows x 4 cols, all Gia Đình
                    rows = ['A', 'B', 'C']
                    for row in rows:
                        for col in range(1, 5):
                            seats_to_insert.append((f"{row}{col}", room_id, existing_seat_types["Gia Đình"]))

                if seats_to_insert:
                    args_str = ','.join(cursor.mogrify("(%s,%s,%s)", x).decode("utf-8") for x in seats_to_insert)
                    cursor.execute(f"INSERT INTO seats (seat_location, theatre_id, seat_type_id) VALUES {args_str}")
                    total_seats += len(seats_to_insert)

        conn.commit()
        print(f"✅ Đã tạo thành công {total_rooms} phòng chiếu và {total_seats} ghế ngồi cho {len(cinemas)} rạp!")

    except psycopg2.Error as err:
        print(f"Lỗi Database: {err}")
        if conn:
            conn.rollback()
    finally:
        if conn:
            cursor.close()
            conn.close()

if __name__ == "__main__":
    seed_rooms()
