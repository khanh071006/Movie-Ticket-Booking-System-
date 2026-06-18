import psycopg2
import uuid
from datetime import datetime, timedelta

DB_HOST = "localhost"
DB_PORT = "5432"
DB_NAME = "movie_booking_db"
DB_USER = "postgres"
DB_PASSWORD = "khanh071006"

def get_or_create_status(cursor, status_name):
    cursor.execute("SELECT id FROM movie_status WHERE name = %s", (status_name,))
    row = cursor.fetchone()
    if row: return row[0]
    cursor.execute("INSERT INTO movie_status (name) VALUES (%s) RETURNING id", (status_name,))
    return cursor.fetchone()[0]

def get_or_create_genre(cursor, genre_name):
    cursor.execute("SELECT id FROM genres WHERE name = %s", (genre_name,))
    row = cursor.fetchone()
    if row: return row[0]
    cursor.execute("INSERT INTO genres (name) VALUES (%s) RETURNING id", (genre_name,))
    return cursor.fetchone()[0]

def get_or_create_director(cursor, director):
    cursor.execute("SELECT id FROM directors WHERE name = %s", (director["name"],))
    row = cursor.fetchone()
    if row: return row[0]
    cursor.execute("INSERT INTO directors (name, image_url) VALUES (%s, %s) RETURNING id", 
                   (director["name"], director.get("img", "")))
    return cursor.fetchone()[0]

def get_or_create_cast(cursor, cast):
    cursor.execute("SELECT id FROM cast_members WHERE name = %s", (cast["name"],))
    row = cursor.fetchone()
    if row: return row[0]
    cursor.execute("INSERT INTO cast_members (name, image_url) VALUES (%s, %s) RETURNING id", 
                   (cast["name"], cast.get("img", "")))
    return cursor.fetchone()[0]

# --- Dữ Liệu Hardcode (Chuẩn 100%) ---
movies_data = [
    {
        "title": "Lật Mặt 7: Một Điều Ước",
        "description": "Câu chuyện cảm động về tình mẹ con, phản ánh chân thực cuộc sống gia đình Việt Nam hiện đại qua lăng kính đạo diễn Lý Hải.",
        "duration": 138,
        "release_date": "2024-04-26",
        "language": "Tiếng Việt",
        "age": 13,
        "poster": "https://m.media-amazon.com/images/M/MV5BN2UzN2M2ZmEtZWQ2ZC00NzBmLWI0MTctMTExZmJiYWRmMWM4XkEyXkFqcGdeQXVyMTE0MzQwOTUz._V1_FMjpg_UX1000_.jpg",
        "trailer": "https://www.youtube.com/watch?v=kYJ5zS-b9m0",
        "status": "Đang Chiếu",
        "director": {"name": "Lý Hải", "img": "https://upload.wikimedia.org/wikipedia/commons/e/e0/Lyhai.jpg"},
        "genres": ["Tâm lý (Drama)", "Gia đình (Family)", "Hài hước (Comedy)"],
        "casts": [
            {"name": "Thanh Hiền", "img": "https://media.vov.vn/sites/default/files/styles/large/public/2024-04/thanh-hien.jpg"},
            {"name": "Đinh Y Nhung", "img": "https://znews-photo.zingcdn.me/w660/Uploaded/mdf_eioxrd/2020_03_12/y_nhung_1.jpg"},
            {"name": "Trương Minh Cường", "img": "https://images.vietnamnet.vn/resimages/2019/11/12/10/01/truong-minh-cuong-2.jpg"}
        ]
    },
    {
        "title": "Dune: Hành Tinh Cát - Phần 2",
        "description": "Paul Atreides hợp tác với Chani và người Fremen để trả thù những kẻ đã hủy hoại gia đình anh, đồng thời cố gắng ngăn chặn một tương lai tồi tệ.",
        "duration": 166,
        "release_date": "2024-03-01",
        "language": "Tiếng Anh - Phụ đề",
        "age": 16,
        "poster": "https://m.media-amazon.com/images/M/MV5BODdjMjM3ZGItMThhNS00NmRlLWIyM2QtOTBkMjk0YjVlNThiXkEyXkFqcGdeQXVyMTUzMTg2ODkz._V1_FMjpg_UX1000_.jpg",
        "trailer": "https://www.youtube.com/watch?v=Way9Dexny3w",
        "status": "Đang Chiếu",
        "director": {"name": "Denis Villeneuve", "img": "https://m.media-amazon.com/images/M/MV5BMTQ4NzM2OTk2MV5BMl5BanBnXkFtZTcwMjA1MjE1MQ@@._V1_.jpg"},
        "genres": ["Hành động (Action)", "Viễn tưởng (Sci-Fi)", "Phiêu lưu (Adventure)"],
        "casts": [
            {"name": "Timothée Chalamet", "img": "https://m.media-amazon.com/images/M/MV5BMjA5OTg2NTM2NF5BMl5BanBnXkFtZTgwMDc4MDc0MjE@._V1_FMjpg_UX1000_.jpg"},
            {"name": "Zendaya", "img": "https://m.media-amazon.com/images/M/MV5BMjAxZTk4NDItYjI3Mi00OTdiLWFhYWItZDJlZmUyNWZkNzM0XkEyXkFqcGdeQXVyMTE0NDgwNzUy._V1_.jpg"},
            {"name": "Rebecca Ferguson", "img": "https://m.media-amazon.com/images/M/MV5BMTkwMjkzNDk0Nl5BMl5BanBnXkFtZTgwNTI1MjI1NDE@._V1_.jpg"}
        ]
    },
    {
        "title": "Deadpool & Wolverine",
        "description": "Cơ quan Quản lý Phương sai Thời gian (TVA) đưa Deadpool ra khỏi cuộc sống yên bình để hợp tác với một Wolverine miễn cưỡng nhằm thay đổi lịch sử.",
        "duration": 127,
        "release_date": "2024-07-26",
        "language": "Tiếng Anh - Phụ đề",
        "age": 18,
        "poster": "https://m.media-amazon.com/images/M/MV5BNzRiMjg0MzUtNTQ1Mi00Y2Q5LWEwM2MtMzUwZDVjNjQwYmI1XkEyXkFqcGdeQXVyMTU2NTgxODg0._V1_FMjpg_UX1000_.jpg",
        "trailer": "https://www.youtube.com/watch?v=73_1biulkYk",
        "status": "Đang Chiếu",
        "director": {"name": "Shawn Levy", "img": "https://m.media-amazon.com/images/M/MV5BODg3ODA2MDYyNF5BMl5BanBnXkFtZTgwOTE0MjI2MTE@._V1_.jpg"},
        "genres": ["Hành động (Action)", "Hài hước (Comedy)", "Siêu anh hùng (Superhero)"],
        "casts": [
            {"name": "Ryan Reynolds", "img": "https://m.media-amazon.com/images/M/MV5BMTY3NTY0MzQxNV5BMl5BanBnXkFtZTcwOTQyNTQ0Nw@@._V1_.jpg"},
            {"name": "Hugh Jackman", "img": "https://m.media-amazon.com/images/M/MV5BNDExMzIzNjk3Nl5BMl5BanBnXkFtZTcwOTE4NDU5OA@@._V1_.jpg"},
            {"name": "Emma Corrin", "img": "https://m.media-amazon.com/images/M/MV5BYzA2ZDZkOTYtOWE2Yy00MTdiLTk3YzQtNWViYzZkNzc4YTFkXkEyXkFqcGdeQXVyMjQwMDg0Ng@@._V1_.jpg"}
        ]
    },
    {
        "title": "Kung Fu Panda 4",
        "description": "Po chuẩn bị trở thành Thủ lĩnh Tinh thần của Thung lũng Bình yên nhưng cần tìm một Chiến binh Rồng mới. Cậu gặp một kẻ thù nguy hiểm có khả năng biến hình.",
        "duration": 94,
        "release_date": "2024-03-08",
        "language": "Lồng Tiếng",
        "age": 0,
        "poster": "https://m.media-amazon.com/images/M/MV5BZDU1NmFjZTctYTA4NS00MTI3LTg2OGUtZjY4YWZmYWEyYzdkXkEyXkFqcGdeQXVyMTUzMTg2ODkz._V1_FMjpg_UX1000_.jpg",
        "trailer": "https://www.youtube.com/watch?v=_inKs4eeHiI",
        "status": "Đang Chiếu",
        "director": {"name": "Mike Mitchell", "img": "https://m.media-amazon.com/images/M/MV5BMTc3NDM4NDU0M15BMl5BanBnXkFtZTcwMjA3MzQ3Nw@@._V1_.jpg"},
        "genres": ["Hoạt hình (Animation)", "Hành động (Action)", "Hài hước (Comedy)", "Gia đình (Family)"],
        "casts": [
            {"name": "Jack Black", "img": "https://m.media-amazon.com/images/M/MV5BMTQzMzk4Mzc5OF5BMl5BanBnXkFtZTcwOTMwNDEzMQ@@._V1_.jpg"},
            {"name": "Awkwafina", "img": "https://m.media-amazon.com/images/M/MV5BZWU0YjVlZjYtMDIyMy00NWQwLWE2ODUtYzVjMmRkZDIwNGVhXkEyXkFqcGdeQXVyMjE3MDI1MTc@._V1_.jpg"},
            {"name": "Viola Davis", "img": "https://m.media-amazon.com/images/M/MV5BMTY3NTMzNDcxMV5BMl5BanBnXkFtZTgwNTU5NTE4MzE@._V1_.jpg"}
        ]
    },
    {
        "title": "Inside Out 2 (Những Mảnh Ghép Cảm Xúc 2)",
        "description": "Riley bước vào tuổi dậy thì, Trụ sở Cảm xúc bất ngờ đối mặt với những Cảm xúc mới mẻ, làm đảo lộn thế giới của Joy, Sadness, Anger, Fear và Disgust.",
        "duration": 96,
        "release_date": "2024-06-14",
        "language": "Lồng Tiếng",
        "age": 0,
        "poster": "https://m.media-amazon.com/images/M/MV5BYzc4ZWJlNDItYjNjOC00ZTE4LWIwZTMtM2U4YmVmYTFmYzcwXkEyXkFqcGdeQXVyMDM2NDM2MQ@@._V1_FMjpg_UX1000_.jpg",
        "trailer": "https://www.youtube.com/watch?v=LEjhY15eCx0",
        "status": "Đang Chiếu",
        "director": {"name": "Kelsey Mann", "img": "https://m.media-amazon.com/images/M/MV5BNjRmMjM0MzAtN2MyZC00MmNiLTk0YWEtZDZkM2IxZTY5N2RlXkEyXkFqcGdeQXVyMzg2ODE4Ng@@._V1_.jpg"},
        "genres": ["Hoạt hình (Animation)", "Gia đình (Family)", "Tâm lý (Drama)"],
        "casts": [
            {"name": "Amy Poehler", "img": "https://m.media-amazon.com/images/M/MV5BNTE3MDA4NjkwOF5BMl5BanBnXkFtZTcwNDMyNjMyMg@@._V1_.jpg"},
            {"name": "Maya Hawke", "img": "https://m.media-amazon.com/images/M/MV5BMGUyNmY4MjEtYWVlOC00MjI3LTg1ZWQtMWFlNjQwZTBlMDY1XkEyXkFqcGdeQXVyODg1MTc3MTM@._V1_.jpg"},
            {"name": "Kensington Tallman", "img": "https://m.media-amazon.com/images/M/MV5BODg2MDBlZTctNTIzYS00YWI0LWIxZDYtYmVmYzcyYTliNjI5XkEyXkFqcGdeQXVyMTUzOTcxODA3._V1_.jpg"}
        ]
    },
    {
        "title": "Venom: The Last Dance",
        "description": "Eddie và Venom đang chạy trốn, bị săn lùng bởi cả thế giới của họ. Bộ đôi phải đối mặt với một quyết định mang tính tàn khốc.",
        "duration": 120,
        "release_date": "2024-10-25",
        "language": "Tiếng Anh - Phụ đề",
        "age": 16,
        "poster": "https://m.media-amazon.com/images/M/MV5BODdjYThlYmYtNjAyMy00OWU5LTkyN2QtNWQwMjFiNWFlOTc3XkEyXkFqcGdeQXVyMTUzMTg2ODkz._V1_FMjpg_UX1000_.jpg",
        "trailer": "https://www.youtube.com/watch?v=__2ABJjxzNo",
        "status": "Sắp Chiếu",
        "director": {"name": "Kelly Marcel", "img": "https://m.media-amazon.com/images/M/MV5BYmVjNWY3ZjEtNmQ1Yy00YTlmLWI3ZTYtZjg3MTJmYmFlNzM2XkEyXkFqcGdeQXVyMTExNDQ2MTI@._V1_.jpg"},
        "genres": ["Hành động (Action)", "Viễn tưởng (Sci-Fi)"],
        "casts": [
            {"name": "Tom Hardy", "img": "https://m.media-amazon.com/images/M/MV5BMTQ3ODEyNDg4NV5BMl5BanBnXkFtZTgwMTE4ODMyMTI@._V1_.jpg"},
            {"name": "Juno Temple", "img": "https://m.media-amazon.com/images/M/MV5BYjgxMTcwNGItYjRiMS00ZTRjLTllYmMtMjQ0ZmQ5YmM4ZGFjXkEyXkFqcGdeQXVyMTg0NTgzMQ@@._V1_.jpg"},
            {"name": "Chiwetel Ejiofor", "img": "https://m.media-amazon.com/images/M/MV5BMTc3NDM5MzE4MV5BMl5BanBnXkFtZTgwNTU5Nzc4OTE@._V1_.jpg"}
        ]
    },
    {
        "title": "Kẻ Trộm Mặt Trăng 4 (Despicable Me 4)",
        "description": "Gru chào đón thành viên mới, Gru Jr., gia đình họ phải đối mặt với sự trả thù của kẻ thù cũ là Maxime Le Mal và bạn gái của hắn.",
        "duration": 105,
        "release_date": "2024-07-03",
        "language": "Lồng Tiếng",
        "age": 0,
        "poster": "https://m.media-amazon.com/images/M/MV5BZTZhMzM1OGUtNDFhYy00ZjIyLTkwMDgtOWI4ZTVhOWVlODcwXkEyXkFqcGdeQXVyMTY3ODkyNDkz._V1_FMjpg_UX1000_.jpg",
        "trailer": "https://www.youtube.com/watch?v=qQlr9-rF32A",
        "status": "Đang Chiếu",
        "director": {"name": "Chris Renaud", "img": "https://m.media-amazon.com/images/M/MV5BMjA5OTg2OTM4OF5BMl5BanBnXkFtZTcwNTkxNDUyOA@@._V1_.jpg"},
        "genres": ["Hoạt hình (Animation)", "Hài hước (Comedy)", "Gia đình (Family)"],
        "casts": [
            {"name": "Steve Carell", "img": "https://m.media-amazon.com/images/M/MV5BMjMyOTM2OTk1OF5BMl5BanBnXkFtZTgwODE3ODk5MTE@._V1_.jpg"},
            {"name": "Kristen Wiig", "img": "https://m.media-amazon.com/images/M/MV5BMTQ2MzgxMjk0MV5BMl5BanBnXkFtZTcwNTIxODU2OQ@@._V1_.jpg"},
            {"name": "Will Ferrell", "img": "https://m.media-amazon.com/images/M/MV5BMTI5OTc4NTU1Nl5BMl5BanBnXkFtZTcwNTE5NDIzMw@@._V1_.jpg"}
        ]
    },
    {
        "title": "Mufasa: The Lion King",
        "description": "Phần tiền truyện khám phá cuộc đời và nguồn gốc thực sự của Mufasa và Scar, hai chú sư tử định hình cả vùng đất Vua Sư Tử.",
        "duration": 115,
        "release_date": "2024-12-20",
        "language": "Tiếng Anh - Phụ đề",
        "age": 0,
        "poster": "https://m.media-amazon.com/images/M/MV5BZWNmNWUxMDUtYjg5Yy00ZDYzLWFlZDEtZTdiODU5OWMzNzYyXkEyXkFqcGdeQXVyMTUzMTg2ODkz._V1_FMjpg_UX1000_.jpg",
        "trailer": "https://www.youtube.com/watch?v=lEM2B61s0O0",
        "status": "Sắp Chiếu",
        "director": {"name": "Barry Jenkins", "img": "https://m.media-amazon.com/images/M/MV5BMjI5NTQ0MjcyMV5BMl5BanBnXkFtZTgwNTQzOTY5MDI@._V1_.jpg"},
        "genres": ["Hoạt hình (Animation)", "Phiêu lưu (Adventure)", "Gia đình (Family)"],
        "casts": [
            {"name": "Aaron Pierre", "img": "https://m.media-amazon.com/images/M/MV5BOTUwOTQwOTUzNl5BMl5BanBnXkFtZTgwNTExNzcyNDM@._V1_.jpg"},
            {"name": "Kelvin Harrison Jr.", "img": "https://m.media-amazon.com/images/M/MV5BMTEwMzUyMjY5OV5BMl5BanBnXkFtZTgwMjc1OTUyNDM@._V1_.jpg"},
            {"name": "Seth Rogen", "img": "https://m.media-amazon.com/images/M/MV5BMTUzMTQwMTA4MF5BMl5BanBnXkFtZTgwOTIyMDMwMjE@._V1_.jpg"}
        ]
    },
    {
        "title": "Joker: Folie à Deux",
        "description": "Arthur Fleck bị giam ở Arkham chờ xét xử, nơi anh tìm thấy tình yêu đích thực và bản nhạc luôn ẩn chứa bên trong tâm hồn mình.",
        "duration": 138,
        "release_date": "2024-10-04",
        "language": "Tiếng Anh - Phụ đề",
        "age": 18,
        "poster": "https://m.media-amazon.com/images/M/MV5BMTE2ZTMyODctMjE3ZS00MWY3LTk0MTYtNDdjN2MwOWE1ZTI0XkEyXkFqcGdeQXVyMTA5ODI3MjI0._V1_FMjpg_UX1000_.jpg",
        "trailer": "https://www.youtube.com/watch?v=xy8aJw1vYHo",
        "status": "Sắp Chiếu",
        "director": {"name": "Todd Phillips", "img": "https://m.media-amazon.com/images/M/MV5BMTQ4Mjc5ODE2Ml5BMl5BanBnXkFtZTcwMjE5NjQ0OQ@@._V1_.jpg"},
        "genres": ["Tâm lý (Drama)", "Nhạc kịch (Musical)", "Tội phạm (Crime)"],
        "casts": [
            {"name": "Joaquin Phoenix", "img": "https://m.media-amazon.com/images/M/MV5BMTQyNzM1ODcwNV5BMl5BanBnXkFtZTcwNDY2ODAwOQ@@._V1_.jpg"},
            {"name": "Lady Gaga", "img": "https://m.media-amazon.com/images/M/MV5BYzA2NTcxMjEtZmJiOS00ZWI0LThmZTktODQ5Njg5MTBiMjhhXkEyXkFqcGdeQXVyMTUzMTg2ODkz._V1_.jpg"},
            {"name": "Zazie Beetz", "img": "https://m.media-amazon.com/images/M/MV5BMTYzNTAwMTM0M15BMl5BanBnXkFtZTgwMTQ3MDgxNDM@._V1_.jpg"}
        ]
    },
    {
        "title": "Godzilla x Kong: Đế Chế Mới",
        "description": "Hai siêu quái thú khổng lồ buộc phải liên minh để đối mặt với một mối đe dọa khổng lồ chưa từng được biết đến ẩn sâu trong Trái đất.",
        "duration": 115,
        "release_date": "2024-03-29",
        "language": "Tiếng Anh - Phụ đề",
        "age": 13,
        "poster": "https://m.media-amazon.com/images/M/MV5BZTA0ZGRiZDUtNjMyMi00NWU5LWE1ODEtODhjMzgwNDRjMzcxXkEyXkFqcGdeQXVyMTUzMTg2ODkz._V1_FMjpg_UX1000_.jpg",
        "trailer": "https://www.youtube.com/watch?v=lV1OOlGwExM",
        "status": "Đang Chiếu",
        "director": {"name": "Adam Wingard", "img": "https://m.media-amazon.com/images/M/MV5BMTg0NjE1NzIyM15BMl5BanBnXkFtZTcwMjMzMDQwMw@@._V1_.jpg"},
        "genres": ["Hành động (Action)", "Viễn tưởng (Sci-Fi)"],
        "casts": [
            {"name": "Rebecca Hall", "img": "https://m.media-amazon.com/images/M/MV5BMTQyNTE0MzM4NV5BMl5BanBnXkFtZTcwMTEzOTcwOQ@@._V1_.jpg"},
            {"name": "Brian Tyree Henry", "img": "https://m.media-amazon.com/images/M/MV5BMjAxMjkxNDUwMl5BMl5BanBnXkFtZTgwNTU5MzMzNDM@._V1_.jpg"},
            {"name": "Dan Stevens", "img": "https://m.media-amazon.com/images/M/MV5BNDQwMjA1NTMwM15BMl5BanBnXkFtZTgwNjA2Njc4MTE@._V1_.jpg"}
        ]
    }
]

def seed():
    try:
        conn = psycopg2.connect(host=DB_HOST, port=DB_PORT, dbname=DB_NAME, user=DB_USER, password=DB_PASSWORD)
        cursor = conn.cursor()
        print("Đang bắt đầu quá trình đổ dữ liệu Phim, Đạo diễn, Diễn viên...")

        for data in movies_data:
            # 1. Trạng thái chiếu
            status_id = get_or_create_status(cursor, data["status"])

            # 2. Thể loại
            genre_ids = []
            for g in data["genres"]:
                genre_ids.append(get_or_create_genre(cursor, g))

            # 3. Đạo diễn
            director_id = get_or_create_director(cursor, data["director"])

            # 4. Diễn viên
            cast_ids = []
            for c in data["casts"]:
                cast_ids.append(get_or_create_cast(cursor, c))

            # 5. Phim
            cursor.execute("SELECT id FROM movies WHERE title = %s", (data["title"],))
            row = cursor.fetchone()
            if row:
                movie_id = row[0]
            else:
                movie_id = str(uuid.uuid4())
                cursor.execute("""
                    INSERT INTO movies (id, title, description, duration_minutes, release_date, language, poster_url, trailer_url, age_restriction, director_id, status_id) 
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """, (
                    movie_id, data["title"], data["description"], data["duration"], 
                    data["release_date"], data["language"], data["poster"], 
                    data["trailer"], data["age"], director_id, status_id
                ))
            
            # 6. Liên kết Phim - Diễn viên
            for cid in cast_ids:
                cursor.execute("SELECT id FROM movie_cast WHERE movie_id = %s AND cast_id = %s", (movie_id, cid))
                if not cursor.fetchone():
                    mc_id = str(uuid.uuid4())
                    cursor.execute("INSERT INTO movie_cast (id, movie_id, cast_id) VALUES (%s, %s, %s)", (mc_id, movie_id, cid))

            # 7. Liên kết Phim - Thể loại
            for gid in genre_ids:
                cursor.execute("SELECT id FROM movie_genre WHERE movie_id = %s AND genre_id = %s", (movie_id, gid))
                if not cursor.fetchone():
                    mg_id = str(uuid.uuid4())
                    cursor.execute("INSERT INTO movie_genre (id, movie_id, genre_id) VALUES (%s, %s, %s)", (mg_id, movie_id, gid))

            print(f"✅ Đã thêm thành công: {data['title']}")

        conn.commit()
        print("Tất cả dữ liệu Phim đã được đổ thành công!")
    except Exception as e:
        print("Có lỗi xảy ra:", e)
        if 'conn' in locals() and conn:
            conn.rollback()
    finally:
        if 'conn' in locals() and conn:
            cursor.close()
            conn.close()

if __name__ == "__main__":
    seed()
