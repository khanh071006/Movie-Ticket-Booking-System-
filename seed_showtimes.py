import psycopg2
import uuid
import random
from datetime import datetime, timedelta

DB_HOST = "localhost"
DB_PORT = "5432"
DB_NAME = "movie_booking_db"
DB_USER = "postgres"
DB_PASSWORD = "khanh071006"

def seed_showtimes():
    conn = None
    try:
        conn = psycopg2.connect(host=DB_HOST, port=DB_PORT, dbname=DB_NAME, user=DB_USER, password=DB_PASSWORD)
        cursor = conn.cursor()

        # Get all movies with durations
        cursor.execute("SELECT id, duration_minutes FROM movies WHERE status_id = 1") # Lấy phim đang chiếu
        movies = cursor.fetchall()
        if not movies:
            cursor.execute("SELECT id, duration_minutes FROM movies")
            movies = cursor.fetchall()
            
        if not movies:
            print("Không có phim nào để tạo lịch chiếu!")
            return

        # Get all rooms
        cursor.execute("SELECT id, cinema_id FROM theatres")
        rooms = cursor.fetchall()

        print("Đang xóa các lịch chiếu cũ...")
        cursor.execute("TRUNCATE TABLE showtimes CASCADE")

        showtimes_to_insert = []
        base_date = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
        
        # We will generate showtimes for 7 days (today to today+6)
        days = 7
        
        # Typical start slots (hours)
        slots = [9, 12, 15, 18, 20, 22]

        print("Đang sinh dữ liệu lịch chiếu...")
        for room in rooms:
            room_id = room[0]
            cinema_id = room[1]
            
            # Pick a random movie for this room to show mostly
            # A room typically shows 1-2 movies per day
            room_movies = random.sample(movies, min(2, len(movies)))
            
            for day_offset in range(days):
                current_date = base_date + timedelta(days=day_offset)
                
                # Pick 4 random slots for this room on this day
                day_slots = random.sample(slots, 4)
                day_slots.sort()
                
                for hour in day_slots:
                    # Randomize minutes a bit
                    minute = random.choice([0, 15, 30])
                    start_time = current_date + timedelta(hours=hour, minutes=minute)
                    
                    movie = random.choice(room_movies)
                    movie_id = movie[0]
                    duration = movie[1] or 120
                    
                    end_time = start_time + timedelta(minutes=duration)
                    
                    showtime_id = str(uuid.uuid4())
                    
                    showtimes_to_insert.append((showtime_id, movie_id, room_id, start_time, end_time))

        print(f"Đã chuẩn bị {len(showtimes_to_insert)} suất chiếu. Bắt đầu chèn vào database (có thể mất vài giây)...")
        
        # Batch insert
        batch_size = 5000
        for i in range(0, len(showtimes_to_insert), batch_size):
            batch = showtimes_to_insert[i:i+batch_size]
            args_str = ','.join(cursor.mogrify("(%s,%s,%s,%s,%s)", x).decode("utf-8") for x in batch)
            cursor.execute(f"INSERT INTO showtimes (id, movie_id, theatre_id, start_time, end_time) VALUES {args_str}")

        conn.commit()
        print(f"✅ Đã tạo thành công {len(showtimes_to_insert)} lịch chiếu siêu khủng cho {len(rooms)} phòng chiếu trong 7 ngày tới!")

    except psycopg2.Error as err:
        print(f"Lỗi Database: {err}")
        if conn:
            conn.rollback()
    finally:
        if conn:
            cursor.close()
            conn.close()

if __name__ == "__main__":
    seed_showtimes()
