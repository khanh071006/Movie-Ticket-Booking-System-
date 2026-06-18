import psycopg2

DB_HOST = "localhost"
DB_PORT = "5432"
DB_NAME = "movie_booking_db"
DB_USER = "postgres"
DB_PASSWORD = "khanh071006"

genres = [
    "Hành động (Action)",
    "Phiêu lưu (Adventure)",
    "Hài hước (Comedy)",
    "Tình cảm (Romance)",
    "Kinh dị (Horror)",
    "Giật gân (Thriller)",
    "Viễn tưởng (Sci-Fi)",
    "Kỳ ảo (Fantasy)",
    "Hoạt hình (Animation)",
    "Tài liệu (Documentary)",
    "Tâm lý (Drama)",
    "Trinh thám (Mystery)",
    "Hình sự (Crime)",
    "Tiểu sử (Biography)",
    "Lịch sử (History)",
    "Chiến tranh (War)",
    "Âm nhạc (Music)",
    "Nhạc kịch (Musical)",
    "Gia đình (Family)",
    "Thể thao (Sport)",
    "Cổ trang (Historical Fiction)",
    "Thần thoại (Mythology)",
    "Học đường (Teen/School)",
    "Võ thuật (Martial Arts)",
    "Miền Tây (Western)",
    "Bí ẩn (Supernatural)",
    "Siêu anh hùng (Superhero)",
    "Thảm họa (Disaster)",
    "Đen tối (Noir)",
    "Hài kịch đen (Black Comedy)"
]

def seed_genres():
    try:
        conn = psycopg2.connect(host=DB_HOST, port=DB_PORT, dbname=DB_NAME, user=DB_USER, password=DB_PASSWORD)
        cursor = conn.cursor()
        
        print("Đang kết nối PostgreSQL để đổ dữ liệu thể loại phim...")
        
        count = 0
        for genre in genres:
            try:
                # Dùng ON CONFLICT DO NOTHING để bỏ qua nếu đã tồn tại
                cursor.execute(
                    "INSERT INTO genres (name) VALUES (%s) ON CONFLICT (name) DO NOTHING", 
                    (genre,)
                )
                if cursor.rowcount > 0:
                    count += 1
            except Exception as e:
                print(f"Lỗi khi chèn {genre}: {e}")
                
        conn.commit()
        print(f"Đã chèn thành công {count} thể loại phim mới vào database!")
        
    except psycopg2.Error as err:
        print(f"Lỗi kết nối CSDL PostgreSQL: {err}")
    finally:
        if 'conn' in locals() and conn:
            cursor.close()
            conn.close()

if __name__ == "__main__":
    seed_genres()
