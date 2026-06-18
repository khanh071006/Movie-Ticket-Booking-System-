import psycopg2

DB_HOST = "localhost"
DB_PORT = "5432"
DB_NAME = "movie_booking_db"
DB_USER = "postgres"
DB_PASSWORD = "khanh071006"

def fix_image_urls():
    try:
        conn = psycopg2.connect(host=DB_HOST, port=DB_PORT, dbname=DB_NAME, user=DB_USER, password=DB_PASSWORD)
        cursor = conn.cursor()
        
        # We will prepend the wsrv.nl proxy to any amazon URLs
        proxy_prefix = "https://wsrv.nl/?url="
        
        # 1. Update movies
        cursor.execute("""
            UPDATE movies 
            SET poster_url = REPLACE(poster_url, 'https://m.media-amazon.com', 'https://wsrv.nl/?url=m.media-amazon.com')
            WHERE poster_url LIKE '%m.media-amazon.com%';
        """)
        print(f"Updated movies: {cursor.rowcount}")

        # 2. Update directors
        cursor.execute("""
            UPDATE directors 
            SET image_url = REPLACE(image_url, 'https://m.media-amazon.com', 'https://wsrv.nl/?url=m.media-amazon.com')
            WHERE image_url LIKE '%m.media-amazon.com%';
        """)
        print(f"Updated directors: {cursor.rowcount}")

        # 3. Update cast_members
        cursor.execute("""
            UPDATE cast_members 
            SET image_url = REPLACE(image_url, 'https://m.media-amazon.com', 'https://wsrv.nl/?url=m.media-amazon.com')
            WHERE image_url LIKE '%m.media-amazon.com%';
        """)
        print(f"Updated cast_members: {cursor.rowcount}")
        
        conn.commit()
        print("Đã sửa lỗi hiển thị ảnh thành công qua Image Proxy!")
        
    except psycopg2.Error as err:
        print(f"Lỗi: {err}")
    finally:
        if 'conn' in locals() and conn:
            cursor.close()
            conn.close()

if __name__ == "__main__":
    fix_image_urls()
