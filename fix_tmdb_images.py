import psycopg2

DB_HOST = "localhost"
DB_PORT = "5432"
DB_NAME = "movie_booking_db"
DB_USER = "postgres"
DB_PASSWORD = "khanh071006"

def fix_tmdb_urls():
    try:
        conn = psycopg2.connect(host=DB_HOST, port=DB_PORT, dbname=DB_NAME, user=DB_USER, password=DB_PASSWORD)
        cursor = conn.cursor()
        
        # We will prepend the wsrv.nl proxy to any tmdb URLs
        # image.tmdb.org/t/p/w500/... -> wsrv.nl/?url=image.tmdb.org/t/p/w500/...
        
        # 1. Update movies
        cursor.execute("""
            UPDATE movies 
            SET poster_url = REPLACE(poster_url, 'https://image.tmdb.org', 'https://wsrv.nl/?url=image.tmdb.org')
            WHERE poster_url LIKE '%image.tmdb.org%';
        """)
        m_count = cursor.rowcount

        # 2. Update directors
        cursor.execute("""
            UPDATE directors 
            SET image_url = REPLACE(image_url, 'https://image.tmdb.org', 'https://wsrv.nl/?url=image.tmdb.org')
            WHERE image_url LIKE '%image.tmdb.org%';
        """)
        d_count = cursor.rowcount

        # 3. Update cast_members
        cursor.execute("""
            UPDATE cast_members 
            SET image_url = REPLACE(image_url, 'https://image.tmdb.org', 'https://wsrv.nl/?url=image.tmdb.org')
            WHERE image_url LIKE '%image.tmdb.org%';
        """)
        c_count = cursor.rowcount
        
        conn.commit()
        print(f"Da proxy qua wsrv.nl thanh cong! Movies: {m_count}, Directors: {d_count}, Cast: {c_count}")
        
    except psycopg2.Error as err:
        print(f"Loi: {err}")
    finally:
        if 'conn' in locals() and conn:
            cursor.close()
            conn.close()

if __name__ == "__main__":
    fix_tmdb_urls()
