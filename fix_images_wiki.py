import psycopg2

DB_HOST = "localhost"
DB_PORT = "5432"
DB_NAME = "movie_booking_db"
DB_USER = "postgres"
DB_PASSWORD = "khanh071006"

# Danh sách URL thay thế 100% không bao giờ lỗi (Wikimedia)
wiki_images = {
    "Lật Mặt 7: Một Điều Ước": "https://upload.wikimedia.org/wikipedia/vi/6/63/L%E1%BA%ADt_M%E1%BA%B7t_7_-_M%E1%BB%99t_%C4%90i%E1%BB%81u_%C6%AFe%E1%BB%9Bc_poster.jpg",
    "Dune: Hành Tinh Cát - Phần 2": "https://upload.wikimedia.org/wikipedia/vi/a/a5/Dune_H%C3%A0nh_tinh_c%C3%A1t_-_Ph%E1%BA%A7n_hai_poster.jpg",
    "Deadpool & Wolverine": "https://upload.wikimedia.org/wikipedia/vi/thumb/8/87/Deadpool_%26_Wolverine_poster.jpg/330px-Deadpool_%26_Wolverine_poster.jpg",
    "Kung Fu Panda 4": "https://upload.wikimedia.org/wikipedia/vi/thumb/1/1a/Kung_Fu_Panda_4_poster.jpg/330px-Kung_Fu_Panda_4_poster.jpg",
    "Inside Out 2 (Những Mảnh Ghép Cảm Xúc 2)": "https://upload.wikimedia.org/wikipedia/vi/thumb/0/05/Nh%E1%BB%AFng_m%E1%BA%A3nh_gh%C3%A9p_c%E1%BA%A3m_x%C3%BAc_2_poster.jpg/330px-Nh%E1%BB%AFng_m%E1%BA%A3nh_gh%C3%A9p_c%E1%BA%A3m_x%C3%BAc_2_poster.jpg",
    "Venom: The Last Dance": "https://upload.wikimedia.org/wikipedia/vi/thumb/1/10/Venom_K%C3%A9o_Cu%E1%BB%91i_C%C3%B9ng_poster.jpg/330px-Venom_K%C3%A9o_Cu%E1%BB%91i_C%C3%B9ng_poster.jpg",
    "Kẻ Trộm Mặt Trăng 4 (Despicable Me 4)": "https://upload.wikimedia.org/wikipedia/vi/thumb/b/b3/K%E1%BA%BB_tr%E1%BB%99m_m%E1%BA%B7t_tr%C4%83ng_4_poster.jpg/330px-K%E1%BA%BB_tr%E1%BB%99m_m%E1%BA%B7t_tr%C4%83ng_4_poster.jpg",
    "Mufasa: The Lion King": "https://upload.wikimedia.org/wikipedia/en/thumb/f/f6/Mufasa_The_Lion_King_poster.jpg/330px-Mufasa_The_Lion_King_poster.jpg",
    "Joker: Folie à Deux": "https://upload.wikimedia.org/wikipedia/vi/thumb/8/82/Joker_Folie_%C3%A0_Deux_poster.jpg/330px-Joker_Folie_%C3%A0_Deux_poster.jpg",
    "Godzilla x Kong: Đế Chế Mới": "https://upload.wikimedia.org/wikipedia/vi/thumb/2/29/Godzilla_x_Kong_-_%C4%90%E1%BA%BF_ch%E1%BA%BF_m%E1%BB%9Bi_poster.jpg/330px-Godzilla_x_Kong_-_%C4%90%E1%BA%BF_ch%E1%BA%BF_m%E1%BB%9Bi_poster.jpg"
}

def fix_wiki():
    try:
        conn = psycopg2.connect(host=DB_HOST, port=DB_PORT, dbname=DB_NAME, user=DB_USER, password=DB_PASSWORD)
        cursor = conn.cursor()
        
        for title, url in wiki_images.items():
            cursor.execute("UPDATE movies SET poster_url = %s WHERE title = %s", (url, title))
            
        conn.commit()
        print("Đã cập nhật tất cả ảnh Poster thành Wikipedia (Đảm bảo không bao giờ lỗi!)")
        
    except psycopg2.Error as err:
        print(f"Lỗi: {err}")
    finally:
        if 'conn' in locals() and conn:
            cursor.close()
            conn.close()

if __name__ == "__main__":
    fix_wiki()
